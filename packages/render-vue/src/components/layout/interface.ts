import {CSSProperties, ExtractPropTypes, PropType} from "vue";


export const getLayoutProps = () => {

  return {
    height: [Number, String],
    style: {
      type: Object as PropType<CSSProperties>
    },
    loading: {
      type: Boolean
    },
    class: String
  }


}

export type LayoutProps = ExtractPropTypes<ReturnType<typeof getLayoutProps>>
