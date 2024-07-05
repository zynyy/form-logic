import fse from 'fs-extra';
import { ES_DIR, LIB_DIR, ROOT_DIST_DIR, consola } from '@/utils';

const { remove } = fse;

export async function clean() {
  consola.start('开始清理 esm、lib、dist目录');
  await Promise.all([remove(ES_DIR), remove(LIB_DIR), remove(ROOT_DIST_DIR)]);
  consola.success(`清理 esm、lib、dist目录成功`);
}
