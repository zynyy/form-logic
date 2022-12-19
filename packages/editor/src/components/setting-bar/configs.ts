import EdgeConfig from "./edge-config";
import DataConfig from "./data-config";
import YesOrNoConfig from "./yesOrNo-config";
import PolicyDecisionConfig from "./policy-decision-config";
import ProcessConfig from "./process-config";

import {SettingConfigTypeFC} from "./interface";

class SettingRegistryConfigs {
  private nodeConfigs: Map<string, SettingConfigTypeFC> = new Map();

  use(node: string, nodeConfig: SettingConfigTypeFC) {
    if (!this.nodeConfigs.has(node)) {
      this.nodeConfigs.set(node, nodeConfig);
    }
    return this;
  }

  getConfig = (node: string) => {
    return this.nodeConfigs.get(node);
  };
}

const settingConfigs = new SettingRegistryConfigs();

settingConfigs

  .use("edge-config", EdgeConfig)
  .use("process-config", ProcessConfig)
  .use("yesOrNo-config", YesOrNoConfig)
  .use("policyDecision-config", PolicyDecisionConfig)
  .use("data-config", DataConfig);

export default settingConfigs;
