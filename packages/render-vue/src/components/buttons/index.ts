import Buttons from './Buttons';

import CloseButton from './CloseButton';
import BackButton from './BackButton';

export default Buttons;

export { CloseButton, BackButton };

export * from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    Buttons: typeof Buttons;
    CloseButton: typeof CloseButton;
    BackButton: typeof BackButton;
  }
}
