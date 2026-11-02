# Bot Prompt 1 — Visual Identity

Send this as the first `send_message` to the remixed bot project.

Fill in all [PLACEHOLDERS] before sending.

---

```
## Section 1: Visual Identity

Update the bot's visual identity throughout the project.

1. In src/components/Nav.tsx:
   - Bot name: "[BOT NAME]" (e.g. "Siza" or "Saarthi")
   - Tagline: "[TAGLINE]" (e.g. "Your livelihoods guide, Limpopo" — concise, specific, no em dashes)
   - Nav background: [PRIMARY_HEX]
   - Remove SideToggle if present

2. In tailwind.config.ts:
   - primary: "[PRIMARY_HEX]"
   - primary-dark: "[PRIMARY_DARK_HEX]"
   - accent: "[ACCENT_HEX]"

3. In src/index.css or src/App.css:
   - Set --primary, --primary-dark, --accent CSS variables to the same hex values

4. In index.html:
   - <title>[BOT NAME] — [TAGLINE SHORT]</title>
   - <meta name="description" content="[One sentence about what this bot does]">
```

---

## Fill-in guide

| Placeholder | Example |
|-------------|---------|
| BOT NAME | Siza |
| TAGLINE | Your livelihoods guide, Limpopo |
| PRIMARY_HEX | #1E40AF |
| PRIMARY_DARK_HEX | #1E3A8A |
| ACCENT_HEX | #3B82F6 |
