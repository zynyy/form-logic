import { Skeleton } from 'ant-design-vue';
import { defineComponent, toRef } from 'vue';
import { RecursionField, useField,observer } from '@/formily-vue';

import { getDynamicSchemaProps } from './interface';
import { useJsonMetaSchema } from '@/hooks/useJsonMetaSchema';
import { useDynamicSchema } from '@/hooks/useDynamicSchema';

const DynamicSchema = observer(
  defineComponent({
    name: 'DynamicSchema',
    inheritAttrs: false,
    props: getDynamicSchemaProps(),

    setup(props) {
      const pageCodeRef = toRef(props, 'pageCode');

      const field = useField();

      const { metaSchema, loading } = useJsonMetaSchema(pageCodeRef);

      const { schemaRef, doneRef } = useDynamicSchema(metaSchema);

      return () => {
        return (
          <Skeleton loading={loading.value || !doneRef.value}>
            <RecursionField
              basePath={field.value.address}
              schema={schemaRef.value}
              onlyRenderProperties={true}
            />
          </Skeleton>
        );
      };
    },
  }),
);

export default DynamicSchema;
