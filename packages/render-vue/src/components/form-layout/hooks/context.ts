import { CSSProperties, ExtractPropTypes, inject, InjectionKey, PropType, provide } from 'vue';

type horizontal = 'right' | 'left';
type Size = 'small' | 'default' | 'large';

export const formLayoutValueContext = {
  colon: {
    type: Boolean,
    default: undefined,
  },
  labelAlign: {
    type: String as PropType<horizontal>,
  },
  wrapperAlign: {
    type: String as PropType<horizontal>,
  },
  labelCol: {
    type: [Number, String],
  },
  wrapperCol: {
    type: [Number, String],
  },
  size: {
    type: String as PropType<Size>,
  },

  bordered: {
    type: Boolean,
  },
  breakpoints: {
    type: Array as PropType<number[]>,
  },
  spaceGap: {
    type: Number,
  },
  gridColumnGap: {
    type: Number,
  },
  gridRowGap: {
    type: Number,
  },
  labelStyle: {
    type: Object as PropType<CSSProperties>,
  },
  labelWrap: {
    type: Boolean,
    default: undefined,
  },
  labelWidth: {
    type: Number,
    String,
  },
  wrapperStyle: {
    type: Object as PropType<CSSProperties>,
  },
  wrapperWrap: {
    type: Boolean,
    default: undefined,
  },
  wrapperWidth: {
    type: Number,
    String,
  },
};

export type FormLayoutValueContext = ExtractPropTypes<typeof formLayoutValueContext>;

export const FormLayoutContextSymbol: InjectionKey<FormLayoutValueContext> =
  Symbol('FormLayoutValueContent');

export const useFormLayoutContext = () => {
  return inject(FormLayoutContextSymbol, {} as FormLayoutValueContext);
};

export const formLayoutProvide = (formLayoutValueContent: FormLayoutValueContext) => {
  provide(FormLayoutContextSymbol, formLayoutValueContent);
};
