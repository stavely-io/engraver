import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import "./separator.css";

export const Separator: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div role="separator" className={clsx("engraver-separator", className)} {...props} />
);
