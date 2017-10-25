import React from 'react';
import { inject, observer } from 'mobx-react';

import { Button } from '@blueprintjs/core';

export default inject('lang', 'ui')(
  observer(({ lang, ui }) => (
    <div className="inline">
      <Button
        onClick={ui.handleCopyToClipboard}
        text={lang.t('buttons.clipboard')}
      />
    </div>
  ))
);
