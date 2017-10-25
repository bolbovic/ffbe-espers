export default class Store {
  constructor(root, ...args) {
    this.stores = root;
    if (this.init) this.init(...args);
  }
}
