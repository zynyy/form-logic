import { ExtractPropTypes } from "vue";


export const getPageLoadingProps = () => {
  return {
    loading: {
      type: Boolean,
      default: false as const
    }
  }
}

export type PageLoadingProps = ExtractPropTypes<ReturnType<typeof getPageLoadingProps>>
