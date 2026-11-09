import clsx from "clsx";
import { type FC, type HTMLAttributes } from "react";

import "./engraver-menu-cell.css";

export const EngraverMenuCell: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={clsx("engraver-menu-cell", className)}>
      {children}
    </div>
  );
};
