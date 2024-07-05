import './styles.less';

import { observer } from '@formlogic/code-render';
import cls from 'classnames';
import { defineComponent } from 'vue';

import { usePrefix, useWorkbench } from '@/hooks';
import { TextWidget } from '@/widgets';

export const HistoryWidget = observer(
  defineComponent({
    name: 'DnHistoryWidget',
    props: [],
    setup() {
      const workbenchRef = useWorkbench();
      const prefixRef = usePrefix('history');

      return () => {
        const currentWorkspace =
          workbenchRef.value?.activeWorkspace || workbenchRef.value?.currentWorkspace;
        if (!currentWorkspace) return null;

        return (
          <div class={prefixRef.value}>
            {currentWorkspace.history.list().map((item, index) => {
              const type = item.type || 'default_state';
              const token = type.replace(/\:/g, '_');

              const date = new Date(item.timestamp);

              return (
                <div
                  class={cls(prefixRef.value + '-item', {
                    active: currentWorkspace.history.current === index,
                  })}
                  key={item.timestamp}
                  onClick={() => {
                    currentWorkspace.history.goTo(index);
                  }}
                >
                  <span class={prefixRef.value + '-item-title'}>
                    <TextWidget token={`operations.${token}`} />
                  </span>
                  <span class={prefixRef.value + '-item-timestamp'}>
                    {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}
                  </span>
                </div>
              );
            })}
          </div>
        );
      };
    },
  }),
);
