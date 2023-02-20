import type { VueTag, Options } from './type.js';

// create web-types.json to provide autocomplete in JetBrains IDEs
export function genWebTypes(tags: VueTag[], options: Options) {
  return {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    framework: 'vue',
    'js-types-syntax': 'typescript',
    name: options.name,
    version: options.version,
    contributions: {
      html: {
        'description-markup': 'markdown',
        'types-syntax': 'typescript',
        // elements: tags,
        'vue-components': tags,
        // tags,
      },
    },
  };
}
