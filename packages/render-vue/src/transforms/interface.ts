import { BtnFieldsItem, LogicListItem, MetaSchema, MetaSchemaData, SchemaPattern } from '@/interface';
import { ISchema } from '@formily/json-schema';

export interface TransformsSchemaOptions {
  metaSchema: MetaSchema;
  pattern?: SchemaPattern;
  hasGroup?: boolean;
}

export interface ListSchema {
  searchSchema: ISchema;
  tableSchema: ISchema;
  hasCollapsed: boolean;
  searchLogic: LogicListItem[];
  tableLogic: LogicListItem[];
  searchBtnFields: BtnFieldsItem[];
  tableBtnFields: BtnFieldsItem[];
  searchButtons: MetaSchemaData[];
  transformsDone: boolean;
}

export interface FormSchema {
  schema: ISchema;
  btnSchema: ISchema;
  buttons: MetaSchemaData[];
  logicList: LogicListItem[];
  btnFields: BtnFieldsItem[];
  pattern: SchemaPattern;
  transformsDone: boolean;
}

export interface Properties {
  [code: string]: ISchema;
}

export interface PropertiesSchema {
  propertiesSchema: Properties;
  buttons: MetaSchemaData[];
  logicList: LogicListItem[];
  btnFields: BtnFieldsItem[];
  pattern: SchemaPattern;
  transformsDone: boolean;
}

export enum RunSchemaEnum {
  formSchema = 'formSchema',
  propertiesSchema = 'propertiesSchema',
  listSchema = 'listSchema',
}
