/* eslint-disable no-magic-numbers */
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

const TripleDottedNote: FC<LucideProps> = ({ size = 24, strokeWidth = 1.6, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M10.3812 18.4001C10.3812 20.1674 8.94851 21.6001 7.1812 21.6001C5.41389 21.6001 3.9812 20.1674 3.9812 18.4001C3.9812 16.6328 5.41389 15.2001 7.1812 15.2001C8.94851 15.2001 10.3812 16.6328 10.3812 18.4001Z'
        fill='currentColor'
        strokeWidth={strokeWidth}
      />
      <path
        d='M10.3812 18.4001C10.3812 20.1674 8.94851 21.6001 7.1812 21.6001C5.41389 21.6001 3.9812 20.1674 3.9812 18.4001C3.9812 16.6328 5.41389 15.2001 7.1812 15.2001C8.94851 15.2001 10.3812 16.6328 10.3812 18.4001ZM10.3812 18.4001V5.6001'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='12.9812' cy='18.8001' r='1.2' fill='currentColor' />
      <circle cx='15.8813' cy='18.8001' r='1.2' fill='currentColor' />
      <circle cx='18.8188' cy='18.8001' r='1.2' fill='currentColor' />
    </svg>
  );
};

export default TripleDottedNote;
