import clsx from "clsx";
import type { FC, SVGProps } from "react";

import "./create-svg-icon.css";

export type SvgIconProps = SVGProps<SVGSVGElement>;

/**
 * Wraps an SVG component with shared icon defaults. Icons use `currentColor`, so they follow the text color.
 */
export function createSvgIcon(Svg: FC<SvgIconProps>, displayName: string): FC<SvgIconProps> {
  const SvgIcon: FC<SvgIconProps> = ({ className, ...props }) => (
    <Svg aria-hidden className={clsx("engraver-icon", className)} {...props} />
  );
  SvgIcon.displayName = displayName;
  return SvgIcon;
}
