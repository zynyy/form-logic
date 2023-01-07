import React from 'react';
import { Tooltip } from 'antd';

import { makeRecursiveMapper } from '../../utils';
import { TablePipeline } from '../pipeline';
import { InfoIcon } from '@/components/ali-react-table/component/icon';
import InlineFlexCell from '@/components/ali-react-table/component/inline-flex-cell';
import { safeRenderHeader } from '@/components/ali-react-table/utils/safe';

export function tips() {
  return function tipsSteap(pipeline: TablePipeline) {
    return pipeline.mapColumns(
      makeRecursiveMapper((col) => {
        if (!col.features?.tips) {
          return col;
        }

        const justifyContent =
          col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start';

        return {
          ...col,
          title: (
            <InlineFlexCell classNames="header-cell-with-tips" style={{ justifyContent }}>
              {safeRenderHeader(col)}
              <Tooltip title={col.features.tips}>
                <div className="tip-icon-wrapper">
                  <InfoIcon className="tip-icon" />
                </div>
              </Tooltip>
            </InlineFlexCell>
          ),
        };
      }),
    );
  };
}
