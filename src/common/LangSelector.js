import React from 'react'
import { inject, observer } from 'mobx-react'

import * as classNames from 'classnames'
import { Button, Classes, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/labs';

import { LANG_LIST } from '../stores/Lang'

export default inject('lang')(observer( ({lang}) => {
  const onChange = item => {
    lang.changeLang(item);
  }
  const renderItem = args => {
    const { index, handleClick, isActive, item } = args;

    const classes = classNames({
      [Classes.ACTIVE]: isActive,
      [Classes.INTENT_PRIMARY]: isActive,
    });

    return (
      <MenuItem
        className={ classes }
        key={ index }
        onClick={ handleClick }
        text={ lang.t(`lang.${ item }`) }
        value={ item }
      />
    );
  };

  return (
    <Select
      filterable={ false }
      itemRenderer={ renderItem }
      items={ LANG_LIST }
      onItemSelect={ onChange }
      popoverProps={ {popoverClassName: Classes.MINIMAL} }
    >
      <Button
        rightIconName="caret-down"
        text={ lang.t(`lang.${ lang.lang }`) }
      />
    </Select>
  );
}));
