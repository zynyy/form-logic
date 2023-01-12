import { MetaSchema, MetaSchemaData, MetaSchemaGroup } from '@/interface';

interface ResultReturn {
  columns: MetaSchemaData[];
  searchColumns: MetaSchemaData[];
  tableColumns: MetaSchemaData[];
  button: MetaSchemaData[];
  searchButton: MetaSchemaData[];
  tableButton: MetaSchemaData[];
}

class MetaDataSorted {
  private readonly metaSchema: MetaSchema;
  private readonly hasGroup: boolean = false;

  columnsArray: MetaSchemaData[] = [];

  searchColumnsArray: MetaSchemaData[] = [];

  tableColumnsArray: MetaSchemaData[] = [];

  buttonsArray: MetaSchemaData[] = [];

  searchButtonsArray: MetaSchemaData[] = [];

  tableButtonsArray: MetaSchemaData[] = [];

  groupsOrder: MetaSchemaGroup[] = [];

  groupButtonsArray: MetaSchemaData[] = [];

  constructor(metaSchema: MetaSchema, hasGroup?: boolean) {
    this.metaSchema = metaSchema;
    this.hasGroup = hasGroup;
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

  run = () => {
    const { data, group } = this.metaSchema || {};

    data?.forEach((item) => {
      const { type } = item || {};
      this[type]?.(item);
    });

    const occupyAllCodes =
      group
        ?.filter((item) => {
          const { mode } = item || {};
          return !!mode;
        })
        ?.reduce((acc, cur) => {
          const { modeCodes, code } = cur || {};
          return acc.concat(code).concat(modeCodes);
        }, [])
        .filter((val) => val) || [];

    this.groupsOrder =
      group?.filter((item) => {
        const { mode, code } = item || {};
        return !occupyAllCodes.includes(code) || !!mode;
      }) || [];
  };

  result = (): ResultReturn => {
    this.run();
    return {
      columns: this.columnsArray,
      searchColumns: this.searchColumnsArray,
      tableColumns: this.tableColumnsArray,
      button: this.buttonsArray,
      searchButton: this.searchButtonsArray,
      tableButton: this.tableButtonsArray,
    };
  };
}

export default MetaDataSorted;
