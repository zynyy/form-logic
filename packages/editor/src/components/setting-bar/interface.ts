import {Cell, Graph} from "@antv/x6";
import {FC} from "react";

export interface SettingConfigType {
  selected: undefined | Cell
  graph: Graph | undefined;
}

export type SettingConfigTypeFC = FC<SettingConfigType>;
