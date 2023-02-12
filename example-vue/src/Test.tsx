import { defineComponent } from "vue";
import {
  SchemeForm,
  useCreateForm,
  useFormSchema,
  getJson,
} from "@formlogic/render-vue";

import type { MetaSchema } from "@formlogic/render-vue";

const metaSchema: MetaSchema = {
  code: "Model_C",
  name: "模型新增",
  model: "Model",
  labelCol: 6,
  wrapperCol: 18,
  columnLayout: 3,
  group: [
    { code: "basicInfo", name: "基础信息" },
    { code: "metaInfo", name: "字段信息" },
  ],
  data: [
    {
      code: "code",
      name: "编码",
      type: "column",
      schemaType: "string",
      required: "1",
      group: "basicInfo",
      logics: [],
    },
    {
      code: "name",
      name: "名称",
      type: "column",
      schemaType: "string",
      required: "1",
      group: "basicInfo",
      logics: [],
    },
    {
      code: "type",
      name: "保存",
      type: "button",
      schemaType: "string",
      required: "1",
      logics: [
        { logicCode: "com_save", effectHook: "onClick", hasChildren: false },
      ],
    },
  ],
};

const Test = defineComponent({
  setup() {
    return () => {
      const [form] = useCreateForm({
        formConfig: {

        },
      });

      const { schema } = useFormSchema({
        metaSchema,
      });


      return <SchemeForm form={form.value} schema={schema} />;
    };
  },
});

export default Test;
