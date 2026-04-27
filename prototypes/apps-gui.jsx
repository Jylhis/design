/* global React */
// apps-gui.jsx — browser, slack, AI panel

const { useState: useStateGui } = React;

function Browser({ showHints = false }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <span style={{ color: 'var(--color-text-faint)' }}>◀ ▶</span>
        <div className="url-box">
          <span className="scheme">https://</span>
          <span className="host">docs.astro.build</span>
          <span style={{ color: 'var(--color-text-muted)' }}>/en/guides/content-collections/</span>
        </div>
        <span style={{ color: 'var(--color-text-faint)' }}>qutebrowser · NORMAL</span>
      </div>
      <div className="browser-tabs">
        <div className="tab active"><span className="num">1</span> Astro Docs · Content Collections</div>
        <div className="tab"><span className="num">2</span> github.com/markusj/jylhis · PR #42</div>
        <div className="tab"><span className="num">3</span> news.ycombinator.com</div>
        <div className="tab"><span className="num">4</span> claude.ai · desktop env brainstorm</div>
      </div>
      <div className="browser-content">
        <h1>Content Collections</h1>
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Type-safe content with frontmatter validation.</p>
        <p>{showHints && <span className="link-hint">aa</span>}Content collections help you <a href="#">organize your Markdown</a> and <a href="#">{showHints && <span className="link-hint">as</span>}type-check your frontmatter</a> with schemas.</p>
        <h2>Defining a collection</h2>
        <p>{showHints && <span className="link-hint">ad</span>}Use <code>defineCollection()</code> to declare the shape of entries. The schema is enforced at build time, so missing or malformed frontmatter fails fast — closer to a compile error than a runtime surprise.</p>
        <p>Each collection is a folder under <code>src/content/</code>. The folder name becomes the collection's id; entries inside are validated against the schema you provide.</p>
        <h2>Querying entries</h2>
        <p>Use <code>getCollection('notes')</code> to fetch all entries from a collection. Filter callbacks run at build time and are tree-shaken — pages that don't reference draft entries won't ship them.</p>
      </div>
      {showHints && (
        <div className="browser-hints">
          <span className="hint"><span className="key">f</span> follow link</span>
          <span className="hint"><span className="key">F</span> new tab</span>
          <span className="hint"><span className="key">o</span> open url</span>
          <span className="hint"><span className="key">/</span> find</span>
          <span className="hint"><span className="key">gt</span> next tab</span>
          <span className="hint"><span className="key">d</span> close tab</span>
        </div>
      )}
    </div>
  );
}

function Slack() {
  return (
    <div className="slack">
      <div className="slack-side">
        <div className="group">workspace · jylhis</div>
        <div className="ch"><span className="hash">#</span> announcements</div>
        <div className="ch active"><span className="hash">#</span> desktop-env<span className="badge">3</span></div>
        <div className="ch"><span className="hash">#</span> infra</div>
        <div className="ch"><span className="hash">#</span> nixos</div>
        <div className="ch"><span className="hash">#</span> random</div>
        <div className="group">direct</div>
        <div className="ch"><span className="hash">●</span> anna k.</div>
        <div className="ch"><span className="hash">●</span> tomas l.<span className="badge">1</span></div>
        <div className="ch"><span className="hash">○</span> ops-bot</div>
        <div className="group">threads</div>
        <div className="ch"><span className="hash">▸</span> waybar tweaks</div>
        <div className="ch"><span className="hash">▸</span> shadcn vs hand-roll</div>
      </div>
      <div className="slack-main">
        <div className="slack-head">
          <span style={{ color: 'var(--color-accent)' }}>#</span>
          <span>desktop-env</span>
          <span style={{ color: 'var(--color-text-faint)' }}>·</span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>experiments with hyprland + niri + custom panels</span>
          <span className="meta">4 members</span>
        </div>
        <div className="slack-msgs">
          <div className="slack-msg">
            <div className="av">AK</div>
            <div>
              <div><span className="who">anna k.</span><span className="when">13:48</span></div>
              <div className="body">have you tried scrolling-strip workspaces? niri's metaphor is really clicking for me — workspaces stop being numbered slots and become a continuous timeline of contexts.</div>
            </div>
          </div>
          <div className="slack-msg">
            <div className="av you">MJ</div>
            <div>
              <div><span className="who">markus</span><span className="when">13:51</span></div>
              <div className="body">yeah i've been mocking it up. main thing i miss is the named context — &quot;site&quot;, &quot;ai&quot;, &quot;mail&quot; rather than 1/2/3. PR up:</div>
              <div className="body"><a href="#">github.com/markusj/jylhis · PR #42</a> <span style={{ color: 'var(--color-text-faint)' }}>scrolling workspace metaphor</span></div>
            </div>
          </div>
          <div className="slack-msg">
            <div className="av">TL</div>
            <div>
              <div><span className="who">tomas l.</span><span className="when">13:55</span></div>
              <div className="body">"whisper bar" idea is interesting. is that one persistent line or contextual?</div>
              <div className="body"><span className="quote">{`> a persistent bottom line that surfaces ambient
> context — now playing, last command, AI draft.`}</span></div>
            </div>
          </div>
          <div className="slack-msg">
            <div className="av">AK</div>
            <div>
              <div><span className="who">anna k.</span><span className="when">14:02</span></div>
              <div className="body">left a review on the PR — mostly nits. one real q: how do you reconcile workspace order with muscle memory if names move? <code>Super+1</code> shouldn't become a moving target.</div>
            </div>
          </div>
        </div>
        <div className="slack-input">
          <span className="prompt">{'>'}</span>
          <span style={{ color: 'var(--color-text-faint)' }}>message #desktop-env…</span>
          <span style={{ marginLeft: 'auto', color: 'var(--color-text-faint)', fontSize: 10.5 }}>↵ send · ⇧↵ newline · /ai for AI assist</span>
        </div>
      </div>
    </div>
  );
}

function AIPanel({ withSelection = false, mode = 'panel' }) {
  return (
    <div className="ai">
      <div className="ai-head">
        <span style={{ color: 'var(--color-accent)' }}>◆</span>
        <span>claude</span>
        <span className="badge">sonnet 4.5</span>
        {mode === 'overlay' && <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>· quake summon</span>}
        <span className="ctx">ctx: <span style={{ color: 'var(--color-text-muted)' }}>emacs · astro.config.mjs</span></span>
      </div>
      <div className="ai-msgs">
        {withSelection && (
          <div className="ai-msg user">
            <div className="role">you</div>
            <div>
              <div className="selection-cite">{`integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'jylhis-paper' },
})],`}</div>
              <p>why does shikiConfig.theme not pick up dark mode? it stays paper even when prefers-color-scheme is dark.</p>
            </div>
          </div>
        )}
        <div className="ai-msg assistant">
          <div className="role">claude</div>
          <div>
            <p>Shiki resolves the theme at build time, not at request time — so a single string locks you to one palette in the rendered HTML. Two ways out:</p>
            <p><strong>1. Pass both themes</strong> and Shiki emits CSS variables that swap with your color-scheme:</p>
            <pre><span className="key">shikiConfig</span>: {`{`}{'\n'}  <span className="key">themes</span>: {`{`}{'\n'}    <span className="key">light</span>: <span className="str">'jylhis-paper'</span>,{'\n'}    <span className="key">dark</span>: <span className="str">'jylhis-roast'</span>{'\n'}  {`}`}{'\n'}{`}`}</pre>
            <p>This generates two style sets gated on <code>[data-theme]</code> selectors, matching your <code>tokens.md</code> dark/light split.</p>
            <p><strong>2. Or, render twice</strong> server-side and toggle visibility — heavier payload but pixel-identical control. Given your jylhis-paper / jylhis-roast palette already share token names, option 1 is cleaner.</p>
          </div>
        </div>
      </div>
      <div className="ai-input">
        <span className="prompt">◆</span>
        <span style={{ color: 'var(--color-text-faint)' }}>follow up… <span style={{ marginLeft: 12, color: 'var(--color-text-muted)' }}>{withSelection ? '+ buffer · + selection · + git diff' : '+ context'}</span></span>
        <span className="hint">↵ send · @ context · / commands</span>
      </div>
    </div>
  );
}

Object.assign(window, { Browser, Slack, AIPanel });
