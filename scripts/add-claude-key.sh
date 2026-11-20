#!/usr/bin/env bash
# Saves the Claude API key into raya/.env (git-ignored) without showing it on screen.
set -euo pipefail
cd "$(dirname "$0")/.."
printf "Paste the Claude API key and press Enter (nothing will show): "
read -rs KEY
echo
KEY="$(printf '%s' "$KEY" | tr -d '[:space:]')"
case "$KEY" in
  sk-ant-*) ;;
  *) echo "That doesn't look like a Claude API key (it should start with sk-ant-). Nothing saved."; exit 1 ;;
esac
touch raya/.env
grep -v '^ANTHROPIC_API_KEY=' raya/.env > raya/.env.tmp || true
printf 'ANTHROPIC_API_KEY=%s\n' "$KEY" >> raya/.env.tmp
mv raya/.env.tmp raya/.env
chmod 600 raya/.env
unset KEY
echo "Saved to raya/.env. You can close this tab."
