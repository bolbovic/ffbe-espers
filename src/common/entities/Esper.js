import { action, computed, observable } from 'mobx'

import Named from './Named'


export default class Esper extends Named {
  constructor(data) {
    super(data);
    Object.assign(this, data);
  }
}