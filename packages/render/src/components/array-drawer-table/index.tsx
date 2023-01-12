import { FC, useState } from 'react';
import { useJsonMetaSchema, useOpen, useSchemaComponentsContext } from '@/hooks';

import DrawerPageForm from '@/drawer-page-form';
import { observer, useField } from '@formily/react';

import ArrayTableBase, { ArrayTableBaseProps } from '@/components/array-table-base';
import { IFormProps, isArrayField } from '@formily/core';
import { AnyObject } from '@formlogic/component';
import { TransformsSchemaOptions } from '@/transforms';
import { useSchemeFormContent } from '@/scheme-form/hooks';

export interface ArrayDrawerTableProps extends Omit<ArrayTableBaseProps, 'onEdit' | 'onAdd'> {
  drawerPageCode?: string;
  drawerFormConfig?: IFormProps;
  drawerExtraLogicParams?: AnyObject;
}

const ArrayDrawerTable: FC<ArrayDrawerTableProps> = observer(
  ({ drawerPageCode, drawerFormConfig, drawerExtraLogicParams, ...restProps }) => {
    const [open, showOpen, hiddenOpen] = useOpen();

    const [activeIndex, setActiveIndex] = useState(-1);

    const [formConfig, setFormConfig] = useState<IFormProps>({});

    const {metaSchema} = useJsonMetaSchema(drawerPageCode);

    const field = useField();

    const components = useSchemaComponentsContext();

    const { getLogicConfig } = useSchemeFormContent();

    const [options, setOptions] = useState<TransformsSchemaOptions>({
      metaSchema: null,
      hasGroup: true,
    });

    const genOptions = () => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });
    };

    const genFormConfig = (otherConfig: IFormProps) => {
      setFormConfig({
        ...drawerFormConfig,
        ...otherConfig,
      });
    };

    const handleEdit = (index, record) => {
      setActiveIndex(index);

      genOptions();
      genFormConfig({
        values: record,
        initialValues: record,
      });

      showOpen();
    };

    const handleAdd = () => {
      setActiveIndex(-1);
      genOptions();
      genFormConfig({
        initialValues: {},
      });

      showOpen();
    };

    const handleClose = () => {
      hiddenOpen();
    };

    const handleConfirm = (formValues) => {
      if (isArrayField(field)) {
        if (activeIndex === -1) {
          field.push(formValues).then(() => void 0);
        } else {
          field.value.splice(activeIndex, 1, formValues);

          field.onInput(field.value).then(() => void 0);
        }
      }
    };

    return (
      <>
        <ArrayTableBase {...restProps} onAdd={handleAdd} onEdit={handleEdit} />

        <DrawerPageForm
          open={open}
          options={options}
          onClose={handleClose}
          onConfirm={handleConfirm}
          formConfig={formConfig}
          extraLogicParams={drawerExtraLogicParams}
          getLogicConfig={getLogicConfig}
          components={components}
        />
      </>
    );
  },
);

export default ArrayDrawerTable;
