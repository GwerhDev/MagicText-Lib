---
description: Full audit of MagicText-Lib — MagicTextEditor component, Toolbar subcomponents, TipTap extensions, i18n system, and types. Checks public API surface, extension patterns, i18n coverage, accessibility, and test coverage. Produces a prioritized remediation plan.
---

You are the lead reviewer for MagicText-Lib. Your job is to audit code against the project's conventions as a published React library and produce a prioritized remediation plan.

If `$ARGUMENTS` is provided, review that specific file or directory.
If no argument is given, ask the user what scope to review (single file, directory, or full project).

---

## Architecture

MagicText-Lib is a published npm library (`tiptap-magictext`) built on React 18 + TipTap 2:

```
src/
  components/
    MagicTextEditor/   Main component — MagicTextEditor.tsx + test + index.ts
    Toolbar/           ToolbarButton, ToolbarDivider, ImagePopover, LinkPopover,
                       TTSPopover, VariableDropdown, icons.tsx
  extensions/          Custom TipTap extensions — TTSMarkExtension, VariableExtension
  i18n/                TranslationsContext, locale files (en.ts, es.ts), types
  styles/              editor.css — single importable stylesheet
  types/               Public TypeScript types exported from the library
  index.ts             Public entrypoint — exports MagicTextEditor + public types only
```

**Library rules:**
- `src/index.ts` exports only the public API — no internal subcomponents, no extension classes
- Extensions must follow TipTap's `Extension.create()` / `Mark.create()` / `Node.create()` pattern
- i18n strings must exist in both `en.ts` and `es.ts` — no key missing in either locale
- No side effects at module level — no `document` access, no `window` references outside of components
- CSS class naming: BEM — `.magic-text-editor`, `.magic-text-editor__toolbar`, `.magic-text-editor__content`

---

## What to check

### A. Public API surface

- **`src/index.ts` exports:** verify only `MagicTextEditor` and types from `src/types/` are exported. Flag any internal component or extension exported directly.
- **Prop types in `src/types/`:** all props used by `MagicTextEditor` must be in `MagicTextEditorProps` — flag any prop accepted but not declared in the public type.
- **Breaking change risk:** flag any prop rename, removal, or type narrowing that would break existing consumers without a major version bump.

### B. Naming conventions

| Context | Convention | Example |
|---|---|---|
| Component files | `PascalCase.tsx` | `MagicTextEditor.tsx`, `ToolbarButton.tsx` |
| Extension files | `PascalCase` + `Extension` suffix | `TTSMarkExtension.ts`, `VariableExtension.tsx` |
| Test files | `ComponentName.test.tsx` | `MagicTextEditor.test.tsx` |
| i18n keys | flat `camelCase` | `bold`, `insertLink`, `ttsPlay` |
| CSS classes | BEM | `.magic-text-editor__toolbar-btn` |
| Public types | `PascalCase` | `MagicTextEditorProps`, `TTSMark`, `Variable` |

Flag any deviation.

### C. TipTap extension patterns

- Extensions must use `Extension.create()`, `Mark.create()`, or `Node.create()` — no class inheritance from TipTap internals.
- Extensions must declare `name`, `addAttributes()`, `parseHTML()`, and `renderHTML()` when applicable.
- Commands added via `addCommands()` must be typed — flag any command without a TypeScript declaration in TipTap's `Commands` interface.
- Extensions must not access `document` or `window` directly — use TipTap's `editor` instance APIs.

### D. i18n coverage

- Every user-visible string in JSX (button labels, tooltips, placeholders, aria-labels) must use the i18n context — flag any hardcoded English string.
- Every key present in `en.ts` must also exist in `es.ts` with the same structure — report any missing keys in either locale.
- The i18n types file must match the shape of the locale objects — flag any key in `en.ts` not covered by the TypeScript type.

### E. Accessibility

- Every toolbar button must have an `aria-label` sourced from i18n — not hardcoded.
- Icon-only buttons must have a visible tooltip or `title` attribute.
- The editor container must have `role="textbox"` and `aria-multiline="true"` (TipTap sets this — verify it's not overridden).
- Flag any interactive element without keyboard focus handling.

### F. Type safety

- Flag any `any` type in component props, extension attributes, or i18n types.
- Flag missing generic constraints in extension `addAttributes()` return types.
- Flag non-null assertions (`!`) on TipTap editor references — the editor can be null during SSR or before mount.

### G. Tests

Current coverage: `MagicTextEditor.test.tsx` (render) and `i18n.test.ts`. Report what's missing:

- **High:** TipTap extension commands (TTSMark apply/remove, Variable insert/update), Toolbar button interactions
- **Medium:** Popover open/close behavior (ImagePopover, LinkPopover, TTSPopover), VariableDropdown selection
- **Low:** ToolbarDivider render, icon rendering

Test conventions: Vitest + `@testing-library/react`. Use `getByTestId` as the primary selector — never `getByText` or `getByRole`.

---

## Output format

For each file reviewed:

```
### src/components/Toolbar/TTSPopover.tsx

Public API
✓ Not exported from src/index.ts (internal component — correct)

Naming
✓ PascalCase filename

i18n
✓ Uses useTranslations() hook
⚠ Line 34: aria-label="Play" hardcoded — use t.ttsPlay

Accessibility
⚠ Line 45: icon-only button missing aria-label

Type safety
✓ Props fully typed
⚠ Line 12: editor!.chain() — add null guard before accessing editor

Tests
⚠ No test for popover open/close — HIGH priority
```

---

## Remediation plan

```
## Remediation Plan

### P1 — Quick wins
- [ ] Add aria-labels from i18n to all toolbar buttons missing them (list)
- [ ] Add missing i18n keys to es.ts (list keys)
- [ ] Fix any types in extension attributes (list)
- [ ] Add null guards on editor references (list)

### P2 — API surface
- [ ] Remove any internal exports from src/index.ts (list)
- [ ] Add missing props to MagicTextEditorProps (list)

### P3 — Extension correctness
- [ ] Add TypeScript command declarations for custom commands (list)
- [ ] Add parseHTML / renderHTML to extensions missing them (list)

### P4 — Test coverage
- [ ] Write tests for High-priority extension commands (list)
- [ ] Write tests for Popover components (list)
- [ ] Write tests for VariableDropdown selection
```

Show counts: total findings, by severity (P1/P2/P3/P4), by category.
