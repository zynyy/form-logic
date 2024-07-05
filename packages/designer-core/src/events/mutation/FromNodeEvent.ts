import { ITreeNode, TreeNode } from '@/models/TreeNode';
import { ICustomEvent } from '@/utils';

export interface IFromNodeEventData {
  // 事件发生的数据源
  source: ITreeNode;
  // 事件发生的目标对象
  target: TreeNode;
}

export class FromNodeEvent implements ICustomEvent {
  type = 'from:node';
  data: IFromNodeEventData;
  constructor(data: IFromNodeEventData) {
    this.data = data;
  }
}
