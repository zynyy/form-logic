import _CustomButton from './CustomButton';
import { withInstall } from '@/utils';

const CustomButton = withInstall(_CustomButton);

export default CustomButton;

export { getCustomButtonProps } from './interface';
export type { CustomButtonProps } from './interface';
