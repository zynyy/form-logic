import { existsSync } from 'node:fs';
import { join, isAbsolute } from 'node:path';
import { getConfig } from './getConfig';
import { STYLE_DIR, SRC_DIR } from './getConfig';

type CSS_LANG = 'css' | 'less' | 'scss';

function getCssLang(): CSS_LANG {
  const cubeConfig = getConfig();
  const preprocessor = cubeConfig.build?.css?.preprocessor || 'less';

  if (preprocessor === 'sass') {
    return 'scss';
  }

  return preprocessor;
}

export const CSS_LANG = getCssLang();

export function getCssBaseFile() {
  const cubeConfig = getConfig();
  let path = join(STYLE_DIR, `base.${CSS_LANG}`);

  const baseFile = cubeConfig.build?.css?.base || '';
  if (baseFile) {
    path = isAbsolute(baseFile) ? baseFile : join(SRC_DIR, baseFile);
  }

  if (existsSync(path)) {
    return path;
  }

  return null;
}

const IMPORT_STYLE_RE = /import\s+?(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;

// "import 'a.less';" => "import 'a.css';"
export function replaceCSSImportExt(code: string) {
  return code.replace(IMPORT_STYLE_RE, (str) => str.replace(`.${CSS_LANG}`, '.css'));
}
