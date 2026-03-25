import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'

function VariableNodeView({ node, updateAttributes, editor }: NodeViewProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(node.attrs.value ?? '')
  const [isEditable, setIsEditable] = useState(editor.isEditable)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep isEditable in sync reactively.
  // setEditable() calls view.setProps() directly (no transaction) and emits 'update'.
  useEffect(() => {
    const sync = () => setIsEditable(editor.isEditable)
    editor.on('update', sync)
    return () => { editor.off('update', sync) }
  }, [editor])

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  // Exit edit mode if editor becomes readonly
  useEffect(() => {
    if (!isEditable && editing) setEditing(false)
  }, [isEditable, editing])

  const confirm = () => {
    updateAttributes({ value: draft.trim() })
    setEditing(false)
  }

  const cancel = () => {
    setDraft(node.attrs.value ?? '')
    setEditing(false)
  }

  const hasFill = Boolean(node.attrs.value)

  const chipClass = [
    'magic-text-editor__variable-chip',
    hasFill ? 'magic-text-editor__variable-chip--filled' : '',
    !isEditable ? 'magic-text-editor__variable-chip--readonly' : '',
  ].filter(Boolean).join(' ')

  return (
    <NodeViewWrapper as="span" className="magic-text-editor__variable" contentEditable={false}>
      {editing && isEditable ? (
        <input
          ref={inputRef}
          className="magic-text-editor__variable-edit"
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
          className={chipClass}
          onClick={() => isEditable && setEditing(true)}
          title={hasFill ? `${node.attrs.label}: ${node.attrs.value}` : isEditable ? `Click to fill ${node.attrs.label}` : node.attrs.label}
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
