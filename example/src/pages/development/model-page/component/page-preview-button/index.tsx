import { Button, Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import {
  FormPageLayout,
  getFormValues,
  ListLayout,
  MetaDataTypeEnum,
  observer,
  toArray,
  useForm,
  useOpen,
  useSchemaComponentsContext,
  useSchemeFormContent,
} from '@formlogic/render';
import { FC, useState } from 'react';
import { getItemMetaSchema } from '@/hooks';

interface PagePreviewButtonProps {}

const PagePreviewButton: FC<PagePreviewButtonProps> = observer(() => {
  const [open, show, hidden] = useOpen();

  const [metaSchema, setMetaSchema] = useState(null);

  const form = useForm();

  const [hasSearch, setHasSearch] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);

  const { getLogicConfig } = useSchemeFormContent();

  const components = useSchemaComponentsContext();

  const { code, codeSuffix, model, data } = form.values;

  const pageCode = code ?? `${model}_${codeSuffix}`;

  const handleClick = () => {
    getFormValues(form).then((formValues) => {
      const { group, data } = formValues || {};

      const list = [MetaDataTypeEnum.search_column, MetaDataTypeEnum.table_column];

      setHasGroup(!!toArray(group).length);
      setHasSearch(!!toArray(data).find((item) => list.includes(item.type)));

      getItemMetaSchema(formValues).then((nextMetaSchema) => {
        setMetaSchema({
          ...nextMetaSchema,
          code: pageCode,
        });
        show();
      });
    });
  };

  return (
    <>
      <Button disabled={!toArray(data).length} onClick={handleClick} icon={<EyeOutlined />}>
        预览
      </Button>

      <Drawer
        title={`${pageCode} 页面预览`}
        open={open}
        width="90%"
        onClose={hidden}
        destroyOnClose
      >
        {hasSearch ? (
          <ListLayout
            action=""
            metaSchema={metaSchema}
            getLogicConfig={getLogicConfig}
            components={components}
          />
        ) : (
          <FormPageLayout
            hasGroup={hasGroup}
            metaSchema={metaSchema}
            getLogicConfig={getLogicConfig}
            onBackClick={hidden}
            components={components}
          />
        )}
      </Drawer>
    </>
  );
});

export default PagePreviewButton;
