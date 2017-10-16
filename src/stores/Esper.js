import axios from 'axios'
import { action, observable, toJS } from 'mobx'

import DB from './DB'
import Esper from '../common/entities/Esper'


export default class EsperStore extends DB {
  @observable espers = {};
  @observable esperIds = [];
  @observable selected = null;

  init(config) {
    super.init(config);
    //this.db.child('GL/espers').once('value', this.loadEspers);
    axios.get('/data/ja.espers.json').then( res => {
      Object.keys(res.data || {}).forEach( e => {
        const esper = res.data[e];
        axios.get(`/data/ja.esper.${esper.id}.json`).then( r => {
          const data = r.data;
          if ( data && data.names ) {
            this.espers[esper.id] = new Esper(data);
            //this.espers[k].id = k;
            this.esperIds.push(esper.id);
          }
        });
      });
    });
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
    console.log(this.espers);
  }
}
