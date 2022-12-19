import { observer, useField } from '@formily/react';
import { Badge } from 'antd';
import React, { FC, PropsWithChildren } from 'react';
import { SchemaKey } from '@formily/json-schema';

interface FeedbackBadgeProps extends PropsWithChildren {
  name: SchemaKey;
}

const FeedbackBadge: FC<FeedbackBadgeProps> = observer(({ name, children }) => {
  const field = useField();

  const errors = field.form.queryFeedbacks({
    type: 'error',
    address: `${field.address.concat(name)}.*`,
  });

  if (errors.length) {
    return (
      <Badge size="small" className="errors-badge" count={errors.length}>
        {children}
      </Badge>
    );
  }

  return <>{children}</>;
});

export default FeedbackBadge;
