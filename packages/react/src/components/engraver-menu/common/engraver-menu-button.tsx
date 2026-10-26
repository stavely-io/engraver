import clsx from "clsx";
import { type ButtonHTMLAttributes, type FC } from "react";

import "./engraver-menu-button.css";

interface EngraverMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const EngraverMenuButton: FC<EngraverMenuButtonProps> = ({
  selected,
  className,
  children,
  ...buttonProps
}) => {
  return (
    <button
      className={clsx("engraver-menu-button", className)}
      aria-pressed={selected}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
