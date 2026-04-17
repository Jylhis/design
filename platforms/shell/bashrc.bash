# Jylhis prompt for bash
# Two-line prompt, copper » that flips red on non-zero exit.
# Add to ~/.bashrc:

# — Colors (ANSI 16 — your terminal should be using the Jylhis colorscheme) —
# 3 = yellow  → amber path
# 2 = green   → olive branch
# 1 = red     → error glyph
# 8 = bright-black → faint clock
# Uses tput so it degrades gracefully if colors are unavailable.

__jylhis_ps1() {
  local last=$?
  local reset; reset=$(tput sgr0 2>/dev/null)
  local amber; amber=$(tput setaf 3 2>/dev/null)
  local olive; olive=$(tput setaf 2 2>/dev/null)
  local red;   red=$(tput setaf 1 2>/dev/null)
  local faint; faint=$(tput setaf 8 2>/dev/null)

  local glyph_color=$amber
  [[ $last -ne 0 ]] && glyph_color=$red

  # git branch (quiet, no output if not a repo)
  local branch=""
  if command -v git >/dev/null 2>&1; then
    branch=$(git symbolic-ref --short HEAD 2>/dev/null \
             || git rev-parse --short HEAD 2>/dev/null)
    if [[ -n $branch ]]; then
      local dirty=""
      if ! git diff --quiet 2>/dev/null; then dirty=" ${amber}✗${reset}"; fi
      if ! git diff --cached --quiet 2>/dev/null; then dirty+="${amber}✚${reset}"; fi
      branch=" on ${olive}${branch}${reset}${dirty}"
    fi
  fi

  PS1="${amber}\w${reset}${branch}\n${glyph_color}» ${reset}"
}

PROMPT_COMMAND='__jylhis_ps1'

# — LS_COLORS —
# Pair with platforms/shell/dircolors:
#   eval "$(dircolors -b ~/.config/shell/jylhis-dircolors)"

# — Aliases in the house style —
alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias diff='diff --color=auto'
