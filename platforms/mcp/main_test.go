package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"os"
	"strings"
	"testing"
)

func call(t *testing.T, params string) rpcResponse {
	t.Helper()
	var buf bytes.Buffer
	s := &server{out: bufio.NewWriter(&buf)}
	s.handleToolCall(rpcRequest{JSONRPC: "2.0", ID: json.RawMessage(`1`), Params: json.RawMessage(params)})

	var resp rpcResponse
	if err := json.Unmarshal(buf.Bytes(), &resp); err != nil {
		t.Fatalf("response %q is not JSON: %v", buf.String(), err)
	}
	return resp
}

func TestHandleToolCallRejectsMalformedArguments(t *testing.T) {
	resp := call(t, `{"name":"get_token","arguments":"accent"}`)
	if resp.Error == nil {
		t.Fatalf("malformed arguments must be an error, got result %v", resp.Result)
	}
	if resp.Error.Code != -32602 {
		t.Errorf("code = %d, want -32602", resp.Error.Code)
	}
}

func TestHandleToolCallReadsArguments(t *testing.T) {
	resp := call(t, `{"name":"get_token","arguments":{"role":"accent"}}`)
	if resp.Error != nil {
		t.Fatalf("well-formed arguments must not error: %v", resp.Error)
	}
	// No tokens are loaded, so the role is unknown — but it was read, not
	// reported as missing.
	text, _ := json.Marshal(resp.Result)
	if strings.Contains(string(text), "missing 'role'") {
		t.Errorf("result = %s, want the role to have been parsed", text)
	}
}

type failingWriter struct{}

func (failingWriter) Write([]byte) (int, error) { return 0, errors.New("pipe closed") }

func TestWriteReportsFailureOnStderr(t *testing.T) {
	r, w, err := os.Pipe()
	if err != nil {
		t.Fatal(err)
	}
	orig := os.Stderr
	os.Stderr = w
	defer func() { os.Stderr = orig }()

	s := &server{out: bufio.NewWriterSize(failingWriter{}, 16)}
	s.write(rpcResponse{JSONRPC: "2.0", ID: json.RawMessage(`1`), Result: strings.Repeat("x", 64)})

	w.Close()
	logged, err := io.ReadAll(r)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(logged), "pipe closed") {
		t.Errorf("stderr = %q, want the write failure reported", logged)
	}
}
