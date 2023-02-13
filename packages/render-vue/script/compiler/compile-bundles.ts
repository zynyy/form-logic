import { build } from 'vite';
import { getPackageJson } from '../common/constant';
import { getViteConfigForPackage } from '../config/vite.package';
import type { LibraryFormats } from 'vite';

export type BundleOption = {
  minify?: boolean;
  formats: LibraryFormats[];
  external?: string[];
};



export async function compileBundles() {
  const dependencies = getPackageJson().dependencies || {};
  const external = Object.keys(dependencies);

  const DEFAULT_OPTIONS: BundleOption[] = [
    // {
    //   minify: false,
    //   formats: ['umd'],
    // },
    // {
    //   minify: true,
    //   formats: ['umd'],
    // },
    {
      minify: false,
      formats: ['es', 'cjs'],
      external,
    },
  ];

  const bundleOptions: BundleOption[] = DEFAULT_OPTIONS;

  await Promise.all(
    bundleOptions.map(async (config) =>
      build(
        getViteConfigForPackage(config),

      )
    )
  );
}
