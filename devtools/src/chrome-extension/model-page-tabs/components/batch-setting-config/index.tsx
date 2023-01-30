import {
  useOpen,
  useJsonMetaSchema,
  TransformsSchemaOptions,
  useSchemaComponentsContext,
  useSchemeFormContent,
  observer,
  useForm,
  toArray,
  DrawerPageForm,
  useArrayContext,
  MetaDataTypeEnum,
  AnyObject,
} from '@formlogic/render';
import { FC, useState } from 'react';
import { Button, ButtonProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { strNumBoolToBoolean } from '@formlogic/component';

interface BatchSettingModelPageFieldProps extends ButtonProps {
  readOnly?: boolean;
}

const BatchSettingModelPageField: FC<BatchSettingModelPageFieldProps> = observer(
  ({ disabled, readOnly }) => {
    const [open, show, hidden] = useOpen();

    const form = useForm();

    const [options, setOptions] = useState<TransformsSchemaOptions>(null);

    const { metaSchema } = useJsonMetaSchema('ModelPage_BatchSetting_C');

    const components = useSchemaComponentsContext();

    const { getLogicConfig } = useSchemeFormContent();

    const { props, field: arrayField } = useArrayContext();

    const { selectedRowKeys, selectedRows, setSelectedRows, setSelectedRowKeys } = props || {};

    const handleClick = () => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });

      show();
    };

    const handleConfirm = (formValues) => {
      const { component, componentProps } = formValues;

      const data = arrayField.value;

      const index = selectedRows.map((item) => {
        return data.indexOf(item);
      });

      const batchConfig: AnyObject = {};

      Object.keys(formValues).forEach((key) => {
        if (['component', 'componentProps'].includes(key)) {
          if (formValues.component) {
            batchConfig.component = component;
            batchConfig.componentProps = componentProps;
          }
        } else if (['logics', 'validator'].includes(key)) {
          if (toArray(formValues[key]).length) {
            batchConfig[key] = formValues[key];
          }
        } else if (
          ['hasSerialNo', 'hasSort', 'required', 'hidden', 'disabled', 'hiddenName'].includes(key)
        ) {
          batchConfig[key] = strNumBoolToBoolean(formValues[key]);
        } else {
          batchConfig[key] = formValues[key];
        }
      });

      arrayField
        .onInput(
          data.map((item, idx) => {
            if (index.includes(idx)) {
              return {
                ...item,
                ...batchConfig,
              };
            }
            return item;
          }),
        )
        .then(() => void 0);
      setSelectedRows([]);
      setSelectedRowKeys([]);
    };

    const { group, data } = form?.values || {};

    return readOnly ? null : (
      <>
        <Button
          disabled={disabled || !toArray(selectedRowKeys).length}
          icon={<SettingOutlined />}
          onClick={handleClick}
        >
          批量设置
        </Button>

        <DrawerPageForm
          onClose={hidden}
          open={open}
          width="90%"
          title="批量修改字段配置"
          options={options}
          components={components}
          getLogicConfig={getLogicConfig}
          extraLogicParams={{
            groups: toArray(group).map((item) => {
              const { code, name } = item;
              return {
                code,
                name,
              };
            }),
            tableColumns: toArray(data)
              .filter((item) => item.type === MetaDataTypeEnum.table_column)
              .map((item) => {
                const { code, name } = item;
                return {
                  code,
                  name,
                };
              }),
          }}
          onConfirm={handleConfirm}
        />
      </>
    );
  },
);

export default BatchSettingModelPageField;
