import { ISchema, SchemaPattern, SchemaPatternEnum, toArray } from '@formlogic/render-core-vue3';
import { groupBy, omit } from 'lodash-es';

import { BtnFieldsItem, LogicListItem, MetaSchemaData, StrNumBool } from '@/interface';
import { Properties, TransformsButtonsSchemaOptions } from '@/transforms/interface';
import { strNumBoolToBoolean, xCompileOmitted } from '@/transforms/utils';

class TransformsButtonsSchema {
  private buttons: MetaSchemaData[] = [];
  private btnFields: BtnFieldsItem[] = [];
  private logicList: LogicListItem[] = [];
  private pageCode: string = '';
  private pattern: SchemaPattern = SchemaPatternEnum.EDITABLE;

  constructor({ buttons, pageCode, pattern }: TransformsButtonsSchemaOptions) {
    this.buttons = buttons;
    this.pageCode = pageCode;
    this.pattern = pattern || SchemaPatternEnum.EDITABLE;
  }

  private pushLogic = (item: MetaSchemaData, prefixField?: string) => {
    const { logics, code, type } = item;

    const logicParams: Record<string, any> = {};
    const btnLogicParams: Record<string, any> = {};

    if (logics && logics.length) {
      const field = prefixField ? `${prefixField}.${code}` : code;

      const clickCodes: string[] = [];

      const fieldCodes: Record<string, any> = {};

      logics?.forEach((cur) => {
        const { effectHook, logicCode, hasChildren, params } = cur || {};

        const execField = strNumBoolToBoolean(hasChildren) ? `${field}.*` : field;

        if (effectHook === 'onClick') {
          btnLogicParams[`${effectHook}_${logicCode}`] = params;
          clickCodes.push(logicCode);
        } else {
          logicParams[`${effectHook}_${logicCode}`] = params;

          if (Reflect.has(fieldCodes, execField)) {
            const record = fieldCodes[execField];

            if (Reflect.has(record, effectHook)) {
              if (!record[effectHook].includes(logicCode)) {
                fieldCodes[execField][effectHook] =
                  fieldCodes[execField][effectHook].concat(logicCode);
              }
            } else {
              fieldCodes[execField][effectHook] = [logicCode];
            }
          } else {
            fieldCodes[execField] = {
              [effectHook]: [logicCode],
            };
          }
        }
      });

      const btnRecord: BtnFieldsItem = {
        fieldCode: field,
        clickCodes,
        pageCode: this.pageCode,
        type,
        params: btnLogicParams,
      };

      this.btnFields.push(btnRecord);

      Object.keys(fieldCodes).forEach((fieldCode) => {
        const logicHooks = fieldCodes[fieldCode];
        const record: LogicListItem = {
          fieldCode: fieldCode,
          logicHooks,
          pageCode: this.pageCode,
          type,
          params: logicParams,
        };
        this.logicList.push(record);
      });
    }
  };

  private getModeExtraProp = (disabled?: StrNumBool) => {
    switch (this.pattern) {
      case SchemaPatternEnum.EDITABLE: {
        return {
          'x-pattern': 'editable',
          'x-editable': true,
          'x-disabled': strNumBoolToBoolean(disabled),
        };
      }
      case SchemaPatternEnum.DETAIL: {
        return {
          'x-pattern': 'readOnly',
          'x-read-only': true,
        };
      }
      case SchemaPatternEnum.DISABLED: {
        return {
          'x-pattern': 'disabled',
          'x-disabled': true,
        };
      }
      default: {
        return {
          'x-pattern': 'editable',
          'x-editable': true,
          'x-disabled': strNumBoolToBoolean(disabled),
        };
      }
    }
  };

  private voidSchema = (item: MetaSchemaData, index: number, properties?: Properties): ISchema => {
    const { componentProps, component, hidden, name, disabled, parentCode, originCode } =
      item || {};

    return {
      type: 'void',
      title: name,
      ...this.getModeExtraProp(disabled),
      'x-hidden': strNumBoolToBoolean(hidden),
      'x-index': index,
      'x-component': component || 'Button',
      'x-component-props': componentProps,
      'x-data': {
        parentCode,
        originCode,
      },
      'x-compile-omitted': xCompileOmitted,
    };
  };

  private getButtonPropertiesSchema = (
    buttonProperties: Record<string, MetaSchemaData[]>,
    parentCode: string,
    prefixField?: string,
  ) => {
    const properties: Record<string, any> = {};

    const buttons = buttonProperties[parentCode];

    if (Array.isArray(buttons)) {
      buttons.forEach((item, index) => {
        const { code, name } = item;
        const btnProperties = this.voidSchema(item, index);

        this.pushLogic(item, prefixField);

        properties[code] = {
          ...btnProperties,
          'x-component-props': {
            ...btnProperties['x-component-props'],
            title: name,
          },
          properties: this.getButtonPropertiesSchema(
            buttonProperties,
            code,
            prefixField ? `${prefixField}.${code}` : '',
          ),
        };
      });
    }

    return properties;
  };

  private getPropertiesGroups = (data: MetaSchemaData[]) => {
    const noPropertiesKey = '$_noProperties';
    const parentCodeGroup =
      groupBy(data, (item) => {
        return item.parentCode || noPropertiesKey;
      }) || {};

    return {
      data: toArray(parentCodeGroup[noPropertiesKey]),
      propertiesData: omit(parentCodeGroup, [noPropertiesKey]),
    };
  };

  buttonProperties(prefixField?: string) {
    const properties: Record<string, any> = {};

    const { data, propertiesData } = this.getPropertiesGroups(this.buttons);

    data.forEach((item, index) => {
      const { name, code } = item || {};

      const btnProperties = this.voidSchema(item, index);
      this.pushLogic(item);

      properties[code] = {
        ...btnProperties,
        'x-component-props': {
          ...btnProperties['x-component-props'],
          title: name,
        },
        'x-compile-omitted': xCompileOmitted,
        properties: this.getButtonPropertiesSchema(
          propertiesData,
          code,
          prefixField ? `${prefixField}.${code}` : '',
        ),
      };
    });

    return properties;
  }

  getButtonsSchema(code = 'formButtons') {
    const properties = this.buttonProperties(code);

    const schema = {
      type: 'void',
      properties: {
        [code]: {
          type: 'void',
          'x-component': 'Space',
          properties,
        },
      },
    };

    return {
      buttonsSchema: schema,
      btnFields: this.btnFields,
      logicList: this.logicList,
    };
  }
}

export default TransformsButtonsSchema;
