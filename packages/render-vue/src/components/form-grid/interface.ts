import type { ExtractPropTypes, } from 'vue';



export const formGridProps = {

  strictAutoFit: {
    type: Boolean
  },
  maxColumns: {
    type: Number
  },
  minColumns: {
    type: Number
  }
};

export type FormGridProps = ExtractPropTypes<typeof formGridProps>;
