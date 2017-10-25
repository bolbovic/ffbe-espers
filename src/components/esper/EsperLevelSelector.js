import React from 'react';
import { inject, observer } from 'mobx-react';

import { Button, NumericInput } from '@blueprintjs/core';

const StarSelector = inject('esper')(
  observer(({ esper, onClick }) => {
    const max = esper.espers[esper.selected].maxEvol || 3;
    const buttons = [];
    const handleClick = item => onClick.bind(null, item);

    for (let i = 1; i <= 3; i++)
      buttons.push(
        <Button
          active={esper.evolution === i}
          disabled={i > max}
          key={i}
          onClick={handleClick(i)}
          text={'★'.repeat(i)}
        />
      );
    return <div className="pt-button-group">{buttons}</div>;
  })
);

export default inject('esper')(
  observer(({ esper }) => {
    const getMaxLevel = e => {
      let i = 30;
      switch (e) {
        case 2:
          i = 40;
          break;
        case 3:
          i = 60;
          break;
      }
      return i;
    };

    const onEvolChange = item => {
      esper.evolution = item;
      esper.level = getMaxLevel(item);
    };

    const onLvlChange = val => {
      esper.level = val;
    };

    return (
      <div className="inline">
        <div className="inline">
          <StarSelector onClick={onEvolChange} />
        </div>
        <div className="inline level">
          <NumericInput
            className="inline pt-fill"
            max={getMaxLevel(esper.evolution)}
            min={1}
            onValueChange={onLvlChange}
            value={esper.level}
          />
        </div>
      </div>
    );
  })
);
