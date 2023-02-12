import { observer } from '@/utils/observer';
import { defineComponent } from 'vue';
import { RecursionField } from '@/formily-vue';
import { getSchemaFragmentProps, SchemaFragmentProps } from './interface';

const Fragment = defineComponent({
  render() {
    return null;
  },
});

const SchemaFragment = observer<SchemaFragmentProps>(
  defineComponent({
    name: 'SchemaFragment',
    props: getSchemaFragmentProps(),
    inheritAttrs: false,
    setup(props: SchemaFragmentProps) {
      return () => {
        const { schemaSource } = props;

        return schemaSource.map((item) => {
          const { name, schema } = item;

          const nowSchema = {
            ...schema,
            'x-component': Fragment,
          };
          return <RecursionField key={name} name={name} schema={nowSchema} onlyRenderSelf />;
        });
      };
    },
  }),
);

export default SchemaFragment;
