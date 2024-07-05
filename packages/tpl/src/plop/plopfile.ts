import { componentVue3Tsx, lernaPackageVue3 } from './generator';
import { NodePlopAPI } from 'node-plop';
import { copyFile, prettierGit } from './action-type';

export default (plop: NodePlopAPI) => {
  plop.setGenerator('component-vue3-tsx', componentVue3Tsx);
  plop.setGenerator('lerna-package-vue3', lernaPackageVue3);

  plop.setActionType('copy-file', copyFile);
  plop.setActionType('prettier-git', prettierGit);
};
