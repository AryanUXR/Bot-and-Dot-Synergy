// Card alignment check: paste into the browser console on any bot page (any platform), or run it
// through a browser tool. Checks every row of persona cards: same top, same height, and the photo,
// name and label at the same height in every card. Run it at 1440 px and at 390 px wide.
// Prints PASS or the exact differences in pixels.
(() => {
  // A persona card: a clickable element holding a heading. Lovable cards are <button aria-label="Open …">,
  // the starter's are <button class="card">.
  const cards = [...document.querySelectorAll('button, a, [role="button"], .card')]
    .filter(el => el.querySelector('h2, h3') && el.getBoundingClientRect().height > 200);
  if (cards.length < 2) return 'FAIL: found fewer than 2 persona cards';
  const pos = (card, sel) => { const el = card.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().top - card.getBoundingClientRect().top) : null; };
  const rows = {};
  for (const c of cards) {
    const r = c.getBoundingClientRect();
    const label = c.querySelector('h2, h3')?.nextElementSibling;
    (rows[Math.round(r.top + scrollY)] ||= []).push({
      name: c.querySelector('h2, h3').textContent.trim(),
      height: Math.round(r.height),
      photo: pos(c, 'img, .photo'),
      heading: pos(c, 'h2, h3'),
      label: label ? Math.round(label.getBoundingClientRect().top - r.top) : null,
      labelStyle: label ? `${getComputedStyle(label).backgroundColor} / ${getComputedStyle(label).borderRadius}` : null,
    });
  }
  const problems = [];
  for (const row of Object.values(rows)) {
    if (row.length < 2) continue;
    for (const k of ['height', 'photo', 'heading', 'label']) {
      const vals = [...new Set(row.map(c => c[k]))];
      if (vals.length > 1 && Math.max(...vals) - Math.min(...vals) > 2)
        problems.push(`${k} differs: ` + row.map(c => `${c.name}=${c[k]}`).join(', '));
    }
  }
  const radii = [...new Set(cards.map(c => getComputedStyle(c.querySelector('h2, h3')?.nextElementSibling || c).borderRadius))];
  if (radii.length > 1) problems.push(`labels use ${radii.length} different shapes: ${radii.join(' | ')}`);
  return problems.length ? 'FAIL\n' + problems.join('\n') : `PASS: ${cards.length} cards in ${Object.keys(rows).length} row(s) line up`;
})();
