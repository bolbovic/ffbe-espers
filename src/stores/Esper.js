import axios from 'axios'
import { action, computed, observable, toJS } from 'mobx'

import DB from './DB'
import Esper from '../common/entities/Esper'


export default class EsperStore extends DB {
  @observable abilities = {};
  @observable espers = {};
  @observable esperIds = [];
  @observable magics = {};
  
  @observable evolution = 1;
  @observable level = 30;
  @observable selected = null;

  @action init(config) {
    super.init(config);
    axios.get('/data/ja.espers.json').then( res => {
      Object.keys(res.data || {}).forEach( e => {
        const esper = res.data[e];
        axios.get(`/data/ja.esper.${esper.id}.json`).then( r => {
          const data = r.data;
          if ( data && data.names ) {
            this.espers[esper.id] = new Esper(data);
            this.esperIds.push(esper.id);
          }
        });
      });
    });
    axios.get('/data/ja.espers.abilities.json').then( res => this.abilities = res.data || {});
    axios.get('/data/ja.espers.magics.json').then( res => this.magics = res.data || {});
  }

  @action loadEspers = snap => {
    const data = snap.val() || {}, keys = Object.keys(data);
    keys.forEach( k => {
      if ( data[k] && data[k].names ) {
        this.espers[k] = new Esper(data[k]);
        this.espers[k].id = k;
        this.esperIds.push(k);
      }
    });
    this.db.child('GL/eboards').once('value', this.loadBoards);
  }
  
  @action loadBoards = snap => {
    const data = snap.val() || {}, keys = Object.keys(data);
    keys.forEach( k => {
      if ( this.espers[k] ) this.espers[k].board = data[k];
    });
  }

  @computed get availableCPS() {
    return this.selected && this.espers[this.selected] ?
      this.espers[this.selected].cpTotal(this.evolution, this.level) : 0;
  }
}
