import {
  ArrayTableBase,
  ArrayTableBaseProps,
  observer,

  TransformsSchemaOptions,
  useField,
  isArrayField,
  FormConfigProps,
  AnyObject,
  findMultiArray, DrawerPageForm, useSchemaComponentsContext, useJsonMetaSchema, useOpen,
} from '@formlogic/render';
import { FC, useState } from 'react';

import getLogicConfig from '@/low-code-meta/logic';

import { Row, Col } from 'antd';

import { StaticSearchTree } from '@formlogic/component';

import { useFieldMetaTree } from '@/pages/development/field-meta/hooks';


export interface MetaTreeArrayDrawerTableProps extends ArrayTableBaseProps {
  drawerPageCode?: string;
  drawerFormConfig?: FormConfigProps;
  drawerExtraLogicParams?: AnyObject;
}

const MetaTreeArrayDrawerTable: FC<MetaTreeArrayDrawerTableProps> = observer(
  ({ drawerPageCode, drawerFormConfig, drawerExtraLogicParams, ...restProps }) => {
    const [open, showOpen, hiddenOpen] = useOpen();

    const [activeIndex, setActiveIndex] = useState(-1);

    const [treeData] = useFieldMetaTree();

    const [formConfig, setFormConfig] = useState<FormConfigProps>({});

    const {metaSchema} = useJsonMetaSchema(drawerPageCode);

    const components = useSchemaComponentsContext()

    const field = useField();

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

    const genFormConfig = (otherConfig: FormConfigProps) => {
      setFormConfig({
        ...drawerFormConfig,
        ...otherConfig,
      });
    };

    const handleEdit = (index, record) => {
      setActiveIndex(index);

      genFormConfig({
        initialValues: record,
      });
      genOptions();
      showOpen();
    };

    const handleAdd = () => {
      setActiveIndex(-1);
      genFormConfig({
        initialValues: {},
      });
      genOptions();
      showOpen();
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

    const handleSelect = (selectedKeys) => {
      selectedKeys.forEach((key) => {
        const record = findMultiArray(treeData, key);

        if (record) {
          const { code, name, defaultConfig } = record;

          if (isArrayField(field)) {
            const exist = field.value?.find((cur) => cur.code === code);

            if (!exist) {
              field.push({ code, name, defaultConfig }).then(() => void 0);
            }
          }
        }
      });
    };

    return (
      <Row gutter={12}>
        <Col span={8}>
          <StaticSearchTree onSelect={handleSelect} treeData={treeData} height={555} />
        </Col>

        <Col span={16}>
          <ArrayTableBase {...restProps} onAdd={handleAdd} onEdit={handleEdit} />
        </Col>

        <DrawerPageForm
          open={open}
          options={options}
          onClose={hiddenOpen}
          onConfirm={handleConfirm}
          formConfig={formConfig}
          extraLogicParams={drawerExtraLogicParams}
          getLogicConfig={getLogicConfig}
          components={components}
        />
      </Row>
    );
  },
);

export default MetaTreeArrayDrawerTable;
