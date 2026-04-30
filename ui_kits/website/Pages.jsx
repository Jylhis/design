// Pages.jsx — page-specific content for the click-thru prototype
const HomePage = ({ onNav }) => (
  <div className="home-intro">
    <h1 className="headline">Build More, Work Less</h1>
    <p className="role">senior software engineer · Zürich, CH</p>
    <p className="tagline">Ship code from embedded firmware to distributed cloud systems. Transform how teams build, test, and deploy software.</p>
    <div className="home-greeting">
      <p>I don't have enough hours in the day to build everything I want — and neither do you. That's why I focus on creating more with less time, actively working on not working by automating my job away one solution at a time.</p>
      <p>Drive organisational change through DevOps transformations, security implementations, and developer workflow optimization. The kind of engineer who fixes problems before customers notice them.</p>
    </div>
    <div className="currently-box" id="currently">
      <h3 className="currently-label">// currently</h3>
      <ul className="currently-list">
        <li>building robotics and DevOps platforms at <a>Hexagon</a> in Zürich</li>
        <li>rewriting this site with Astro 5.x and a new design system</li>
      </ul>
    </div>
    <div className="contact-links">
      <a>markus@jylhis.com</a><a>github</a><a>linkedin</a>
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
    <p className="rss-line"><a className="rss-link">rss feed</a> · {NOTES.length} notes</p>
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
  { slug: 'nixos', title: 'NixOS Configuration', status: 'active', perms: 'drwxr-xr-x', date: '2024-07-17', description: 'Personal spin of Omarchy with NixOS.', tags: ['nix','flakes'], github: 'Jylhis/marchyo' },
  { slug: 'emacs', title: 'Emacs Configuration', status: 'active', perms: 'drwxr-xr-x', date: '2021-03-10', description: 'Modular literate Emacs config. Org-mode, Magit, Vertico.', tags: ['elisp','emacs'], github: 'Jylhis/emacs' },
  { slug: 'nixpkgs', title: 'nixpkgs', status: 'contributed', perms: 'dr-xr-xr-x', date: '2023-03-04', description: 'Packages and modules contributed upstream.', tags: ['nix'], github: 'NixOS/nixpkgs' },
  { slug: 'sympa', title: 'Sympa at CERN', status: 'archived', perms: 'drwxr--r--', date: '2020-08-01', description: '4× performance improvement for e-group lists. Patches upstreamed.', tags: ['perl','infra'] },
  { slug: 'ghost-spawner', title: 'Ghost Spawner', status: 'experimental', perms: 'drwx------', date: '2024-02-14', description: 'Procedural entity generator for a Godot project.', tags: ['godot','gamedev'] },
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
    <div style={{display:'flex', gap:'var(--space-md)', alignItems:'baseline', flexWrap:'wrap'}}>
      <h1 style={{margin:0}}>{project.title}</h1>
      <StatusBadge status={project.status}/>
    </div>
    <p className="subtitle">{project.description}</p>
    <h2>Highlights</h2>
    <ul>
      <li>Declarative system configuration</li>
      <li>Home Manager integration</li>
      <li>Modular architecture</li>
      <li>Reproducible builds</li>
    </ul>
    <h2>Tech</h2>
    <TagList tags={project.tags}/>
    <hr/>
    {project.github && <p>Source: <a>github.com/{project.github}</a></p>}
  </article>
);

const ResumePage = () => (
  <div className="cv-page">
    <h1>resume</h1>
    <p className="subtitle">Senior Software Engineer & DevOps Specialist — Zürich, CH</p>
    <DividerLabeled label="experience" />
    <CvEntry>
      <CvRow role>Senior Software Engineer (DevOps)</CvRow>
      <CvRow><span className="cv-company"><a>Hexagon Robotics</a></span> · <span className="cv-date">May 2025 — present</span> · Zürich</CvRow>
      <CvRow desc>Early DevOps engineer for the project.</CvRow>
      <CvRow highlight>Scaled CI infrastructure significantly</CvRow>
      <CvRow highlight>Helped introduce fully reproducible dev environments, builds and packaging</CvRow>
      <CvRow highlight>Promoted DevOps practices and culture</CvRow>
      <CvRow blank/>
      <CvRow role>Fellow — Software Development & Infrastructure</CvRow>
      <CvRow><span className="cv-company"><a>CERN</a></span> · <span className="cv-date">Aug 2020 — Apr 2022</span> · Geneva</CvRow>
      <CvRow desc>Contributed to MALT, CERN's org-wide migration from Exchange to open source.</CvRow>
      <CvRow highlight>Optimized Sympa for CERN e-groups, 4× performance improvement</CvRow>
      <CvRow blank/>
    </CvEntry>
    <DividerLabeled label="skills" />
    <CvEntry>
      <CvSkills label="languages" items={['go','rust','haskell','python','c++']}/>
      <CvSkills label="infra" items={['nixos','kubernetes','cloudflare','podman']}/>
      <CvSkills label="tools" items={['emacs','git','magit','just']}/>
    </CvEntry>
  </div>
);

const CvEntry = ({children}) => <>{children}</>;
const CvRow = ({children, role, desc, highlight, blank}) => (
  <div className="cv-entry">
    <span className="cv-line-num"></span>
    <div className={`cv-line-content ${role?'cv-role':''} ${desc?'cv-desc':''} ${highlight?'cv-highlight':''} ${blank?'blank':''}`}>
      {highlight ? `· ${children}` : children}
    </div>
  </div>
);
const CvSkills = ({label, items}) => (
  <div className="cv-entry">
    <span className="cv-line-num"></span>
    <div className="cv-line-content cv-skills-line">
      <span className="label">{label}</span><span className="bracket">: [</span>
      {items.map((it, i) => (
        <React.Fragment key={it}>
          <span className="value">{it}</span>{i < items.length - 1 && <span className="comma">, </span>}
        </React.Fragment>
      ))}
      <span className="bracket">]</span>
    </div>
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
    <p><a onClick={(e)=>{e.preventDefault(); onNav('/');}}>← back home</a></p>
  </div>
);

Object.assign(window, { HomePage, NotesPage, NoteDetail, ProjectsPage, ProjectDetail, ResumePage, NotFoundPage, NOTES, PROJECTS });
