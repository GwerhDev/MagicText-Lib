import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'

interface VariableNodeViewProps {
  node: { attrs: { label: string; value: string } }
  updateAttributes: (attrs: Partial<{ label: string; value: string }>) => void
}

function VariableNodeView({ node, updateAttributes }: VariableNodeViewProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(node.attrs.value ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const confirm = () => {
    updateAttributes({ value: draft.trim() })
    setEditing(false)
  }

  const cancel = () => {
    setDraft(node.attrs.value ?? '')
    setEditing(false)
  }

  const hasFill = Boolean(node.attrs.value)

  return (
    <NodeViewWrapper as="span" className="magic-editor__variable" contentEditable={false}>
      {editing ? (
        <input
          ref={inputRef}
          className="magic-editor__variable-edit"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={confirm}
          onKeyDown={e => {
            e.stopPropagation()
            if (e.key === 'Enter') { e.preventDefault(); confirm() }
            if (e.key === 'Escape') { e.preventDefault(); cancel() }
          }}
          placeholder={node.attrs.label}
          size={Math.max((draft || node.attrs.label).length, 4)}
        />
      ) : (
        <span
          className={`magic-editor__variable-chip${hasFill ? ' magic-editor__variable-chip--filled' : ''}`}
          onClick={() => setEditing(true)}
          title={hasFill ? `${node.attrs.label}: ${node.attrs.value}` : `Click to fill ${node.attrs.label}`}
        >
          {hasFill ? node.attrs.value : node.attrs.label}
        </span>
      )}
    </NodeViewWrapper>
  )
}

export const VariableExtension = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: { default: null },
      value: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="variable"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'variable' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableNodeView)
  },
})
