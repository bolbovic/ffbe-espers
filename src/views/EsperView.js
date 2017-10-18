import React from 'react'
import { inject, observer } from 'mobx-react';

import EsperBoard from '../components/esper/EsperBoard'
import EsperSelector from '../components/esper/EsperSelector'
import EsperLevelSelector from '../components/esper/EsperLevelSelector'

export default inject('esper')(observer(({esper}) => (
  <div className="esper-view centered">
    <div className="leftbar centered">
      <EsperSelector />
      { esper.selected ? <EsperLevelSelector /> : null }
    </div>
    <div className="board">
      <EsperBoard
        availableCPS={ esper.availableCPS }
        esper={ esper.selected ? esper.espers[esper.selected] : null }
        evolution={ esper.evolution }
        level={ esper.level }
      />
    </div>
  </div>
)));
