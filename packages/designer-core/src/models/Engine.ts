import { IEngineProps } from '@/interface';
import { Event, EventContainer, globalThisPolyfill, uid } from '@/utils';

import { Cursor } from './Cursor';
import { Keyboard } from './Keyboard';
import { Screen, ScreenType } from './Screen';
import { ITreeNode, TreeNode } from './TreeNode';
import { Workbench } from './Workbench';

/**
 * 设计器引擎
 */

export class Engine extends Event {
  id: string;

  props: IEngineProps<Engine>;

  cursor: Cursor;

  workbench: Workbench;

  keyboard: Keyboard;

  screen: Screen;

  constructor(props: Partial<IEngineProps<Engine>>) {
    // @ts-ignore
    super(props);
    this.props = {
      ...Engine.defaultProps,
      ...props,
    };
    this.id = uid();
    this.workbench = new Workbench(this);
    this.screen = new Screen(this);
    this.cursor = new Cursor(this);
    this.keyboard = new Keyboard(this);
  }

  initTree(tree: ITreeNode) {
    if (this.workbench.currentWorkspace) {
      this.workbench.currentWorkspace.operation.initTree(tree);
    }
  }

  switchVersion(tree: ITreeNode) {
    if (this.workbench.currentWorkspace) {
      this.workbench.currentWorkspace.operation.switchVersion(tree);
    }
  }

  setCurrentTree(tree: ITreeNode) {
    if (this.workbench.currentWorkspace) {
      this.workbench.currentWorkspace.operation.tree.from(tree);
    }
  }

  getCurrentTree() {
    return this.workbench?.currentWorkspace?.operation?.tree;
  }

  getAllSelectedNodes() {
    let results: TreeNode[] = [];
    for (let i = 0; i < this.workbench.workspaces.length; i++) {
      const workspace = this.workbench.workspaces[i];
      // @ts-ignore
      results = results.concat(workspace.operation.selection.selectedNodes);
    }
    return results;
  }

  findNodeById(id: string) {
    return TreeNode.findById(id);
  }

  findMovingNodes(): TreeNode[] {
    const results: TreeNode[] = [];
    this.workbench.eachWorkspace((workspace) => {
      workspace.operation.moveHelper.dragNodes?.forEach((node) => {
        if (!results.includes(node)) {
          results.push(node);
        }
      });
    });
    return results;
  }

  createNode(node: ITreeNode, parent?: TreeNode) {
    return new TreeNode(node, parent);
  }

  mount(container?: EventContainer) {
    this.attachEvents(container ?? globalThisPolyfill);
  }

  unmount(container?: EventContainer) {
    this.detachEvents(container);
  }

  static defaultProps: IEngineProps<Engine> = {
    shortcuts: [],
    effects: [],
    drivers: [],
    rootComponentName: 'Root',
    sourceIdAttrName: 'data-designer-source-id',
    nodeIdAttrName: 'data-designer-node-id',
    contentEditableAttrName: 'data-content-editable',
    contentEditableNodeIdAttrName: 'data-content-editable-node-id',
    clickStopPropagationAttrName: 'data-click-stop-propagation',
    nodeSelectionIdAttrName: 'data-designer-node-helpers-id',
    nodeDragHandlerAttrName: 'data-designer-node-drag-handler',
    screenResizeHandlerAttrName: 'data-designer-screen-resize-handler',
    nodeResizeHandlerAttrName: 'data-designer-node-resize-handler',
    outlineNodeIdAttrName: 'data-designer-outline-node-id',
    nodeTranslateAttrName: 'data-designer-node-translate-handler',
    defaultScreenType: ScreenType.PC,
  };
}
