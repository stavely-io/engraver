/* eslint-disable no-magic-numbers */
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

const FirstVoice: FC<LucideProps> = ({ size = 24, strokeWidth = 1.6, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M15.6 10.3999H16.8V14.3999M15.6 14.3999H18'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.4 18.3999C12.4 20.1672 10.9673 21.5999 9.2 21.5999C7.43269 21.5999 6 20.1672 6 18.3999C6 16.6325 7.43269 15.1999 9.2 15.1999C10.9673 15.1999 12.4 16.6325 12.4 18.3999Z'
        fill='currentColor'
      />
      <path
        d='M12.4 18.3999C12.4 20.1672 10.9673 21.5999 9.2 21.5999C7.43269 21.5999 6 20.1672 6 18.3999C6 16.6325 7.43269 15.1999 9.2 15.1999C10.9673 15.1999 12.4 16.6325 12.4 18.3999ZM12.4 18.3999V5.59985'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default FirstVoice;
