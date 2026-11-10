# Engraver

Interactive, editable music notation for the web. Engraver renders scores with [VexFlow](https://vexflow.com) and lets users input, select and edit notes with the mouse and keyboard, with built-in playback.

> [!NOTE]
> Engraver is in early development. The packages are not published to npm yet and the API will change.

## Packages

| Package                                 | Description                                                         |
| --------------------------------------- | ------------------------------------------------------------------- |
| [`@engraver/core`](packages/core)       | Framework-agnostic score model, editing logic, rendering and player |
| [`@engraver/react`](packages/react)     | React component, providers and hooks                                |
| [`@engraver/vexflow`](packages/vexflow) | Internal fork of VexFlow, bundled into `core`                       |

## Usage

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

See [`apps/react-example`](apps/react-example) for a runnable example.

## Development

Requires Node.js 22.18 or newer.

```bash
vp install      # install dependencies
vp run ready    # check everything is ready
vp run dev      # start the example app
vp run -r test  # run the tests
vp run -r build # build all packages
```

## Contributing

Found a bug or have an idea? [Open an issue](https://github.com/stavely-io/engraver/issues/new/choose). Commit messages and PR titles follow [Conventional Commits](https://www.conventionalcommits.org).

## Credits

Engraver's rendering is built on a fork of [VexFlow](https://github.com/vexflow/vexflow), licensed under MIT. See [`packages/vexflow/LICENSE`](packages/vexflow/LICENSE).

## License

To be decided.
