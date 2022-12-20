import { forwardRef, useEffect, useRef, useState } from 'react';
import { LogicConfig, MetaSchema } from '@/interface';
import { IFormProps } from '@formily/core';
import { useBindLogic, useListSchema } from '@/hooks';
import { Skeleton } from 'antd';

import ListNormal, { ListNormalProps, ListNormalRef } from '@/list-normal';

import { getPageConfigDetail } from '@/service';
import { TransformsSchemaOptions } from '@/transforms';

export interface ListLayoutProps
  extends Pick<
    ListNormalProps,
    'extraSearchParams' | 'transformSearchParams' | 'onSearchMount' | 'onTableMount'
  > {
  metaSchema?: MetaSchema;
  searchFormConfig?: IFormProps;
  pageCode?: string;
  action: string;
  getLogicConfig?: LogicConfig;
  extraLogicParams?: {
    [key: string]: any;
  };
}

export interface ListLayoutRef {}

const ListLayout = forwardRef<ListLayoutRef, ListLayoutProps>(
  (
    {
      metaSchema,
      pageCode,
      searchFormConfig,
      action,
      getLogicConfig,
      extraLogicParams,
      extraSearchParams,
      transformSearchParams,
      onSearchMount,
      onTableMount,
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);

    const [options, setOptions] = useState<TransformsSchemaOptions | undefined>(undefined);

    const listSchema = useListSchema(options);

    const { searchSchema, tableSchema, hasCollapsed, searchLogic, tableLogic } = listSchema;

    const listNormalRef = useRef<ListNormalRef>();

    const [searchDone] = useBindLogic(
      listNormalRef.current?.searchForm,
      searchSchema,
      searchLogic,
      getLogicConfig,
      extraLogicParams,
      () => {},
    );

    const [tableDone] = useBindLogic(
      listNormalRef.current?.dataTableForm,
      tableSchema,
      tableLogic,
      getLogicConfig,
      extraLogicParams,
      () => {},
    );

    useEffect(() => {
      if (pageCode) {
        setLoading(true);
        getPageConfigDetail({
          pageCode,
        })
          .then((res) => {
            const { data } = res || {};
            setOptions({
              metaSchema: data,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [pageCode]);

    useEffect(() => {
      if (metaSchema) {
        setOptions({
          metaSchema,
        });
      }
    }, [metaSchema]);


    return (
      <>
        <Skeleton loading={loading}>
          <ListNormal
            searchSchema={searchDone ? searchSchema : undefined}
            tableSchema={tableDone ? tableSchema : undefined}
            searchFormConfig={searchFormConfig}
            hasCollapsed={hasCollapsed}
            action={action}
            ref={listNormalRef}
            extraSearchParams={extraSearchParams}
            transformSearchParams={transformSearchParams}
            onSearchMount={onSearchMount}
            onTableMount={onTableMount}
          />
        </Skeleton>
      </>
    );
  },
);

export default ListLayout;
