import React from 'react';
import { inject, observer } from 'mobx-react';

import classNames from 'classnames';
import { Button, Classes, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/labs';

export default inject('esper')(
  observer(({ esper }) => {
    const onChange = item => {
      esper.changeBoard(
        item,
        esper.espers[item].maxEvol,
        esper.getMaxLevel(esper.evolution)
      );
    };

    const renderItem = args => {
      const { handleClick, isActive, item } = args;
      const e = esper.espers[item];

      const classes = classNames({
        [Classes.ACTIVE]: isActive,
        [Classes.INTENT_PRIMARY]: isActive
      });
      return (
        <MenuItem
          className={classes}
          key={e.id}
          onClick={handleClick}
          text={e.name}
          value={e}
        />
      );
    };

    return (
      <div className="inline">
        <Select
          filterable={false}
          itemRenderer={renderItem}
          items={esper.esperIds}
          onItemSelect={onChange}
          popoverProps={{ popoverClassName: Classes.MINIMAL }}
        >
          <Button
            rightIconName="caret-down"
            text={esper.selected ? esper.espers[esper.selected].name : ''}
          />
        </Select>
      </div>
    );
  })
);
