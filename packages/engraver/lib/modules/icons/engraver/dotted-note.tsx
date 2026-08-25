/* eslint-disable no-magic-numbers */
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

const DottedNote: FC<LucideProps> = ({ size = 24, strokeWidth = 1.6, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M13.3 18.4001C13.3 20.1674 11.8673 21.6001 10.1 21.6001C8.33265 21.6001 6.89996 20.1674 6.89996 18.4001C6.89996 16.6328 8.33265 15.2001 10.1 15.2001C11.8673 15.2001 13.3 16.6328 13.3 18.4001Z'
        fill='currentColor'
      />
      <path
        d='M13.3 18.4001C13.3 20.1674 11.8673 21.6001 10.1 21.6001C8.33265 21.6001 6.89996 20.1674 6.89996 18.4001C6.89996 16.6328 8.33265 15.2001 10.1 15.2001C11.8673 15.2001 13.3 16.6328 13.3 18.4001ZM13.3 18.4001V5.6001'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='15.9' cy='18.8001' r='1.2' fill='currentColor' />
    </svg>
  );
};

export default DottedNote;
