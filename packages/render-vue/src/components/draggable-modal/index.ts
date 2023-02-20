import DraggableModal from './DraggableModal';

import infoModal from './infoModal';
import confirmModal from './confirmModal';
import ModalRender from './ModalRender';

export * from './interface';

export { infoModal, ModalRender, confirmModal };

export default DraggableModal;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    DraggableModal: typeof DraggableModal;
    infoModal: typeof infoModal;
    ModalRender: typeof ModalRender;
    confirmModal: typeof confirmModal;
  }
}
