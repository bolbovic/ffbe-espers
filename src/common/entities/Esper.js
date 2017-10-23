import Named from './Named';

export default class Esper extends Named {
  board = [];
  maxEvol = 3;

  constructor(data) {
    super(data);
    Object.assign(this, data);
  }

  cpTotal(evol = 1, lvl = 1) {
    let t = 0;
    for (let ev = 1; ev <= evol; ev++) {
      const ar = this.cps[`${ev}`],
        last = ev === evol;
      for (let l = 1; (!last && l <= ar.length) || (last && l <= lvl); l++) {
        t += ar[l - 1] || 0;
      }
    }
    return t;
  }
}
