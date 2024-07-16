import './styles.less';

import { FormProvider, observer, onFormInputChange, useCreateForm } from '@formlogic/render-vue2';
import { SelectNodeEvent, cancelIdle, requestIdle } from '@formlogic/designer-core';
import { toJS } from '@formily/reactive';
import cls from 'classnames';
import { Form as ElForm, Empty, Row } from 'element-ui';
import { debounce, isEmpty, isEqual } from 'lodash-es';
import { defineComponent, nextTick, onMounted, reactive, ref, shallowRef, unref } from 'vue';

import {
  useDesigner,
  usePrefix,
  useWorkbench,
  useWorkspaceCurrentNode,
  useWorkspaceSelected,
} from '@/hooks';
import { IconWidget, NodePathWidget } from '@/widgets';

import { SchemaField } from './SchemaField';

const GlobalState = {
  idleRequest: null,
};

export const SettingsForm = observer(
  defineComponent({
    props: ['uploadAction', 'components', 'effects', 'scope', 'headers'],
    setup(props) {
      const workbenchRef = useWorkbench();
      const designerRef = useDesigner();
      const prefixRef = usePrefix('settings-form');

      const modelFields = ref([]);

      const currentNodeId = ref('');

      const prevModel = ref('');

      const currentWorkspace =
        workbenchRef.value?.activeWorkspace || workbenchRef.value?.currentWorkspace;
      const currentWorkspaceId = ref(currentWorkspace?.id);

      const nodeRef = useWorkspaceCurrentNode();
      const selectedRef = useWorkspaceSelected();

      const schemaRef = shallowRef();

      const sources = reactive({
        key: nodeRef.value.id,
        isEmpty:
          nodeRef.value &&
          isEmpty(nodeRef.value.designerProps?.propsSchema) &&
          selectedRef.value.length === 1,
      });

      const [formRef, refreshForm] = useCreateForm();

      const requestIdleTask = () => {
        schemaRef.value = undefined;
        const selectedNode = designerRef.value.findNodeById(currentNodeId.value) || {};
        if (nodeRef.value) {
          sources.key = selectedNode.id;
          sources.isEmpty =
            isEmpty(selectedNode.designerProps?.propsSchema) && selectedRef.value.length === 1;

          const initialValues = toJS(selectedNode?.props);

          refreshForm({
            initialValues,
            effects(form) {
              onFormInputChange(
                debounce(() => {
                  if (selectedNode.id === nodeRef.value?.id) {
                    const nextProps = toJS(form.values);
                    if (!isEqual(nextProps, initialValues)) {
                      selectedNode?.setProps(nextProps, 'overwrite');
                    }
                  }
                }, 500),
              );

              selectedNode?.designerProps.settingFormEffects?.(selectedNode, form);

              props.effects?.(form);
            },
          });

          schemaRef.value = selectedNode?.designerProps?.propsSchema;
        } else {
          schemaRef.value = {};
        }
      };

      const initForm = () => {
        currentNodeId.value = nodeRef.value?.id;

        requestIdleTask();

        fetchModelFields(nodeRef.value?.root.props?.model);
      };

      onMounted(() => {
        initForm();
        designerRef.value.subscribeTo(SelectNodeEvent, (node) => {
          if (node.data.source?.length === 1) {
            const sourceId = node.data.source[0].id;
            if (sourceId !== currentNodeId.value) {
              currentNodeId.value = sourceId;
              nextTick(() => {
                requestIdleTask();
              });
            }
          } else {
            currentNodeId.value = '';
            sources.isEmpty = true;
          }

          if (node.data.target.isRoot) {
            fetchModelFields(node.data.target.props.model);
          }
        });
      });

      const fetchModelFields = (code: string) => {
        if (!code || prevModel.value === code) {
          return;
        }
        prevModel.value = code;
      };

      const render = () => {
        const schema = unref(schemaRef);
        const prefix = prefixRef.value;

        return (
          <div class={cls(prefix)} key={sources.key} id={`form-${formRef.value.id}`}>
            <FormProvider key={formRef.value.id} form={formRef.value}>
              <ElForm>
                <Row
                  type="flex"
                  style={{
                    'flex-wrap': 'wrap',
                  }}
                  wrap
                >
                  {!sources.isEmpty ? (
                    <SchemaField
                      schema={schema}
                      components={props.components}
                      scope={props.scope}
                    />
                  ) : (
                    <div class={prefix + '-empty'}>
                      <Empty description="无须配置" />
                    </div>
                  )}
                </Row>
              </ElForm>
            </FormProvider>
          </div>
        );
      };

      return () => {
        const prefix = prefixRef.value;

        return (
          <IconWidget.Provider props={{ tooltip: true }}>
            <div class={prefix + '-wrapper'}>
              {!sources.isEmpty && <NodePathWidget workspaceId={currentWorkspaceId.value} />}
              <div class={prefix + '-content'}>{render()}</div>
            </div>
          </IconWidget.Provider>
        );
      };
    },
  }),
  {
    scheduler: (update) => {
      cancelIdle(GlobalState.idleRequest);
      GlobalState.idleRequest = requestIdle(update, {
        timeout: 500,
      });
    },
  },
);
