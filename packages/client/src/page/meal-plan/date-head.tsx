import React, { FC } from 'react';
import { Divider, Typography } from '@mui/material';

interface DateProps {
  date: Date;
}

export const DateHead: FC<DateProps> = ({ date }) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.toLocaleString('default', { year: '2-digit' });
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <>
      <Typography variant='h6'>{days[date.getDay()]}</Typography>
      <Typography variant='body2'>{`${day} ${month} ${year}`}</Typography>
      <Divider flexItem />
    </>
  );
};
