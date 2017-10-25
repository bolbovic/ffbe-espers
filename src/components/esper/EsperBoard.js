import React from 'react';
import { computed, observable, reaction } from 'mobx';
import Hex from 'react-hex';
import { inject, observer } from 'mobx-react';

import Abilities from './Abilities';
import { gridPoint } from '../../helpers/hexa';
import Box from './Box';

const SIZE = 50;

const getParent = (node, board) => {
  let r = null;
  board.forEach(n => {
    if (`${node.infos.parentId}` === n.id) {
      r = n;
    }
  });
  return r;
};

const Link = ({ colored, x1, y1, x2, y2 }) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    strokeWidth="20"
    stroke={colored ? '#9999FF' : '#999999'}
  />
);
Link.propTypes = {
  colored: React.PropTypes.bool,
  x1: React.PropTypes.number,
  x2: React.PropTypes.number,
  y1: React.PropTypes.number,
  y2: React.PropTypes.number
};

@inject('esper')
@observer
class EsperBoard extends React.Component {
  @observable board = [];
  @observable boardHeight = 0;
  @observable boardWidth = 0;

  canSelect = () =>
    this.totalUsed + this.hoverChanged <= this.props.esper.availableCPS;

  getBox = id => {
    let box = undefined;
    this.board.forEach(b => {
      if (b.id === id) box = b;
    });
    return box;
  };

  getChildren = id =>
    this.getBox(id)
      .infos.children.map(c => this.getBox(c))
      .filter(c => !!c);

  getAncestors = (id, me = true) => {
    const box = this.getBox(`${id}`);
    if (box && box.infos) {
      const ret = me ? [box] : [];
      if (box.infos.parentId) {
        return ret.concat(this.getAncestors(box.infos.parentId));
      }
      return ret;
    }
    return [];
  };

  getDescendant = (id, me = false) => {
    let boxes = me ? [this.getBox(`${id}`)] : this.getChildren(`${id}`);
    if (boxes.length > 0) {
      let a = [];
      boxes.forEach(b => {
        a = a.concat(this.getDescendant(b.id));
      });
      boxes = boxes.concat(a);
    }
    return boxes;
  };

  getHoveredBox = () => {
    let box = undefined;
    this.board.forEach(b => {
      if (b.hover) box = b;
    });
    return box;
  };

  @computed
  get totalUsed() {
    let total = 0;
    this.board.forEach(b => (total += b.selected ? b.infos.cost : 0));
    return total;
  }

  @computed
  get hoverChanged() {
    const hBox = this.getHoveredBox();
    let cost = 0;
    if (hBox) {
      if (hBox.selected) {
        this.getDescendant(hBox.id, true).forEach(c => {
          if (c.selected) cost -= c.infos.cost;
        });
      } else {
        this.getAncestors(hBox.id).forEach(c => {
          if (!c.selected) cost += c.infos.cost;
        });
      }
    }
    return cost;
  }

  handleClick = id => {
    const box = this.getBox(id);
    if (this.canSelect()) {
      if (box.selected) {
        this.props.esper.unselectBoxes(
          this.getDescendant(id, true).map(box => box.id)
        );
      } else {
        this.props.esper.selectBoxes(this.getAncestors(id).map(box => box.id));
      }
    }
  };

  handleMouseOver = id => {
    this.getBox(id).hover = true;
    if (this.canSelect()) {
      this.getBox(id).selectable = true;
      this.getAncestors(id, false).forEach(box => (box.pathed = true));
      this.getDescendant(id).forEach(box => (box.unpathed = true));
    }
  };

  handleMouseOut = id => {
    this.getBox(id).hover = false;
    this.getBox(id).selectable = false;
    this.getAncestors(id, false).forEach(box => (box.pathed = false));
    this.getDescendant(id).forEach(box => (box.unpathed = false));
  };

  initBoard = (esper, evol = 2, sBoxes = []) => {
    const b = esper.board;

    switch (evol) {
      case 1:
        this.boardWidth = 475;
        this.boardHeight = 432;
        break;
      case 2:
        this.boardWidth = 670;
        this.boardHeight = 597;
        break;
      default:
        this.boardWidth = 865;
        this.boardHeight = 762;
        break;
    }

    const offsetX = this.boardWidth / 2;
    const offsetY = this.boardHeight / 2;

    this.board = Object.keys(b)
      .map(key => {
        let r = null;
        if (parseInt(b[key].rarity) <= evol) {
          const p = b[key].position;
          r = gridPoint(
            'pointy-topped-odd',
            offsetX,
            offsetY,
            SIZE,
            p.x,
            p.y,
            10
          );
          r.id = key;
          r.infos = b[key];
          r.hover = false;
          r.pathed = false;
          r.selectable = false;
          r.selected = sBoxes.indexOf(key) !== -1;
          r.unpathed = false;
          r = observable(r);
        }
        return r;
      })
      .filter(f => !!f);
  };

  componentWillMount() {
    const e = this.props.esper;
    if (e) {
      if (e.selected)
        this.initBoard(e.espers[e.selected], e.evolution, e.selectedBoxes);
      reaction(
        () => ({
          esper: e.selected,
          evol: e.evolution,
          boxes: e.selectedBoxes
        }),
        ({ esper, evol, boxes }) => this.initBoard(e.espers[esper], evol, boxes)
      );
    }
  }

  render() {
    const hexes = this.board.map((obj, key) => (
      <Hex fill="white" key={key} type="pointy-topped" {...obj.props} />
    ));

    const drawHexes = this.board.map((obj, key) => (
      <Box
        box={obj}
        key={key}
        onClick={this.handleClick}
        onMouseOut={this.handleMouseOut}
        onMouseOver={this.handleMouseOver}
      />
    ));

    const links = this.board
      .map(node => {
        const parent = getParent(node, this.board);
        return parent
          ? {
              colored:
                parent.selected ||
                node.selected ||
                !parent.infos.parentId ||
                ((node.hover || node.pathed) && parent.pathed),
              x1: parent.props.x,
              y1: parent.props.y,
              x2: node.props.x,
              y2: node.props.y
            }
          : null;
      })
      .filter(f => !!f)
      .map((f, k) => <Link key={k} {...f} />);

    const avail = this.props.esper.availableCPS;
    return this.props.esper ? (
      <div>
        <div className="cps centered">
          <span className={this.totalUsed > avail ? 'error' : ''}>
            {this.totalUsed}
          </span>
          {` / ${avail}`}
          <div className="cp-hover">
            {this.hoverChanged !== 0 ? (
              <span
                className={
                  this.totalUsed + this.hoverChanged > avail ? 'error' : ''
                }
              >
                {` (${this.totalUsed + this.hoverChanged})`}
              </span>
            ) : (
              ' '
            )}
          </div>
        </div>
        <svg width={this.boardWidth} height={this.boardHeight}>
          {links}
          {hexes}
          {drawHexes}
        </svg>
        <Abilities board={this.board} />
      </div>
    ) : null;
  }
}

EsperBoard.propTypes = {
  esper: React.PropTypes.object
};
export default EsperBoard;
