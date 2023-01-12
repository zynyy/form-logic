import { createContext, useContext } from 'react';
import { AnyObject, EventsObject, LogicConfig, SchemaPattern } from '@/interface';

export interface SchemeFormValueContent {
  pattern?: SchemaPattern;
  getLogicConfig?: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
}

export const SchemeFormContent = createContext<SchemeFormValueContent>({
  getLogicConfig(code: string): Promise<any> {
    return Promise.resolve(undefined);
  },
  pattern: 'EDITABLE',
  extraLogicParams: {},
  events: {},
});

export const useSchemeFormContent = () => {
  return useContext(SchemeFormContent);
};
