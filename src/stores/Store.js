export default class Store {
  constructor(root, ...args) {
    this.stores = root;
    this.init(...args);
  }

  init() {}
}
