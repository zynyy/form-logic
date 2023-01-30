import { Button } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';

import { sortBy } from 'lodash-es';
import { getFormValues, toArray, useForm, isField } from '@formlogic/render';
import { FC } from 'react';

export interface PageSortButtonProps {}

const PageSortButton: FC<PageSortButtonProps> = () => {
  const form = useForm();

  const handleClick = () => {
    getFormValues(form).then((formValues) => {
      const { data, group } = formValues;

      const groups = toArray(group);

      form.query('data').take((target) => {
        if (isField(target)) {
          target
            .onInput(
              sortBy(
                data,
                (item) => {
                  const { group } = item;
                  return groups.findIndex((cur) => cur.code === group);
                },
                'type',
              ),
            )
            .then(() => void 0);
        }
      });
    });
  };

  return (
    <Button icon={<SortAscendingOutlined />} onClick={handleClick}>
      排序
    </Button>
  );
};

export default PageSortButton;
