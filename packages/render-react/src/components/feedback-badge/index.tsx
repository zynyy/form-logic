import { observer, useField,SchemaKey } from '@formily/react';
import { Badge } from 'antd';
import React, { FC, PropsWithChildren } from 'react';


interface FeedbackBadgeProps extends PropsWithChildren {
  name?: SchemaKey;
}

const FeedbackBadge: FC<FeedbackBadgeProps> = observer(({ name, children }) => {
  const field = useField();

  const errors = field.form.queryFeedbacks({
    type: 'error',
    address: `${name ? field.address.concat(name) : field.address}`,
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
