type HexColor = `#${string}`;

// rgb() and rgba()
type RgbColor = `rgb(${number}, ${number}, ${number})`;
type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;

// hsl() and hsla()
type HslColor = `hsl(${number}, ${number}%, ${number}%)`;
type HslaColor = `hsla(${number}, ${number}%, ${number}%, ${number})`;

// oklch() – format like: oklch(0.55 0.25 260 / 1)
type OklchColor = `oklch(${number} ${number} ${number}${` / ${number}` | ""})`;

export type Color = HexColor | RgbColor | RgbaColor | HslColor | HslaColor | OklchColor;
