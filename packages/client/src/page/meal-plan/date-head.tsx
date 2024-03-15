import React, { FC } from 'react';

import { Divider, Typography } from '@mui/material';

interface DateProps {
  day: string;
}

export const DateHead: FC<DateProps> = ({ day }) => {
  return (
    <>
      <Typography variant='h6'>{day}</Typography>
      <Typography variant='body2'>15 Mar 2024</Typography>
      <Divider flexItem />
    </>
  );
};
