import Esper from './Esper'
import Files from './Files'
import FirebaseConfig from '../config/Firebase'
import Lang from './Lang'
import UI from './UI'

class RootStore {
  constructor() {
    this.esper = new Esper(this, FirebaseConfig);
    this.files = new Files(this, require('../data/file_list.js').default);
    this.lang = new Lang(this);
    this.ui = new UI(this, FirebaseConfig);
  }
}

const singleton = new RootStore();
export default singleton;
