import CustomButton from './CustomButton';

export default CustomButton;

export { getCustomButtonProps } from './interface';
export type { CustomButtonProps } from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    CustomButton: typeof CustomButton;
  }
}
