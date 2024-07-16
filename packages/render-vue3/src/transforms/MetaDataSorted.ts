import { dotToDash } from '@formlogic/render-core-vue3';

import { MetaSchema, MetaSchemaData, MetaSchemaGroup } from '@/interface';
import { VerificationRecord } from '@/transforms/interface';

interface ResultReturn {
  columns: MetaSchemaData[];
  searchColumns: MetaSchemaData[];
  tableColumns: MetaSchemaData[];
  detailTableColumns: MetaSchemaData[];
  button: MetaSchemaData[];
  searchButton: MetaSchemaData[];
  tableButton: MetaSchemaData[];
  detailTableButton: MetaSchemaData[];
  tabButton: MetaSchemaData[];
  tabPaneButton: MetaSchemaData[];
}

class MetaDataSorted {
  private readonly metaSchema: MetaSchema | undefined;
  private readonly hasGroup: boolean = false;

  columnsArray: MetaSchemaData[] = [];

  searchColumnsArray: MetaSchemaData[] = [];

  tableColumnsArray: MetaSchemaData[] = [];
  detailTableColumnsArray: MetaSchemaData[] = [];

  buttonsArray: MetaSchemaData[] = [];
  tabButtonArray: MetaSchemaData[] = [];
  tabPaneButtonArray: MetaSchemaData[] = [];

  searchButtonsArray: MetaSchemaData[] = [];

  tableButtonsArray: MetaSchemaData[] = [];
  detailTableButtonsArray: MetaSchemaData[] = [];

  groupsOrder: MetaSchemaGroup[] = [];
  groupArray: MetaSchemaGroup[] = [];

  groupButtonsArray: MetaSchemaData[] = [];

  private typeMap: Map<string, (item: MetaSchemaData) => void> = new Map();

  private readonly permissionVerification;

  constructor(
    metaSchema: MetaSchema | undefined,
    permissionVerification: (authCode: string, record: VerificationRecord) => boolean,
    hasGroup?: boolean,
  ) {
    this.metaSchema = metaSchema;
    this.hasGroup = !!hasGroup;
    this.permissionVerification = permissionVerification;

    this.typeMap
      .set('column', this.column)
      .set('search_column', this.search_column)
      .set('table_column', this.table_column)
      .set('detail_table_column', this.detail_table_column)
      .set('button', this.button)
      .set('search_button', this.search_button)
      .set('table_button', this.table_button)
      .set('detail_table_button', this.detail_table_button);
  }

  private column = (item: MetaSchemaData) => {
    this.columnsArray.push(item);
  };

  private search_column = (item: MetaSchemaData) => {
    this.searchColumnsArray.push(item);
  };

  private table_column = (item: MetaSchemaData) => {
    this.tableColumnsArray.push(item);
  };

  private detail_table_column = (item: MetaSchemaData) => {
    this.detailTableColumnsArray.push(item);
  };

  private button = (item: MetaSchemaData) => {
    const { group } = item;

    if (this.hasGroup && group) {
      this.groupButtonsArray.push(item);
    } else {
      this.buttonsArray.push(item);
    }
  };

  private search_button = (item: MetaSchemaData) => {
    this.searchButtonsArray.push(item);
  };

  private table_button = (item: MetaSchemaData) => {
    this.tableButtonsArray.push(item);
  };

  private detail_table_button = (item: MetaSchemaData) => {
    this.detailTableButtonsArray.push(item);
  };

  run = () => {
    const { data, group } = this.metaSchema || {};

    data?.forEach((item) => {
      const { type } = item || {};

      const { code, group, parentCode, authCode } = item || {};

      const fn = this.typeMap.get(type);

      const isVerified = this.permissionVerification?.(authCode ?? '', item) ?? true;

      if (fn && isVerified) {
        if (item.componentProps?.targetFiled) {
          item.componentProps.targetField = item.componentProps?.targetFiled;
        }

        fn({
          ...item,
          code: dotToDash(code),
          group: dotToDash(group),
          parentCode: dotToDash(parentCode),
          originCode: code,
        });
      }
    });

    const occupyAllCodes: string[] =
      group
        ?.filter((item) => {
          const { mode } = item || {};
          return !!mode;
        })
        ?.reduce((acc: string[], cur) => {
          const { modeCodes, code } = cur || {};
          return acc.concat(code).concat(modeCodes || []);
        }, [])
        .filter((val) => val) || [];

    this.groupsOrder =
      group
        ?.filter((item) => {
          const { mode, code } = item || {};
          return !occupyAllCodes.includes(code) || !!mode;
        })
        .map((item) => {
          const { code } = item || {};
          return {
            ...item,
            code: dotToDash(code),
            originCode: code,
          };
        }) || [];
  };

  result = (): ResultReturn => {
    this.run();
    return {
      columns: this.columnsArray,
      searchColumns: this.searchColumnsArray,
      tableColumns: this.tableColumnsArray,
      detailTableColumns: this.detailTableColumnsArray,
      button: this.buttonsArray,
      searchButton: this.searchButtonsArray,
      tableButton: this.tableButtonsArray,
      detailTableButton: this.detailTableButtonsArray,
      tabButton: this.tabButtonArray,
      tabPaneButton: this.tabPaneButtonArray,
    };
  };
}

export default MetaDataSorted;
