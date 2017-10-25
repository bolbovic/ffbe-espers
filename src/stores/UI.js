import copy from 'copy-to-clipboard';
import { action, observable } from 'mobx';

import Store from './Store';

export default class UIStore extends Store {
  @observable history = null;
  @observable location = null;

  @observable preventLeave = false;
  @observable preventCallback;

  @action
  setHistory = history => {
    this.history = history;
    this.history.listen(this.handleHistoryChanged);
    this.location = this.history.location;
  };

  @action
  handleHistoryChanged = location => {
    this.location = location;
  };

  handleCopyToClipboard = () => {
    copy(window.location.href);
  };
}
