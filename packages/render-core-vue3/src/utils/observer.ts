import { IObserverOptions, useObserver } from '@/hooks';
import { DefineComponent } from '@/interface';

/* istanbul ignore next */
export const observer = function <Props>(
  opts: any,
  options?: IObserverOptions,
): DefineComponent<Props> {
  const name = options?.name || opts.name || 'ObservableComponent';

  return {
    name,
    ...opts,
    setup(props: Record<string, any>, context: any) {
      useObserver(options);
      return opts?.setup?.(props, context);
    },
  };
};
