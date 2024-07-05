import {
  calcOffsetOfSnapLineSegmentToEdge,
  calcRectOfAxisLineSegment,
  ILineSegment,
  IPoint,
  Rect,
} from '@/utils';

import { TransformHelper } from './TransformHelper';
import type { TreeNode } from './TreeNode';

export type ISnapLineType = 'ruler' | 'space-block' | 'normal';

export type ISnapLine = ILineSegment & {
  type?: ISnapLineType;
  distance?: number;
  id?: string;
  refer?: TreeNode;
};

export class SnapLine {
  _id: string | undefined;
  type: ISnapLineType;
  distance: number;
  refer: TreeNode | undefined;
  start: IPoint;
  end: IPoint;
  helper: TransformHelper;
  constructor(helper: TransformHelper, line: ISnapLine) {
    this.helper = helper;
    this.type = line.type || 'normal';
    this._id = line.id;
    this.refer = line.refer;
    this.start = { ...line.start };
    this.end = { ...line.end };
    this.distance = line.distance || 0;
  }

  get id() {
    return this._id ?? `${this.start.x}-${this.start.y}-${this.end.x}-${this.end.y}`;
  }

  get direction() {
    if (this.start?.x === this.end?.x) return 'v';
    return 'h';
  }

  get closest() {
    return this.distance < TransformHelper.threshold;
  }

  get rect() {
    return calcRectOfAxisLineSegment(this);
  }

  translate(node: TreeNode, translate: IPoint) {
    if (!node || !node?.parent) return;
    const parent = node.parent;
    const dragNodeRect = node.getValidElementOffsetRect();
    const parentRect = parent.getValidElementOffsetRect();
    // @ts-ignore
    const edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, dragNodeRect);
    if (this.direction === 'h') {
      // @ts-ignore
      translate.y = this.start.y - parentRect.y - edgeOffset.y;
    } else {
      // @ts-ignore
      translate.x = this.start.x - parentRect.x - edgeOffset.x;
    }
  }

  resize(node: TreeNode, rect: Rect) {
    if (!node || !node?.parent) return;
    const parent = node.parent;
    const dragNodeRect = node.getValidElementOffsetRect();
    const parentRect = parent.getValidElementOffsetRect();
    // @ts-ignore
    const edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, dragNodeRect);
    const cursorRect = this.helper.cursorDragNodesRect;
    const snapEdge = this.snapEdge(rect);
    if (this.direction === 'h') {
      // @ts-ignore
      const y = this.start.y - parentRect.y - edgeOffset.y;
      switch (this.helper.direction) {
        case 'left-top':
        case 'center-top':
        case 'right-top':
          if (snapEdge !== 'ht' || !cursorRect) {
            return;
          }
          rect.y = y;
          rect.height = cursorRect.bottom - y;
          break;
        case 'left-bottom':
        case 'center-bottom':
        case 'right-bottom':
          if (snapEdge !== 'hb' || !cursorRect) {
            return;
          }
          rect.height = this.start.y - cursorRect.top;
          break;
      }
    } else {
      // @ts-ignore
      const x = this.start.x - parentRect.x - edgeOffset.x;
      switch (this.helper.direction) {
        case 'left-top':
        case 'left-bottom':
        case 'left-center':
          if (snapEdge !== 'vl' || !cursorRect) {
            return;
          }
          rect.x = x;
          rect.width = cursorRect.right - x;
          break;
        case 'right-center':
        case 'right-top':
        case 'right-bottom':
          if (snapEdge !== 'vr' || !cursorRect) {
            return;
          }
          rect.width = this.start.x - cursorRect.left;
          break;
      }
    }
  }

  snapEdge(rect: Rect) {
    const threshold = TransformHelper.threshold;
    if (this.direction === 'h') {
      if (Math.abs(this.start.y - rect.top) < threshold) return 'ht';
      if (Math.abs(this.start.y - (rect.top + rect.height / 2)) < threshold) return 'hc';
      if (Math.abs(this.start.y - rect.bottom) < threshold) return 'hb';
    } else {
      if (Math.abs(this.start.x - rect.left) < threshold) return 'vl';
      if (Math.abs(this.start.x - (rect.left + rect.width / 2)) < threshold) return 'vc';
      if (Math.abs(this.start.x - rect.right) < threshold) return 'vr';
    }
  }
}
