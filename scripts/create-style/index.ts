import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
import process from 'process';
const { exec } = require('child_process');

const styleSuffix = ['css', 'less'];

export const createStyle = () => {
  const cwd = process.cwd();

  const paths = [];

  const lastIndex = styleSuffix.length - 1;

  styleSuffix.forEach((key, index) => {
    glob(`./**/*(style|index).${key}`, { cwd: path.resolve(cwd, './src') }, (err, files) => {
      if (err) return console.error(err);
      paths.push(...files);

      if (lastIndex === index) {
        const filename = path.resolve(cwd, './src/style.ts');

        fs.mkdir(path.dirname(filename), { recursive: true }, (err) => {
          if (err) throw err;
          fs.writeFile(
            filename,
            `// auto generated code
      ${paths
        .map((path) => {
          return `import '${path}'\n`;
        })
        .join('')}`,
            (err) => {
              if (err) throw err;
              exec(`npx prettier ${filename} --write`);
            },
          );
        });

        exec(`npx prettier ${filename} --write`);
      }
    });
  });
};
