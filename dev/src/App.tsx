import { useState } from 'react'
import { MagicEditor } from 'magic-text'
import type { JSONContent } from 'magic-text'
import '../../src/styles/editor.css'

const INITIAL_CONTENT = `<h2>Welcome to MagicText</h2><p>This is a <strong>rich text editor</strong> built with <em>TipTap</em>. Try editing the content!</p><ul><li>Bold, italic, underline</li><li>Headings and lists</li><li>Links and images</li></ul>`

export default function App() {
  const [html, setHtml] = useState(INITIAL_CONTENT)
  const [json, setJson] = useState<JSONContent | null>(null)
  const [editable, setEditable] = useState(true)

  return (
    <div style={{ maxWidth: 860, margin: '40px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>MagicText Dev</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Development playground — not included in the npm package.</p>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={() => setEditable((v) => !v)}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer', background: editable ? '#f1f5f9' : '#fff' }}
        >
          {editable ? 'Switch to Read-only' : 'Switch to Editable'}
        </button>
        <button
          onClick={() => setHtml('')}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <MagicEditor
        content={html}
        onChange={(nextHtml: string, nextJson: JSONContent) => { setHtml(nextHtml); setJson(nextJson) }}
        placeholder="Start writing something..."
        editable={editable}
      />

      <details style={{ marginTop: 32 }}>
        <summary style={{ cursor: 'pointer', color: '#475569', fontWeight: 500, marginBottom: 8 }}>
          HTML output
        </summary>
        <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, overflow: 'auto', fontSize: 13, lineHeight: 1.6 }}>
          {html}
        </pre>
      </details>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', color: '#475569', fontWeight: 500, marginBottom: 8 }}>
          JSON output
        </summary>
        <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, overflow: 'auto', fontSize: 13, lineHeight: 1.6 }}>
          {JSON.stringify(json, null, 2)}
        </pre>
      </details>
    </div>
  )
}
