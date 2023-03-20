import { FC, ReactNode } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

const Container = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
}));

const Progress = styled(LinearProgress)(() => ({
  position: 'absolute',
  width: '100%',
  left: 0,
  top: 0,
}));

type LoadingType = {
  loading?: boolean;
  children: ReactNode;
} & BoxProps;

export const Loading: FC<LoadingType> = ({
  loading = false,
  children,
  ...props
}) => {
  return (
    <Container {...props}>
      {loading && <Progress />}
      {children}
    </Container>
  );
};
