import { Tracker } from '@formily/reactive';
import { getCurrentInstance, onBeforeUnmount } from 'vue';

export interface IObserverOptions {
  name?: string;
  scheduler?: (updater: () => void) => void;
}

export const useObserver = (options?: IObserverOptions) => {
  let tracker: Tracker | null = null;
  const disposeTracker = () => {
    if (tracker) {
      tracker.dispose();
      tracker = null;
    }
  };

  const vm = getCurrentInstance();

  const vmUpdate = () => {
    vm?.proxy?.$forceUpdate();
  };

  onBeforeUnmount(disposeTracker);

  const newTracker = () => {
    tracker = new Tracker(() => {
      if (options?.scheduler && typeof options.scheduler === 'function') {
        options.scheduler(vmUpdate);
      } else {
        vmUpdate();
      }
    });
  };

  Object.defineProperty(vm, 'effect', {
    get() {
      // https://github.com/alibaba/formily/issues/2655
      // @ts-ignore
      return vm['_updateEffect'] || {};
    },
    set(newValue) {
      // @ts-ignore
      vm['_updateEffectRun'] = newValue.run;

      disposeTracker();

      const update = function () {
        let refn = null;
        tracker?.track(() => {
          // @ts-ignore
          refn = vm['_updateEffectRun'].call(newValue);
        });

        return refn;
      };

      newTracker();
      newValue.run = update;
      // @ts-ignore
      vm['_updateEffect'] = newValue;
    },
  });
};
