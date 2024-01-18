import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RouterAnimationProps {
  children: ReactNode;
}

export const RouterAnimation: FC<RouterAnimationProps> = ({ children }) => (
  <motion.div
    style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    }}
    variants={{
      hidden: {
        opacity: 0,
        y: '60px',
      },
      visible: {
        opacity: 1,
        y: '0px',
        transition: {
          duration: 0.4,
        },
      },
      exit: {
        opacity: 0,
        y: '-60px',
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
