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
//	import "github.com/jylhis/design/platforms/charm/jylhis"
//
//	t := jylhis.NewTheme(jylhis.Sheet) // or jylhis.Field
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

// Mode selects the light (Sheet) or dark (Field) variant.
type Mode int

const (
	Sheet Mode = iota // light — cool near-white ground, bronze accent
	Field             // dark  — cool near-black ground, bronze accent
)

// Palette is the raw Jylhis palette for one mode.
// Values are hex strings; convert to lipgloss.Color with lipgloss.Color(p.Accent).
type Palette struct {
	// Surfaces
	Bg, BgSubtle, Surface, SurfaceRaised string
	// Text
	Text, TextMuted, TextHeading, TextFaint string
	// Accent family — bronze
	Accent, AccentHover, Brand string
	// Structure
	Border, BorderStrong, Decorator string
	// Syntax — Emacs Modus (Operandi for Sheet, Vivendi for Field).
	// Uniform with the CSS vars and the Emacs themes.
	SynKeyword, SynString, SynNumber, SynFunction, SynType, SynBuiltin,
	SynVariable, SynTag, SynComment, SynDocstring string
	// Status — Modus red/yellow/green/blue accents.
	StatusErr, StatusWarn, StatusOk, StatusInfo string
	// ANSI 16 (for tables, sparklines, anything that needs raw palette access)
	ANSI [16]string
}

// sheet is the canonical light palette. Hex values are the single source of truth.
// When they change, update tokens.json first, then run: bun scripts/generate.mjs
var sheet = Palette{
	Bg: "#f6f8fb", BgSubtle: "#eef2f6", Surface: "#e6ecf1", SurfaceRaised: "#fcfdff",
	Text: "#23262e", TextMuted: "#565a63", TextHeading: "#12141a", TextFaint: "#878c95",
	Accent: "#6f3e00", AccentHover: "#8a4d00", Brand: "#b5450e",
	Border: "#cfd6de", BorderStrong: "#aab4c0", Decorator: "#7f8fb5",
	SynKeyword: "#531ab6", SynString: "#3548cf", SynNumber: "#0000b0", SynFunction: "#721045", SynBuiltin: "#8f0075", SynType: "#005f5f", SynVariable: "#005e8b", SynComment: "#595959", SynDocstring: "#2a5045",
	SynTag: "#005f5f",
	StatusErr: "#a60000", StatusWarn: "#884900", StatusOk: "#006800", StatusInfo: "#005e8b",
	ANSI: [16]string{
		"#23262e", "#a60000", "#006800", "#884900", "#0031a9", "#721045", "#005a5f", "#565a63",
		"#878c95", "#b60000", "#316500", "#6f3e00", "#3548cf", "#531ab6", "#005e8b", "#23262e",
	},
}

var field = Palette{
	Bg: "#0d0f14", BgSubtle: "#14171e", Surface: "#1b1f28", SurfaceRaised: "#232833",
	Text: "#d6dae2", TextMuted: "#9aa0ab", TextHeading: "#f2f4f8", TextFaint: "#656b76",
	Accent: "#e0a33a", AccentHover: "#f0b95c", Brand: "#ef8a4a",
	Border: "#2b303b", BorderStrong: "#3a4150", Decorator: "#39415a",
	SynKeyword: "#b6a0ff", SynString: "#79a8ff", SynNumber: "#00bcff", SynFunction: "#feacd0", SynBuiltin: "#f78fe7", SynType: "#6ae4b9", SynVariable: "#00d3d0", SynComment: "#989898", SynDocstring: "#9ac8e0",
	SynTag: "#6ae4b9",
	StatusErr: "#f0685f", StatusWarn: "#d9b34a", StatusOk: "#6bbf6b", StatusInfo: "#5fb8cf",
	ANSI: [16]string{
		"#0d0f14", "#f0685f", "#6bbf6b", "#d9b34a", "#79a8ff", "#feacd0", "#6ae4b9", "#c9dedf",
		"#656b76", "#ff7f7f", "#70b900", "#e0a33a", "#79a8ff", "#b6a0ff", "#00d3d0", "#f2f4f8",
	},
}

// PaletteFor returns the raw palette for a mode.
func PaletteFor(m Mode) Palette {
	if m == Field {
		return field
	}
	return sheet
}

// C is a convenience wrapper: lipgloss color from a hex string in the palette.
func C(hex string) color.Color { return lipgloss.Color(hex) }
