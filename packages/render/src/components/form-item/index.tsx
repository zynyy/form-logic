import {
  CSSProperties,
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cls from 'classnames';
import { observer } from '@formily/react';

import { isArrayField, isVoidField } from '@formily/core';
import { connect, mapProps } from '@formily/react';
import { Tooltip, Popover } from 'antd';
import {
  QuestionCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import useFormItemLayout from '@/components/form-item/hooks/useFormItemLayout';
import useOverflow from '@/components/form-item/hooks/useOverflow';
import { FormLayoutValueContext } from '@/components/form-layout/hooks';

import { useFormItemStyle } from '@/components/form-item/hooks';
import { useDOMHover, useDOMFocus, useDOMResizeChange, useDOMRect } from '@formlogic/component';
import BigNumber from 'bignumber.js';
import { replacePx } from '@/utils';

export interface FormItemProps extends FormLayoutValueContext, PropsWithChildren {
  className?: string;
  style?: CSSProperties;
  prefixCls?: string;
  label?: ReactNode;
  colon?: boolean;
  tooltip?: ReactNode;
  extra?: ReactNode;
  feedbackText?: any[];
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & {});
  asterisk?: boolean;
  gridSpan?: number;
  hiddenLabel?: boolean;
}

const ICON_MAP = {
  error: <CloseCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
};

const BaseItem: FC<FormItemProps> = observer(
  ({
    children,
    hiddenLabel,
    label,
    style,
    asterisk,
    feedbackStatus,
    extra,
    feedbackText,
    tooltip,
    gridSpan,
    className,
    ...props
  }) => {
    const formLayout = useFormItemLayout(props);
    const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLSpanElement>();
    const {
      colon,
      labelWidth,
      wrapperWidth,
      labelCol,
      wrapperCol,
      labelAlign,
      wrapperAlign,
      size,
      labelWrap,
      wrapperWrap,
      labelStyle,
      wrapperStyle,
    } = formLayout;

    const [visible, setVisible] = useState(false);

    const [isHover, domHoverRef] = useDOMHover();
    const [isFocus, componentDomRef] = useDOMFocus<HTMLDivElement>();

    const [controlContentRect, controlContentDomRef] = useDOMRect<HTMLDivElement>();

    const [rowEnd, setRowEnd] = useState(1);

    const [warpSSR, hashId, prefixCls] = useFormItemStyle();

    const formItemDomRef = useRef<HTMLDivElement>();

    useEffect(() => {
      if (controlContentRect) {
        const { height } = controlContentRect;

        if (height > 34) {
          const { marginBottom } = getComputedStyle(formItemDomRef.current);

          const marginBottomNum = replacePx(marginBottom);

          const { lineHeight } = getComputedStyle(componentDomRef.current);

          const row = new BigNumber(height)
            .div(new BigNumber(marginBottomNum).plus(replacePx(lineHeight)).toNumber())
            .toNumber();

          const datumScale = new BigNumber(marginBottomNum)
            .div(34)
            .plus(Math.round(row))
            .toNumber();

          if (datumScale > row) {
            setRowEnd(Math.ceil(row));
          } else {
            setRowEnd(Math.floor(row));
          }
        }
      }
    }, [controlContentRect]);

    const errorsMsg = useMemo(() => {
      if (feedbackText?.length) {
        return feedbackText
          .reduce((acc, item) => {
            const { messages } = item;
            return `${acc} ${acc ? ';' : ''} ${messages?.join(';')}`;
          }, '')
          .trim();
      }
      return '';
    }, [feedbackText]);

    // 固定宽度
    let enableCol = false;
    if (labelWidth || wrapperWidth) {
      if (labelWidth) {
        labelStyle.width = labelWidth === 'auto' ? undefined : labelWidth;
        labelStyle.maxWidth = labelWidth === 'auto' ? undefined : labelWidth;
      }
      if (wrapperWidth) {
        wrapperStyle.width = wrapperWidth === 'auto' ? undefined : wrapperWidth;
        wrapperStyle.maxWidth = wrapperWidth === 'auto' ? undefined : wrapperWidth;
      }
      // 栅格模式
    }

    if (labelCol || wrapperCol) {
      if (!labelStyle.width && !wrapperStyle.width) {
        enableCol = true;
      }
    }

    const getOverflowTooltip = () => {
      if (overflow) {
        return <div>{label}</div>;
      }
      return tooltip;
    };

    const renderLabelText = () => {
      const labelChildren = (
        <div className={`${prefixCls}-label-content`} ref={containerRef}>
          <span ref={contentRef}>
            {asterisk && <span className={`${prefixCls}-asterisk`}>{'*'}</span>}
            <label>{label}</label>
          </span>
        </div>
      );

      if (overflow) {
        return (
          <Tooltip placement="top" align={{ offset: [0, 10] }} title={getOverflowTooltip()}>
            {labelChildren}
          </Tooltip>
        );
      }
      return labelChildren;
    };

    const renderTooltipIcon = () => {
      if (tooltip) {
        return (
          <span className={`${prefixCls}-label-tooltip-icon`}>
            <Tooltip align={{ offset: [0, 2] }} title={tooltip}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        );
      }
    };

    const renderLabel = () => {
      if (!label || hiddenLabel) return null;
      return (
        <div
          className={cls({
            [`${prefixCls}-label`]: true,
            [`${prefixCls}-label-tooltip`]: !!tooltip ?? overflow,
            [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
          })}
          style={labelStyle}
        >
          {renderLabelText()}
          {renderTooltipIcon()}
          {label !== ' ' && <span className={`${prefixCls}-colon`}>{colon ? ':' : ''}</span>}
        </div>
      );
    };

    useEffect(() => {
      if (isFocus || isHover) {
        setVisible(!!errorsMsg);
      } else {
        setVisible(false);
      }
    }, [errorsMsg, isFocus, isHover]);

    return warpSSR(
      <div
        style={{
          ...style,
          gridRowEnd: `span ${rowEnd}`,
        }}
        data-grid-span={gridSpan}
        className={cls(hashId, {
          [`${prefixCls}`]: true,
          [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
          [`${prefixCls}-feedback-has-text`]: !!feedbackText?.length,
          [`${prefixCls}-size-${size}`]: !!size,
          [`${prefixCls}-fullness`]: true,
          [`${prefixCls}-label-align-${labelAlign}`]: true,
          [`${prefixCls}-control-align-${wrapperAlign}`]: true,
          [`${prefixCls}-label-wrap`]: !!labelWrap,
          [`${prefixCls}-control-wrap`]: !!wrapperWrap,
          [`form-item-${feedbackStatus}`]: !!feedbackStatus,
          [className]: !!className,
        })}
        ref={formItemDomRef}
      >
        {renderLabel()}
        <div
          className={cls({
            [`${prefixCls}-control`]: true,
            [`${prefixCls}-item-col-${hiddenLabel ? 24 :wrapperCol}`]: enableCol && !!wrapperCol && label,
          })}
        >
          <div className={cls(`${prefixCls}-control-content`)} ref={controlContentDomRef}>
            <div
              style={wrapperStyle}
              className={cls({
                [`${prefixCls}-control-content-component`]: true,
              })}
              ref={componentDomRef}
            >
              <Popover
                autoAdjustOverflow
                placement="top"
                content={
                  <div
                    className={cls(hashId, {
                      [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
                      [`${prefixCls}-help`]: true,
                    })}
                  >
                    {ICON_MAP[feedbackStatus]} {errorsMsg}
                  </div>
                }
                open={visible}
              >
                <span ref={domHoverRef}>{children}</span>
              </Popover>
            </div>
          </div>
          {extra && <div className={cls(`${prefixCls}-extra`)}>{extra}</div>}
        </div>
      </div>,
    );
  },
);

// 适配
const FormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    if (!field) return props;

    if (isVoidField(field)) {
      return {
        label: field.title || props.label,
        asterisk: props.asterisk,
      };
    }

    const takeFeedbackStatus = () => {
      return field.validating ? 'pending' : field.validateStatus;
    };

    const takeMessage = () => {
      const split = (messages: any[]) => {
        return messages
          .filter((item) => {
            const { path } = item || {};

            if (isArrayField(field)) {
              return path === field.props.name;
            }
            return true;
          })
          .reduce((buf, text, index) => {
            if (!text) return buf;
            return index < messages.length - 1 ? buf.concat([text, ', ']) : buf.concat([text]);
          }, []);
      };

      if (field.validating) {
        return [];
      }

      if (field.errors.length) {
        return split(field.errors);
      }
    };

    const takeAsterisk = () => {
      if (field.required) {
        return true;
      }
      if ('asterisk' in props) {
        return props.asterisk;
      }
      return false;
    };

    return {
      label: props.label || field.title,
      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeMessage(),
      asterisk: takeAsterisk(),
    };
  }),
);

export default FormItem;
