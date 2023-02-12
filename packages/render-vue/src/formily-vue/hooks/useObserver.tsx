import { Tracker } from '@formily/reactive';
import { getCurrentInstance, onBeforeUnmount } from 'vue';

export interface IObserverOptions {
  name?: string;
  scheduler?: (updater: () => void) => void;
}

/* istanbul ignore next */
export const useObserver = (options?: IObserverOptions) => {

  let tracker: Tracker = null;
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

  Object.defineProperty(vm, 'effect', {
    get() {
      // https://github.com/alibaba/formily/issues/2655

      return vm['_updateEffect'] || {};
    },
    set(newValue) {
      vm['_updateEffectRun'] = newValue.run;

      disposeTracker();
      const newTracker = () => {
        tracker = new Tracker(() => {
          if (options?.scheduler && typeof options.scheduler === 'function') {
            options.scheduler(vmUpdate);
          } else {
            vmUpdate();
          }
        });
      };

      const update = function () {
        let refn = null;
        tracker?.track(() => {
          refn = vm['_updateEffectRun'].call(newValue);
        });

        return refn;
      };
      newTracker();
      newValue.run = update;
      vm['_updateEffect'] = newValue;
    },
  });
};
