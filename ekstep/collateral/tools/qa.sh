#!/bin/zsh
# qa.sh deck.pptx outdir : export the deck to PDF with Keynote, then one PNG per slide in outdir.
set -e
deck="${1:A}"; out="${2:A}"; here="${0:A:h}"; name="${deck:t:r}"
mkdir -p "$out"; rm -f "$out"/p*.png(N) "$out/deck.pdf"
# Fresh Keynote each time: a half-finished import makes later exports time out.
pkill -x Keynote 2>/dev/null || true
while pgrep -x Keynote >/dev/null; do sleep 1; done
# Opening a large .pptx can take minutes; open it without blocking, then wait for the document.
open -a Keynote "$deck"
for i in {1..120}; do
  osascript -e "tell application \"Keynote\" to exists document \"$name\"" 2>/dev/null | grep -q true && break
  sleep 2
done
osascript <<OSA
with timeout of 600 seconds
tell application "Keynote"
  set d to document "$name"
  export d to POSIX file "$out/deck.pdf" as PDF
  close d saving no
end tell
end timeout
OSA
swift "$here/render.swift" "$out/deck.pdf" "$out"
