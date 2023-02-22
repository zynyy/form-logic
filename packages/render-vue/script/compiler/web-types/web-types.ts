import type { VueTag, Options } from './type.js';

// create web-types.json to provide autocomplete in JetBrains IDEs
export function genWebTypes(tags: VueTag[], options: Options) {
  return {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    framework: 'vue',
    'js-types-syntax': 'typescript',
    name: options.name,
    version: options.version,
    'description-markup': 'markdown',
    contributions: {
      html: {
        // elements: tags,
        'vue-components': tags,
        // tags,
      },
    },
  };
}
