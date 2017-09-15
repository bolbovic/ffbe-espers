import React from 'react';
import Hex from 'react-hex';
import { observer } from 'mobx-react'

const getFill = (box) => {
  const { hover, pathed, selected } = box;
  const reward = box.infos && box.infos.reward ? box.infos.reward[0] : '';
  let color = 'white', alpha = '.1';

  if ( hover || pathed ) {
    alpha = '.75';
  } else if ( selected ) {
    alpha = '.50';
  }

  switch ( reward ) {
    case 'ATK': color = `255, 0, 0`; break;
    case 'DEF': color = '255, 165, 0'; break;
    case 'MAG': color = '128, 0, 128'; break;
    case 'SPR': color = '0, 0, 255'; break;
    case 'MP': color = '0, 128, 0'; break;
    case 'HP': color = '255, 255, 0'; break;
    case 'ABILITY': color = '255, 0, 255'; break;
    case 'MAGIC': color = '0, 255, 255'; break;
    default: color = '255, 255, 255';
  }
  return `rgba(${color}, ${alpha})`;
}

const getReward = box => {
  let txt = '';
  if ( box.infos && box.infos.reward ) {
    if ( ['ATK', 'DEF', 'MAG', 'SPR', 'HP', 'MP'].indexOf(box.infos.reward[0]) !== -1 ) {
      txt = `${box.infos.reward[0]} +${box.infos.reward[1]}`;
    } else {
      txt = box.infos.reward[0];
    }
  }
  return txt;
}

export default observer(({
  box, onMouseOver, onMouseOut, onClick
}) => {
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
        fontSize={ 12 }
        pointerEvents="none"
        textAnchor="middle" x={box.props.x} y={box.props.y + 6}
      >
        {getReward(box)}
      </text>
    </g>
  );
});

