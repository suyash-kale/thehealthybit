import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RouterAnimationXProps {
  children: ReactNode;
}

export const RouterAnimationX: FC<RouterAnimationXProps> = ({ children }) => (
  <motion.div
    style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    }}
    variants={{
      hidden: {
        opacity: 0,
        x: '60px',
      },
      visible: {
        opacity: 1,
        x: '0px',
        transition: {
          duration: 0.4,
        },
      },
      exit: {
        opacity: 0,
        x: '-60px',
        transition: {
          duration: 0.2,
        },
      },
    }}
    exit='exit'
    initial='hidden'
    animate='visible'
  >
    {children}
  </motion.div>
);
