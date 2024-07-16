import './styles.less';

import { defineComponent, onBeforeUnmount, ref } from 'vue';

import { useDesigner, usePrefix, useViewport } from '@/hooks';
import { composeExport } from '@/utils';
import { SnapLine } from '@/widgets/AuxToolWidget/SnapLine';
import { SpaceBlock } from '@/widgets/AuxToolWidget/SpaceBlock';

import { Cover } from './Cover';
import { DashedBox } from './DashedBox';
import { FreeSelection } from './FreeSelection';
import { Insertion } from './Insertion';
import { Selection } from './Selection';

const AuxToolWidgetComponent = defineComponent({
  name: 'DnAuxToolWidget',
  props: [],
  setup(props) {
    const engineRef = useDesigner();
    const viewportRef = useViewport();

    const prefixRef = usePrefix('auxtool');
    const domRef = ref();

    onBeforeUnmount(() => {
      engineRef.value.subscribeWith('viewport:scroll', () => {
        if (viewportRef.value.isIframe && domRef.value) {
          domRef.value.style.transform = `perspective(1px) translate3d(${-viewportRef.value
            .scrollX}px,${-viewportRef.value.scrollY}px,0)`;
        }
      });
    });

    return () => {
      if (!viewportRef.value) return null;

      return (
        <div ref={domRef} class={prefixRef.value}>
          <Insertion />
          <SpaceBlock />
          <SnapLine />
          <DashedBox />
          <Selection />
          <Cover />
          <FreeSelection />
        </div>
      );
    };
  },
});

export const AuxToolWidget = composeExport(AuxToolWidgetComponent, {
  displayName: 'AuxToolWidget',
});
