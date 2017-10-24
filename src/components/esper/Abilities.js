import React from 'react';
import { inject, observer } from 'mobx-react';
import sortby from 'lodash.sortby';

const Ability = inject('esper', 'lang')(
  observer(({ box, esper, lang }) => {
    const [r, v] = box.infos.reward;
    return (
      <div className="skill">
        {r === 'ABILITY' ? (
          <span className="ability">{`${esper.abilities[v].NAME}: ${esper
            .abilities[v].DESC_LONG}`}</span>
        ) : r === 'MAGIC' ? (
          <span className="magic">{`${esper.magics[v].NAME}: ${esper.magics[v]
            .DESC_LONG}`}</span>
        ) : (
          <span>{`${v}% ${lang.t(`carac.${r}`)}`}</span>
        )}
      </div>
    );
  })
);

export default observer(({ board }) => (
  <div className="abilities">
    <div>
      {sortby(board, ['infos.reward.0'])
        .map((b, idx) => {
          if (
            b.infos.reward &&
            ['RES_', 'ABIL', 'MAGI'].indexOf(
              b.infos.reward[0].substring(0, 4)
            ) !== -1 &&
            b.selected
          ) {
            return <Ability box={b} key={idx} />;
          }
          return null;
        })
        .filter(b => !!b)}
    </div>
  </div>
));
