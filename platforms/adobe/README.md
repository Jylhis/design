# Jylhis for Adobe / Affinity

Two Adobe Swatch Exchange (`.ase`) files. ASE is the binary swatch format consumed by Photoshop, Illustrator, InDesign, and the Affinity suite (Designer, Photo, Publisher).

```
platforms/adobe/
├── jylhis-light.ase      ← hand-tuned binary (light)
└── jylhis-dark.ase       ← hand-tuned binary (dark)
```

Each file ships every role from the system, organized into ASE color groups matching our thematic banners — Grounds, Ink, Benchmark, Contour, Hairline, Modus, Signal, Spectrum.

## Install

### Photoshop / Illustrator / InDesign

Open the **Swatches** panel → panel menu → *Load Swatches…* → select the `.ase` file.

The colors land in the swatches panel preserving the group hierarchy. To make them available across files, drag the loaded swatches to a custom *Swatch Library* and save it.

### Affinity Designer / Photo / Publisher

Open the **Swatches** studio → studio menu (≡ icon) → *Import Palette → As Document Palette* (or *As Application Palette*) → select the `.ase` file.

### Sketch / Figma

Sketch and Figma do not natively read `.ase`. Convert with [`coolors.co/contrast-checker/colors-import-export-tool`](https://coolors.co/) or use a community plugin. Or, simpler, use the GIMP `.gpl` file in [`../gimp/`](../gimp/) — both Sketch and Figma have first-party `.gpl` import.

## Format

Binary, big-endian:

- 12-byte header: `ASEF` magic, version 1.0, block count.
- Block stream: `0xC001` (group start), `0xC002` (group end), `0x0001` (color entry).
- Strings are UTF-16 BE with a trailing null code unit.
- Color entries use the `RGB ` model with three big-endian floats in `[0.0, 1.0]`.

Each file carries 7 groups + 43 colors = 57 blocks. Round-tripped through
a parser, the floats reproduce the source 8-bit hex values exactly.

## Contract

Hex values mirror `themes/jylhis.json`. The `.ase` binaries are maintained
by hand — the generator does not emit `.ase` (see `nix/install-map.nix`) —
so re-export rather than expecting `bun scripts/generate.mjs` to refresh
them.
