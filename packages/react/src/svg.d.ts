// SVGs are compiled into React components at build time, see `svgComponents` in vite.config.ts
declare module "*.svg" {
  import type { FC, SVGProps } from "react";

  const SvgComponent: FC<SVGProps<SVGSVGElement>>;
  export default SvgComponent;
}
