import type { FC, HTMLAttributes } from "react";

import { cn } from "../../utils/style";

export const Separator: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div role="separator" className={cn("h-px w-full shrink-0", className)} {...props} />
);
