// Package jylhis is the Jylhis design system for Charm TUIs.
//
// GENERATED from tokens.json. Do not edit by hand.
// Run: bun scripts/generate.mjs
//
// It exposes the canonical Jylhis palette as lipgloss colors and
// provides ready-made styles for common components (titles, borders,
// help, selected items, kbd hints, status). Works standalone or
// inside Bubble Tea.
//
// Usage:
//
//	import "github.com/jylhis/design/charm/jylhis"
//
//	t := jylhis.NewTheme(jylhis.Paper) // or jylhis.Roast
//	fmt.Println(t.Title.Render("Notes"))
//	fmt.Println(t.Subtle.Render("7 files · updated 2m ago"))
//
// For auto light/dark against the terminal background, use
// jylhis.Detect(os.Stdin, os.Stdout) or pair with Bubble Tea's
// tea.BackgroundColorMsg (see bubbletea.go).
package jylhis

import (
	"image/color"

	"charm.land/lipgloss/v2"
)

// Mode selects the light (Paper) or dark (Roast) variant.
type Mode int

const (
	Paper Mode = iota // light — warm cream, copper accent
	Roast             // dark  — dark roast, copper accent
)

// Palette is the raw Jylhis palette for one mode.
// Values are hex strings; convert to lipgloss.Color with lipgloss.Color(p.Accent).
type Palette struct {
	// Surfaces
	Bg, BgSubtle, Surface, SurfaceRaised string
	// Text
	Text, TextMuted, TextHeading, TextFaint string
	// Accent family — copper
	Accent, AccentHover, Brand string
	// Structure
	Border, BorderStrong, Decorator string
	// Syntax — Emacs Modus (Operandi for Paper, Vivendi for Roast).
	// Uniform with the CSS vars and the Emacs themes.
	SynKeyword, SynString, SynNumber, SynFunction, SynType, SynBuiltin,
	SynVariable, SynTag, SynComment, SynDocstring string
	// Status — Modus red/yellow/green/blue accents.
	StatusErr, StatusWarn, StatusOk, StatusInfo string
	// ANSI 16 (for tables, sparklines, anything that needs raw palette access)
	ANSI [16]string
}

// paper is the canonical light palette. Hex values are the single source of truth.
// When they change, update tokens.json first, then run: bun scripts/generate.mjs
var paper = Palette{
	Bg: "#faf7f2", BgSubtle: "#f0ebe3", Surface: "#e8e1d6", SurfaceRaised: "#fefdfb",
	Text: "#2c2825", TextMuted: "#6b5f54", TextHeading: "#1e1b18", TextFaint: "#8a7f72",
	Accent: "#9a5a2a", AccentHover: "#7a4622", Brand: "#b5703c",
	Border: "#d5cec4", BorderStrong: "#b0a898", Decorator: "#c4baa8",
	SynKeyword: "#531ab6", SynString: "#0000b0", SynNumber: "#3548cf", SynFunction: "#721045", SynBuiltin: "#8f0075", SynType: "#005f5f", SynVariable: "#005e8b", SynComment: "#7f1010", SynDocstring: "#2a5045",
	SynTag: "#005f5f",
	StatusErr: "#a60000", StatusWarn: "#6f5500", StatusOk: "#006800", StatusInfo: "#0031a9",
	ANSI: [16]string{
		"#2c2825", "#a60000", "#006800", "#6f5500", "#0031a9", "#721045", "#005f5f", "#e8e1d6",
		"#8a7f72", "#972500", "#315b00", "#b5703c", "#3548cf", "#531ab6", "#005e8b", "#fefdfb",
	},
}

var roast = Palette{
	Bg: "#1a1714", BgSubtle: "#242019", Surface: "#2a2520", SurfaceRaised: "#363230",
	Text: "#e8e0d4", TextMuted: "#b0a496", TextHeading: "#f0eae0", TextFaint: "#8a7f72",
	Accent: "#e89b5e", AccentHover: "#f5b07a", Brand: "#d4884a",
	Border: "#3d3830", BorderStrong: "#5a5248", Decorator: "#4a4338",
	SynKeyword: "#b6a0ff", SynString: "#79a8ff", SynNumber: "#00bcff", SynFunction: "#feacd0", SynBuiltin: "#f78fe7", SynType: "#6ae4b9", SynVariable: "#2fafff", SynComment: "#ff9f80", SynDocstring: "#88c0a1",
	SynTag: "#6ae4b9",
	StatusErr: "#ff5f59", StatusWarn: "#d0bc00", StatusOk: "#44bc44", StatusInfo: "#2fafff",
	ANSI: [16]string{
		"#1a1714", "#ff5f59", "#44bc44", "#d0bc00", "#2fafff", "#feacd0", "#6ae4b9", "#e8e0d4",
		"#6b6157", "#ff7f7f", "#70b900", "#e89b5e", "#79a8ff", "#b6a0ff", "#00d3d0", "#f0eae0",
	},
}

// PaletteFor returns the raw palette for a mode.
func PaletteFor(m Mode) Palette {
	if m == Roast {
		return roast
	}
	return paper
}

// C is a convenience wrapper: lipgloss color from a hex string in the palette.
func C(hex string) color.Color { return lipgloss.Color(hex) }
