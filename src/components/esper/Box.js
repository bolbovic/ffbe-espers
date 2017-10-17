import React from 'react';
import Hex from 'react-hex';
import { inject, observer } from 'mobx-react'

const getFill = (box) => {
  const { hover, pathed, selected } = box;
  const reward = box.infos && box.infos.reward ? box.infos.reward[0] : '';
  let color = 'white', alpha = '.3';

  if ( hover || pathed ) {
    alpha = '1';
  } else if ( selected ) {
    alpha = '.8';
  }

  switch ( reward.substring(0,4) ) {
    case 'ATK': color = `230, 102, 101`; break;
    case 'DEF': color = '205, 180, 140'; break;
    case 'MAG': color = '146, 149, 202'; break;
    case 'SPR': color = '9, 107, 182'; break;
    case 'MP': color = '158, 206, 182'; break;
    case 'HP': color = '255, 214, 3'; break;
    case 'RES_':
    case 'ABIL': color = '173, 113, 175'; break;
    case 'MAGI': color = '172, 203, 232'; break;
    default: color = '255, 255, 255';
  }
  return `rgba(${color}, ${alpha})`;
}



export default inject('esper')(observer(({
  box, esper, onMouseOver, onMouseOut, onClick
}) => {

  const getReward = box => {
    let txt = '';
    console.log(esper.magics, esper.abilities)
    if ( box.infos && box.infos.reward ) {
      if ( ['ATK', 'DEF', 'MAG', 'SPR', 'HP', 'MP'].indexOf(box.infos.reward[0]) !== -1 ) {
        txt = `${box.infos.reward[0]} +${box.infos.reward[1]}`;
      } else if ( box.infos.reward[0].substring(0,4) === 'RES_' ) {
        txt = `${box.infos.reward[0]} +${box.infos.reward[1]}%`
      } else if ( box.infos.reward[0] === 'ABILITY' ) {
        txt = esper.abilities[box.infos.reward[1]].NAME;
      } else if ( box.infos.reward[0] === 'MAGIC' ) {
        txt = esper.magics[box.infos.reward[1]].NAME;
      } else {
        txt = `${box.infos.reward[0]} ${box.infos.reward[1]}`;
      }
    }
    return txt;
  }

  return (
    <g key={`${box.gridX}-${box.gridY}`}>
      <Hex
        fill={getFill(box)}
        onClick={ onClick.bind(null, box.id) }
        onMouseOver={ onMouseOver.bind(null, box.id) }
        onMouseOut={ onMouseOut.bind(null, box.id) }
        stroke={ box.hover ? 'red' : (box.pathed ? '#0000FF' : (box.selected ? 'black' : 'grey')) }
        type="pointy-topped"
        {...box.props}
      />
      <text
        fill={ box.hover ? 'white' : 'black' }
        fontSize={ 10 }
        pointerEvents="none"
        textAnchor="middle" x={box.props.x} y={box.props.y + 6}
      >
        {getReward(box)}
      </text>
    </g>
  );
}));

