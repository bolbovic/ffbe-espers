import axios from 'axios';
import { action, computed, observable, reaction } from 'mobx';
import sortby from 'lodash.sortby';
import uniq from 'lodash.uniq';

import Esper from '../common/entities/Esper';
import Store from './Store';

export default class EsperStore extends Store {
  @observable abilities = {};
  @observable espers = {};
  @observable esperIds = [];
  @observable loaded = false;
  @observable magics = {};
  @observable selectedBoxes = [];

  @observable evolution = 1;
  @observable level = 30;
  @observable selected = null;

  @action
  init() {
    axios.get('/data/ja.espers.json').then(res => {
      const proms = [];
      Object.keys(res.data || {}).forEach(e => {
        const esper = res.data[e];
        proms.push(
          axios.get(`/data/ja.esper.${esper.id}.json`).then(r => {
            const data = r.data;
            if (data && data.names) {
              this.espers[esper.id] = new Esper(data);
            }
          })
        );
      });
      proms.push(
        axios
          .get('/data/ja.espers.abilities.json')
          .then(res => (this.abilities = res.data || {}))
      );
      proms.push(
        axios
          .get('/data/ja.espers.magics.json')
          .then(res => (this.magics = res.data || {}))
      );
      Promise.all(proms).then(() => {
        this.esperIds = sortby(res.data, ['order']).map(e => e.id);
        this.loaded = true;
      });
    });

    reaction(
      () => ({ loaded: this.loaded, location: this.stores.ui.location }),
      ({ loaded, location }) => {
        if (loaded) {
          const params = {};
          location.search
            .substring(1)
            .split('&')
            .forEach(value => {
              const cut = value.split('=');
              params[cut[0]] = decodeURIComponent(cut[1]);
            });
          const [, , id, evol, level] = location.pathname.split('/');
          if (this.espers[id]) {
            this.selected = id;
            this.evolution = parseInt(evol || this.espers[id].maxEvol, 10);
            this.level = parseInt(level || this.getMaxLevel(this.evolution));
            if (params.s) {
              this.selectedBoxes = JSON.parse(params.s);
            }
          }
        }
      }
    );
  }

  @computed
  get availableCPS() {
    return this.selected && this.espers[this.selected]
      ? this.espers[this.selected].cpTotal(this.evolution, this.level)
      : 0;
  }

  getMaxLevel = e => {
    let i = 30;
    switch (e) {
      case 2:
        i = 40;
        break;
      case 3:
        i = 60;
        break;
    }
    return i;
  };

  changeBoard = (esperId, evol, level) => {
    const s =
      esperId === this.selected &&
      this.evolution === evol &&
      this.selectedBoxes.length > 0
        ? `?s=${JSON.stringify(this.selectedBoxes)}`
        : '';
    this.stores.ui.history.push(`/esper/${esperId}/${evol}/${level}${s}`);
  };

  selectBoxes = boxes => {
    const s = uniq(this.selectedBoxes.concat(boxes));
    this.stores.ui.history.push(
      `/esper/${this.selected}/${this.evolution}/${this
        .level}?s=${JSON.stringify(s)}`
    );
  };

  unselectBoxes = boxes => {
    const s = this.selectedBoxes.filter(b => boxes.indexOf(b) === -1);
    this.stores.ui.history.push(
      `/esper/${this.selected}/${this.evolution}/${this
        .level}?s=${JSON.stringify(s)}`
    );
  };
}
