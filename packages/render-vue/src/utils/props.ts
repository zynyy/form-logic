import { PropType } from 'vue';

export const makeRequiredProp = <T>(type: T) => ({
  type,
  required: true as const,
});
