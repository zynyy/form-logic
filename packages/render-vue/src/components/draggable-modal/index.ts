import _DraggableModal from './DraggableModal';
import { withInstall } from '@/utils';

export { default as infoModal } from './infoModal';
export { default as confirmModal } from './confirmModal';
export { default as ModalRender } from './ModalRender';

export * from './interface';

const DraggableModal = withInstall(_DraggableModal);

export default DraggableModal;
