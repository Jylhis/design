// Pages.jsx — page-specific content for the click-thru prototype
const HomePage = ({ onNav }) => (
  <div className="home-intro">
    <h1 className="headline">Build More, Work Less</h1>
    <p className="role">your role · your city</p>
    <p className="tagline">A short tagline describing what you do. Two clauses, present tense, ending with the kind of impact you want a reader to remember.</p>
    <div className="home-greeting">
      <p>One paragraph that opens the door — what you're working on, who you're working with, and the angle you take when you sit down at the keyboard. Specific, not breathless.</p>
      <p>A second paragraph that sets up the rest of the site — links to deeper reads, current focus, anything you want a stranger to know in the first thirty seconds.</p>
    </div>
    <div className="ds-callout" id="currently">
      <h2 className="ds-callout__label">currently</h2>
      <ul>
        <li>shipping a small thing at <a href="https://example.com">your company</a></li>
        <li>learning a new tool worth writing about</li>
      </ul>
    </div>
    <div className="contact-links">
      <a href="mailto:you@example.com">you@example.com</a><a href="https://github.com/your-org">github</a><a href="https://linkedin.com/in/your-handle">linkedin</a>
    </div>
  </div>
);

const NOTES = [
  { slug: 'linux-toolbox', title: 'Modern Linux Command-Line Tools', date: '2025-10-19', description: 'Modern replacements for traditional Unix tools.', tags: ['linux','cli','tools'] },
  { slug: 'nix-flakes', title: 'Nix Flakes for the Rest of Us', date: '2025-08-12', description: 'A practical intro to reproducible dev shells.', tags: ['nix','devops'] },
  { slug: 'raft-notes', title: 'Reading the Raft Paper, Again', date: '2025-06-03', description: 'Consensus without the handwave.', tags: ['distributed','notes'] },
];

const NotesPage = ({ onOpenNote }) => (
  <div>
    <h1 style={{fontSize:'1.6rem', marginBottom:'var(--space-xs)'}}>notes</h1>
    <p className="subtitle">Technical writing, documentation, and the occasional observation.</p>
    <p className="rss-line"><a className="rss-link" href="/rss.xml">rss feed</a> · {NOTES.length} notes</p>
    <ul className="notes-list">
      {NOTES.map(n => (
        <li key={n.slug}>
          <a className="note-item" href={`/notes/${n.slug}/`} onClick={(e)=>{e.preventDefault(); onOpenNote(n);}}>
            <time className="note-date">{new Date(n.date).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</time>
            <div className="note-content">
              <span className="note-title">{n.title}</span>
              <p className="note-excerpt">{n.description}</p>
              <TagList tags={n.tags} />
            </div>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const NoteDetail = ({ note }) => (
  <article className="prose">
    <ManHeader title="notes" section={7} />
    <h1>{note.title}</h1>
    <p className="subtitle">{new Date(note.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})} · 6 min read</p>
    <p>Modern replacements that are faster, friendlier, and generally less surprising than the tools they replace. This isn't a complete list — just the ones I reach for daily.</p>
    <h2>Core utilities</h2>
    <p>Most of these are Rust rewrites. They respect <code>.gitignore</code>, render with proper Unicode, and don't surprise you with BSD/GNU flag differences.</p>
    <blockquote><p>If a tool can't tell you what it's going to do before it does it, it's not a modern tool.</p></blockquote>
    <CodeBlock filename="~/.config/zsh/aliases.zsh">
{`alias ls='eza --git --icons'
alias cat='bat --paging=never'
alias find='fd'
alias grep='rg'`}
    </CodeBlock>
    <h2>System monitoring</h2>
    <p>Replace <code>htop</code> with <code>btop</code> and don't look back. Mouse support, network graphs, and per-process I/O — the works.</p>
    <hr/>
    <TagList tags={note.tags}/>
  </article>
);

const PROJECTS = [
  { slug: 'workstation', title: 'Workstation Config', status: 'active', perms: 'drwxr-xr-x', date: '2024-07-17', description: 'Reproducible dev environment, dotfiles, and system setup.', tags: ['nix','flakes'], github: 'your-org/dotfiles' },
  { slug: 'editor', title: 'Editor Config', status: 'active', perms: 'drwxr-xr-x', date: '2021-03-10', description: 'Modular literate editor setup with batteries included.', tags: ['elisp','emacs'], github: 'your-org/editor' },
  { slug: 'upstream', title: 'upstream library', status: 'contributed', perms: 'dr-xr-xr-x', date: '2023-03-04', description: 'Patches and modules contributed to a popular package.', tags: ['oss'], github: 'upstream/library' },
  { slug: 'mailing-list', title: 'mailing-list infra', status: 'archived', perms: 'drwxr--r--', date: '2020-08-01', description: 'Performance improvements to a self-hosted list manager.', tags: ['perl','infra'] },
  { slug: 'ghost-spawner', title: 'Ghost Spawner', status: 'experimental', perms: 'drwx------', date: '2024-02-14', description: 'Procedural entity generator for a side game project.', tags: ['godot','gamedev'] },
];

const ProjectsPage = ({ onOpenProject }) => (
  <div>
    <h1 style={{fontSize:'1.6rem', marginBottom:'var(--space-xs)'}}>projects</h1>
    <p className="subtitle">Things I've built, contributed to, or am currently tinkering with.</p>
    <p className="terminal-prompt"><span className="prompt-char">$</span> ls -la ~/projects/</p>
    <div className="projects-list">
      {PROJECTS.map(p => (
        <article key={p.slug}>
          <a className="project-entry" href={`/projects/${p.slug}/`} onClick={(e)=>{e.preventDefault(); onOpenProject(p);}}>
            <div className="project-header">
              <span className="perms">{p.perms}</span>
              <span className="project-name">{p.title}</span>
              <span className="project-date">{new Date(p.date).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</span>
            </div>
            <p className="project-desc">{p.description}</p>
            <TagList tags={p.tags}/>
            {p.github && <div className="project-links"><span className="tree-item">└── <span>github</span></span></div>}
          </a>
        </article>
      ))}
    </div>
  </div>
);

const ProjectDetail = ({ project }) => (
  <article className="prose">
    <ManHeader title="projects" section={7} />
    <div style={{display:'flex', gap:'var(--space-md)', alignItems:'baseline', flexWrap:'wrap', marginBottom:'var(--space-lg)'}}>
      <h1 style={{margin:0}}>{project.title}</h1>
      <StatusBadge status={project.status}/>
    </div>
    <p className="subtitle">{project.description}</p>
    <h2>Highlights</h2>
    <ul>
      <li>One specific outcome per bullet</li>
      <li>Numbers where they help, words where they don't</li>
      <li>Modular architecture</li>
      <li>Reproducible builds</li>
    </ul>
    <h2>Tech</h2>
    <TagList tags={project.tags}/>
    <hr/>
    {project.github && <p>Source: <a href={`https://github.com/${project.github}`}>github.com/{project.github}</a></p>}
  </article>
);

const ResumePage = () => (
  <div>
    <h1>resume</h1>
    <p className="subtitle">Your role · your specialty — your city</p>
    <DividerLabeled label="experience" level={2} />
    <CvEntry
      role="Senior Engineer"
      company="Acme Corp"
      date="May 2025 — present"
      location="your city"
      description="One-line description of what the role is and the team you sit on."
      highlights={[
        'One specific outcome with a number where useful',
        'A second outcome that shows breadth, not a duplicate of the first',
        'A third outcome — keep the verbs strong',
      ]}
    />
    <CvEntry
      role="Engineer"
      company="MegaOrg"
      date="Aug 2020 — Apr 2022"
      location="previous city"
      description="One-line description of the team or programme you contributed to."
      highlights={["The outcome you'd lead with in an interview"]}
    />
    <DividerLabeled label="skills" level={2} />
    <CvEntry
      skills={{
        languages: ['go','rust','haskell','python','c++'],
        infra: ['nixos','kubernetes','cloudflare','podman'],
        tools: ['emacs','git','magit','just'],
      }}
    />
  </div>
);

const NotFoundPage = ({ onNav }) => (
  <div className="prose" style={{textAlign:'center', paddingTop:'var(--space-3xl)'}}>
    <ManHeader title="404" section={1} />
    <h1>404 — not found</h1>
    <p className="subtitle">The page you asked for returned a nonzero exit code.</p>
    <pre style={{textAlign:'left', maxWidth:'42ch', margin:'var(--space-xl) auto'}}><code>{`$ curl -I /this-page
HTTP/2 404
content-type: text/plain`}</code></pre>
    <p><a href="/" onClick={(e)=>{e.preventDefault(); onNav('/');}}>← back home</a></p>
  </div>
);

Object.assign(window, { HomePage, NotesPage, NoteDetail, ProjectsPage, ProjectDetail, ResumePage, NotFoundPage, NOTES, PROJECTS });
