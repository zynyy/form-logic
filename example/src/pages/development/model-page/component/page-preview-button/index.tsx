import { Button, Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import {
  FormPageLayout,
  ListLayout,
  useOpen,
  useSchemeFormContent,
  useForm,
  getFormValues,
  toArray,
  MetaDataTypeEnum,
  useSchemaComponentsContext,
} from '@formlogic/render';
import { useState } from 'react';
import { getItemMetaSchema } from '@/hooks';

const PagePreviewButton = () => {
  const [open, show, hidden] = useOpen();

  const [metaSchema, setMetaSchema] = useState(null);

  const form = useForm();

  const [hasSearch, setHasSearch] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);

  const { getLogicConfig } = useSchemeFormContent();

  const components = useSchemaComponentsContext();

  const handleClick = () => {
    getFormValues(form).then((formValues) => {
      const { group, data } = formValues || {};

      setHasGroup(!!toArray(group).length);
      setHasSearch(!!toArray(data).find((item) => item.type === MetaDataTypeEnum.search_column));

      getItemMetaSchema(formValues).then((nextMetaSchema) => {
        setMetaSchema(nextMetaSchema);
        show();
      });
    });
  };

  const code = form.getValuesIn('code');

  return (
    <>
      <Button onClick={handleClick} icon={<EyeOutlined />}>
         预览
      </Button>

      <Drawer title={`${code} 页面预览`} open={open} width="90%" onClose={hidden}>
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
};

export default PagePreviewButton;
