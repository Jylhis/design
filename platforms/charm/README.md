# Jylhis for Charm TUIs

Design system for [Bubble Tea](https://github.com/charmbracelet/bubbletea) + [Lip Gloss](https://github.com/charmbracelet/lipgloss) + [Bubbles](https://github.com/charmbracelet/bubbles) apps. Ships the Jylhis palette as pre-built lipgloss styles and wires up the common bubbles (list, help, spinner, textinput) so every Jylhis TUI looks like the rest of the ecosystem.

```
platforms/charm/
├── jylhis/
│   ├── palette.go    — raw palette (Paper + Roast), single source of truth
│   ├── theme.go      — pre-built lipgloss styles (Title, Selected, Kbd, Err…)
│   ├── bubbles.go    — DefaultKeys + ListStyles/DelegateStyles/TextInput/Spinner/Help
│   └── bubbletea.go  — Detect cmd + ApplyBackground for auto light/dark
├── demo/main.go      — runnable example
└── go.mod
```

## Quick start

```go
import "github.com/jylhis/design/platforms/charm/jylhis"

t := jylhis.NewTheme(jylhis.Paper) // or jylhis.Roast

fmt.Println(t.Title.Render(" Notes "))
fmt.Println(t.Subtle.Render("7 files · updated 2m ago"))
fmt.Println(t.Err.Render("✗ build failed") + "  " + t.Kbd.Render("r") + t.Help.Render(" retry"))
```

## Auto light/dark in Bubble Tea

```go
func (m model) Init() tea.Cmd { return jylhis.Detect }

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    if t, ok := jylhis.ApplyBackground(msg); ok {
        m.theme = t
        m.list.Styles = jylhis.ListStyles(t)
    }
    // ...
}
```

## What you get, for free

- **One selected-item language** across web, rofi, Emacs, and TUIs: copper bar + copper title, surface-raised fill.
- **Earth-toned ANSI 16**: green is olive, blue is slate, magenta is plum — red stays real red, for errors only.
- **DefaultKeys** that mirror the web shortcuts: `/` filter, `^K` palette, `^⇧L` theme toggle, `?` help, `q` quit.
- **KbdHint(key, label)** helper that renders `[q] quit`-style key hints in the house style.
- **Bubbles styling** for `list`, `help`, `spinner`, `textinput` — plus `DelegateStyles` for list items.

## Companion libraries

The palette is intentionally plain hex strings. Convert them with `lipgloss.Color(...)` wherever a Lip Gloss style or component expects a color:

- **[harmonica](https://github.com/charmbracelet/harmonica)** — spring animations. Use `t.Palette.Accent` as the fill color while spring-tweening a progress bar width.
- **[ntcharts](https://github.com/NimbleMarkets/ntcharts)** — TUI charts. Pass `t.Palette.ANSI[:]` to get a palette-compliant series color cycle; use `t.Accent` for highlighted series and `t.Rule` for axes.

Example series colors for ntcharts:

```go
seriesColors := []lipgloss.Color{
    lipgloss.Color(t.Palette.SynTag),       // Modus cyan-cooler
    lipgloss.Color(t.Palette.SynString),    // Modus blue-cooler
    lipgloss.Color(t.Palette.SynNumber),    // Modus blue-warmer
    lipgloss.Color(t.Palette.SynFunction),  // Modus magenta
    lipgloss.Color(t.Palette.Accent),       // copper (highlight)
}
```

## Running the demo

```sh
cd platforms/charm
go mod tidy
go run ./demo
```

Then press `^⇧L` to toggle theme, `/` to filter, `q` to quit.

## Contract

Hex values in `palette.go` are mirrors of `tokens.md` — the canonical spec. When the palette changes, update `tokens.md` first, then propagate here.
