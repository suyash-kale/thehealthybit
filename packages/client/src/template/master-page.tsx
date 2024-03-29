import React, { FC, useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Grid,
  Menu,
  MenuItem,
  AppBar,
  Drawer,
  ListItemButton,
} from '@mui/material';
import { Theme, CSSObject, styled } from '@mui/material/styles';
import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

import { useUser } from '../hooks/use-user';
import { PageMessage } from '../atom/page-message';

interface MasterPageType {
  role?: string;
}

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  minHeight: '48px ',
}));

export const MasterPage: FC<MasterPageType> = () => {
  const navigate = useNavigate();

  const { isSignIn, signOut, reSignIn } = useUser();

  const [open, setOpen] = React.useState(true);

  const [loading, setLoading] = useState<boolean>(true);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onSignOut = useCallback(() => {
    signOut();
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    const main = async () => {
      // is case user agreed to remember me, will try to re-sign in.
      if (!isSignIn) {
        await reSignIn();
      }
      setLoading(false);
    };
    main();
  }, [isSignIn, reSignIn]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position='fixed'>
        <Toolbar variant='dense'>
          {isSignIn && (
            <IconButton
              color='inherit'
              onClick={() => setOpen((b) => !b)}
              edge='start'
              sx={{
                marginRight: '26px',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            <FormattedMessage id='APP-NAME' />
          </Typography>
          {isSignIn && (
            <>
              <IconButton
                color='inherit'
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{ mt: '35px' }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                keepMounted
              >
                <MenuItem onClick={onSignOut}>
                  <FormattedMessage id='SIGN-OUT' />
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBarStyled>
      {isSignIn && (
        <DrawerStyled variant='permanent' open={open}>
          <DrawerHeader />
          <Divider />
          <List>
            <Divider />
            <ListItemButton onClick={() => navigate('/meal-plan')}>
              <ListItemIcon>
                <RestaurantIcon />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage id='MEAL-PLAN' />
              </ListItemText>
            </ListItemButton>
            <Divider />
          </List>
        </DrawerStyled>
      )}
      <Box component='main' sx={{ flexGrow: 1, mt: 2, p: 3 }}>
        <DrawerHeader />
        <Container maxWidth={false}>
          <Grid container spacing={2} justifyContent='center'>
            {loading ? (
              <PageMessage title={<FormattedMessage id='RELAX' />}>
                <FormattedMessage id='WE-ARE-GETTING-THINGS-READY' />
              </PageMessage>
            ) : (
              <Outlet />
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
