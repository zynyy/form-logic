
import { defineComponent, ref, toRef } from 'vue';
import ArrayTableBase from '@/components/array-table-base';
import DrawerPageForm from '@/drawer-page-form';
import { useField, useSchemaComponentsContext,observer } from '@/formily-vue';
import { useSchemeFormContent } from '@/scheme-form';
import { useJsonMetaSchema } from '@/hooks';
import { SchemaPattern } from '@/interface';
import { TransformsSchemaOptions } from '@/transforms';
import { IFormProps, isArrayField } from '@formily/core';
import {getArrayDrawerTableProps} from "./interface";

const ArrayDrawerTable = observer(
  defineComponent({
    name: 'ArrayDrawerTable',
    inheritAttrs: false,
    props: getArrayDrawerTableProps(),
    setup(props) {
      const visible = ref(false);
      const options = ref<TransformsSchemaOptions>(null);
      const formConfig = ref<IFormProps>({});
      const activeIndex = ref(-1);

      const fieldRef = useField();

      const { metaSchema } = useJsonMetaSchema(toRef(props, 'drawerPageCode'));

      const genOptions = (pattern?: SchemaPattern) => {
        options.value = {
          metaSchema: metaSchema.value,
          hasGroup: true,
          pattern,
        };
      };

      const genFormConfig = (otherConfig: IFormProps) => {
        const { drawerFormConfig } = props;
        formConfig.value = {
          ...drawerFormConfig,
          ...otherConfig,
        };
      };

      const handleClose = () => {
        visible.value = false;
      };

      const handleAdd = () => {
        visible.value = true;
      };

      const handleEdit = (index, record) => {
        activeIndex.value = index;

        genOptions();
        genFormConfig({
          values: record,
          initialValues: record,
        });

        visible.value = true;
      };

      const handleDetail = (index, record) => {
        activeIndex.value = index;

        genOptions('DETAIL');
        genFormConfig({
          values: record,
          initialValues: record,
        });

        visible.value = true;
      };

      const handleConfirm = (formValues) => {
        const field = fieldRef.value;

        if (isArrayField(field)) {
          if (activeIndex.value === -1) {
            field.push(formValues).then(() => void 0);
          } else {
            field.value.splice(activeIndex.value, 1, formValues);

            field.onInput(field.value).then(() => void 0);
          }
        }
      };

      const componentsRef = useSchemaComponentsContext();

      const formContentRef = useSchemeFormContent();

      return () => {
        const { drawerExtraLogicParams, ...restProps } = props;

        const { getLogicConfig } = formContentRef.value;

        return (
          <>
            <ArrayTableBase
              {...restProps}
              onDetail={handleDetail}
              onAdd={handleAdd}
              onEdit={handleEdit}
            />

            <DrawerPageForm
              visible={visible.value}
              options={options.value}
              onClose={handleClose}
              onConfirm={handleConfirm}
              formConfig={formConfig.value}
              extraLogicParams={drawerExtraLogicParams}
              getLogicConfig={getLogicConfig}
              components={componentsRef.value}
            />
          </>
        );
      };
    },
  }),
);

export default ArrayDrawerTable;
