import { action, observable, toJS } from 'mobx'

import DB from './DB'
import Esper from '../common/entities/Esper'


export default class EsperStore extends DB {
  @observable espers = {};
  @observable esperIds = [];
  @observable selected = null;

  init(config) {
    super.init(config);
    this.db.child('GL/espers').once('value', this.loadEspers);
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
}
