// Package main is a tiny Bubble Tea demo of the Jylhis theme.
//
//	cd platforms/charm && go run ./demo
//
// It shows: title, list with delegate, selected-item language,
// status badges, kbd hints, help bar, spinner, and the copper accent.
// Auto-detects light/dark from the terminal background.
package main

import (
	"fmt"
	"os"

	"charm.land/bubbles/v2/help"
	"charm.land/bubbles/v2/list"
	"charm.land/bubbles/v2/spinner"
	tea "charm.land/bubbletea/v2"
	"charm.land/lipgloss/v2"

	"github.com/jylhis/design/platforms/charm/jylhis"
)

type item struct {
	title, desc, status string
}

func (i item) Title() string       { return i.title }
func (i item) Description() string { return i.desc }
func (i item) FilterValue() string { return i.title }

type model struct {
	theme   jylhis.Theme
	keys    jylhis.KeyMap
	list    list.Model
	spin    spinner.Model
	help    help.Model
	width   int
	height  int
	ready   bool
	message string
}

func initialModel() model {
	t := jylhis.NewTheme(jylhis.Paper) // default before bg query answers
	k := jylhis.DefaultKeys()

	items := []list.Item{
		item{"Ghostty colorscheme", "paper + roast, 16-color ANSI", "ok"},
		item{"Hyprland tokens", "borders, waybar, rofi, mako", "ok"},
		item{"Emacs deftheme", "modus-style semantic face targeting", "ok"},
		item{"Charm TUI kit", "lipgloss + bubbles + bubbletea", "info"},
		item{"nushell support", "not yet built", "warn"},
		item{"kitty/alacritty", "out of scope — ghostty is primary", "err"},
	}

	delegate := list.NewDefaultDelegate()
	delegate.Styles = jylhis.DelegateStyles(t)

	l := list.New(items, delegate, 0, 0)
	l.Title = "Jylhis · platform targets"
	l.Styles = jylhis.ListStyles(t)
	l.SetShowHelp(false) // we render our own help bar

	return model{
		theme: t,
		keys:  k,
		list:  l,
		spin:  jylhis.Spinner(t),
		help:  jylhis.Help(t),
	}
}

func (m model) Init() tea.Cmd {
	return tea.Batch(jylhis.Detect, m.spin.Tick)
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	// Hot-swap the theme when we learn the bg.
	if t, ok := jylhis.ApplyBackground(msg); ok {
		m.theme = t
		m.list.Styles = jylhis.ListStyles(t)
		d := list.NewDefaultDelegate()
		d.Styles = jylhis.DelegateStyles(t)
		m.list.SetDelegate(d)
		m.spin.Style = lipgloss.NewStyle().Foreground(lipgloss.Color(t.Palette.Accent))
		m.help = jylhis.Help(t)
	}

	var cmds []tea.Cmd
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width, m.height = msg.Width, msg.Height
		m.ready = true
		// leave room for title, status row, help bar.
		m.list.SetSize(msg.Width-4, msg.Height-8)
	case tea.KeyMsg:
		switch {
		case msg.String() == "ctrl+c" || msg.String() == "q":
			return m, tea.Quit
		case msg.String() == "ctrl+shift+l":
			if m.theme.Mode == jylhis.Paper {
				m.theme = jylhis.NewTheme(jylhis.Roast)
			} else {
				m.theme = jylhis.NewTheme(jylhis.Paper)
			}
			m.list.Styles = jylhis.ListStyles(m.theme)
			d := list.NewDefaultDelegate()
			d.Styles = jylhis.DelegateStyles(m.theme)
			m.list.SetDelegate(d)
			m.help = jylhis.Help(m.theme)
			m.message = "theme toggled"
		}
	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spin, cmd = m.spin.Update(msg)
		cmds = append(cmds, cmd)
	}

	var cmd tea.Cmd
	m.list, cmd = m.list.Update(msg)
	cmds = append(cmds, cmd)
	return m, tea.Batch(cmds...)
}

func (m model) View() tea.View {
	if !m.ready {
		v := tea.NewView("")
		v.AltScreen = true
		return v
	}
	t := m.theme

	header := lipgloss.JoinHorizontal(lipgloss.Center,
		t.Brand.Render("jylhis"),
		t.Rule.Render(" ── "),
		t.Subtle.Render("design system · charm tui"),
		t.Rule.Render(" ── "),
		m.spin.View(),
	)

	badges := lipgloss.JoinHorizontal(lipgloss.Center,
		t.Ok.Render("● shipping"), "  ",
		t.Info.Render("● tokens.md"), "  ",
		t.Warn.Render("● nushell"), "  ",
		t.Err.Render("● out of scope"),
	)

	kbd := lipgloss.JoinHorizontal(lipgloss.Center,
		t.KbdHint("↑↓/jk", "navigate"), "  ",
		t.KbdHint("/", "filter"), "  ",
		t.KbdHint("^⇧L", "theme"), "  ",
		t.KbdHint("q", "quit"),
	)

	body := t.Border.
		Width(m.width-4).
		Padding(0, 1).
		Render(m.list.View())

	msg := ""
	if m.message != "" {
		msg = t.Accent.Render("· " + m.message)
	}

	content := lipgloss.JoinVertical(lipgloss.Left,
		"",
		"  "+header,
		"  "+badges+"  "+msg,
		"",
		body,
		"",
		"  "+kbd,
		"",
	)
	v := tea.NewView(content)
	v.AltScreen = true
	return v
}

func main() {
	p := tea.NewProgram(initialModel())
	if _, err := p.Run(); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}
