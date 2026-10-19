import React, { type FC } from "react";

import { cn } from "../../utils/style";

export const DisabledOverlay: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-muted/40 dark:bg-accent/90 pointer-events-auto absolute z-20 flex h-full w-full items-center justify-center rounded-lg",
        className,
      )}
      {...props}
    />
  );
};
