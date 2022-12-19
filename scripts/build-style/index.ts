import { CopyBaseOptions, runCopy } from './copy';
import { buildAllStyles } from './buildAllStyles';

export const buildStyle = ({
  allStylesOutputFile,
  ...opts
}: CopyBaseOptions & { allStylesOutputFile: string }) => {
  return Promise.all(
    [allStylesOutputFile ? buildAllStyles(allStylesOutputFile) : false, runCopy(opts)].filter(
      Boolean,
    ),
  );
};
