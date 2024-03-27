import React, { FC } from 'react';
import { Divider, Typography } from '@mui/material';

import { formatDate, formatDay } from '../../utility/date';

interface DateProps {
  date: Date;
}

export const DateHead: FC<DateProps> = ({ date }) => {
  return (
    <>
      <Typography variant='h6'>{formatDay(date)}</Typography>
      <Typography variant='body2'>{formatDate(date)}</Typography>
      <Divider flexItem />
    </>
  );
};
