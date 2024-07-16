import { FC, memo } from 'react';
import { RecursionField,ISchema } from '@formily/react';


interface SchemaSourceItem {
  name: string;
  schema: ISchema;
}

interface SchemaFragmentProps {
  schemaSource: SchemaSourceItem[];
}

const SchemaFragment: FC<SchemaFragmentProps> = ({ schemaSource }) => {
  return (
    <>
      {schemaSource.map((item) => {
        const { name, schema } = item;

        const nowSchema = {
          ...schema,
          'x-component': 'Fragment',
        };
        return <RecursionField key={name} name={name} schema={nowSchema} onlyRenderSelf />;
      })}
    </>
  );
};

export default memo(SchemaFragment);
