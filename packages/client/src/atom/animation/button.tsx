import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonAnimationProps {
  children: ReactNode;
}

export const ButtonAnimation: FC<ButtonAnimationProps> = ({ children }) => (
  <motion.div
    style={{
      display: 'inline-block',
    }}
    variants={{
      hidden: {
        opacity: 0,
        x: '-20px',
      },
      visible: {
        opacity: 1,
        x: '0px',
        transition: {
          duration: 0.5,
        },
      },
    }}
    initial='hidden'
    animate='visible'
  >
    {children}
  </motion.div>
);
