import { isArr, isValid } from '@formily/shared';
import { Ref, ref, shallowRef, watchEffect } from 'vue';

interface IProps {
  breakpoints?: number[];
  layout?: 'vertical' | 'horizontal' | 'inline' | ('vertical' | 'horizontal' | 'inline')[];
  labelCol?: number | number[] | string | string[];
  wrapperCol?: number | number[] | string | string[];
  labelAlign?: 'right' | 'left' | ('right' | 'left')[];
  wrapperAlign?: 'right' | 'left' | ('right' | 'left')[];
  [props: string]: any;
}

interface ICalcBreakpointIndex {
  (originalBreakpoints: number[], width: number): number;
}

interface ICalculateProps {
  (target: HTMLElement, props: IProps): IProps;
}

interface IUseResponsiveFormLayout {
  (props: IProps): {
    domRef: Ref<HTMLDivElement>;
    props: IProps;
  };
}

const calcBreakpointIndex: ICalcBreakpointIndex = (breakpoints, width) => {
  for (let i = 0; i < breakpoints.length; i++) {
    if (width <= breakpoints[i]) {
      return i;
    }
  }
};

const calcFactor = <T>(value: T | T[], breakpointIndex: number): T => {
  if (Array.isArray(value)) {
    if (breakpointIndex === -1) return value[0];
    return value[breakpointIndex] ?? value[value.length - 1];
  } else {
    return value;
  }
};

const factor = <T>(value: T | T[], breakpointIndex: number): T =>
  isValid(value) ? calcFactor(value as any, breakpointIndex) : value;

const calculateProps: ICalculateProps = (target, props) => {
  const { clientWidth } = target;
  const { breakpoints, layout, labelAlign, wrapperAlign, labelCol, wrapperCol, ...otherProps } =
    props;
  const breakpointIndex = calcBreakpointIndex(breakpoints, clientWidth);

  return {
    layout: factor(layout, breakpointIndex),
    labelAlign: factor(labelAlign, breakpointIndex),
    wrapperAlign: factor(wrapperAlign, breakpointIndex),
    labelCol: factor(labelCol, breakpointIndex),
    wrapperCol: factor(wrapperCol, breakpointIndex),
    ...otherProps,
  };
};

const useResponsiveFormLayout: IUseResponsiveFormLayout = (props) => {
  const domRef = ref<HTMLDivElement>(null);
  const { breakpoints } = props;

  if (!isArr(breakpoints)) {
    return { domRef, props };
  }

  const layoutProps = shallowRef<any>(props);

  const updateUI = () => {
    if (domRef.value) {
      layoutProps.value = calculateProps(domRef.value, props);
    }
  };

  watchEffect((onCleanup) => {
    const observer = () => {
      updateUI();
    };
    const resizeObserver = new ResizeObserver(observer);
    if (domRef.value) {
      resizeObserver.observe(domRef.value);
    }
    updateUI();
    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  return {
    domRef,
    props: layoutProps.value,
  };
};

export default useResponsiveFormLayout;
