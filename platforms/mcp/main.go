// Command jylhis-design-mcp is a Model Context Protocol server that exposes the
// Jylhis design system to AI agents (PRODUCT.md names AI extenders as a
// secondary user). It serves the datum authoritatively: token lookups with
// their contrast contract, per-component specs (the generated reference), and
// the design principles — so an agent reads the system instead of guessing it.
//
// Transport: MCP stdio (newline-delimited JSON-RPC 2.0). Stdlib only — a single
// static binary, no dependencies (AGENTS.md script-language preference #1).
package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const (
	serverName      = "jylhis-design"
	serverVersion   = "0.1.0"
	defaultProtocol = "2024-11-05"
)

// ─── JSON-RPC framing ────────────────────────────────────────────────

type rpcRequest struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      json.RawMessage `json:"id,omitempty"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params,omitempty"`
}

type rpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type rpcResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      json.RawMessage `json:"id,omitempty"`
	Result  any             `json:"result,omitempty"`
	Error   *rpcError       `json:"error,omitempty"`
}

// ─── tokens.json shape (only what we surface) ────────────────────────

type colorEntry struct {
	Light string `json:"light"`
	Dark  string `json:"dark"`
	Notes string `json:"notes"`
	Modus string `json:"modus"`
}

type group struct {
	Label   string   `json:"label"`
	Blurb   string   `json:"blurb"`
	Members []string `json:"members"`
}

type contrastCheck struct {
	FG    string  `json:"fg"`
	BG    string  `json:"bg"`
	Mode  string  `json:"mode"`
	Min   float64 `json:"min"`
	Label string  `json:"label"`
}

type pair struct {
	FG    string  `json:"fg"`
	Min   float64 `json:"min"`
	Label string  `json:"label"`
}

type tokensFile struct {
	Meta     map[string]any        `json:"meta"`
	Groups   map[string]group      `json:"groups"`
	Palette  map[string]colorEntry `json:"palette"`
	Syntax   map[string]colorEntry `json:"syntax"`
	Status   map[string]colorEntry `json:"status"`
	Pairs    map[string]pair       `json:"pairs"`
	Contrast []contrastCheck       `json:"contrast"`
}

func (t *tokensFile) role(name string) (colorEntry, bool) {
	for _, sec := range []map[string]colorEntry{t.palette(), t.Syntax, t.Status} {
		if e, ok := sec[name]; ok {
			return e, true
		}
	}
	return colorEntry{}, false
}

func (t *tokensFile) palette() map[string]colorEntry { return t.Palette }

// ─── server ──────────────────────────────────────────────────────────

type server struct {
	root   string
	tokens tokensFile
	out    *bufio.Writer
}

func main() {
	root, err := findRoot()
	if err != nil {
		fmt.Fprintln(os.Stderr, "jylhis-design-mcp:", err)
		os.Exit(1)
	}
	s := &server{root: root, out: bufio.NewWriter(os.Stdout)}
	if err := s.loadTokens(); err != nil {
		fmt.Fprintln(os.Stderr, "jylhis-design-mcp: load tokens:", err)
		os.Exit(1)
	}
	fmt.Fprintf(os.Stderr, "jylhis-design-mcp: serving from %s\n", root)

	sc := bufio.NewScanner(os.Stdin)
	sc.Buffer(make([]byte, 0, 64*1024), 8*1024*1024)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" {
			continue
		}
		var req rpcRequest
		if err := json.Unmarshal([]byte(line), &req); err != nil {
			continue // malformed frame; MCP stdio has no way to reply without an id
		}
		s.dispatch(req)
	}
	if err := sc.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "jylhis-design-mcp: stdin:", err)
	}
}

// findRoot walks up from the working directory to the dir holding tokens.json.
func findRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "tokens.json")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("tokens.json not found in any parent of the working directory")
		}
		dir = parent
	}
}

func (s *server) loadTokens() error {
	b, err := os.ReadFile(filepath.Join(s.root, "tokens.json"))
	if err != nil {
		return err
	}
	return json.Unmarshal(b, &s.tokens)
}

func (s *server) dispatch(req rpcRequest) {
	switch req.Method {
	case "initialize":
		s.handleInitialize(req)
	case "tools/list":
		s.reply(req.ID, map[string]any{"tools": toolDefs()})
	case "tools/call":
		s.handleToolCall(req)
	case "ping":
		s.reply(req.ID, map[string]any{})
	default:
		// Notifications (no id, e.g. notifications/initialized) need no reply.
		if len(req.ID) > 0 {
			s.replyError(req.ID, -32601, "method not found: "+req.Method)
		}
	}
}

func (s *server) handleInitialize(req rpcRequest) {
	protocol := defaultProtocol
	var p struct {
		ProtocolVersion string `json:"protocolVersion"`
	}
	if err := json.Unmarshal(req.Params, &p); err == nil && p.ProtocolVersion != "" {
		protocol = p.ProtocolVersion // echo the client's version for compatibility
	}
	s.reply(req.ID, map[string]any{
		"protocolVersion": protocol,
		"capabilities":    map[string]any{"tools": map[string]any{}},
		"serverInfo":      map[string]any{"name": serverName, "version": serverVersion},
		"instructions":    "Authoritative Jylhis design-system access. Use get_token before quoting a colour/contrast, get_component before using a component's props, and get_principles for the design rules. Never invent token values or props.",
	})
}

// ─── tools ───────────────────────────────────────────────────────────

func toolDefs() []map[string]any {
	strObj := func(desc string, req bool, prop, propDesc string) map[string]any {
		schema := map[string]any{"type": "object"}
		if prop != "" {
			schema["properties"] = map[string]any{prop: map[string]any{"type": "string", "description": propDesc}}
			if req {
				schema["required"] = []string{prop}
			}
		} else {
			schema["properties"] = map[string]any{}
		}
		_ = desc
		return schema
	}
	return []map[string]any{
		{"name": "list_tokens", "description": "List every colour role, grouped (Grounds, Ink, Bronze, Line, Modus, Signal, Spectrum), with each group's blurb and members.", "inputSchema": strObj("", false, "", "")},
		{"name": "get_token", "description": "Look up one colour role: its Sheet (light) and Field (dark) hex, notes, and every WCAG contrast claim it appears in. Pass a role name like 'accent', 'text', 'surface', 'syn-keyword'.", "inputSchema": strObj("", true, "role", "role name, e.g. accent, text, surface, status-err, syn-keyword")},
		{"name": "list_components", "description": "List the React component library (names only).", "inputSchema": strObj("", false, "", "")},
		{"name": "get_component", "description": "Return the full reference for one component: summary, anatomy, typed props table, and accessibility notes. Pass a component name like 'Button', 'Modal', 'Tabs'.", "inputSchema": strObj("", true, "name", "component name, e.g. Button, Modal, Tabs, Table")},
		{"name": "get_principles", "description": "Return the design principles: values, structural + interaction principles, and the named rules.", "inputSchema": strObj("", false, "", "")},
	}
}

func (s *server) handleToolCall(req rpcRequest) {
	var call struct {
		Name      string          `json:"name"`
		Arguments json.RawMessage `json:"arguments"`
	}
	if err := json.Unmarshal(req.Params, &call); err != nil {
		s.replyError(req.ID, -32602, "invalid params")
		return
	}
	var args map[string]any
	if len(call.Arguments) > 0 {
		if err := json.Unmarshal(call.Arguments, &args); err != nil {
			s.replyError(req.ID, -32602, "invalid arguments")
			return
		}
	}
	arg := func(key string) string {
		if v, ok := args[key].(string); ok {
			return v
		}
		return ""
	}

	var text string
	isErr := false
	switch call.Name {
	case "list_tokens":
		text = s.textListTokens()
	case "get_token":
		text, isErr = s.textGetToken(arg("role"))
	case "list_components":
		text, isErr = s.textListComponents()
	case "get_component":
		text, isErr = s.textGetComponent(arg("name"))
	case "get_principles":
		text, isErr = s.readDoc(filepath.Join("docs", "PRINCIPLES.md"))
	default:
		s.toolError(req.ID, "unknown tool: "+call.Name)
		return
	}
	s.toolResult(req.ID, text, isErr)
}

func (s *server) textListTokens() string {
	var b strings.Builder
	b.WriteString("# Jylhis colour roles\n\n")
	for key, g := range s.tokens.Groups {
		fmt.Fprintf(&b, "## %s (%s)\n%s\n- roles: %s\n\n", g.Label, key, g.Blurb, strings.Join(g.Members, ", "))
	}
	return b.String()
}

func (s *server) textGetToken(role string) (string, bool) {
	if role == "" {
		return "missing 'role' argument", true
	}
	e, ok := s.tokens.role(role)
	if !ok {
		return fmt.Sprintf("unknown role %q — call list_tokens for the full set", role), true
	}
	var b strings.Builder
	fmt.Fprintf(&b, "# %s\n\n- Sheet (light): %s\n- Field (dark): %s\n", role, e.Light, e.Dark)
	if e.Notes != "" {
		fmt.Fprintf(&b, "- notes: %s\n", e.Notes)
	}
	if e.Modus != "" {
		fmt.Fprintf(&b, "- modus: %s\n", e.Modus)
	}
	if p, ok := s.tokens.Pairs[role]; ok {
		fmt.Fprintf(&b, "- paired foreground: %s (min %.1f:1 — %s)\n", p.FG, p.Min, p.Label)
	}
	var claims []string
	for _, c := range s.tokens.Contrast {
		if c.FG == role || c.BG == role {
			claims = append(claims, fmt.Sprintf("  - %s on %s (%s): ≥ %.1f:1 — %s", c.FG, c.BG, c.Mode, c.Min, c.Label))
		}
	}
	if len(claims) > 0 {
		b.WriteString("- contrast claims:\n")
		b.WriteString(strings.Join(claims, "\n"))
		b.WriteString("\n")
	}
	return b.String(), false
}

func (s *server) textListComponents() (string, bool) {
	entries, err := os.ReadDir(filepath.Join(s.root, "components"))
	if err != nil {
		return "cannot read components/: " + err.Error(), true
	}
	var names []string
	for _, e := range entries {
		if e.IsDir() {
			names = append(names, e.Name())
		}
	}
	return "# Components\n\n- " + strings.Join(names, "\n- ") + "\n", false
}

func (s *server) textGetComponent(name string) (string, bool) {
	if name == "" {
		return "missing 'name' argument", true
	}
	// Serve the generated reference; fall back to the raw .d.ts if absent.
	if txt, ok := s.readDoc(filepath.Join("docs", "components", name+".md")); !ok {
		return txt, false
	}
	if b, err := os.ReadFile(filepath.Join(s.root, "components", name, name+".d.ts")); err == nil {
		return "# " + name + " (types)\n\n```ts\n" + string(b) + "\n```\n", false
	}
	return fmt.Sprintf("unknown component %q — call list_components", name), true
}

// readDoc returns (text,false) on success, (errmsg,true) on failure.
func (s *server) readDoc(rel string) (string, bool) {
	b, err := os.ReadFile(filepath.Join(s.root, rel))
	if err != nil {
		return "cannot read " + rel + ": " + err.Error(), true
	}
	return string(b), false
}

// ─── reply helpers ───────────────────────────────────────────────────

func (s *server) toolResult(id json.RawMessage, text string, isError bool) {
	s.reply(id, map[string]any{
		"content": []map[string]any{{"type": "text", "text": text}},
		"isError": isError,
	})
}

func (s *server) toolError(id json.RawMessage, text string) { s.toolResult(id, text, true) }

func (s *server) reply(id json.RawMessage, result any) {
	s.write(rpcResponse{JSONRPC: "2.0", ID: id, Result: result})
}

func (s *server) replyError(id json.RawMessage, code int, msg string) {
	s.write(rpcResponse{JSONRPC: "2.0", ID: id, Error: &rpcError{Code: code, Message: msg}})
}

// write emits one JSON-RPC frame. A dropped frame leaves the client waiting for
// a reply that never arrives, so failures are reported on stderr.
func (s *server) write(resp rpcResponse) {
	b, err := json.Marshal(resp)
	if err != nil {
		fmt.Fprintln(os.Stderr, "jylhis-design-mcp: marshal response:", err)
		return
	}
	if _, err := s.out.Write(b); err != nil {
		fmt.Fprintln(os.Stderr, "jylhis-design-mcp: write response:", err)
		return
	}
	if err := s.out.WriteByte('\n'); err != nil {
		fmt.Fprintln(os.Stderr, "jylhis-design-mcp: write response:", err)
		return
	}
	if err := s.out.Flush(); err != nil {
		fmt.Fprintln(os.Stderr, "jylhis-design-mcp: flush response:", err)
	}
}
