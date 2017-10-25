import axios from 'axios';
import { action, computed, observable } from 'mobx';

import Esper from '../common/entities/Esper';
import Store from './Store';

export default class EsperStore extends Store {
  @observable abilities = {};
  @observable espers = {};
  @observable esperIds = [];
  @observable magics = {};

  @observable evolution = 1;
  @observable level = 30;
  @observable selected = null;

  @action
  init() {
    axios.get('/data/ja.espers.json').then(res => {
      Object.keys(res.data || {}).forEach(e => {
        const esper = res.data[e];
        axios.get(`/data/ja.esper.${esper.id}.json`).then(r => {
          const data = r.data;
          if (data && data.names) {
            this.espers[esper.id] = new Esper(data);
            this.esperIds.push(esper.id);
          }
        });
      });
    });
    axios
      .get('/data/ja.espers.abilities.json')
      .then(res => (this.abilities = res.data || {}));
    axios
      .get('/data/ja.espers.magics.json')
      .then(res => (this.magics = res.data || {}));
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
}
