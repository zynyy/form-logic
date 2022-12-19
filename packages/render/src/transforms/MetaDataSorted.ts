import { MetaSchema, MetaSchemaData, MetaSchemaGroup } from '@/interface';
import { strNumBoolToBoolean } from '@/transforms/utils';

interface ResultReturn {
  columns: MetaSchemaData[];
  searchColumns: MetaSchemaData[];
  tableColumns: MetaSchemaData[];
  button: MetaSchemaData[];
  searchButton: MetaSchemaData[];
  tableButton: MetaSchemaData[];
}

class MetaDataSorted {
  private metaSchema: MetaSchema;

  columnsArray: MetaSchemaData[] = [];

  searchColumnsArray: MetaSchemaData[] = [];

  tableColumnsArray: MetaSchemaData[] = [];

  buttonsArray: MetaSchemaData[] = [];

  searchButtonsArray: MetaSchemaData[] = [];

  tableButtonsArray: MetaSchemaData[] = [];

  groupsOrder: MetaSchemaGroup[];

  constructor(metaSchema: MetaSchema) {
    this.metaSchema = metaSchema;
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
    this.buttonsArray.push(item);
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
          const { hasStep, hasTabs } = item || {};
          return strNumBoolToBoolean(hasStep) || strNumBoolToBoolean(hasTabs);
        })
        ?.reduce((acc, cur) => {
          const { tabs, code, steps } = cur || {};
          return acc.concat(code).concat(tabs).concat(steps);
        }, [])
        .filter((val) => val) || [];

    this.groupsOrder =
      group?.filter((item) => {
        const { hasStep, hasTabs, code } = item || {};
        return (
          !occupyAllCodes.includes(code) ||
          strNumBoolToBoolean(hasStep) ||
          strNumBoolToBoolean(hasTabs)
        );
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
