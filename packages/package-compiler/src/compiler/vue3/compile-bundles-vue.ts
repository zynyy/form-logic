import { build } from 'vite';
import { getPackageJson, getConfig } from '@/utils';
import { mergeCustomViteConfig } from '@/utils';
import { getViteConfigForPackage } from './vite.config.vue3';
import type { LibraryFormats } from 'vite';

export type BundleOption = {
  minify?: boolean;
  formats: LibraryFormats[];
  external?: string[];
};

export async function compileBundlesVue() {
  const { dependencies, peerDependencies } = getPackageJson() || {};
  const external = Object.keys(dependencies || {}).concat(Object.keys(peerDependencies || {}));

  const DEFAULT_OPTIONS: BundleOption[] = [
    {
      minify: false,
      formats: ['umd'],
    },
    {
      minify: true,
      formats: ['umd'],
    },
    {
      minify: false,
      formats: ['es', 'cjs'],
      external,
    },
    {
      minify: true,
      formats: ['es', 'cjs'],
      external,
    },
  ];

  const bundleOptions: BundleOption[] = getConfig().build?.bundleOptions || DEFAULT_OPTIONS;

  await Promise.all(
    bundleOptions.map(async (config) =>
      build(await mergeCustomViteConfig(getViteConfigForPackage(config), 'production')),
    ),
  );
}
