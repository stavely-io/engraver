/* eslint-disable no-magic-numbers */
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

const Sharp: FC<LucideProps> = ({ size = 24, strokeWidth = 1, ...props }) => {
  const sw = Number(strokeWidth);

  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M13.4738 4L13.4738 20.7163' stroke='currentColor' strokeWidth={0.8 * sw} strokeLinecap='round' />
      <path d='M10.4164 4.677L10.4164 21.5999' stroke='currentColor' strokeWidth={0.8 * sw} strokeLinecap='round' />
      <path d='M8.98126 16.5228L15.0188 15.169' stroke='currentColor' strokeWidth={2 * sw} strokeLinecap='round' />
      <path d='M8.98126 10.4308L15.0188 9.07693' stroke='currentColor' strokeWidth={2 * sw} strokeLinecap='round' />
    </svg>
  );
};

export default Sharp;
