import React from 'react'
import { action, computed, observable } from 'mobx'
import Hex from 'react-hex'
import { observer } from 'mobx-react'

import { DatabaseRef } from '../../config/Firebase'
import { gridPoint } from '../../helpers/hexa'
import Box from './Box'


const SIZE = 50;

const getParent = ( node, board ) => {
  let r = null;
  board.forEach( n => {
    if ( `${node.infos.parentId}` === n.id ) {
      r = n;
    }
  })
  return r;
}

const Link = ({colored, x1, y1, x2, y2}) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="20" stroke={ colored ? '#9999FF' : '#999999' }  />
);


@observer
class EsperBoard extends React.Component {
  @observable board = [];
  @observable boardSize = 0;

  constructor(props) {
    super(props);
    this.state = {
      board: []
    };
  }

  canSelect = id => {
    return true;
  }

  getBox = id => {
    let box = undefined;
    this.board.forEach( b => {
      //console.log(b.id, id);
      if ( b.id === id ) {
        box = b;
      }
    })
    return box;
  }

  getChildren = id => {
    console.log(this.getBox(id), id);
    return this.getBox(id).infos.children.map( c => this.getBox(c) );
  }

  getAncestors = (id, me = true) => {
    let box = this.getBox(`${id}`);
    if ( box && box.infos ) {
      let ret = me ? [ box ] : [];
      if ( box.infos.parentId ) {
        return ret.concat( this.getAncestors(box.infos.parentId) );
      } else {
        return ret;
      }
    }
    return [];
  }

  getDescendant = id => {
    let boxes = this.getChildren(`${id}`);
    if ( boxes.length > 0 ) {
      let a = [];
      boxes.forEach( b => {
        a = a.concat( this.getDescendant(b.id) )
      })
      boxes = boxes.concat(a);
    }
    return boxes;
  }

  @computed get totalUsed() {
    let total = 0;
    this.board.forEach( b => total += b.selected ? b.infos.cost : 0 );
    return total;
  }

  onClick = id => {
    console.log('on click', id, this.getBox(id));
    let box = this.getBox(id);
    if ( box.selected ) {
      box.selected = false;
      this.getDescendant( id ).forEach( box => box.selected = false );
    } else {
      if ( this.canSelect(id) ) {
        box.selected = true;
        this.getAncestors( id ).forEach( box => box.selected = true );
      }
    }
  }

  onMouseOver = id => {
    //console.log('mouse over', id, this.getAncestors(id));
    this.getBox(id).hover = true;
    this.getAncestors(id, false).forEach( box => box.pathed = true );
  }

  onMouseOut = id => {
    //console.log('mouse out', id);
    this.getBox(id).hover = false;
    this.getAncestors(id, false).forEach( box => box.pathed = false );
  }

  initBoard = esper => {
    const b = esper.board;
    
    this.boardSize = 1000 //b.length > 37 ? 1000 : 700;
    const offset = this.boardSize / 2;

    this.board = Object.keys(b).map( 
      key => {
        let r = null;
        //if ( b[key].cost < 50 ) {
          const p = b[key].position;
          r = gridPoint('pointy-topped-odd', offset, offset, SIZE, p.x, p.y, 10 );
          r.infos = b[key];
          r.id = key;
          r.selected = false;
          r.hover = false;
          r.pathed = false;
          r = observable(r);
        //}
        return r;
      }).filter( f => !!f );
}

  componentWillMount() {
    if ( this.props.esper ) {
      this.initBoard(this.props.esper);
    }
  }

  componentWillReceiveProps(np) {
    if ( np.esper !== this.props.esper && np.esper ) {
      this.initBoard(np.esper);
    }
  }

  render() {
    const hexes = this.board.map((obj, key) => (
      <Hex
        fill="white" key={ key }
        type="pointy-topped" {...obj.props}
      />
    ));

    const drawHexes = this.board.map((obj, key) => (
      <Box
        box={ obj } key={ key }
        onClick={ this.onClick }
        onMouseOut={ this.onMouseOut }
        onMouseOver={ this.onMouseOver }
      />
    ));
  
    const links = this.board.map( node => {
      const parent = getParent(node, this.board);
      return parent ? {
        colored: parent.selected ||
          node.selected ||
          !parent.infos.parentId ||
          (node.hover || node.pathed) && parent.pathed,
        x1: parent.props.x, y1: parent.props.y,
        x2: node.props.x, y2: node.props.y
      } : null;
    }).filter( f => !!f ).map( (f,k) => <Link key={ k } {...f} />);

    return (
      <div>
        <div>{ this.totalUsed }</div>
        <svg width={ this.boardSize } height={ this.boardSize }>
          {links}
          {hexes}
          {drawHexes}
        </svg>
      </div>
    );
  }
}
export default EsperBoard;