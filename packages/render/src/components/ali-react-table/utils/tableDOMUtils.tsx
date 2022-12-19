// 表格 DOM 结构
// div.art-art-table-wrapper
// └── div.art-loading-wrapper
//     ├── div.art-loading-indicator-wrapper
//     │   └── div.art-loading-indicator
//     │
//     └── div.art-loading-content-wrapper
//         ├── div.art-art-table
//         │   │
//         │   ├── div.art-art-table-header
//         │   │  └── art-table
//         │   │      ├── colgroup
//         │   │      └── thead  注意这里会出现自定义内容，可能存在嵌套表格
//         │   │
//         │   ├── div.art-art-table-body
//         │   │   ├── div.art-virtual-blank.top
//         │   │   ├── art-table
//         │   │   │   ├── colgroup
//         │   │   │   └── tbody 注意这里会出现自定义内容，可能存在嵌套表格
//         │   │   └── div.art-virtual-blank.bottom
//         │   │
//         │   ├── div.art-art-table-footer
//         │   │  └── art-table
//         │   │      ├── colgroup
//         │   │      └── tfoot  注意这里会出现自定义内容，可能存在嵌套表格
//         │   │
//         │   ├── div.art-lock-shadow-mask
//         │   │   └── div.art-left-lock-shadow
//         │   └── div.art-lock-shadow-mask
//         │       └── div.art-right-lock-shadow
//         │
//         └── div.art-sticky-scroll
//             └── div.art-sticky-scroll-item
//
// 在「可能存在嵌套表格」的情况下，我们可以采用以下的方式来避免「querySelector 不小心获取到了的嵌套表格上的元素」：
//  artTable.querySelector(':scope > .art-lock-shadow-mask .art-left-lock-shadow')

// 表格 DOM 结构辅助工具
class TableDOMHelper {
  readonly artTableWrapper: HTMLDivElement;
  readonly artTable: HTMLDivElement;
  readonly tableHeader: HTMLDivElement;
  readonly tableBody: HTMLDivElement;
  readonly tableFooter: HTMLDivElement;

  readonly stickyScroll: HTMLDivElement;
  readonly stickyScrollItem: HTMLDivElement;

  constructor(artTableWrapper: HTMLDivElement) {
    this.artTableWrapper = artTableWrapper;
    this.artTable = artTableWrapper.querySelector<HTMLDivElement>(':scope  .art-table');

    this.tableHeader = this.artTable.querySelector(`:scope  .art-table-header`);
    this.tableBody = this.artTable.querySelector(`:scope  .art-table-body`);
    this.tableFooter = this.artTable.querySelector(`:scope  .art-table-footer`);

    const stickyScrollSelector = `:scope   .art-table + .art-sticky-scroll`;
    this.stickyScroll = artTableWrapper.querySelector<HTMLDivElement>(stickyScrollSelector);
    this.stickyScrollItem = this.stickyScroll.querySelector(`:scope  .art-sticky-scroll-item`);
  }
  getVirtualTop = (): HTMLDivElement => {
    return this.tableBody.querySelector<HTMLDivElement>(`.art-virtual-blank .top`);
  };

  getTableRows = (): NodeListOf<HTMLTableRowElement> => {
    const htmlTable = this.getTableBodyHtmlTable();
    return htmlTable.querySelectorAll<HTMLTableRowElement>(`:scope > tbody > .art-table-row`);
  };

  getTableBodyHtmlTable = (): HTMLTableElement => {
    return this.artTable.querySelector(`.art-table-body table`);
  };

  getLeftLockShadow = (): HTMLDivElement => {
    const selector = `:scope > .art-lock-shadow-mask .art-left-lock-shadow`;
    return this.artTable.querySelector<HTMLDivElement>(selector);
  };

  getRightLockShadow = (): HTMLDivElement => {
    const selector = `:scope > .art-lock-shadow-mask .art-right-lock-shadow`;
    return this.artTable.querySelector<HTMLDivElement>(selector);
  };

  getLoadingIndicator = (): HTMLDivElement => {
    return this.artTableWrapper.querySelector<HTMLDivElement>(`.art-loading-indicator`);
  };
}

export default TableDOMHelper;
