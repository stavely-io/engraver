/* eslint-disable no-magic-numbers */
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

const DoubleDottedNote: FC<LucideProps> = ({ size = 24, strokeWidth = 1.6, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M11.85 18.4001C11.85 20.1674 10.4173 21.6001 8.65001 21.6001C6.8827 21.6001 5.45001 20.1674 5.45001 18.4001C5.45001 16.6328 6.8827 15.2001 8.65001 15.2001C10.4173 15.2001 11.85 16.6328 11.85 18.4001Z'
        fill='currentColor'
      />
      <path
        d='M11.85 18.4001C11.85 20.1674 10.4173 21.6001 8.65001 21.6001C6.8827 21.6001 5.45001 20.1674 5.45001 18.4001C5.45001 16.6328 6.8827 15.2001 8.65001 15.2001C10.4173 15.2001 11.85 16.6328 11.85 18.4001ZM11.85 18.4001V5.6001'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='14.45' cy='18.8001' r='1.2' fill='currentColor' />
      <circle cx='17.35' cy='18.8001' r='1.2' fill='currentColor' />
    </svg>
  );
};

export default DoubleDottedNote;
