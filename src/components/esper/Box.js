import React from 'react';
import Hex from 'react-hex';
import { inject, observer } from 'mobx-react';

const getFill = box => {
  const { pathed, selectable, selected, unpathed } = box;
  const reward = box.infos && box.infos.reward ? box.infos.reward[0] : '';
  let color = 'white',
    alpha = '.1';

  if ((selectable || pathed) && !selected) {
    alpha = '1';
  } else if (selected && !unpathed && !selectable) {
    alpha = '.9';
  }

  switch (reward.substring(0, 4)) {
    case 'ATK':
      color = `230, 102, 101`;
      break;
    case 'DEF':
      color = '205, 180, 140';
      break;
    case 'MAG':
      color = '146, 149, 202';
      break;
    case 'SPR':
      color = '9, 107, 182';
      break;
    case 'MP':
      color = '158, 206, 182';
      break;
    case 'HP':
      color = '255, 214, 3';
      break;
    case 'RES_':
    case 'ABIL':
      color = '173, 113, 175';
      break;
    case 'MAGI':
      color = '172, 233, 232';
      break;
    default:
      color = '255, 255, 255';
  }
  return `rgba(${color}, ${alpha})`;
};

const Txt = ({ fill, fontSize = 10, text = '', x, y }) => (
  <text
    fill={fill}
    fontSize={fontSize}
    pointerEvents="none"
    textAnchor="middle"
    x={x}
    y={y}
  >
    {text}
  </text>
);
Txt.propTypes = {
  fill: React.PropTypes.string.isRequired,
  fontSize: React.PropTypes.number,
  text: React.PropTypes.string,
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired
};

export default inject('esper', 'lang')(
  observer(({ box, esper, lang, onMouseOver, onMouseOut, onClick }) => {
    lang.lang; // Doing this to auto load when a change of lang.

    const getReward = box => {
      let txt = '';
      if (box.infos && box.infos.reward) {
        if (
          ['ATK', 'DEF', 'MAG', 'SPR', 'HP', 'MP'].indexOf(
            box.infos.reward[0]
          ) !== -1
        ) {
          txt = `${lang.t(`carac.${box.infos.reward[0]}`)} +${box.infos
            .reward[1]}`;
        } else if (box.infos.reward[0].substring(0, 4) === 'RES_') {
          txt = `${lang.t(`carac.${box.infos.reward[0]}`)} +${box.infos
            .reward[1]}%`;
        } else if (box.infos.reward[0] === 'ABILITY') {
          txt = esper.abilities[box.infos.reward[1]].NAME;
        } else if (box.infos.reward[0] === 'MAGIC') {
          txt = esper.magics[box.infos.reward[1]].NAME;
        } else {
          txt = `${box.infos.reward[0]} ${box.infos.reward[1]}`;
        }
      }
      return txt;
    };

    const fill = box.selectable && !box.selected ? 'white' : 'black';

    return (
      <g key={`${box.gridX}-${box.gridY}`}>
        <Hex
          fill={getFill(box)}
          onClick={onClick.bind(null, box.id)}
          onMouseOver={onMouseOver.bind(null, box.id)}
          onMouseOut={onMouseOut.bind(null, box.id)}
          stroke={
            box.hover
              ? 'red'
              : box.pathed ? '#0000FF' : box.selected ? 'black' : 'grey'
          }
          type="pointy-topped"
          {...box.props}
        />
        {box.infos.parentId ? (
          <Txt
            fill={fill}
            fontSize={12}
            text={'★'.repeat(box.infos.rarity) || ''}
            x={box.props.x}
            y={box.props.y - 16}
          />
        ) : null}
        {box.infos.parentId ? (
          <Txt
            fill={fill}
            text={getReward(box)}
            x={box.props.x}
            y={box.props.y + 6}
          />
        ) : null}
        {box.infos.parentId ? (
          <Txt
            fill={fill}
            text={`SP ${box.infos.cost}`}
            x={box.props.x}
            y={box.props.y + 28}
          />
        ) : null}
      </g>
    );
  })
);
