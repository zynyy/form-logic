import {
  ComponentTreeWidget,
  CompositePanel,
  createDesigner,
  Designer,
  DesignerToolsWidget,
  Engine,
  GlobalRegistry,
  HistoryWidget,
  OutlineTreeWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  WorkspacePanel,
} from '@formlogic/designer-vue2';
import { ref } from 'vue';

import { Input, Resize, Translate } from './components';
import { SettingsForm } from './settings-form';

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增列表组件',
      Displays: '展示组件',
      Functional: '功能型组件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
    },
  },
});

const components = {
  Input,
  Resize,
  Translate,
};

const CompositePanelItem = CompositePanel.Item;

const sources = {
  Inputs: [Input],
  Layouts: [Resize, Translate],
  Arrays: [],
  Functional: [],
};

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Designer',
  component: Designer,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const render = () => ({
  components: { Designer },
  setup() {
    return () => {
      const engine = ref<Engine>(
        createDesigner({
          shortcuts: [],
          rootComponentName: 'Form',
          defaultComponentTree: {
            children: [],
          },
        }),
      );

      return (
        <Designer engine={engine.value}>
          <StudioPanel>
            <CompositePanel>
              <CompositePanelItem title="panels.Component" icon="Component">
                <ResourceWidget title="sources.Inputs" sources={sources.Inputs} />
                <ResourceWidget title="sources.Layouts" sources={sources.Layouts} />
                <ResourceWidget title="sources.Arrays" sources={sources.Arrays} />
                <ResourceWidget title="sources.Functional" sources={sources.Functional} />
              </CompositePanelItem>
              <CompositePanelItem title="panels.OutlinedTree" icon="Outline">
                <OutlineTreeWidget />
              </CompositePanelItem>
              <CompositePanelItem title="panels.History" icon="History">
                <HistoryWidget />
              </CompositePanelItem>
            </CompositePanel>
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">
                  <ComponentTreeWidget components={components} />
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
            <SettingsPanel title="panels.PropertySettings">
              <SettingsForm />
            </SettingsPanel>
          </StudioPanel>
        </Designer>
      );
    };
  },
});

export const basic = {
  render,
  args: {},
};
