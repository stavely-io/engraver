import type { FC, HTMLAttributes } from "react";

import { cn } from "../../utils/style";

export type SvgIconProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Wraps raw SVG markup in a component. Icons use `currentColor`, so they follow the text color.
 */
export function createSvgIcon(svg: string, displayName: string): FC<SvgIconProps> {
  const SvgIcon: FC<SvgIconProps> = ({ className, ...props }) => (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  );
  SvgIcon.displayName = displayName;
  return SvgIcon;
}
