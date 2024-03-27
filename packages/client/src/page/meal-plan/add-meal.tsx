import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField as TextFieldMaterial,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LeftIcon from '@mui/icons-material/ChevronLeft';

import { MealTypeState } from '../../state/meal-type';
import { MealType } from '../../types/meal-type';
import { formatDate, formatDay } from '../../utility/date';

// Add meal/ show meal detail component
export const AddMeal: FC = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const { d, m } = useParams<{ d: string; m: string }>();

  const mealTypes = useRecoilValue(MealTypeState);

  const [date, setDate] = useState<Date>();

  const [mealType, setMealType] = useState<MealType>();

  const [open, setOpen] = useState<boolean>(false);

  const onGoBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    if (state?.date || d) {
      setDate(new Date(state?.date || d));
    }
    if (state?.mealType) {
      setMealType(state?.mealType);
    } else if (m) {
      setMealType(mealTypes.find((meal) => meal.label === m));
    }
  }, [state, d, m]);

  return (
    <Grid item xl={8} md={8} sm={12}>
      <Dialog open={open}>
        <DialogTitle>Add Meal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={[]}
                renderInput={(params) => <TextFieldMaterial {...params} />}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Unit</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={null}
                  label='Age'
                >
                  <MenuItem value='grams'>Grams</MenuItem>
                  <MenuItem value='cups'>Cups</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextFieldMaterial />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type='submit'>Submit</Button>
        </DialogActions>
      </Dialog>
      <Grid container justifyContent='space-between' alignItems='flex-start'>
        <Grid xs='auto' item>
          <IconButton
            type='button'
            style={{ float: 'left' }}
            onClick={onGoBack}
          >
            <LeftIcon fontSize='large' />
          </IconButton>
        </Grid>
        <Grid xs item>
          <Typography variant='h3' align='center'>
            <FormattedMessage id='ADD-MEAL-PLAN' />
          </Typography>
          <Typography variant='body2' align='center' sx={{ mb: 3 }}>
            {date && `${formatDay(date)}, ${formatDate(date)}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container mb={1} justifyContent='space-between'>
        <Grid xs={6} item>
          <Paper
            component='form'
            sx={{
              display: 'flex',
              width: '100%',
              pl: 1,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder='Search'
              size='small'
            />
            <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            size='large'
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            <FormattedMessage id='ADD' />
          </Button>
        </Grid>
      </Grid>
      <Paper
        sx={{
          p: 1,
          mb: 1,
        }}
      >
        <Grid
          justifyContent='space-between'
          alignItems='center'
          direction='row'
          container
        >
          <Grid item>
            <Grid spacing={2} alignItems='center' container>
              <Grid mr={6} item>
                <Typography variant='subtitle1'>Curd</Typography>
                <Typography variant='body2'>200 grams</Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle2'>1</Typography>
                <Typography variant='body2'>Protein</Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle2'>1</Typography>
                <Typography variant='body2'>Fats</Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle2'>1</Typography>
                <Typography variant='body2'>Carbs</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton aria-label='delete'>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
