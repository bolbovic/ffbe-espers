import React from 'react';
import { inject, observer } from 'mobx-react';

import * as classNames from 'classnames';
import { Button, Classes, NumericInput, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/labs';

import { LANG_LIST } from '../../stores/Lang';

export default inject('esper')(
  observer(({ esper }) => {
    const getMaxLevel = e => {
      let i = 30;
      switch (e) {
        case 2:
          i = 40;
          break;
        case 3:
          i = 50;
          break;
      }
      return i;
    };

    const makeItems = () => {
      let items = [],
        max = esper.espers[esper.selected]
          ? esper.espers[esper.selected].maxEvol
          : 0;
      for (var i = 1; i <= max; i++) items.push(i);
      return items;
    };

    const onEvolChange = item => {
      esper.evolution = item;
      esper.level = getMaxLevel(item);
    };

    const onLvlChange = val => {
      esper.level = val;
    };

    const renderItem = args => {
      const { index, handleClick, isActive, item } = args;
      const classes = classNames({
        [Classes.ACTIVE]: isActive,
        [Classes.INTENT_PRIMARY]: isActive
      });
      return (
        <MenuItem
          className={classes}
          key={item}
          onClick={handleClick}
          text={'★'.repeat(item)}
          value={item}
        />
      );
    };

    return (
      <div className="inline">
        <div className="inline">
          <Select
            filterable={false}
            itemRenderer={renderItem}
            items={makeItems()}
            onItemSelect={onEvolChange}
            popoverProps={{ popoverClassName: Classes.MINIMAL }}
          >
            <Button
              rightIconName="caret-down"
              text={
                esper.evolution && esper.selected
                  ? '★'.repeat(esper.evolution)
                  : ''
              }
            />
          </Select>
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
