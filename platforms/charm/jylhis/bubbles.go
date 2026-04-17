package jylhis

import (
	"charm.land/lipgloss/v2"
	"github.com/charmbracelet/bubbles/v2/help"
	"github.com/charmbracelet/bubbles/v2/key"
	"github.com/charmbracelet/bubbles/v2/list"
	"github.com/charmbracelet/bubbles/v2/spinner"
	"github.com/charmbracelet/bubbles/v2/textinput"
)

// --- Key bindings ---------------------------------------------------------
// DefaultKeys is the Jylhis canonical keymap. It deliberately mirrors the
// web app's command palette conventions so muscle memory transfers.
//
// Navigation is vim-native (hjkl) with arrow-key fallbacks everywhere.
// Escape always dismisses the topmost transient surface (filter, modal).

type KeyMap struct {
	Up, Down, Left, Right key.Binding
	Next, Prev            key.Binding // tab / shift-tab between panes
	Enter                 key.Binding // confirm / open
	Back                  key.Binding // esc
	Filter                key.Binding // /
	Palette               key.Binding // ctrl+k, cmd+k
	ToggleTheme           key.Binding // ctrl+shift+l — mirrors the web shortcut
	Help                  key.Binding // ?
	Quit                  key.Binding // q / ctrl+c
}

// DefaultKeys returns the Jylhis keymap.
func DefaultKeys() KeyMap {
	return KeyMap{
		Up:    key.NewBinding(key.WithKeys("up", "k"), key.WithHelp("↑/k", "up")),
		Down:  key.NewBinding(key.WithKeys("down", "j"), key.WithHelp("↓/j", "down")),
		Left:  key.NewBinding(key.WithKeys("left", "h"), key.WithHelp("←/h", "left")),
		Right: key.NewBinding(key.WithKeys("right", "l"), key.WithHelp("→/l", "right")),
		Next:  key.NewBinding(key.WithKeys("tab"), key.WithHelp("tab", "next pane")),
		Prev:  key.NewBinding(key.WithKeys("shift+tab"), key.WithHelp("⇧tab", "prev pane")),

		Enter:       key.NewBinding(key.WithKeys("enter"), key.WithHelp("↵", "open")),
		Back:        key.NewBinding(key.WithKeys("esc"), key.WithHelp("esc", "back")),
		Filter:      key.NewBinding(key.WithKeys("/"), key.WithHelp("/", "filter")),
		Palette:     key.NewBinding(key.WithKeys("ctrl+k"), key.WithHelp("^k", "palette")),
		ToggleTheme: key.NewBinding(key.WithKeys("ctrl+shift+l"), key.WithHelp("^⇧L", "toggle theme")),
		Help:        key.NewBinding(key.WithKeys("?"), key.WithHelp("?", "help")),
		Quit:        key.NewBinding(key.WithKeys("q", "ctrl+c"), key.WithHelp("q", "quit")),
	}
}

// ShortHelp / FullHelp implementing the help.KeyMap interface for bubbles/help.
func (k KeyMap) ShortHelp() []key.Binding {
	return []key.Binding{k.Up, k.Down, k.Enter, k.Filter, k.Help, k.Quit}
}
func (k KeyMap) FullHelp() [][]key.Binding {
	return [][]key.Binding{
		{k.Up, k.Down, k.Left, k.Right},
		{k.Next, k.Prev, k.Enter, k.Back},
		{k.Filter, k.Palette, k.ToggleTheme},
		{k.Help, k.Quit},
	}
}

// --- Bubbles styling ------------------------------------------------------
// These helpers take a Theme and return configured bubbles styles/models
// so every Charm TUI in the Jylhis ecosystem looks identical.

// ListStyles returns list.DefaultStyles themed for Jylhis.
func ListStyles(t Theme) list.Styles {
	s := list.DefaultStyles()
	p := t.Palette
	c := func(hex string) lipgloss.Color { return lipgloss.Color(hex) }

	s.Title = s.Title.
		Foreground(c(p.TextHeading)).
		Background(c(p.BgSubtle)).
		Padding(0, 1).
		Bold(true)
	s.TitleBar = s.TitleBar.Padding(0, 0, 1, 0)

	s.StatusBar = s.StatusBar.Foreground(c(p.TextMuted))
	s.StatusEmpty = s.StatusEmpty.Foreground(c(p.TextFaint))
	s.NoItems = s.NoItems.Foreground(c(p.TextFaint)).Italic(true)

	s.FilterPrompt = s.FilterPrompt.Foreground(c(p.Accent))
	s.FilterCursor = s.FilterCursor.Foreground(c(p.Accent))

	s.DividerDot = s.DividerDot.Foreground(c(p.Decorator))
	s.HelpStyle = s.HelpStyle.Foreground(c(p.TextMuted))

	// Pagination dots
	s.ActivePaginationDot = s.ActivePaginationDot.Foreground(c(p.Accent))
	s.InactivePaginationDot = s.InactivePaginationDot.Foreground(c(p.Decorator))

	return s
}

// DelegateStyles returns list.DefaultDelegate styles themed for Jylhis.
// Selected items get the copper bar + copper title treatment.
func DelegateStyles(t Theme) list.DefaultItemStyles {
	d := list.NewDefaultItemStyles()
	p := t.Palette
	c := func(hex string) lipgloss.Color { return lipgloss.Color(hex) }

	d.NormalTitle = d.NormalTitle.Foreground(c(p.Text))
	d.NormalDesc = d.NormalDesc.Foreground(c(p.TextMuted))

	d.SelectedTitle = d.SelectedTitle.
		Foreground(c(p.Accent)).
		Bold(true).
		BorderForeground(c(p.Accent)).
		BorderStyle(lipgloss.NormalBorder()).
		BorderLeft(true).
		Padding(0, 0, 0, 1)
	d.SelectedDesc = d.SelectedDesc.
		Foreground(c(p.Text)).
		BorderForeground(c(p.Accent)).
		BorderStyle(lipgloss.NormalBorder()).
		BorderLeft(true).
		Padding(0, 0, 0, 1)

	d.DimmedTitle = d.DimmedTitle.Foreground(c(p.TextFaint))
	d.DimmedDesc = d.DimmedDesc.Foreground(c(p.TextFaint))

	d.FilterMatch = d.FilterMatch.Foreground(c(p.Accent)).Underline(true)
	return d
}

// TextInput returns a textinput.Model themed for Jylhis.
func TextInput(t Theme, placeholder string) textinput.Model {
	ti := textinput.New()
	ti.Placeholder = placeholder
	p := t.Palette
	c := func(hex string) lipgloss.Color { return lipgloss.Color(hex) }

	ti.Prompt = "» "
	ti.PromptStyle = lipgloss.NewStyle().Foreground(c(p.Accent)).Bold(true)
	ti.TextStyle = lipgloss.NewStyle().Foreground(c(p.Text))
	ti.PlaceholderStyle = lipgloss.NewStyle().Foreground(c(p.TextFaint))
	ti.CursorStyle = lipgloss.NewStyle().Foreground(c(p.Accent))
	return ti
}

// Spinner returns a spinner.Model themed for Jylhis, using the branded dot style.
func Spinner(t Theme) spinner.Model {
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color(t.Palette.Accent))
	return s
}

// Help returns a help.Model themed for Jylhis.
func Help(t Theme) help.Model {
	h := help.New()
	p := t.Palette
	c := func(hex string) lipgloss.Color { return lipgloss.Color(hex) }

	h.Styles.ShortKey = lipgloss.NewStyle().Foreground(c(p.TextHeading)).Bold(true)
	h.Styles.ShortDesc = lipgloss.NewStyle().Foreground(c(p.TextMuted))
	h.Styles.ShortSeparator = lipgloss.NewStyle().Foreground(c(p.Decorator))
	h.Styles.FullKey = h.Styles.ShortKey
	h.Styles.FullDesc = h.Styles.ShortDesc
	h.Styles.FullSeparator = h.Styles.ShortSeparator
	h.Styles.Ellipsis = lipgloss.NewStyle().Foreground(c(p.TextFaint))
	return h
}
