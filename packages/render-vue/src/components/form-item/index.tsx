import cls from 'classnames';
import { observer } from '@/utils/observer';

import { isArrayField, isDataField } from '@formily/core';

import { Tooltip, Popover } from 'ant-design-vue';
import {
  QuestionCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue';

import useFormItemLayout from '@/components/form-item/hooks/useFormItemLayout';
import useOverflow from '@/components/form-item/hooks/useOverflow';

import BigNumber from 'bignumber.js';
import { replacePx } from '@/utils';
import { computed, defineComponent, ref, watchEffect } from 'vue';
import useDOMHover from '@/hooks/dom/useDOMHover';
import useDOMFocus from '@/hooks/dom/useDOMFocus';
import useDOMRect from '@/hooks/dom/useDOMRect';
import { FormItemProps, formItemProps } from '@/components/form-item/interface';

import { connect, mapProps } from '@/formily-vue/shared/connect';

const ICON_MAP = {
  error: <CloseCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
  pending: <LoadingOutlined />,
};

const BaseItem = observer(
  defineComponent({
    name: 'FormItem',
    inheritAttrs: false,
    props: formItemProps,
    setup(props: FormItemProps, { slots }) {
      const { style, asterisk, tooltip, ...restProps } = props;

      const prefixCls = 'form-logic-form-item';

      const formLayout = useFormItemLayout(restProps);
      const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLSpanElement>();
      const {
        colon,
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

      const visible = ref(false);

      const [isHover, domHoverRef] = useDOMHover();
      const [isFocus, componentDomRef] = useDOMFocus<HTMLDivElement>();

      const [controlContentRect, controlContentDomRef] = useDOMRect<HTMLDivElement>();

      const rowEnd = ref(1);

      const formItemDomRef = ref<HTMLDivElement>();

      watchEffect(() => {
        if (controlContentRect.value) {
          const { height } = controlContentRect.value;

          if (height > 34) {
            const { marginBottom } = getComputedStyle(formItemDomRef.value);

            const marginBottomNum = replacePx(marginBottom);

            const { lineHeight } = getComputedStyle(componentDomRef.value);

            const row = new BigNumber(height)
              .div(new BigNumber(marginBottomNum).plus(replacePx(lineHeight)).toNumber())
              .toNumber();

            const datumScale = new BigNumber(marginBottomNum)
              .div(34)
              .plus(Math.round(row))
              .toNumber();

            if (datumScale > row) {
              rowEnd.value = Math.ceil(row);
            } else {
              rowEnd.value = Math.floor(row);
            }
          }
        }
      });

      const errorsMsg = computed(() => {
        return props.feedbackText?.length
          ? props.feedbackText
              .reduce((acc, item) => {
                const { messages } = item;
                return `${acc} ${acc ? ';' : ''} ${messages?.join(';')}`;
              }, '')
              .trim()
          : '';
      });

      watchEffect(() => {
        if (isFocus.value || isHover.value) {
          visible.value = !!errorsMsg.value;
        } else {
          visible.value = false;
        }
      });

      return () => {
        const { hiddenLabel, feedbackStatus, feedbackText, gridSpan, label } = props;

        const getOverflowTooltip = () => {
          if (overflow.value) {
            return <div>{label}</div>;
          }
          return tooltip;
        };

        const renderLabel = () => {
          if (!label || hiddenLabel) return null;
          return (
            <div
              class={cls({
                [`${prefixCls}-label`]: true,
                [`${prefixCls}-label-tooltip`]: !!tooltip ?? overflow,
                [`${prefixCls}-item-col-${labelCol}`]: !!labelCol,
              })}
              style={labelStyle}
            >
              {renderLabelText()}
              {renderTooltipIcon()}
              {label !== ' ' && <span class={`${prefixCls}-colon`}>{colon ? ':' : ''}</span>}
            </div>
          );
        };

        const renderTooltipIcon = () => {
          if (tooltip) {
            return (
              <span class={`${prefixCls}-label-tooltip-icon`}>
                <Tooltip align={{ offset: [0, 2] }} title={tooltip}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            );
          }
        };

        const renderLabelText = () => {
          const labelChildren = (
            <div class={`${prefixCls}-label-content`} ref={containerRef}>
              <span ref={contentRef}>
                {asterisk && <span class={`${prefixCls}-asterisk`}>{'*'}</span>}
                <label>{label}</label>
              </span>
            </div>
          );

          if (overflow.value) {
            return (
              <Tooltip placement="top" align={{ offset: [0, 10] }} title={getOverflowTooltip()}>
                {labelChildren}
              </Tooltip>
            );
          }
          return labelChildren;
        };

        return (
          <div
            style={{
              ...props.style,
              gridRowEnd: `span ${rowEnd.value}`,
              gridColumn: `span ${gridSpan} / auto`,
            }}
            class={cls({
              [`${prefixCls}`]: true,
              [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
              [`${prefixCls}-feedback-has-text`]: !!feedbackText?.length,
              [`${prefixCls}-size-${size}`]: !!size,
              [`${prefixCls}-fullness`]: true,
              [`${prefixCls}-label-align-${labelAlign}`]: true,
              [`${prefixCls}-control-align-${wrapperAlign}`]: true,
              [`${prefixCls}-label-wrap`]: !!labelWrap,
              [`${prefixCls}-control-wrap`]: !!wrapperWrap,
              [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
            })}
            ref={formItemDomRef}
          >
            {renderLabel()}
            <div
              class={cls({
                [`${prefixCls}-control`]: true,
                [`${prefixCls}-item-col-${hiddenLabel ? 24 : wrapperCol}`]: !!wrapperCol && label,
              })}
            >
              <div class={cls(`${prefixCls}-control-content`)} ref={controlContentDomRef}>
                <div
                  style={wrapperStyle}
                  class={cls({
                    [`${prefixCls}-control-content-component`]: true,
                  })}
                  ref={componentDomRef}
                >
                  <Popover
                    autoAdjustOverflow
                    placement="top"
                    content={
                      <div
                        class={cls({
                          [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
                          [`${prefixCls}-help`]: true,
                        })}
                      >
                        {ICON_MAP[feedbackStatus]} {errorsMsg.value}
                      </div>
                    }
                    visible={visible.value}
                  >
                    <span ref={domHoverRef}>{slots.default()}</span>
                  </Popover>
                </div>
              </div>
              {slots.extra && <div class={cls(`${prefixCls}-extra`)}>{slots.extra()}</div>}
            </div>
          </div>
        );
      };
    },
  }),
);

// 适配
const FormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    if (!field) return props;

    if (!isDataField(field)) {
      return {
        label: props.label || field.title,
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
