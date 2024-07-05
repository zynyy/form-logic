import { action, define, observable } from '@formily/reactive';

import { SelectNodeEvent, UnSelectNodeEvent } from '@/events';
import { isArr, isStr } from '@/utils';

import type { Operation } from './Operation';
import type { TreeNode } from './TreeNode';

export interface ISelection {
  selected?: string[];
  operation: Operation;
}

export class Selection {
  operation: Operation;
  selected: string[] = [];
  indexes: Record<string, boolean> = {};

  constructor(props: ISelection) {
    this.selected = props.selected || [];
    this.operation = props.operation;
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      selected: observable,
      select: action,
      batchSelect: action,
      add: action,
      remove: action,
      clear: action,
      crossAddTo: action,
    });
  }

  trigger(type = SelectNodeEvent) {
    return this.operation.dispatch(
      new type({
        target: this.operation.tree,
        source: this.selectedNodes.filter((val) => val) as TreeNode[],
      }),
    );
  }

  select(id: string | TreeNode) {
    if (!id) {
      return;
    }
    if (isStr(id)) {
      if (this.selected.length === 1 && this.selected.includes(id)) {
        this.trigger(SelectNodeEvent);
        return;
      }
      this.selected = [id];
      this.indexes = { [id]: true };
      this.trigger(SelectNodeEvent);
    } else {
      this.select(id?.id);
    }
  }

  safeSelect(id: string | TreeNode) {
    if (!id) return;
    this.select(id);
  }

  mapIds(ids: any) {
    return isArr(ids) ? ids.map((node: any) => (isStr(node) ? node : node?.id)) : [];
  }

  batchSelect(ids: string[] | TreeNode[]) {
    this.selected = this.mapIds(ids);
    this.indexes = this.selected.reduce((buf: Record<string, boolean>, id) => {
      buf[id] = true;
      return buf;
    }, {});
    this.trigger(SelectNodeEvent);
  }

  batchSafeSelect(ids: string[] | TreeNode[]) {
    if (!ids?.length) return;
    this.batchSelect(ids);
  }

  get selectedNodes() {
    return this.selected.map((id) => this.operation.tree.findById(id));
  }

  get first() {
    if (this.selected && this.selected.length) return this.selected[0];
  }

  get last() {
    if (this.selected && this.selected.length) return this.selected[this.selected.length - 1];
  }

  get length() {
    return this.selected.length;
  }

  add(...ids: string[] | TreeNode[]) {
    this.mapIds(ids).forEach((id) => {
      if (isStr(id)) {
        if (!this.selected.includes(id)) {
          this.selected.push(id);
          this.indexes[id] = true;
        }
      } else {
        this.add(id?.id);
      }
    });
    this.trigger();
  }

  crossAddTo(node: TreeNode) {
    if (node.parent) {
      if (this.has(node)) {
        this.remove(node);
      } else {
        const selectedNodes = this.selectedNodes;
        const minDistanceNode = selectedNodes.reduce((minDistanceNode, item) => {
          if (item && minDistanceNode) {
            return item.distanceTo(node) < minDistanceNode.distanceTo(node)
              ? item
              : minDistanceNode;
          }
          if (minDistanceNode && !item) {
            return minDistanceNode;
          }
          return item;
        }, selectedNodes[0]);
        if (minDistanceNode) {
          const crossNodes = node.crossSiblings(minDistanceNode);
          crossNodes.forEach((node) => {
            if (!this.has(node.id)) {
              this.selected.push(node.id);
              this.indexes[node.id] = true;
            }
          });
        }
        if (!this.has(node.id)) {
          this.selected.push(node.id);
          this.indexes[node.id] = true;
        }
      }
    }
  }

  remove(...ids: string[] | TreeNode[]) {
    this.mapIds(ids).forEach((id) => {
      if (isStr(id)) {
        this.selected = this.selected.filter((item) => item !== id);
        delete this.indexes[id];
      } else {
        this.remove(id?.id);
      }
    });
    this.trigger(UnSelectNodeEvent);
  }

  has(...ids: string[] | TreeNode[]): boolean {
    return this.mapIds(ids).some((id) => {
      if (isStr(id)) {
        return this.indexes[id];
      } else {
        if (!id?.id) return false;
        return this.has(id?.id);
      }
    });
  }

  clear() {
    this.selected = [];
    this.indexes = {};
    this.trigger(UnSelectNodeEvent);
  }
}
