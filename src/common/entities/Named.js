import Stores from '../../stores'
import { computed, observable } from 'mobx';


export default class Named {
  @observable names = [];
  constructor(data) {
    if ( data.names ) {
      this.names = observable(data.names);
    }
  }

  @computed get name() {
    return this.names[Stores.lang.langShort] || this.names.jp || '';
  }
}