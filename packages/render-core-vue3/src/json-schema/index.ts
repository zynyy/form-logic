import { IFieldFactoryProps } from '@formily/core';
import { ISchema, ISchemaTransformerOptions, Schema } from '@formily/json-schema';

import { transformFieldProps } from './transformer';

class JsonSchema extends Schema {
  constructor(json: ISchema) {
    super(json);
    return this.fromJSON(json);
  }

  toFieldProps = (options?: ISchemaTransformerOptions): IFieldFactoryProps<any, any> => {
    return transformFieldProps(this, options);
  };
}

export default JsonSchema;
