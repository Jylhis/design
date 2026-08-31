# Jylhis prompt for zsh / starship
# Two options: native zsh prompt, or starship.toml.
#
# — NATIVE ZSH —
# Add to ~/.zshrc:

autoload -Uz vcs_info
precmd() { vcs_info }
setopt prompt_subst

zstyle ':vcs_info:git:*' formats ' on %F{green}%b%f%u%c'
zstyle ':vcs_info:git:*' actionformats ' on %F{green}%b%f %F{red}(%a)%f'
zstyle ':vcs_info:git:*' check-for-changes true
zstyle ':vcs_info:git:*' stagedstr   ' %F{yellow}✚%f'
zstyle ':vcs_info:git:*' unstagedstr ' %F{yellow}✗%f'

# Two-line prompt. First line: path + git. Second line: » accent/red glyph.
PROMPT='%F{yellow}%~%f${vcs_info_msg_0_}
%(?.%F{yellow}.%F{red})» %f'

RPROMPT='%F{8}%*%f'   # bright-black clock on the right

# — LS_COLORS —
# Pair with platforms/shell/dircolors:
#   eval "$(dircolors -b ~/.config/shell/jylhis-dircolors)"

# — STARSHIP ALT — see platforms/shell/starship.toml
