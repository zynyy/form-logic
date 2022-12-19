import { FC } from 'react';
import { RecursionField } from '@formily/react';
import { ISchema } from '@formily/json-schema';

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

export default SchemaFragment;
