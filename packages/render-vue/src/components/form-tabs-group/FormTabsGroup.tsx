import { defineComponent, ref, watch } from 'vue';
import cls from 'classnames';
import SchemaFragment from '@/components/schema-fragment';
import { useStylePrefixCls } from '@/components/style/hooks';

import { Card, Tabs } from 'ant-design-vue';
import { RecursionField } from '@/formily-vue';
import { usePropertiesSources } from '@/hooks';
import { useTabs } from '@/components/form-tabs-group/hooks';
import FeedbackBadge from '@/components/feedback-badge';
import { observer } from '@/utils/observer';
import { FormTabsGroupProps, getFormTabsGroupProps } from '@/components/form-tabs-group/interface';

const FormTabsGroup = observer<FormTabsGroupProps>(
  defineComponent({
    name: 'FormTabsGroup',
    inheritAttrs: false,
    props: getFormTabsGroupProps(),
    setup(props: FormTabsGroupProps) {
      const prefixCls = useStylePrefixCls('form-tabs-group');

      const activeKey = ref(null);


      watch(
        () => props.activeKey,
        (nextActiveKey) => {
          activeKey.value = nextActiveKey;
        },
      );

      const handleChange = (nextActiveKey:string) => {
        activeKey.value = nextActiveKey;
        props.onChange?.(nextActiveKey);
      };

      return () => {
        const tabsSources = usePropertiesSources();

        const tabs = useTabs(tabsSources);

        const defaultKey = `${tabs[0]?.key}`;

        return (
          <div class={cls(prefixCls)}>
            <SchemaFragment schemaSource={tabsSources} />
            <Tabs activeKey={activeKey.value || defaultKey} onChange={handleChange} type="card">
              {tabs.map((item) => {
                const { schema, key, name, title } = item || {};

                return (
                  <Tabs.TabPane
                    key={key}
                    id={key}
                    v-slots={{
                      tab: () => {
                        return <FeedbackBadge name={name}>{title}</FeedbackBadge>;
                      },
                    }}
                    forceRender
                  >
                    <Card size="small">
                      <RecursionField schema={schema} name={name} onlyRenderProperties />
                    </Card>
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </div>
        );
      };
    },
  }),
);

export default FormTabsGroup;
