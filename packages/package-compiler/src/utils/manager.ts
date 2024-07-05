import { execa } from 'execa';
import { consola } from './logger.js';
import { execSync } from 'child_process';
import { getConfig } from './getConfig';

let hasYarnCache: boolean;

export function hasYarn() {
  if (hasYarnCache === undefined) {
    try {
      execSync('yarn --version', { stdio: 'ignore' });
      hasYarnCache = true;
    } catch (e) {
      hasYarnCache = false;
    }
  }

  return hasYarnCache;
}

function getPackageManager() {
  const { build } = getConfig();

  if (build?.packageManager) {
    return build?.packageManager;
  }

  return hasYarn() ? 'yarn' : 'npm';
}

export async function installDependencies() {
  consola.info('Install Dependencies\n');

  try {
    const manager = getPackageManager();

    await execa(manager, ['install', '--prod=false'], {
      stdio: 'inherit',
    });
  } catch (err) {
    consola.error(err);
    throw err;
  }
}
