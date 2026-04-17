package jylhis

import (
	"charm.land/lipgloss/v2"
	tea "github.com/charmbracelet/bubbletea/v2"
)

// ThemeMsg is emitted by the Detect command when the terminal background
// color is known. Your Bubble Tea Update should re-derive styles from it.
type ThemeMsg struct {
	Theme Theme
}

// Detect is a tea.Cmd batch that asks the terminal for its background color.
// Pair with the msg handler in ApplyBackground to auto-select Paper vs Roast.
//
//	func (m model) Init() tea.Cmd       { return jylhis.Detect }
//	func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
//	    if t, ok := jylhis.ApplyBackground(msg); ok { m.theme = t }
//	    ...
//	}
func Detect() tea.Msg { return tea.RequestBackgroundColor() }

// ApplyBackground checks a tea.Msg for a BackgroundColorMsg and, if present,
// returns the appropriate Theme. Returns ok=false for unrelated messages.
func ApplyBackground(msg tea.Msg) (Theme, bool) {
	bg, ok := msg.(tea.BackgroundColorMsg)
	if !ok {
		return Theme{}, false
	}
	if bg.IsDark() {
		return NewTheme(Roast), true
	}
	return NewTheme(Paper), true
}

// AdaptiveColor returns a lipgloss.Color that picks the paper or roast
// variant given a known-dark-background boolean (e.g. from BackgroundColorMsg).
// Useful when you want a single adaptive color outside of the Theme struct.
func AdaptiveColor(isDark bool, light, dark string) lipgloss.Color {
	if isDark {
		return lipgloss.Color(dark)
	}
	return lipgloss.Color(light)
}
