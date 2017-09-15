import { observable } from 'mobx'

import Store from './Store'


export default class DB extends Store {
  init(config) {
    this.config = config;
    this.db = config.DatabaseRef;
  }
}
