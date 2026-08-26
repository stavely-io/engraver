import React, { ButtonHTMLAttributes, FC } from 'react';

import { cn } from '@/lib/utils/style';

interface EngraverMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const EngraverMenuButton: FC<EngraverMenuButtonProps> = ({ selected, className, children, ...buttonProps }) => {
  return (
    <button
      className={cn(
        'text-primary flex h-[30px] w-[30px] items-center justify-center self-center rounded-lg py-[3px]',
        'hover:bg-primary/10 active:bg-primary/20',
        selected && 'bg-cyan-600 text-white hover:bg-cyan-600 active:bg-cyan-700',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
