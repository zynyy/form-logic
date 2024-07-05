import {
  calcDistanceOfSnapLineToEdges,
  calcExtendsLineSegmentOfRect,
  LineSegment,
  Rect,
} from '@/utils';

import { SnapLine } from './SnapLine';
import type { TransformHelper } from './TransformHelper';
import type { TreeNode } from './TreeNode';

export type ISpaceBlockType = 'top' | 'right' | 'bottom' | 'left' | (string & {});

export interface ISpaceBlock {
  id?: string;
  refer?: TreeNode;
  rect?: Rect;
  distance?: number;
  type?: ISpaceBlockType;
}

export type AroundSpaceBlock = Record<ISpaceBlockType, SpaceBlock>;

export class SpaceBlock {
  _id: string;
  distance: number;
  refer: TreeNode;
  helper: TransformHelper;
  rect: Rect;
  type: ISpaceBlockType;
  constructor(helper: TransformHelper, box: Required<ISpaceBlock>) {
    this.helper = helper;
    this.distance = box.distance;
    this.refer = box.refer;
    this.rect = box.rect;
    this.type = box.type;
    this._id = box.id;
  }

  get referRect() {
    if (!this.refer) return;
    return this.helper.getNodeRect(this.refer);
  }

  get id() {
    return this._id ?? `${this.rect.x}-${this.rect.y}-${this.rect.width}-${this.rect.height}`;
  }

  get next() {
    // @ts-ignore
    const spaceBlock = this.helper.calcAroundSpaceBlocks(this.referRect);
    return spaceBlock[this.type as any];
  }

  get extendsLine() {
    if (!this.needExtendsLine) return;
    const dragNodesRect = this.helper.dragNodesRect;
    // @ts-ignore
    return calcExtendsLineSegmentOfRect(dragNodesRect, this.referRect);
  }

  get needExtendsLine() {
    const targetRect = this.crossDragNodesRect;
    const referRect = this.crossReferRect;
    if (this.type === 'top' || this.type === 'bottom') {
      const rightDelta = referRect.right - targetRect.left;
      const leftDelta = targetRect.right - referRect.left;
      return rightDelta < targetRect.width / 2 || leftDelta < targetRect.width / 2;
    } else {
      const topDelta = targetRect.bottom - referRect.top;
      const bottomDelta = referRect.bottom - targetRect.top;
      return topDelta < targetRect.height / 2 || bottomDelta < targetRect.height / 2;
    }
    return true;
  }

  get crossReferRect() {
    const referRect = this.referRect;
    if (this.type === 'top' || this.type === 'bottom') {
      // @ts-ignore
      return new Rect(referRect.x, this.rect.y, referRect.width, this.rect.height);
    } else {
      // @ts-ignore
      return new Rect(this.rect.x, referRect.y, this.rect.width, referRect.height);
    }
  }

  get crossDragNodesRect() {
    const dragNodesRect = this.helper.dragNodesRect;
    if (this.type === 'top' || this.type === 'bottom') {
      // @ts-ignore
      return new Rect(dragNodesRect.x, this.rect.y, dragNodesRect.width, this.rect.height);
    } else {
      // @ts-ignore
      return new Rect(this.rect.x, dragNodesRect.y, this.rect.width, dragNodesRect.height);
    }
  }

  get isometrics() {
    const results: SpaceBlock[] = [];
    let spaceBlock: SpaceBlock = this as any;
    while ((spaceBlock = spaceBlock.next)) {
      // @ts-ignore
      if (Math.abs(spaceBlock.distance - this.distance) < TransformHelper.threshold) {
        if (results.some((box) => box.distance !== spaceBlock.distance)) continue;
        results.push(spaceBlock);
      }
    }
    return results;
  }

  get snapLine() {
    if (!this.isometrics.length) return;
    const nextRect = this.next.rect;
    const referRect = this.referRect;
    let line: LineSegment;
    if (this.type === 'top') {
      line = new LineSegment(
        {
          x: nextRect.left,
          // @ts-ignore
          y: referRect.bottom + nextRect.height,
        },
        {
          x: nextRect.right,
          // @ts-ignore
          y: referRect.bottom + nextRect.height,
        },
      );
    } else if (this.type === 'bottom') {
      line = new LineSegment(
        {
          x: nextRect.left,
          // @ts-ignore
          y: referRect.top - nextRect.height,
        },
        {
          x: nextRect.right,
          // @ts-ignore
          y: referRect.top - nextRect.height,
        },
      );
    } else if (this.type === 'left') {
      line = new LineSegment(
        {
          // @ts-ignore
          x: referRect.right + nextRect.width,
          y: nextRect.top,
        },
        {
          // @ts-ignore
          x: referRect.right + nextRect.width,
          y: nextRect.bottom,
        },
      );
    } else {
      line = new LineSegment(
        {
          // @ts-ignore
          x: referRect.left - nextRect.width,
          y: nextRect.top,
        },
        {
          // @ts-ignore
          x: referRect.left - nextRect.width,
          y: nextRect.bottom,
        },
      );
    }
    const distance = calcDistanceOfSnapLineToEdges(line, this.helper.dragNodesEdgeLines);
    return new SnapLine(this.helper, {
      ...line,
      distance,
      type: 'space-block',
    });
  }
}
