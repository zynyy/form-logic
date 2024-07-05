import { sep } from 'node:path';

export const SFC_REGEXP = /\.(vue)$/;
export const DEMO_REGEXP = new RegExp('\\' + sep + 'demo$');
export const TEST_REGEXP = new RegExp('\\' + sep + 'test$');
export const TEST_DIR_REGEXP = new RegExp('\\' + sep + '__test__$');
export const ASSET_REGEXP = /\.(png|jpe?g|gif|webp|ico|jfif|svg|woff2?|ttf)$/i;
export const STYLE_REGEXP = /\.(css|less|scss)$/;
export const STORIES_SCRIPT_REGEXP = /\.stories\.(js|ts|jsx|tsx)$/;
export const SCRIPT_REGEXP = /\.(js|ts|jsx|tsx)$/;
export const JSX_REGEXP = /\.([jt])sx$/;
