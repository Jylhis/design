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
	Sheet    Mode = iota // light      — cool near-white ground, bronze accent
	Field                // dark       — cool near-black ground, bronze accent
	Chalk                // mono-light — near-white paper, black ink, grayscale
	Graphite             // mono-dark  — near-black ground, white ink, grayscale
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

var chalk = Palette{
	Bg: "#f4f4f4", BgSubtle: "#ececec", Surface: "#e2e2e2", SurfaceRaised: "#fcfcfc",
	Text: "#2b2b2b", TextMuted: "#565656", TextHeading: "#1a1a1a", TextFaint: "#7d7d7d",
	Accent: "#000000", AccentHover: "#333333", Brand: "#3a3a3a",
	Border: "#cfcfcf", BorderStrong: "#b0b0b0", Decorator: "#bdbdbd",
	SynKeyword: "#1c1c1c", SynString: "#3d3d3d", SynNumber: "#474747", SynFunction: "#262626", SynBuiltin: "#424242", SynType: "#2e2e2e", SynVariable: "#333333", SynComment: "#5a5a5a", SynDocstring: "#505050",
	SynTag: "#2e2e2e",
	StatusErr: "#1f1f1f", StatusWarn: "#454545", StatusOk: "#565656", StatusInfo: "#333333",
	ANSI: [16]string{
		"#242424", "#1f1f1f", "#565656", "#454545", "#333333", "#3a3a3a", "#4a4a4a", "#565656",
		"#7d7d7d", "#2a2a2a", "#6a6a6a", "#000000", "#404040", "#4a4a4a", "#555555", "#1a1a1a",
	},
}

var graphite = Palette{
	Bg: "#0d0d0d", BgSubtle: "#161616", Surface: "#1f1f1f", SurfaceRaised: "#282828",
	Text: "#dadada", TextMuted: "#9a9a9a", TextHeading: "#f2f2f2", TextFaint: "#6a6a6a",
	Accent: "#ffffff", AccentHover: "#dcdcdc", Brand: "#e8e8e8",
	Border: "#333333", BorderStrong: "#4a4a4a", Decorator: "#3d3d3d",
	SynKeyword: "#ededed", SynString: "#bcbcbc", SynNumber: "#b0b0b0", SynFunction: "#e0e0e0", SynBuiltin: "#b6b6b6", SynType: "#d6d6d6", SynVariable: "#c8c8c8", SynComment: "#8f8f8f", SynDocstring: "#9a9a9a",
	SynTag: "#d6d6d6",
	StatusErr: "#f0f0f0", StatusWarn: "#b8b8b8", StatusOk: "#909090", StatusInfo: "#d0d0d0",
	ANSI: [16]string{
		"#0d0d0d", "#f0f0f0", "#909090", "#b8b8b8", "#d0d0d0", "#c8c8c8", "#b0b0b0", "#9a9a9a",
		"#6a6a6a", "#ffffff", "#a5a5a5", "#ffffff", "#dcdcdc", "#d5d5d5", "#c0c0c0", "#f2f2f2",
	},
}

// PaletteFor returns the raw palette for a mode.
func PaletteFor(m Mode) Palette {
	switch m {
	case Field:
		return field
	case Chalk:
		return chalk
	case Graphite:
		return graphite
	default:
		return sheet
	}
}

// C is a convenience wrapper: lipgloss color from a hex string in the palette.
func C(hex string) color.Color { return lipgloss.Color(hex) }
