package jylhis

import "charm.land/lipgloss/v2"

// Theme is the resolved, ready-to-use set of lipgloss styles for one mode.
// Build one with NewTheme(mode) and pass it down through your model.
type Theme struct {
	Mode    Mode
	Palette Palette

	// Text
	Body    lipgloss.Style
	Muted   lipgloss.Style
	Faint   lipgloss.Style
	Heading lipgloss.Style
	Title   lipgloss.Style
	Subtle  lipgloss.Style // meta / counts / timestamps

	// Accent & emphasis
	Accent lipgloss.Style
	Brand  lipgloss.Style
	Link   lipgloss.Style

	// Status
	Err  lipgloss.Style
	Warn lipgloss.Style
	Ok   lipgloss.Style
	Info lipgloss.Style

	// Structure
	Border        lipgloss.Style // rounded border, border color
	BorderSquare  lipgloss.Style
	BorderFocused lipgloss.Style // rounded, accent border — for focused pane
	Card          lipgloss.Style // surface fill + border + padding
	Rule          lipgloss.Style // horizontal rule char color (decorator)

	// Interactive
	Selected   lipgloss.Style // current row in list, highlighted menu item
	Cursor     lipgloss.Style // block cursor / pointer ">"
	Help       lipgloss.Style // help bar at bottom of TUI
	Kbd        lipgloss.Style // [q] quit  — pill-ish inline key hint
	Input      lipgloss.Style // text input field
	InputFocus lipgloss.Style

	// Syntax / badges
	Keyword  lipgloss.Style
	String   lipgloss.Style
	Number   lipgloss.Style
	Function lipgloss.Style
	Tag      lipgloss.Style
	Comment  lipgloss.Style
}

// NewTheme returns a Theme for the given mode with all styles pre-built.
func NewTheme(m Mode) Theme {
	p := PaletteFor(m)
	col := lipgloss.Color

	t := Theme{Mode: m, Palette: p}

	// Text roles
	t.Body = lipgloss.NewStyle().Foreground(col(p.Text))
	t.Muted = lipgloss.NewStyle().Foreground(col(p.TextMuted))
	t.Faint = lipgloss.NewStyle().Foreground(col(p.TextFaint))
	t.Heading = lipgloss.NewStyle().Foreground(col(p.TextHeading)).Bold(true)
	t.Title = lipgloss.NewStyle().
		Foreground(col(p.TextHeading)).
		Bold(true).
		PaddingLeft(1).
		PaddingRight(1)
	t.Subtle = lipgloss.NewStyle().Foreground(col(p.TextMuted)).Faint(true)

	// Accent
	t.Accent = lipgloss.NewStyle().Foreground(col(p.Accent))
	t.Brand = lipgloss.NewStyle().Foreground(col(p.Brand)).Bold(true)
	t.Link = lipgloss.NewStyle().Foreground(col(p.Accent)).Underline(true)

	// Status
	t.Err = lipgloss.NewStyle().Foreground(col(p.StatusErr)).Bold(true)
	t.Warn = lipgloss.NewStyle().Foreground(col(p.StatusWarn))
	t.Ok = lipgloss.NewStyle().Foreground(col(p.StatusOk))
	t.Info = lipgloss.NewStyle().Foreground(col(p.StatusInfo))

	// Borders
	t.Border = lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(col(p.Border))
	t.BorderSquare = lipgloss.NewStyle().
		Border(lipgloss.NormalBorder()).
		BorderForeground(col(p.Border))
	t.BorderFocused = lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(col(p.Accent))
	t.Card = lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(col(p.Border)).
		Background(col(p.Surface)).
		Foreground(col(p.Text)).
		Padding(1, 2)
	t.Rule = lipgloss.NewStyle().Foreground(col(p.Decorator))

	// Interactive — one selected-item language across the whole system.
	// Bronze bg + ground fg is the same recipe as the web and rofi.
	t.Selected = lipgloss.NewStyle().
		Foreground(col(p.SurfaceRaised)).
		Background(col(p.Accent)).
		Bold(true)
	t.Cursor = lipgloss.NewStyle().Foreground(col(p.Accent)).Bold(true)

	// Help bar: muted body text with an accent kbd pill.
	t.Help = lipgloss.NewStyle().Foreground(col(p.TextMuted))
	t.Kbd = lipgloss.NewStyle().
		Foreground(col(p.TextHeading)).
		Background(col(p.BgSubtle)).
		Padding(0, 1).
		Bold(true)

	t.Input = lipgloss.NewStyle().
		Foreground(col(p.Text)).
		Background(col(p.BgSubtle)).
		Padding(0, 1)
	t.InputFocus = lipgloss.NewStyle().
		Foreground(col(p.Text)).
		Background(col(p.BgSubtle)).
		Padding(0, 1).
		Border(lipgloss.NormalBorder(), false, false, true, false).
		BorderForeground(col(p.Accent))

	// Syntax
	t.Keyword = lipgloss.NewStyle().Foreground(col(p.SynKeyword))
	t.String = lipgloss.NewStyle().Foreground(col(p.SynString))
	t.Number = lipgloss.NewStyle().Foreground(col(p.SynNumber))
	t.Function = lipgloss.NewStyle().Foreground(col(p.SynFunction)).Bold(true)
	t.Tag = lipgloss.NewStyle().Foreground(col(p.SynTag))
	t.Comment = lipgloss.NewStyle().Foreground(col(p.SynComment)).Italic(true)

	return t
}

// KbdHint formats a "[key] label" hint using Kbd + Help styles.
// Example: t.KbdHint("q", "quit")  →  "[q] quit"
func (t Theme) KbdHint(key, label string) string {
	return t.Kbd.Render(key) + " " + t.Help.Render(label)
}

// Status returns the appropriate status style by keyword.
func (t Theme) Status(kind string) lipgloss.Style {
	switch kind {
	case "err", "error":
		return t.Err
	case "warn", "warning":
		return t.Warn
	case "ok", "success":
		return t.Ok
	case "info":
		return t.Info
	}
	return t.Body
}
