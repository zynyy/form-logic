import { InitTreeEvent, SwitchVersion } from '@/events/mutation';
import { ICustomEvent, cancelIdle, isFn, requestIdle, uid } from '@/utils';

import type { Engine } from './Engine';
import { Hover } from './Hover';
import { MoveHelper } from './MoveHelper';
import { Selection } from './Selection';
import { TransformHelper } from './TransformHelper';
import { ITreeNode, TreeNode } from './TreeNode';
import type { Workspace } from './Workspace';

export interface IOperation {
  tree?: ITreeNode;
  selected?: string[];
}

export class Operation {
  workspace: Workspace;

  engine: Engine;

  tree: TreeNode;

  selection: Selection;

  hover: Hover;

  transformHelper: TransformHelper;

  moveHelper: MoveHelper;

  requests: {
    snapshot: null | number;
  } = {
    snapshot: null,
  };

  constructor(workspace: Workspace) {
    this.engine = workspace.engine;
    this.workspace = workspace;

    const { children, ...restDefaultComponentTree } = this.engine.props.defaultComponentTree || {};

    this.tree = new TreeNode({
      componentName: this.engine.props.rootComponentName,
      ...restDefaultComponentTree,
      operation: this,
    });

    this.tree.setTreeNode({
      children,
    });

    this.hover = new Hover({
      operation: this,
    });
    this.selection = new Selection({
      operation: this,
    });
    this.moveHelper = new MoveHelper({
      operation: this,
    });
    this.transformHelper = new TransformHelper({
      operation: this,
    });
    this.selection.select(this.tree);
  }

  dispatch(event: ICustomEvent, callback?: () => void) {
    if (this.workspace.dispatch(event) === false) {
      return;
    }
    if (isFn(callback)) {
      return callback();
    }
  }

  snapshot(type?: string) {
    cancelIdle(this.requests.snapshot);
    if (!this.workspace || !this.workspace.history || this.workspace.history.locking) {
      return;
    }
    this.requests.snapshot = requestIdle(() => {
      this.workspace.history.push(type);
    });
  }

  from(operation?: IOperation) {
    if (!operation) return;
    if (operation.tree) {
      this.tree.from(operation.tree);
    }
    if (operation.selected) {
      this.selection.selected = operation.selected;
    }
  }

  initTree(node: ITreeNode | TreeNode) {
    this.workspace.history.clear();

    const event = new InitTreeEvent({
      target: this.tree,
      source: node,
    });

    this.dispatch(event, () => {
      const id = uid();
      this.tree.setTreeNode({ ...node, id });
      this.snapshot(event.type);
      this.selection.select(id);
    });
  }

  switchVersion(node: ITreeNode | TreeNode) {
    const event = new SwitchVersion({
      target: this.tree,
      source: node,
    });

    this.dispatch(event, () => {
      this.tree.setTreeNode(node);
      this.snapshot(event.type);
    });
  }

  serialize(): IOperation {
    return {
      tree: this.tree.serialize(),
      selected: [this.tree.id],
    };
  }
}
