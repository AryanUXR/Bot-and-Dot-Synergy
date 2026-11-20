#!/usr/bin/env bash
# Deploy the Blue Dots Assistant to one of its two Vercel projects (team: BlueDots).
#   scripts/deploy.sh uat    -> https://blue-dots-assistant-uat.vercel.app  (test here first)
#   scripts/deploy.sh prod   -> https://blue-dots-assistant.vercel.app      (only after UAT is checked)
set -euo pipefail
cd "$(dirname "$0")/.."
ORG=team_3Kv2Hpzy6u21MXPkYoSV3X8p
case "${1:-}" in
  uat)  PROJECT=prj_hyvzbM35Olbih9qmkL2dpCk2f3op ;;
  prod) PROJECT=prj_FHp44Sw4OOZ1oZ7oiOLEvF2lFlpC
        read -r -p "Deploy to PRODUCTION? Was this build checked on UAT? (yes/no) " ok
        [ "$ok" = "yes" ] || { echo "Stopped."; exit 1; } ;;
  *) echo "Usage: scripts/deploy.sh uat|prod"; exit 1 ;;
esac
VERCEL_ORG_ID=$ORG VERCEL_PROJECT_ID=$PROJECT npx --yes vercel@latest deploy --prod --yes
