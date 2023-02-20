import { Card, Space } from 'ant-design-vue';

import { defineComponent } from 'vue';

import { useFieldSchema } from '@/formily-vue/components/schema-field/hooks';
import { RecursionField, useField,observer } from '@/formily-vue';
import { FormGroupProps, getFormGroupProps } from './interface';
import { useGroupSchemaBtn } from '@/hooks';

import {useStylePrefixCls} from "@/components/style/hooks";

const FormGroup = observer(
  defineComponent({
    name: 'FormGroup',
    inheritAttrs: false,
    props: getFormGroupProps(),
    setup(props: FormGroupProps) {
      const { hiddenName, title, code } = props;

      const schema = useFieldSchema();
      const field = useField();

      const btn = useGroupSchemaBtn(code);

      const prefixCls = useStylePrefixCls("form-group")

      const filterProperties = (propertiesSchema, name) => {
        return name !== 'groupButtons';
      };

      return () => {
        return (
          <div id={code} class={prefixCls}>
            <Card
              size="small"
              title={hiddenName ? null : title}
              extra={btn ? <Space>{btn}</Space> : null}
            >
              <RecursionField
                basePath={field.value.address}
                schema={schema.value}
                onlyRenderProperties
                filterProperties={filterProperties}
              />
            </Card>
          </div>
        );
      };
    },
  }),
);

export default FormGroup;
