# vite-plus-starter

A starter for creating a Vite Plus project.

## Development

- Install dependencies:

```bash
vp install
```

- Run the unit tests:

```bash
vp test
```

- Build the library:

```bash
vp pack
```

## Styling

Styles ship as plain CSS and are imported automatically with the package; no Tailwind or extra
setup is needed. Every rule lives in the `engraver` [cascade layer](https://developer.mozilla.org/docs/Web/CSS/@layer),
so any unlayered CSS you write overrides it, regardless of specificity or load order.

### Design tokens

Override any of these on `:root`, on `.engraver`, or on a wrapping element:

| Token                                   | Purpose                                  |
| --------------------------------------- | ---------------------------------------- |
| `--engraver-background`                 | Menu and sheet background                |
| `--engraver-foreground`                 | Icon and text color                      |
| `--engraver-border`                     | Borders and separators                   |
| `--engraver-hover-background`           | Menu button hover                        |
| `--engraver-active-background`          | Menu button press                        |
| `--engraver-selected-background`        | Selected menu button                     |
| `--engraver-selected-active-background` | Selected menu button press               |
| `--engraver-selected-foreground`        | Selected menu button icon color          |
| `--engraver-overlay-background`         | Disabled menu overlay                    |
| `--engraver-sheet-overlay-background`   | Disabled sheet overlay                   |
| `--engraver-radius`                     | Corner radius of menu, sheet and buttons |
| `--engraver-border-width`               | Border and separator thickness           |
| `--engraver-gap`                        | Spacing inside and between menu cells    |
| `--engraver-button-size`                | Menu button width and height             |
| `--engraver-icon-size`                  | Menu icon size                           |

Dark values apply automatically under `prefers-color-scheme: dark`.

```css
.engraver {
  --engraver-selected-background: rebeccapurple;
  --engraver-radius: 0;
}
```

### Class names

Components expose stable `engraver-*` class names (`.engraver-menu`, `.engraver-menu-button`,
`.engraver-sheet`, …) for structural tweaks. The selected menu button has `aria-pressed="true"`.

### Using with Tailwind CSS

Tailwind v4 puts its styles in layers too, and layers declared later win. To let Tailwind
utilities override Engraver while Engraver still overrides Tailwind's preflight, declare the
order at the top of your CSS:

```css
@layer theme, base, engraver, components, utilities;
@import "tailwindcss";
```

A layer's position is fixed where it is first declared, so this stylesheet must load before
`@engraver/react` (import it first in your entry file).

### Global element resets

Unlayered element rules in your app (for example `button { background: none }` from a
normalize stylesheet) beat layered styles. Put them in a layer before `engraver` or scope them
away from `.engraver`.
