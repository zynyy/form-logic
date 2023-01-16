import {
  AnyObject,
  BtnFieldsItem,
  LogicListItem,
  MetaDataTypeEnum,
  MetaSchemaData,
  MetaSchemaGroup,
  SchemaPattern,
  SchemaPatternEnum,
  StrNumBool,
} from '@/interface';
import MetaDataSorted from '@/transforms/MetaDataSorted';

import { ISchema } from '@formily/react';
import { strNumBoolToBoolean } from '@/transforms/utils';
import { LIST_FILED_CODE, STEPS_GROUP_MODE, TABS_GROUP_MODE } from '@/utils/constant';

import {
  FormSchema,
  ListSchema,
  Properties,
  PropertiesSchema,
  RunSchemaEnum,
  TransformsSchemaOptions,
} from '@/transforms/interface';

const xCompileOmitted = [
  'default',
  'x-validator',
  'x-decorator-props',
  'x-component-props',
  'x-data',
  'description',
  'title',
];

class TransformsSchema extends MetaDataSorted {
  private readonly options: TransformsSchemaOptions;
  private readonly pattern: SchemaPattern;

  private runSchema: keyof typeof RunSchemaEnum = RunSchemaEnum.formSchema;
  private hasCollapsed = false;

  private logicList: LogicListItem[] = [];
  private searchLogic: LogicListItem[] = [];
  private tableLogic: LogicListItem[] = [];

  private searchBtnFields: BtnFieldsItem[] = [];
  private tableBtnFields: BtnFieldsItem[] = [];
  private btnFields: BtnFieldsItem[] = [];

  private schemaTypeMap: Map<string, (item: MetaSchemaData, index: number) => ISchema> = new Map();

  constructor(op: TransformsSchemaOptions | undefined) {
    const { metaSchema, hasGroup } = op || {};
    super(metaSchema, hasGroup);
    this.options = op;
    this.pattern = op.pattern || SchemaPatternEnum.EDITABLE;

    this.schemaTypeMap
      .set('string', this.fieldSchema)
      .set('void', this.voidSchema)
      .set('object', this.objectSchema)
      .set('array', this.arraySchema);

    this.run();
  }

  private getDefaultValue = (item: MetaSchemaData) => {
    const { defaultValue } = item || {};

    return defaultValue;
  };

  private getModeExtraProp = (disabled?: StrNumBool) => {
    const pattern = this.options.pattern;
    switch (pattern) {
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

  private getItemColProp = (item: MetaSchemaData) => {
    const { colSpan, labelCol, wrapperCol } = item || {};

    const { labelCol: layoutLabelCol, wrapperCol: layoutWrapperCol } =
      this.options.metaSchema || {};

    return {
      gridSpan: colSpan,
      labelCol: labelCol || layoutLabelCol || 6,
      wrapperCol: wrapperCol || layoutWrapperCol || 18,
    };
  };

  private pushLogic = (item: MetaSchemaData, prefixField?: string) => {
    const { logics, code, eventCode, type } = item;

    if ((logics && logics.length) || eventCode) {
      const field = prefixField ? `${prefixField}.${code}` : code;

      const clickCodes = [];

      const fieldCodes = {};

      logics?.forEach((cur) => {
        const { effectHook, logicCode, hasChildren } = cur || {};

        const execField = strNumBoolToBoolean(hasChildren) ? `${field}.*` : field;

        if (effectHook === 'onClick') {
          clickCodes.push(logicCode);
        } else {
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

      const pageCode = this.options?.metaSchema?.code;

      const btnRecord = {
        fieldCode: field,
        clickCodes,
        eventCode,
        pageCode,
        type,
      };

      if (this.runSchema === RunSchemaEnum.listSchema) {
        if (clickCodes.length || eventCode) {
          switch (item.type) {
            case MetaDataTypeEnum.button:
            case MetaDataTypeEnum.table_button: {
              this.tableBtnFields.push(btnRecord);
              break;
            }
            case MetaDataTypeEnum.search_button: {
              this.searchBtnFields.push(btnRecord);
              break;
            }
            default: {
              break;
            }
          }
        }
      } else {
        if (clickCodes.length || eventCode) {
          this.btnFields.push(btnRecord);
        }
      }

      Object.keys(fieldCodes).forEach((fieldCode) => {
        const logicHooks = fieldCodes[fieldCode];

        const record = {
          fieldCode: fieldCode,
          logicHooks,
          pageCode,
          type,
        };

        if (this.runSchema === RunSchemaEnum.listSchema) {
          if (Object.keys(logicHooks).length) {
            switch (item.type) {
              case MetaDataTypeEnum.search_column:
              case MetaDataTypeEnum.search_button: {
                this.searchLogic.push(record);
                break;
              }
              default: {
                this.tableLogic.push(record);
                break;
              }
            }
          }
        } else {
          if (Object.keys(logicHooks).length) {
            this.logicList.push(record);
          }
        }
      });
    }
  };

  private baseSchema = (item: MetaSchemaData, index): ISchema => {
    const {
      description,
      required,
      componentProps,
      component,
      hidden,
      name,
      disabled,
      hiddenName,
      type,
    } = item || {};

    const modeExtraProp = this.getModeExtraProp(strNumBoolToBoolean(disabled));

    const { defaultSearchColumn } = this.options.metaSchema || {};

    let hiddenBool = strNumBoolToBoolean(hidden);

    const extraData = {
      initHidden: hiddenBool,
    };

    const extraProperty: AnyObject = {};

    if (
      !hiddenBool &&
      defaultSearchColumn &&
      type === 'search_column' &&
      index >= defaultSearchColumn
    ) {
      extraData['hiddenSearchColumn'] = true;
      hiddenBool = true;
      this.hasCollapsed = true;
    }

    return {
      title: name,
      required: strNumBoolToBoolean(required),
      default: this.getDefaultValue(item),
      description,
      ...extraProperty,
      ...modeExtraProp,
      'x-index': index,
      'x-hidden': hiddenBool,
      'x-validator': this.getValidator(item),
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        ...this.getItemColProp(item),
        wrapperWrap: true,
        tooltip: description,
        label: name,
        hiddenLabel: strNumBoolToBoolean(hiddenName),
      },
      'x-component': component,
      'x-component-props': componentProps,
      'x-data': extraData,
      'x-compile-omitted': xCompileOmitted,
    };
  };

  private objectSchema = (item: MetaSchemaData) => {
    const { itemMetaSchema, code, component, componentProps } = item || {};

    const { columns } = new MetaDataSorted(itemMetaSchema).result();

    const extra = {};

    if (component) {
      extra['x-component'] = component;
      extra['x-component-props'] = componentProps;
    }

    return {
      type: 'object',
      ...extra,
      'x-validator': this.getValidator(item),
      properties: this.gridProperties(columns, code),
    };
  };

  private fieldSchema = (item: MetaSchemaData, index: number): ISchema => {
    const { component } = item || {};

    return {
      ...this.baseSchema(item, index),
      type: 'string',
      'x-component': component || 'Input',
    };
  };

  private voidSchema = (item: MetaSchemaData, index: number, properties?: Properties): ISchema => {
    const { componentProps, component, hidden, name, disabled, parentCode, type } = item || {};

    const defaultComponent = type?.endsWith('button') ? 'Button' : 'Fragment';

    return {
      type: 'void',
      title: name,
      ...this.getModeExtraProp(disabled),
      'x-hidden': strNumBoolToBoolean(hidden),
      'x-index': index,
      'x-component': component || defaultComponent,
      'x-component-props': componentProps,
      properties: properties,
      'x-data': {
        parentCode,
      },
      'x-compile-omitted': xCompileOmitted,
    };
  };

  private getValidator = (item: MetaSchemaData) => {
    const { validator } = item;

    const record = {};

    if (validator) {
      validator.forEach((cur) => {
        const { validatorRule, validatorRuleValue } = cur || {};
        record[validatorRule] = validatorRuleValue ?? true;
      });
    }

    return record;
  };

  private buttonsSchema = (buttons: MetaSchemaData[], prefixField?: string) => {
    const properties = {};

    const popoverProperties = {};

    buttons.forEach((item, index) => {
      const { code, name, type } = item;
      const btnProperties = this.voidSchema(item, index);

      const codeProperties = {
        ...btnProperties,
        'x-component-props': {
          ...btnProperties['x-component-props'],
          title: name,
        },
      };

      if (index > 2 && type === MetaDataTypeEnum.table_button) {
        this.pushLogic(item, `${prefixField}.popover`);
        popoverProperties[code] = codeProperties;
      } else {
        this.pushLogic(item, prefixField);
        properties[code] = codeProperties;
      }
    });

    if (Object.keys(popoverProperties).length) {
      properties['popover'] = {
        type: 'void',
        'x-component': 'PopoverBtn',
        properties: popoverProperties,
      };
    }

    return properties;
  };

  private itemProperties = (item: MetaSchemaData, prefixField?: string): Properties => {
    const {
      description,
      required,
      componentProps,
      hidden,
      name,
      disabled,
      component,
      code,
      schemaType,
    } = item || {};

    const modeExtraProp = this.getModeExtraProp(strNumBoolToBoolean(disabled));

    const defaultValue = this.getDefaultValue(item);

    this.pushLogic(item, prefixField);

    return {
      [code]: {
        type: schemaType,
        title: name,
        required: strNumBoolToBoolean(required),
        description,
        default: defaultValue,
        ...modeExtraProp,
        'x-hidden': strNumBoolToBoolean(hidden),
        'x-validator': this.getValidator(item),
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          ...this.getItemColProp(item),
          wrapperWrap: true,
          tooltip: description,
          label: name,
          hiddenLabel: true,
        },
        'x-component': component || 'ArrayBase.PreviewText',
        'x-component-props': componentProps,
        'x-compile-omitted': xCompileOmitted,
      },
    };
  };

  private arrayItemSchema = (
    item: Partial<MetaSchemaData>,
    tableColumns: MetaSchemaData[],
    tableButton: MetaSchemaData[],
  ): ISchema => {
    const properties = {};

    const { hasSort, hasSerialNo } = item;

    const pattern = this.pattern;

    if (strNumBoolToBoolean(hasSort) && pattern === SchemaPatternEnum.EDITABLE) {
      properties['dragSort'] = {
        type: 'void',
        title: '排序',
        'x-component': 'Fragment',
        'x-component-props': {
          width: 50,
          align: 'center',
          fixed: 'left',
        },
        properties: {
          dragSort: {
            type: 'void',
            ...this.getModeExtraProp(),
            'x-component': 'ArrayBase.SortHandle',
          },
        },
      };
    }

    if (strNumBoolToBoolean(hasSerialNo)) {
      properties['serialNo'] = {
        type: 'void',
        title: '序号',
        'x-component': 'Fragment',
        'x-component-props': {
          width: 50,
          align: 'center',
          fixed: 'left',
        },
        properties: {
          serialNo: {
            type: 'void',
            ...this.getModeExtraProp(),
            'x-component': 'ArrayBase.Index',
          },
        },
      };
    }

    const prefixField = `${item.code}.*`;

    tableColumns.forEach((cur, index) => {
      const { code } = cur;
      properties[code] = this.voidSchema(cur, index, this.itemProperties(cur, prefixField));
    });

    if (tableButton.length) {
      properties['operations'] = {
        type: 'void',
        title: '操作列',
        'x-hidden':
          tableButton.filter((item) => strNumBoolToBoolean(item.hidden)).length ===
          tableButton.length,
        'x-component': 'Fragment',
        'x-component-props': {
          fixed: 'right',
        },
        properties: {
          operations: {
            type: 'void',
            'x-component': 'Space',
            properties: this.buttonsSchema(tableButton, prefixField),
          },
        },
      };
    }

    return {
      type: 'object',
      properties,
    };
  };

  private arraySchema = (item: MetaSchemaData, index): ISchema => {
    const { itemMetaSchema, component } = item || {};

    const { button, tableButton, tableColumns } = new MetaDataSorted(itemMetaSchema).result();

    return {
      ...this.fieldSchema(item, index),
      type: 'array',
      'x-component': component || 'ArrayTable',
      'x-index': index,
      properties: this.buttonsSchema(button, item.code),
      items: this.arrayItemSchema(item, tableColumns, tableButton),
    };
  };

  private schemaType = (schemaType) => {
    if (this.schemaTypeMap.has(schemaType)) {
      return this.schemaTypeMap.get(schemaType);
    }
    return this.voidSchema;
  };

  private groupButtonProperties = (groupCode: string, buttons: MetaSchemaData[]) => {
    if (!buttons.length) {
      return {};
    }

    return {
      groupButtons: {
        type: 'void',
        component: 'Fragment',
        ...this.getModeExtraProp(),
        properties: this.buttonsSchema(buttons),
      },
    };
  };

  private gridProperties = (grids: MetaSchemaData[], prefixField?: string) => {
    const wrapProperties = [];

    const { columnLayout } = this.options.metaSchema || {};

    const gridProperties = {};
    const objectProperties = {};

    const gridIndex = [];

    let nextGridWrap = false;

    grids.forEach((item, index) => {
      const { wrap, code, schemaType } = item || {};

      const properties = this.schemaType(schemaType)(item, index);

      this.pushLogic(item, prefixField);

      if (schemaType === 'object') {
        const idx = `object_${code}`;

        objectProperties[idx] = properties;
        gridIndex.push(idx);

        nextGridWrap = true;
      } else {
        if (properties) {
          if (strNumBoolToBoolean(wrap) || !wrapProperties.length || nextGridWrap) {
            wrapProperties.push({
              [code]: properties,
            });
            const index = wrapProperties.length - 1;
            gridIndex.push(`grid_${index || ''}`);
            nextGridWrap = false;
          } else {
            const lastIndex = wrapProperties.length - 1;
            wrapProperties[lastIndex][code] = properties;
          }
        }
      }
    });

    gridIndex.forEach((idx) => {
      if (idx.startsWith('grid_')) {
        const index = idx.replace(/^grid_/, '') || 0;
        gridProperties[`grid${index || ''}`] = {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            strictAutoFit: true,
            maxColumns: columnLayout || 3,
            minColumns: 1,
          },
          properties: wrapProperties[index] || {},
        };
      } else {
        const code = idx.replace(/^object_/, '');

        gridProperties[code] = objectProperties[idx];
      }
    });

    return gridProperties;
  };

  private tabsGroupProperties = (groupItem: MetaSchemaGroup): ISchema => {
    const tabsProperties = {};

    const { code, modeCodes } = groupItem;

    const { metaSchema } = this.options || {};
    const { group } = metaSchema || {};

    [code]
      .concat(modeCodes)
      .filter((val) => val)
      .forEach((key) => {
        const grids = this.columnsArray.filter((item) => {
          return item.group === key;
        });

        const { name } = group.find((cur) => cur.code === key);

        if (grids.length) {
          tabsProperties[key] = {
            type: 'void',
            title: name,
            'x-component': 'FormGroup',
            'x-hidden':
              grids.filter((item) => strNumBoolToBoolean(item.hidden)).length === grids.length,
            'x-component-props': {
              code,
              title: name,
            },
            properties: this.gridProperties(grids),
          };
        }
      });

    return tabsProperties;
  };

  // todo 待开发分步表单
  private stepGroupProperties = (groupItem: MetaSchemaGroup): ISchema => {
    return {};
  };

  private groupProperties = () => {
    const groupProperties = {};

    this.groupsOrder.forEach((item) => {
      const { code, name, hiddenName, mode } = item;

      const hasTabs = mode === TABS_GROUP_MODE;
      const hasStep = mode === STEPS_GROUP_MODE;

      if (hasTabs) {
        groupProperties[`${code}Tabs`] = {
          type: 'void',
          'x-component': 'FormTabsGroup',
          'x-component-props': {},
          properties: this.tabsGroupProperties(item),
        };
      } else if (hasStep) {
        groupProperties[`${code}Steps`] = {
          type: 'void',
          'x-component': 'FormStepGroup',
          'x-component-props': {},
          properties: this.stepGroupProperties(item),
        };
      } else {
        const grids = this.columnsArray.filter((item) => {
          return item.group === code;
        });

        const groupButtons = this.groupButtonsArray.filter((item) => {
          return item.group === code;
        });

        if (grids.length) {
          groupProperties[code] = {
            type: 'void',
            'x-component': 'FormGroup',
            'x-hidden':
              grids.filter((item) => strNumBoolToBoolean(item.hidden)).length === grids.length,
            'x-component-props': {
              code,
              title: name,
              hiddenName: strNumBoolToBoolean(hiddenName),
            },
            properties: {
              ...this.groupButtonProperties(code, groupButtons),
              ...this.gridProperties(grids),
            },
          };
        }
      }
    });

    return groupProperties;
  };

  getSearchSchema() {
    const { metaSchema } = this.options || {};

    const { labelCol, wrapperCol } = metaSchema || {};

    return {
      type: 'object',
      properties: {
        formLayout: {
          type: 'void',
          'x-component': 'FormLayout',
          'x-component-props': {
            labelCol: labelCol || 6,
            wrapperCol: wrapperCol || 18,
          },
          properties: this.gridProperties(this.searchColumnsArray),
        },
      },
    };
  }

  private getTableSchema() {
    const code = LIST_FILED_CODE;

    return {
      type: 'object',
      properties: {
        [code]: {
          type: 'array',
          'x-component': 'ListTable',
          properties: this.buttonsSchema(this.buttonsArray, code),
          items: this.arrayItemSchema(
            {
              hasSerialNo: true,
              code,
            },
            this.tableColumnsArray,
            this.tableButtonsArray,
          ),
        },
      },
    };
  }

  getListSchema = (): ListSchema => {
    this.runSchema = RunSchemaEnum.listSchema;
    return {
      searchSchema: this.getSearchSchema(),
      tableSchema: this.getTableSchema(),
      hasCollapsed: this.hasCollapsed,
      searchLogic: this.searchLogic,
      tableLogic: this.tableLogic,
      searchBtnFields: this.searchBtnFields,
      tableBtnFields: this.tableBtnFields,
      searchButtons: this.searchButtonsArray,
      transformsDone: true,
    };
  };

  getFormSchema = (): FormSchema => {
    this.runSchema = RunSchemaEnum.formSchema;

    const { metaSchema, hasGroup } = this.options || {};

    const { labelCol, wrapperCol } = metaSchema || {};

    let properties: {};

    if (hasGroup) {
      properties = this.groupProperties();
    } else {
      properties = this.gridProperties(this.columnsArray);
    }

    const schema = {
      type: 'object',
      ...this.getModeExtraProp(),
      properties: {
        formLayout: {
          type: 'void',
          'x-component': 'FormLayout',
          'x-component-props': {
            labelCol: labelCol || 6,
            wrapperCol: wrapperCol || 18,
          },
          properties,
        },
      },
    };

    return {
      schema,
      buttons: this.buttonsArray,
      logicList: this.logicList,
      btnFields: this.btnFields,
      pattern: this.options.pattern,
      transformsDone: true,
      btnSchema: {
        type: 'void',
        properties: this.buttonsSchema(this.buttonsArray),
      },
    };
  };

  getPropertiesSchema = (prefixField: string): PropertiesSchema => {
    this.runSchema = RunSchemaEnum.propertiesSchema;

    return {
      propertiesSchema: this.gridProperties(this.columnsArray, prefixField),
      buttons: this.buttonsArray,
      logicList: this.logicList,
      btnFields: this.btnFields,
      pattern: this.options.pattern,
      transformsDone: true,
    };
  };
}

export default TransformsSchema;
