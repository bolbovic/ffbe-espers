import Esper from './Esper';
import Files from './Files';
import Lang from './Lang';
import UI from './UI';

class RootStore {
  constructor() {
    this.esper = new Esper(this);
    this.files = new Files(this);
    this.lang = new Lang(this);
    this.ui = new UI(this);

    this.esper.init();
    this.files.init(require('../data/file_list.js').default);
    this.lang.init();
  }
}

const singleton = new RootStore();
export default singleton;
