// SVGs are inlined as strings at build time, see `loader` in vite.config.ts
declare module "*.svg" {
  const svg: string;
  export default svg;
}
