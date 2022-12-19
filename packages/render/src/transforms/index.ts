import { MetaSchema, MetaSchemaData, MetaSchemaGroup, SchemaMode, StrNumBool } from '@/interface';
import MetaDataSorted from '@/transforms/MetaDataSorted';
import { ISchema } from '@formily/json-schema';
import { strNumBoolToBoolean } from '@/transforms/utils';

import { MouseEvent } from 'react';

export interface TransformsSchemaOptions {
  metaSchema: MetaSchema;
  schemaMode?: SchemaMode;
  hasGroup?: boolean;
  buttonsEvent?: {
    [key: string]: (e: MouseEvent<HTMLElement>) => void;
  };
  logic?: {
    [key: string]: {
      dsl: {
        "cells": {
          id: string;
        }
      },
      nodeFns: {
        [key: string]: () => void | any
      },
    }
  }
}

export interface ListSchema {
  searchSchema: ISchema;
  tableSchema: ISchema;
  hasCollapsed: boolean;
}

export interface FormSchema {
  schema: ISchema;
  buttons: MetaSchemaData[];
}

class TransformsSchema extends MetaDataSorted {
  private options: TransformsSchemaOptions;
  private hasCollapsed = false;

  private schemaTypeMap: Map<string, (item: MetaSchemaData, index: number) => ISchema> = new Map();

  constructor(op: TransformsSchemaOptions) {
    const { metaSchema } = op;
    super(metaSchema);
    this.options = op;
    this.schemaTypeMap
      .set('string', this.fieldSchema)
      .set('void', this.voidSchema)
      .set('array', this.arraySchema);

    this.run();
  }

  private getDefaultValue = (item: MetaSchemaData) => {
    const { defaultValue } = item || {};
    return defaultValue;
  };

  private getModeExtraProp = (disabled?: StrNumBool) => {
    const mode = this.options.schemaMode;
    switch (mode) {
      case 'EDITABLE': {
        return {
          'x-pattern': 'editable',
          'x-editable': true,
          'x-disabled': strNumBoolToBoolean(disabled),
        };
      }
      case 'DETAIL': {
        return {
          'x-pattern': 'readOnly',
          'x-read-only': true,
        };
      }
      case 'DISABLED': {
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

  private baseSchema = (item: MetaSchemaData, index): ISchema => {
    const {
      description,
      required,
      componentProps,
      component,
      hidden,
      validator,
      name,
      disabled,
      hiddenName,
      type,
    } = item || {};

    const modeExtraProp = this.getModeExtraProp(strNumBoolToBoolean(disabled));

    const defaultValue = this.getDefaultValue(item);

    const { defaultSearchColumn } = this.options.metaSchema || {};

    let hiddenBool = strNumBoolToBoolean(hidden);

    const extraData = {
      initHidden: hiddenBool,
    };

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
      description,
      default: defaultValue,
      ...modeExtraProp,
      'x-hidden': hiddenBool,
      'x-validator': validator,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        feedbackLayout: 'popover',
        ...this.getItemColProp(item),
        wrapperWrap: true,
        tooltip: description,
        label: name,
        hiddenLabel: strNumBoolToBoolean(hiddenName),
      },
      'x-component': component,
      'x-component-props': componentProps,
      'x-data': extraData,
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

  private voidSchema = (item: MetaSchemaData, properties?): ISchema => {
    const { componentProps, component, hidden, name, disabled } = item || {};

    return {
      type: 'void',
      title: name,
      ...this.getModeExtraProp(disabled),
      'x-hidden': strNumBoolToBoolean(hidden),
      'x-component': component || 'Fragment',
      'x-component-props': componentProps,
      properties: properties,
    };
  };

  private buttonsSchema = (buttons: MetaSchemaData[]) => {
    const properties = {};

    buttons.forEach((item) => {
      const { code, name } = item;
      const btnProperties = this.voidSchema(item);
      properties[code] = {
        ...btnProperties,
        'x-component-props': {
          ...btnProperties['x-component-props'],
          title: name,
        },
      };
    });

    return properties;
  };

  private itemProperties = (item: MetaSchemaData): ISchema => {
    const {
      description,
      required,
      componentProps,
      hidden,
      validator,
      name,
      disabled,
      component,
      code,
      schemaType,
    } = item || {};

    const modeExtraProp = this.getModeExtraProp(strNumBoolToBoolean(disabled));

    const defaultValue = this.getDefaultValue(item);

    return {
      [code]: {
        type: schemaType,
        title: name,
        required: strNumBoolToBoolean(required),
        description,
        default: defaultValue,
        ...modeExtraProp,
        'x-hidden': strNumBoolToBoolean(hidden),
        'x-validator': validator,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          feedbackLayout: 'popover',
          ...this.getItemColProp(item),
          wrapperWrap: true,
          tooltip: description,
          label: name,
          hiddenLabel: true,
        },
        'x-component': component || 'ArrayBase.PreviewText',
        'x-component-props': componentProps,
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

    if (strNumBoolToBoolean(hasSort)) {
      properties['dragSort'] = {
        type: 'void',
        title: '排序',
        'x-component': 'Fragment',
        'x-component-props': {
          width: 50,
          align: 'center',
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

    tableColumns.forEach((item) => {
      const { code } = item;

      properties[code] = this.voidSchema(item, this.itemProperties(item));
    });

    if (tableButton.length) {
      properties['operations'] = {
        type: 'void',
        title: '操作列',
        'x-hidden':
          tableButton.filter((item) => strNumBoolToBoolean(item.hidden)).length ===
          tableButton.length,
        'x-component': 'Fragment',
        properties: {
          operations: {
            type: 'void',
            'x-component': 'Space',
            properties: this.buttonsSchema(tableButton),
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
      properties: this.buttonsSchema(button),
      items: this.arrayItemSchema(item, tableColumns, tableButton),
    };
  };

  private schemaType = (schemaType) => {
    if (this.schemaTypeMap.has(schemaType)) {
      return this.schemaTypeMap.get(schemaType);
    }
    return this.voidSchema;
  };

  private gridProperties = (grids: MetaSchemaData[]) => {
    const wrapProperties = [];

    const { columnLayout } = this.options.metaSchema;

    grids.forEach((item, index) => {
      const { wrap, code, schemaType } = item || {};

      const lastIndex = wrapProperties.length - 1;

      const properties = this.schemaType(schemaType)(item, index);

      if (properties) {
        if (strNumBoolToBoolean(wrap) || lastIndex === -1) {
          wrapProperties.push({
            [code]: properties,
          });
        } else {
          wrapProperties[lastIndex][code] = properties;
        }
      }
    });

    const gridProperties = {};

    wrapProperties.forEach((properties, key) => {
      gridProperties[`grid${key ? key : ''}`] = {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          strictAutoFit: true,
          maxColumns: columnLayout || 3,
          minColumns: 1,
        },
        properties: wrapProperties[key] || {},
      };
    });

    return gridProperties;
  };

  private tabsGroupProperties = (groupItem: MetaSchemaGroup): ISchema => {
    const tabsProperties = {};

    const { code, tabs } = groupItem;

    const { metaSchema } = this.options || {};
    const { group } = metaSchema || {};

    [code]
      .concat(tabs)
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

  private stepGroupProperties = (groupItem: MetaSchemaGroup): ISchema => {
    return {};
  };

  private groupProperties = () => {
    const groupProperties = {};

    this.groupsOrder.forEach((item) => {
      const { code, name, hiddenName, hasStep, hasTabs } = item;

      if (strNumBoolToBoolean(hasTabs)) {
        groupProperties[`${code}Tabs`] = {
          type: 'void',
          'x-component': 'FormTabsGroup',
          'x-component-props': {},
          properties: this.tabsGroupProperties(item),
        };
      } else if (strNumBoolToBoolean(hasStep)) {
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
            properties: this.gridProperties(grids),
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
    return {
      type: 'object',
      properties: {
        dataSource: {
          type: 'array',
          'x-component': 'ListTable',
          properties: this.buttonsSchema(this.buttonsArray),
          items: this.arrayItemSchema(
            {
              hasSerialNo: true,
            },
            this.tableColumnsArray,
            this.tableButtonsArray,
          ),
        },
      },
    };
  }

  getListSchema = (): ListSchema => {
    return {
      searchSchema: this.getSearchSchema(),
      tableSchema: this.getTableSchema(),
      hasCollapsed: this.hasCollapsed,
    };
  };

  getFormSchema = (): FormSchema => {
    const { metaSchema, hasGroup } = this.options || {};

    const { labelCol, wrapperCol } = metaSchema || {};

    let properties = {};

    if (hasGroup) {
      properties = this.groupProperties();
    } else {
      properties = this.gridProperties(this.columnsArray);
    }

    return {
      schema: {
        type: 'object',
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
      },
      buttons: this.buttonsArray,
    };
  };
}

export default TransformsSchema;
