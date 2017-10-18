import React from 'react'
import { inject, observer } from 'mobx-react'

import * as classNames from 'classnames'
import { Button, Classes, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/labs';

import { LANG_LIST } from '../../stores/Lang'

export default inject('esper')(observer( ({esper}) => {
  const onChange = item => {
    esper.evolution = 1;
    esper.level = 30;
    esper.selected = item;
  }

  const renderItem = args => {
    const { index, handleClick, isActive, item } = args;
    const e = esper.espers[item];

    const classes = classNames({
      [Classes.ACTIVE]: isActive,
      [Classes.INTENT_PRIMARY]: isActive,
    });
    return (
      <MenuItem
        className={ classes }
        key={ e.id }
        onClick={ handleClick }
        text={ e.name }
        value={ e }
      />
    );
  };

  return (
    <div className="inline">
      <Select
        filterable={ false }
        itemRenderer={ renderItem }
        items={ esper.esperIds }
        onItemSelect={ onChange }
        popoverProps={ {popoverClassName: Classes.MINIMAL} }
      >
        <Button
          rightIconName="caret-down"
          text={ esper.selected ? esper.espers[esper.selected].name : '' }
        />
      </Select>
    </div>
  );
}));
