import { observer } from '@formlogic/code-render';
import { CSSProperties } from '@vue/runtime-dom';
import { defineComponent } from 'vue';

import { usePrefix, useScreen, useTheme } from '@/hooks';

const MockupImages: Record<string, string[]> = {
  dark: [
    '//img.alicdn.com/imgextra/i3/O1CN01zXMc8W26oJZGUaCK1_!!6000000007708-55-tps-946-459.svg',
    '//img.alicdn.com/imgextra/i3/O1CN012KWk2i1DLduN7InSK_!!6000000000200-55-tps-459-945.svg',
  ],
  light: [
    '//img.alicdn.com/imgextra/i4/O1CN01vuXGe31tEy00v2xBx_!!6000000005871-55-tps-946-459.svg',
    '//img.alicdn.com/imgextra/i4/O1CN01ehfzMc1QPqY6HONTJ_!!6000000001969-55-tps-459-945.svg',
  ],
};
const MobileBodyComponent = defineComponent({
  name: 'DnMobileSimulatorBody',
  setup(props, { slots }) {
    const screenRef = useScreen();
    const themeRef = useTheme();
    const prefixRef = usePrefix('mobile-simulator-body');
    const getContentStyles = (): CSSProperties => {
      if (screenRef.value.flip) {
        return {
          position: 'absolute',
          width: '736px',
          height: '414px',
          top: '43.3333px',
          left: '106.667px',
          overflow: 'hidden',
        };
      }
      return {
        position: 'absolute',
        width: '414px',
        height: '736px',
        top: '126.667px',
        left: '23.3333px',
        overflow: 'hidden',
      };
    };

    return () => {
      return (
        <div
          class={prefixRef.value}
          style={{
            alignItems: screenRef.value.flip ? 'center' : '',
            minWidth: screenRef.value.flip ? 1000 : 0,
          }}
        >
          <div
            class={prefixRef.value + '-wrapper'}
            style={{
              position: 'relative',
              minHeight: screenRef.value.flip ? 0 : 1000,
            }}
          >
            <img
              src={
                screenRef.value.flip
                  ? MockupImages[themeRef.value][0]
                  : MockupImages[themeRef.value][1]
              }
              style={{
                display: 'block',
                margin: '20px 0',
                width: screenRef.value.flip ? '946.667px' : '460px',
                height: screenRef.value.flip ? '460px' : '946.667px',
                boxShadow: '0 0 20px #0000004d',
                borderRadius: '60px',
                backfaceVisibility: 'hidden',
              }}
            />
            <div class={prefixRef.value + '-content'} style={getContentStyles()}>
              {slots.default?.()}
            </div>
          </div>
        </div>
      );
    };
  },
});
export const MobileBody = observer(MobileBodyComponent);
