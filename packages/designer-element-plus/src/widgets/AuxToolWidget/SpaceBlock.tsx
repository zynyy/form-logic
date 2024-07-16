import { Fragment, observer } from '@formlogic/render-vue2';
import { CursorStatus, ILineSegment, calcRectOfAxisLineSegment } from '@formlogic/designer-core';
import { defineComponent } from 'vue';

import { useCursor, usePrefix, useTransformHelper } from '@/hooks';

export const SpaceBlock = observer(
  defineComponent({
    name: 'DnSpaceBlock',
    setup() {
      const cursor = useCursor();
      const transformHelper = useTransformHelper();
      const prefix = usePrefix('aux-space-block');

      const renderRulerBox = (distance: number, type: string) => {
        if (type === 'top' || type === 'bottom') {
          return (
            <div class={prefix + '-ruler-v'}>
              <div class={prefix + '-ruler-indicator'}>
                <span>{distance?.toFixed(0)}</span>
              </div>
            </div>
          );
        } else if (type === 'left' || type === 'right') {
          return (
            <div class={prefix + '-ruler-h'}>
              <div class={prefix + '-ruler-indicator'}>
                <span>{distance?.toFixed(0)}</span>
              </div>
            </div>
          );
        }
      };

      const renderDashedLine = (line: ILineSegment) => {
        const rect = calcRectOfAxisLineSegment(line);
        if (!rect) return null;
        const width = rect.width || 2;
        const height = rect.height || 2;
        return (
          <svg
            width={width + 'px'}
            height={height + 'px'}
            viewBox={`0 0 ${width} ${height}`}
            style={{
              top: 0,
              left: 0,
              transform: `perspective(1px) translate3d(${line.start.x}px,${line.start.y}px,0)`,
              position: 'absolute',
              zIndex: 3,
            }}
          >
            <line
              x1={line.start.x - rect.x}
              y1={line.start.y - rect.y}
              x2={line.end.x - rect.x}
              y2={line.end.y - rect.y}
              stroke-dasharray={4}
              stroke="#745BFF"
              stroke-width={2}
            ></line>
          </svg>
        );
      };

      return () => {
        if (cursor.value.status !== CursorStatus.Dragging) {
          return null;
        }

        return (
          <Fragment>
            {transformHelper.measurerSpaceBlocks.map(
              ({ type, crossDragNodesRect, distance, extendsLine }, key) => {
                return (
                  <Fragment>
                    {renderDashedLine(extendsLine)}
                    <div
                      key={key}
                      style={{
                        top: 0,
                        left: 0,
                        height: crossDragNodesRect.height,
                        width: crossDragNodesRect.width,
                        transform: `perspective(1px) translate3d(${crossDragNodesRect.x}px,${crossDragNodesRect.y}px,0)`,
                        position: 'absolute',
                        zIndex: 3,
                      }}
                    >
                      {renderRulerBox(distance, type)}
                    </div>
                  </Fragment>
                );
              },
            )}
            {transformHelper.thresholdSpaceBlocks.map(({ rect }, key) => {
              return (
                <div
                  key={key}
                  class={prefix}
                  style={{
                    top: 0,
                    left: 0,
                    height: rect.height,
                    width: rect.width,
                    transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
                    position: 'absolute',
                    background: 'rgba(255, 0, 0, 0.2)',
                    zIndex: 1,
                  }}
                ></div>
              );
            })}
          </Fragment>
        );
      };
    },
  }),
);
