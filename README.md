# magic-text

Rich text editor component for React, built on top of [TipTap](https://tiptap.dev).

## Installation

```bash
npm install magic-text
```

> **Peer dependencies:** `react` and `react-dom` >= 18 must be installed in your project.

## Usage

```tsx
import { MagicEditor } from 'magic-text'
import 'magic-text/styles'

export default function App() {
  return (
    <MagicEditor
      placeholder="Start writing..."
      onChange={(html, json) => console.log(html, json)}
    />
  )
}
```

### Controlled mode

```tsx
const [html, setHtml] = useState('')

<MagicEditor
  content={html}
  onChange={(nextHtml) => setHtml(nextHtml)}
/>
```

### Read-only mode

```tsx
<MagicEditor content={html} editable={false} />
```

## Props

| Prop               | Type                                              | Default               | Description                                      |
| ------------------ | ------------------------------------------------- | --------------------- | ------------------------------------------------ |
| `content`          | `string`                                          | `''`                  | HTML content. Acts as controlled value when combined with `onChange`. |
| `onChange`         | `(html: string, json: JSONContent) => void`       | —                     | Fired on every content change.                   |
| `onBlur`           | `(html: string, json: JSONContent) => void`       | —                     | Fired when the editor loses focus.               |
| `onFocus`          | `(html: string, json: JSONContent) => void`       | —                     | Fired when the editor gains focus.               |
| `placeholder`      | `string`                                          | `'Write something...'`| Placeholder shown when the editor is empty.      |
| `editable`         | `boolean`                                         | `true`                | Toggles edit mode. Hides toolbar when `false`.   |
| `autofocus`        | `boolean \| 'start' \| 'end' \| 'all' \| number` | `false`               | Autofocus the editor on mount.                   |
| `className`        | `string`                                          | —                     | Extra class for the root wrapper.                |
| `toolbarClassName` | `string`                                          | —                     | Extra class for the toolbar.                     |
| `contentClassName` | `string`                                          | —                     | Extra class for the content area.                |

## Toolbar features

| Group       | Actions                                              |
| ----------- | ---------------------------------------------------- |
| History     | Undo, Redo                                           |
| Formatting  | Bold, Italic, Underline, Strikethrough, Highlight    |
| Headings    | H1, H2, H3                                           |
| Lists       | Bullet list, Ordered list                            |
| Blocks      | Blockquote, Code block, Horizontal rule              |
| Alignment   | Left, Center, Right                                  |
| Insert      | Link, Image                                          |

## Styles

Styles are distributed as a separate CSS file so you can opt in:

```tsx
import 'magic-text/styles'
```

Classes follow the `magic-editor__*` BEM convention so they are easy to override.

## Development

```bash
# Start the dev playground (dev/ directory, not included in the npm package)
npm run dev

# Build the library
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck
```

## License

MIT
