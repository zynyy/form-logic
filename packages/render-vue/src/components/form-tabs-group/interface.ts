import FormTabsGroup from "@/components/form-tabs-group/FormTabsGroup";
import {ExtractPropTypes, PropType} from "vue";


export const getFormTabsGroupProps = () => {
  return {
    onChange: {
      type: Function as PropType<(active: string) => void>
    },
    activeKey: String
  }
}

export type FormTabsGroupProps = ExtractPropTypes<ReturnType<typeof getFormTabsGroupProps>>
