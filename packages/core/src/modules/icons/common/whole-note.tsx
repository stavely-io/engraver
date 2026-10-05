/* eslint-disable no-magic-numbers */
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

const WholeNote: FC<LucideProps> = ({ size = 24, strokeWidth = 1.6, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M12 21.6002C13.7673 21.6002 15.2 20.1675 15.2 18.4002C15.2 16.6329 13.7673 15.2002 12 15.2002C10.2327 15.2002 8.79999 16.6329 8.79999 18.4002C8.79999 20.1675 10.2327 21.6002 12 21.6002Z'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default WholeNote;
