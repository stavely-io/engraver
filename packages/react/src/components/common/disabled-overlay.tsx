import clsx from "clsx";
import React, { type FC } from "react";

import "./disabled-overlay.css";

export const DisabledOverlay: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={clsx("engraver-disabled-overlay", className)} {...props} />;
};
