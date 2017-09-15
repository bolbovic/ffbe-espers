import React from 'react'
import { inject, observer } from 'mobx-react';

import EsperBoard from '../components/esper/EsperBoard'
import EsperSelector from '../components/esper/EsperSelector'

export default inject('esper')(observer(({esper}) => (
  <div>
    <EsperSelector />
    <EsperBoard esper={ esper.selected ? esper.espers[esper.selected] : null } />
  </div>
)));
