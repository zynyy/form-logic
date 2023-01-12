import { useContext } from 'react';
import { SchemaComponentsContext } from '@formily/react';

const useSchemaComponentsContext = () => {
  return useContext(SchemaComponentsContext);
};

export default useSchemaComponentsContext;
