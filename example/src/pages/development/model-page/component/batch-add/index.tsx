import { PlusButton, PlusButtonProps } from '@formlogic/component';

import {
  useOpen,
  ModalPageForm,
  useJsonMetaSchema,
  TransformsSchemaOptions,
  AnyObject,
  useSchemaComponentsContext,
  useSchemeFormContent,
  observer,
  useForm,
  toArray,
  isArrayField,
} from '@formlogic/render';
import { FC, useState } from 'react';
import { ModelPageConfig } from '@/pages/development/model-page/services';

interface BatchAddModelPageFieldProps extends PlusButtonProps {
  modalExtraLogicParams?: AnyObject;
}

const BatchAddModelPageField: FC<BatchAddModelPageFieldProps> = observer(
  ({ disabled, modalExtraLogicParams }) => {
    const [open, show, hidden] = useOpen();

    const form = useForm();

    const [options, setOptions] = useState<TransformsSchemaOptions>(null);

    const { metaSchema } = useJsonMetaSchema(ModelPageConfig.BATCH_ADD_FIELD);

    const components = useSchemaComponentsContext();

    const { getLogicConfig } = useSchemeFormContent();

    const handleClick = () => {
      setOptions({
        metaSchema,
        hasGroup: false,
      });

      show();
    };

    const handleConfirm = (formValues: {
      code: Array<{
        code: string;
        name: string;
        defaultConfig?: any;
      }>;
      type;
      group;
    }) => {
      const { code, group, type } = formValues;

      const newFields = toArray(code).map((item) => {
        const { code: fieldCode, name, defaultConfig } = item;
        return {
          code: fieldCode,
          name,
          group,
          type,
          ...defaultConfig,
        };
      });

      form.query('data').take((target) => {
        if (isArrayField(target)) {
          target.push(...newFields).then(() => void 0);
        }
        hidden();
      });
    };

    const { model, group } = form?.values || {};

    return (
      <>
        <PlusButton disabled={disabled || !model} onClick={handleClick} type="default">
          批量添加
        </PlusButton>

        <ModalPageForm
          onClose={hidden}
          open={open}
          width={400}
          title="批量添加字段"
          options={options}
          components={components}
          getLogicConfig={getLogicConfig}
          extraLogicParams={{
            model,
            groups: toArray(group).map((item) => {
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

export default BatchAddModelPageField;
