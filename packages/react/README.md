# @engraver/react

React component for [Engraver](https://github.com/stavely-io/engraver): interactive, editable music notation for the web.

> [!NOTE]
> Engraver is in early development. This package is not published to npm yet and the API will change.

## Usage

Requires React 19 or newer and [`@engraver/core`](../core).

```tsx
import {
  CLEF_DATA,
  ClefType,
  KEY_SIGNATURES,
  TimeSignature,
  type EngraverConfig,
} from "@engraver/core";
import { Engraver } from "@engraver/react";

const config: EngraverConfig = {
  engraverScoreConfig: {
    scoreTemplate: {
      measureCount: 4,
      staveConfigs: [
        {
          clef: CLEF_DATA[ClefType.TREBLE],
          timeSignature: TimeSignature.FOUR_FOUR,
          keySignature: KEY_SIGNATURES.C,
        },
      ],
    },
  },
};

export function App() {
  return <Engraver config={config} />;
}
```

The component's styles are included automatically when you import the package.

### Props

| Prop     | Type                | Description                                      |
| -------- | ------------------- | ------------------------------------------------ |
| `config` | `EngraverConfig`    | Score template, menu, UI and theme configuration |
| `theme`  | `EngraverThemeType` | Optional colour theme                            |

## Development

From this directory:

```bash
vp check # format, lint and type-check
vp test  # run the tests
vp pack  # build the package
```

See the [repository README](https://github.com/stavely-io/engraver#readme) for monorepo-wide commands.
