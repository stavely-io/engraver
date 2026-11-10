# @engraver/core

Framework-agnostic core of [Engraver](https://github.com/stavely-io/engraver): interactive, editable music notation for the web.

> [!NOTE]
> Engraver is in early development. This package is not published to npm yet and the API will change.

## What's inside

- **Engraver**: score model, editing logic, configuration types and rendering through a bundled fork of [VexFlow](https://vexflow.com)
- **Musical core**: pitches, durations, clefs, key and time signatures
- **Player**: score playback built on [smplr](https://github.com/danigb/smplr)

For a ready-made UI, use [`@engraver/react`](../react).

## Development

From this directory:

```bash
vp check # format, lint and type-check
vp test  # run the tests
vp pack  # build the package
```

See the [repository README](https://github.com/stavely-io/engraver#readme) for monorepo-wide commands.

## Credits

Rendering is built on a fork of [VexFlow](https://github.com/vexflow/vexflow), licensed under MIT. See [`packages/vexflow/LICENSE`](https://github.com/stavely-io/engraver/blob/main/packages/vexflow/LICENSE).
