import typescript from "rollup-plugin-typescript2";
import { build, getRollupBasePlugin } from "./build";


export const buildAllStyles = async (outputFile: string) => {

  await build({
    input: "src/style.ts",
    output: {
      file: outputFile,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        tsconfigOverride: {
          compilerOptions: {
            module: "ESNext",
            declaration: false,
          },
        },
      }),
      ...getRollupBasePlugin(),
    ],
  });
};
