import React from 'react';

import { Button, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const AddMealType = () => {
  return (
    <Tooltip title='Add Meal Type' placement='top'>
      <Button
        variant='contained'
        size='small'
        style={{ width: 'auto', minWidth: 'auto' }}
      >
        <AddIcon />
      </Button>
    </Tooltip>
  );
};
