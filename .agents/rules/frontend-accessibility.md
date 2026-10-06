---
trigger: glob
globs: "src/**/*.tsx"
description: Accessibility is required even if the user did not mention it
---

# Accessibility

- Semantic HTML, visible labels, keyboard access, 48px minimum touch targets.
- Dialogs need focus management and an accessible name.
- Live regions for async status where users would otherwise miss errors.
- Do not weaken WCAG for aesthetic choices. Pair with `typeui-fundamentals`.
