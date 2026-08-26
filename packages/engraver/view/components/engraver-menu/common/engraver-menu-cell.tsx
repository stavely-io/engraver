import { FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/style';

export const EngraverMenuCell: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={cn('border-muted-foreground flex flex-row gap-[6px] border-r px-[6px] py-[5px]', className)}
    >
      {children}
    </div>
  );
};
