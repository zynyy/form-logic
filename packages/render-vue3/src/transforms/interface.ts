import { ISchema, SchemaPattern } from '@formlogic/render-core-vue3';

import {
  BtnFieldsItem,
  LogicListItem,
  MetaSchema,
  MetaSchemaData,
  MetaSchemaGroup,
} from '@/interface';

export type VerificationRecord = MetaSchemaData | MetaSchemaGroup;

export interface TransformsSchemaOptions {
  metaSchema: MetaSchema | undefined;
  pattern?: SchemaPattern;
  hasGroup?: boolean;
  hasSerialNo?: boolean;
  detailKey?: string;
}

export interface TransformsButtonsSchemaOptions {
  buttons: MetaSchemaData[];
  pageCode: string;
  pattern?: SchemaPattern;
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
  propertiesSchema: Properties | null;
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
