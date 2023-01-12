import { FormLayoutValueContext, useFormLayoutContext } from '@/components/form-layout/hooks';

const useFormItemLayout = (props: FormLayoutValueContext) => {
  const layout = useFormLayoutContext();

  return {
    colon: props.colon ?? layout.colon ?? true,
    labelAlign: props.labelAlign ?? layout.labelAlign ?? 'right',
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign ?? 'left',
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    size: props.size ?? layout.size,
    tooltipIcon: props.tooltipIcon ?? layout.tooltipIcon,
    labelStyle: props.labelStyle ?? layout.labelStyle ?? {},
    wrapperStyle: props.wrapperStyle ?? layout.wrapperStyle ?? {},
  };
};

export default useFormItemLayout;
