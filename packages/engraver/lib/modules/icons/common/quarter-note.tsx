/* eslint-disable no-magic-numbers */
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

const QuarterNote: FC<LucideProps> = ({ size = 24, strokeWidth = 1.6, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M15.2 18.4001C15.2 20.1674 13.7673 21.6001 12 21.6001C10.2327 21.6001 8.79999 20.1674 8.79999 18.4001C8.79999 16.6328 10.2327 15.2001 12 15.2001C13.7673 15.2001 15.2 16.6328 15.2 18.4001Z'
        fill='currentColor'
      />
      <path
        d='M15.2 18.4001C15.2 20.1674 13.7673 21.6001 12 21.6001C10.2327 21.6001 8.79999 20.1674 8.79999 18.4001C8.79999 16.6328 10.2327 15.2001 12 15.2001C13.7673 15.2001 15.2 16.6328 15.2 18.4001ZM15.2 18.4001V5.6001'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default QuarterNote;
