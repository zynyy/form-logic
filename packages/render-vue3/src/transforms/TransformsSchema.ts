import {
  dotToDashValue,
  ISchema,
  SchemaPattern,
  SchemaPatternEnum,
  SchemaTypes,
  toArray,
} from '@formlogic/render-core-vue3';
import { groupBy, merge, omit } from 'lodash-es';

import {
  AnyObject,
  BtnFieldsItem,
  LogicListItem,
  MetaSchemaData,
  MetaSchemaGroup,
  StrNumBool,
} from '@/interface';
import {
  FormSchema,
  ListSchema,
  Properties,
  PropertiesSchema,
  RunSchemaEnum,
  TransformsSchemaOptions,
  VerificationRecord,
} from '@/transforms/interface';
import MetaDataSorted from '@/transforms/MetaDataSorted';
import { strNumBoolToBoolean, xCompileOmitted } from '@/transforms/utils';
import {
  LIST_FILED_CODE,
  MetaDataTypeEnum,
  OPERATIONS_PROP,
  STEPS_GROUP_MODE,
  TABS_GROUP_MODE,
} from '@/utils/constant';
import { isFunction } from '@/utils/is';

// eslint-disable-next-line
let checkPermission = (authCode: string, record: VerificationRecord) => {
  return true;
};

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

  constructor(op: TransformsSchemaOptions) {
    const { metaSchema, hasGroup } = op || {};
    super(metaSchema, TransformsSchema.permissionVerification, hasGroup);
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

    if (defaultValue === 0) {
      return defaultValue;
    }

    if (defaultValue === '') {
      return undefined;
    }

    return dotToDashValue(defaultValue);
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

  private pushLogic = (item: MetaSchemaData | MetaSchemaGroup, prefixField?: string) => {
    const { logics, code } = item;

    const logicParams: Record<string, any> = {};
    const btnLogicParams: Record<string, any> = {};

    const eventCode = 'eventCode' in item ? item.eventCode : '';

    const type = 'type' in item ? item.type : 'column';

    let field = prefixField ? `${prefixField}.${code}` : code;

    if ('schemaType' in item && item.schemaType === 'void' && item.type === 'column') {
      field = code;
    }

    if ((logics && logics.length) || eventCode) {
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

      const pageCode = this.options?.metaSchema?.code || '';

      const btnRecord: BtnFieldsItem = {
        fieldCode: field,
        clickCodes,
        pageCode,
        type,
        params: btnLogicParams,
      };

      if (this.runSchema === RunSchemaEnum.listSchema) {
        if (clickCodes.length || eventCode) {
          switch (type) {
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
        const record: LogicListItem = {
          fieldCode: fieldCode,
          logicHooks,
          pageCode,
          type,
          params: logicParams,
        };

        if (this.runSchema === RunSchemaEnum.listSchema) {
          if (Object.keys(logicHooks).length) {
            switch (type) {
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

  private baseSchema = (item: MetaSchemaData, index: number): ISchema => {
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
      originCode,
    } = item || {};

    const modeExtraProp = this.getModeExtraProp(strNumBoolToBoolean(disabled));

    const { defaultSearchColumn = 6 } = this.options.metaSchema || {};

    let hiddenBool = strNumBoolToBoolean(hidden);

    const extraData: Record<string, any> = {
      initHidden: hiddenBool,
      initRequired: strNumBoolToBoolean(required),
      originCode,
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

    const { columns } = itemMetaSchema
      ? new MetaDataSorted(itemMetaSchema, TransformsSchema.permissionVerification).result()
      : {
          columns: [],
        };

    const extra: Record<string, any> = {};

    if (component) {
      extra['x-component'] = component;
      extra['x-component-props'] = componentProps;
    }

    return {
      type: 'object',
      'x-data': {
        originCode: item.originCode,
        initHidden: strNumBoolToBoolean(item.hidden),
        initRequired: strNumBoolToBoolean(item.required),
      },
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
    const {
      componentProps,
      component,
      hidden,
      name,
      disabled,
      parentCode,
      type,
      itemMetaSchema,
      originCode,
    } = item || {};

    const defaultComponent = type?.endsWith('button') ? 'Button' : 'Fragment';

    const { button, columns } = itemMetaSchema
      ? new MetaDataSorted(itemMetaSchema, TransformsSchema.permissionVerification).result()
      : {
          button: [],
          columns: [],
        };

    const items = this.voidItemSchema(item, columns, button);

    return {
      type: 'void',
      title: name,
      ...this.getModeExtraProp(disabled),
      'x-hidden': strNumBoolToBoolean(hidden),
      'x-index': index,
      'x-component': component || defaultComponent,
      'x-component-props': componentProps,
      properties: Object.assign({}, properties, items.properties || {}),
      'x-data': {
        parentCode,
        originCode,
      },
      'x-compile-omitted': xCompileOmitted,
    };
  };

  private getValidator = (item: MetaSchemaData) => {
    const { validator } = item;

    return (
      validator?.map((item) => {
        const { validatorRule, validatorRuleValue, triggerType, message } = item || {};

        return {
          validateFirst: true,
          triggerType,
          [validatorRule]:
            !validatorRuleValue && validatorRuleValue !== 0 ? true : validatorRuleValue,
          message,
        };
      }) || []
    );
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
            prefixField ? `${prefixField}.${code}` : code,
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

  private buttonsSchema = (
    buttons: MetaSchemaData[],
    prefixField?: string,
    propertiesCode?: string,
    propertiesProp?: Record<string, any>,
  ) => {
    const properties: Record<string, any> = {};

    const { data, propertiesData } = this.getPropertiesGroups(buttons);

    const defaultField = propertiesCode ?? prefixField?.endsWith('*') ? '' : 'buttons';

    const nowPrefixField = prefixField
      ? `${prefixField}${defaultField ? '.' : ''}${defaultField}`
      : '';

    data.forEach((item, index) => {
      const { code, name } = item;
      const btnProperties = this.voidSchema(item, index);
      const codeProperties = {
        ...btnProperties,
        'x-component-props': {
          ...btnProperties['x-component-props'],
          title: name,
        },
        properties: this.getButtonPropertiesSchema(
          propertiesData,
          code,
          nowPrefixField ? `${nowPrefixField}.${code}` : code,
        ),
      };

      this.pushLogic(item, nowPrefixField);
      properties[code] = codeProperties;
    });

    return {
      [propertiesCode ?? 'buttons']: {
        type: 'void',
        'x-component': 'SpaceButton',
        ...propertiesProp,
        properties,
      },
    };
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
        'x-component': component || 'AgTextEllipsis',
        'x-component-props': componentProps,
        'x-compile-omitted': xCompileOmitted,
      },
    };
  };

  private voidItemSchema = (
    item: Partial<MetaSchemaData>,
    columns: MetaSchemaData[],
    button: MetaSchemaData[],
  ): ISchema => {
    const properties: Record<string, any> = {};

    const prefixField = `${item.code}.`;

    columns.forEach((cur) => {
      const { code } = cur;

      properties[code] = this.itemProperties(cur, prefixField)[code];
    });

    if (button.length) {
      properties[OPERATIONS_PROP] = {
        type: 'void',
        title: '按钮',
        'x-hidden':
          button.filter((item) => strNumBoolToBoolean(item.hidden)).length === button.length,
        properties: this.buttonsSchema(button, prefixField),
      };
    }

    return {
      type: 'void',
      properties,
    };
  };

  private arrayTableItemSchema = (
    item: Partial<MetaSchemaData>,
    tableColumns: MetaSchemaData[],
    tableButton: MetaSchemaData[],
  ): ISchema => {
    const properties: Record<string, any> = {};

    const { hasSerialNo } = item;

    if (strNumBoolToBoolean(hasSerialNo)) {
      properties['serialNo'] = {
        type: 'void',
        title: '序号',
        'x-component': 'Fragment',
        'x-component-props': {
          width: 80,
          maxWidth: 80,
          align: 'center',
          pinned: 'left',
          editable: false,
          suppressSizeToFit: true,
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
      cur.colSpan = 12;
      properties[code] = this.voidSchema(cur, index, this.itemProperties(cur, prefixField));
    });

    if (tableButton.length) {
      properties[OPERATIONS_PROP] = {
        type: 'void',
        title: '操作列',
        'x-hidden':
          tableButton.filter((item) => strNumBoolToBoolean(item.hidden)).length ===
          tableButton.length,
        'x-component': 'Fragment',
        'x-component-props': {
          fixed: 'right',
          editable: false,
        },
        properties: this.buttonsSchema(tableButton, prefixField, OPERATIONS_PROP, {
          'x-component': 'OperationsColumn',
        }),
      };
    }

    return {
      type: 'object',
      properties,
    };
  };

  private arrayItemSchema = (
    item: Partial<MetaSchemaData>,
    tableColumns: MetaSchemaData[],
    tableButton: MetaSchemaData[],
  ): ISchema => {
    if (!item.component || item.component === 'ArrayTable') {
      return this.arrayTableItemSchema(item, tableColumns, tableButton);
    }

    const prefixField = `${item.code}.*`;

    const gridProperties = this.gridProperties(tableColumns, prefixField);

    return {
      type: 'object',
      properties: {
        ...gridProperties,
        [OPERATIONS_PROP]: {
          type: 'void',
          properties: this.buttonsSchema(tableButton, prefixField),
        },
      },
    };
  };

  private arraySchema = (item: MetaSchemaData, index: number): ISchema => {
    const { itemMetaSchema, agDetailMetaSchema, component } = item || {};

    const { button, tableButton, tableColumns } = itemMetaSchema
      ? new MetaDataSorted(itemMetaSchema, TransformsSchema.permissionVerification).result()
      : {
          button: [],
          tableButton: [],
          tableColumns: [],
        };

    const { hasSort } = item;

    const pattern = this.pattern;

    const fieldSchema = this.fieldSchema(item, index);

    const { tableButton: agDetailButton, tableColumns: agDetailColumns } = agDetailMetaSchema
      ? new MetaDataSorted(agDetailMetaSchema, TransformsSchema.permissionVerification).result()
      : {
          tableButton: [],
          tableColumns: [],
        };

    return {
      ...fieldSchema,
      type: 'array',
      'x-component': component || 'ArrayTable',
      'x-component-props': merge({}, fieldSchema['x-component-props'], {
        hasRowDrag: strNumBoolToBoolean(hasSort) && pattern === SchemaPatternEnum.EDITABLE,
      }),
      'x-index': index,
      properties: this.buttonsSchema(button, item.code),
      items: [
        this.arrayItemSchema(item, tableColumns, tableButton),
        this.arrayItemSchema(
          {
            code: `${item.code}.*.${item.componentProps?.childrenListKey || 'children'}`,
            hasSerialNo: item.hasSerialNo,
          },
          agDetailColumns,
          agDetailButton,
        ),
      ],
    };
  };

  private schemaType = (schemaType: SchemaTypes) => {
    if (this.schemaTypeMap.has(schemaType)) {
      return this.schemaTypeMap.get(schemaType);
    }
    return this.voidSchema;
  };

  private groupButtonProperties = (code: string, buttons: MetaSchemaData[], basePath?: string) => {
    if (!buttons.length) {
      return {};
    }

    const path = basePath ? `${basePath}.${code}` : '';

    return {
      [code]: {
        type: 'void',
        ...this.getModeExtraProp(),
        properties: this.buttonsSchema(buttons, path),
      },
    };
  };

  private getProperties = (
    item: MetaSchemaData,
    index: number,
    grids: MetaSchemaData[],
    prefixField?: string,
  ) => {
    const { code, group, hiddenName, component, description, name, schemaType } = item || {};
    const properties = this.schemaType(schemaType)?.(item, index) || {};

    this.pushLogic(item, prefixField);

    const childrenProperties: Record<string, any> = {};

    const children = grids.filter(
      (item) => item.parentCode && item.parentCode === code && item.group === group,
    );

    const isGroupComponent = component === 'FormGroup';

    if (!isGroupComponent && children.length && !properties['x-decorator']) {
      properties['x-decorator'] = 'FormItem';
      properties['x-decorator-props'] = {
        ...this.getItemColProp(item),
        wrapperWrap: true,
        tooltip: description,
        label: name,
        hiddenLabel: strNumBoolToBoolean(hiddenName),
      };
    }

    children.forEach((cur, index) => {
      childrenProperties[cur.code] = this.getProperties(cur, index, grids, prefixField);
    });

    properties.properties = childrenProperties;

    return properties;
  };

  private gridProperties = (grids: MetaSchemaData[], basePath?: string) => {
    const wrapProperties: Record<string, any> = [];

    const { columnLayout } = this.options.metaSchema || {};

    const gridProperties: Record<string, any> = {};
    const objectProperties: Record<string, any> = {};
    const groupProperties: Record<string, any> = {};

    const gridIndex: string[] = [];

    let nextGridWrap = false;

    const replacePath: Record<string, string> = {};
    const replacePathMap: Record<string, string> = {};

    grids
      .filter((item) => !item.parentCode)
      .forEach((item, index) => {
        const { wrap, code, schemaType, component } = item || {};

        const childrenData = this.columnsArray.filter(
          (cur) => cur.parentCode && cur.parentCode === code,
        );

        const isGroupComponent = component === 'FormGroup';

        const nextGrid = isGroupComponent ? grids.concat(childrenData) : grids;

        let flag = 'grid_';

        if (schemaType === 'object') {
          flag = `object_${code}`;
        }

        if (isGroupComponent) {
          flag = `group_${code}`;
        }

        let path = basePath ? `${basePath}.{{${flag}}}` : '';

        if (item.type === 'table_column') {
          path = basePath ?? '';
        }

        replacePath[code] = path;

        const properties = this.getProperties(item, index, nextGrid, path) || {};

        if (schemaType === 'object') {
          const idx = `${flag}`;

          objectProperties[idx] = properties;
          gridIndex.push(idx);

          nextGridWrap = true;
        } else {
          if (properties) {
            if (isGroupComponent) {
              const idx = `${flag}`;

              const groupButtons = this.groupButtonsArray.filter((cur) => {
                return code === cur.parentCode && cur.group === item.group;
              });

              if (groupButtons.length) {
                const groupButtonsProperties = this.groupButtonProperties(
                  'groupButtons',
                  groupButtons.map((item) => {
                    return {
                      ...item,
                      parentCode: '',
                    };
                  }),
                );

                if (properties.properties) {
                  properties.properties = merge(
                    properties.properties ?? {},
                    groupButtonsProperties,
                  );
                }
              }

              groupProperties[idx] = properties;
              gridIndex.push(idx);
              nextGridWrap = true;
            } else {
              if (strNumBoolToBoolean(wrap) || !wrapProperties.length || nextGridWrap) {
                wrapProperties.push({
                  [code]: properties,
                });
                const index = wrapProperties.length - 1;
                gridIndex.push(`${flag}${index || ''}`);
                nextGridWrap = false;
              } else {
                const lastIndex = wrapProperties.length - 1;
                wrapProperties[lastIndex][code] = properties;
              }
            }
          }
        }
      });

    gridIndex.forEach((idx, i) => {
      if (idx.startsWith('grid_')) {
        const index = idx.replace(/^grid_/, '') || 0;

        const gridCode = `grid${index || ''}`;

        const childProperties = wrapProperties[index] || {};

        Object.keys(childProperties).forEach((code) => {
          if (replacePath[code]) {
            const nextCode = `${replacePath[code]}.${code}`;
            replacePathMap[nextCode] = replacePath[code].replace('{{grid_}}', gridCode);
          }
        });

        gridProperties[gridCode] = {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            strictAutoFit: true,
            maxColumns: columnLayout || 3,
            minColumns: 1,
          },
          'x-index': i,
          properties: childProperties,
        };
      } else if (idx.startsWith('object_')) {
        const code = idx.replace(/^object_/, '');

        if (replacePath[code]) {
          const nextCode = `${replacePath[code]}`;
          replacePathMap[nextCode] = replacePath[code].replace(`{{object_${code}}}`, code);
        }

        gridProperties[code] = objectProperties[idx];
      } else if (idx.startsWith('group_')) {
        const code = idx.replace(/^group_/, '');
        gridProperties[code] = groupProperties[idx];
        if (replacePath[code]) {
          const nextCode = replacePath[code];
          replacePathMap[nextCode] = replacePath[code].replace(`{{group_${code}}}`, code);
        }
      }
    });

    Object.keys(replacePathMap).forEach((key) => {
      const path = key.split('.');

      const lastPath = path.pop();

      if (lastPath?.endsWith('}}') && lastPath.startsWith('{{')) {
        path.push(lastPath);
      }

      const pathStr = path.join('.');

      const reg = new RegExp(`^${pathStr}`);

      this.logicList = this.logicList.map((item) => {
        const { fieldCode } = item;

        const nextFieldCode =
          fieldCode.startsWith(key) && pathStr !== replacePathMap[key]
            ? fieldCode.replace(reg, replacePathMap[key])
            : fieldCode;

        return {
          ...item,
          fieldCode: nextFieldCode,
        };
      });
    });

    return gridProperties;
  };

  private tabsGroupProperties = (groupItem: MetaSchemaGroup, basePath?: string): ISchema => {
    const tabsProperties: Record<string, any> = {};

    const { code, modeCodes } = groupItem;

    const { metaSchema } = this.options || {};
    const { group } = metaSchema || {
      group: [],
    };

    [code]
      .concat(modeCodes || '')
      .filter((val) => {
        const groupItem = (group?.find((cur) => cur.code === val) || {}) as MetaSchemaGroup;

        if (groupItem) {
          const { authCode } = groupItem;
          return TransformsSchema.permissionVerification?.(authCode ?? '', groupItem) ?? true;
        }

        return false;
      })
      .forEach((key) => {
        const grids = this.columnsArray.filter((item) => {
          return item.group === key;
        });

        const groupItem = (group?.find((cur) => cur.code === key) || {}) as MetaSchemaGroup;

        const { name, hidden, componentProps, originCode } = groupItem;

        const groupButtons = this.groupButtonsArray.filter((item) => {
          return item.group === key && !item.parentCode;
        });

        this.pushLogic(groupItem, basePath);

        if (grids.length) {
          const path = basePath ? `${basePath}.${key}` : '';
          tabsProperties[key] = {
            type: 'void',
            title: name,
            'x-component': 'FormGroup',
            'x-hidden':
              strNumBoolToBoolean(hidden) ||
              grids.filter((item) => strNumBoolToBoolean(item.hidden)).length === grids.length,
            'x-component-props': {
              code: key,
              ...componentProps,
            },
            'x-data': {
              originCode,
              initHidden: strNumBoolToBoolean(hidden),
            },
            properties: {
              ...this.groupButtonProperties('tabsPaneButtons', groupButtons, path),
              ...this.gridProperties(grids, path),
            },
          };
        }
      });

    return tabsProperties;
  };

  // todo 待开发分步表单
  // eslint-disable-next-line
  private stepGroupProperties = (groupItem: MetaSchemaGroup, basePath?: string): ISchema => {
    return {};
  };

  private groupProperties = (basePath?: string) => {
    const groupProperties: Record<string, any> = {};

    this.groupsOrder.forEach((item) => {
      const { code, name, authCode, hiddenName, mode, originCode, hidden, componentProps } = item;

      const hasTabs = mode === TABS_GROUP_MODE;
      const hasStep = mode === STEPS_GROUP_MODE;

      if (hasTabs) {
        const groupTabCode = `${code}Tabs`;

        const path = basePath ? `${basePath}.${groupTabCode}` : '';

        groupProperties[groupTabCode] = {
          type: 'void',
          'x-component': 'FormTabsGroup',
          'x-component-props': {},
          'x-data': {
            originCode,
            initHidden: strNumBoolToBoolean(hidden),
          },
          properties: this.tabsGroupProperties(item, path),
        };
      } else if (hasStep) {
        const groupStepCode = `${code}Steps`;

        const path = basePath ? `${basePath}.${groupStepCode}` : '';

        groupProperties[groupStepCode] = {
          type: 'void',
          'x-component': 'FormStepGroup',
          'x-component-props': {},
          'x-data': {
            originCode,
            initHidden: strNumBoolToBoolean(hidden),
          },
          properties: this.stepGroupProperties(item, path),
        };
      } else {
        const isVerified = TransformsSchema.permissionVerification?.(authCode ?? '', item) ?? true;

        if (isVerified) {
          const grids = this.columnsArray.filter((item) => {
            return item.group === code;
          });

          const groupButtons = this.groupButtonsArray.filter((item) => {
            return item.group === code;
          });

          if (grids.length) {
            this.pushLogic(item, basePath);

            const path = basePath ? `${basePath}.${code}` : '';

            groupProperties[code] = {
              type: 'void',
              'x-component': item.component || 'FormGroup',
              title: name,
              'x-hidden':
                grids.filter((item) => strNumBoolToBoolean(item.hidden)).length === grids.length,
              'x-component-props': {
                code,
                title: name,
                hiddenName: strNumBoolToBoolean(hiddenName),
                ...componentProps,
              },
              'x-data': {
                originCode,
                initHidden: strNumBoolToBoolean(hidden),
              },
              properties: {
                ...this.groupButtonProperties('groupButtons', groupButtons, path),
                ...this.gridProperties(grids, path),
              },
            };
          }
        }
      }
    });

    return groupProperties;
  };

  getSearchSchema() {
    const { metaSchema } = this.options || {};

    const { labelCol, wrapperCol, columnLayout } = metaSchema || {};

    return {
      type: 'object',
      'x-data': {
        pageCode: metaSchema?.code,
      },
      properties: {
        formLayout: {
          type: 'void',
          'x-component': 'FormLayout',
          'x-component-props': {
            labelCol: labelCol || 6,
            wrapperCol: wrapperCol || 18,
            columnLayout,
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
      'x-data': {
        pageCode: this.options.metaSchema?.code,
      },
      properties: {
        [code]: {
          type: 'array',
          'x-component': 'ListTable',
          properties: this.buttonsSchema(this.buttonsArray, code),
          items: [
            this.arrayItemSchema(
              {
                hasSerialNo: this.options.hasSerialNo,
                code,
              },
              this.tableColumnsArray,
              this.tableButtonsArray,
            ),
            this.arrayItemSchema(
              {
                hasSerialNo: this.options.hasSerialNo,
                code: [code, this.options.detailKey ?? 'children'].join('.'),
              },
              this.detailTableColumnsArray,
              this.detailTableButtonsArray,
            ),
          ],
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

    const formLayout = 'formLayout';

    if (hasGroup) {
      properties = this.groupProperties(formLayout);
    } else {
      properties = this.gridProperties(this.columnsArray, formLayout);
    }

    const schema = {
      type: 'object',
      ...this.getModeExtraProp(),
      'x-data': {
        pageCode: this.options.metaSchema?.code,
      },
      properties: {
        [formLayout]: {
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
      pattern: this.options.pattern || 'EDITABLE',
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
      pattern: this.options.pattern || 'EDITABLE',
      transformsDone: true,
    };
  };

  static registerPermissionVerification = (
    fn: (authCode: string, record: VerificationRecord) => boolean,
  ) => {
    if (isFunction(fn)) {
      checkPermission = fn;
    }
  };

  static readonly permissionVerification = (authCode: string, record: VerificationRecord) => {
    return checkPermission(authCode, record);
  };
}

export default TransformsSchema;
