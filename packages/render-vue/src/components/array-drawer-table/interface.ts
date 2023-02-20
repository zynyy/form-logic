import {ExtractPropTypes, PropType} from "vue";
import {IFormProps} from "@formily/core";
import omit from "lodash.omit";
import {getArrayBaseProps} from "@/components/array-base";


export const getArrayDrawerTableProps = () => {

  return {

    ...omit(getArrayBaseProps(), ["onAdd", "onDetail","onEdit"]),
    drawerExtraLogicParams: {
      type: Object as PropType<Record<string, any>>
    },
    drawerPageCode: String,
    drawerFormConfig: {
      type: Object as PropType<IFormProps>,
      default: {}
    }
  }
}

export type ArrayDrawerTableProps  = ExtractPropTypes<ReturnType<typeof getArrayDrawerTableProps>>
