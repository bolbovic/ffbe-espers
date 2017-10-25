import React from 'react';
import { inject, observer } from 'mobx-react';

import CopyToClipboardUrl from '../common/CopyToClipboardUrl';
import EsperBoard from '../components/esper/EsperBoard';
import EsperSelector from '../components/esper/EsperSelector';
import EsperLevelSelector from '../components/esper/EsperLevelSelector';

export default inject('esper')(
  observer(({ esper }) => (
    <div className="esper-view centered mt-10 mb-10">
      <div className="leftbar centered">
        <EsperSelector />
        {esper.selected ? <EsperLevelSelector /> : null}
        {esper.selected ? <CopyToClipboardUrl /> : null}
      </div>
      <div className="board">
        <EsperBoard />
      </div>
    </div>
  ))
);
