import { FC, PropsWithChildren } from 'react';
import { observer, RecursionField, useField } from '@formily/react';
import { useDynamicSchema, useJsonMetaSchema } from '@/hooks';
import { Skeleton } from 'antd';

export interface DynamicSchemaProps extends PropsWithChildren {
  pageCode?: string;
}

const DynamicSchema: FC<DynamicSchemaProps> = observer(({ pageCode, children }) => {
  const field = useField();

  const { metaSchema } = useJsonMetaSchema(pageCode);

  const [schema, done] = useDynamicSchema(metaSchema);

  return (
    <Skeleton loading={!done}>
      <RecursionField basePath={field.address} schema={schema} onlyRenderProperties />
    </Skeleton>
  );
});

export default DynamicSchema;
