import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import type { Variable } from '../../types'
import { VariableIcon } from './icons'

interface Props {
  editor: Editor
  variables?: Variable[]
  onVariableAdd?: (variable: Variable) => void
}

export function VariableDropdown({ editor, variables = [], onVariableAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [customVars, setCustomVars] = useState<Variable[]>([])
  const [newLabel, setNewLabel] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const insert = (variable: Variable) => {
    editor.chain().focus().insertContent({
      type: 'variable',
      attrs: { label: variable.label, value: '' },
    }).run()
    setOpen(false)
  }

  const addCustom = () => {
    if (!newLabel.trim()) return
    const variable: Variable = { label: newLabel.trim() }
    setCustomVars(prev => [...prev, variable])
    onVariableAdd?.(variable)
    setNewLabel('')
    insert(variable)
  }

  const allVars = [...variables, ...customVars]

  return (
    <div className="magic-editor__var-wrap" ref={wrapRef}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen(o => !o)
        }}
        title="Insert variable"
        aria-label="Insert variable"
        aria-pressed={open}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`magic-editor__btn${open ? ' magic-editor__btn--active' : ''}`}
      >
        <VariableIcon />
      </button>

      {open && (
        <div className="magic-editor__var-dropdown" role="dialog" aria-label="Variable picker">
          {allVars.length > 0 && (
            <ul className="magic-editor__var-list" role="listbox">
              {allVars.map((v, i) => (
                <li key={i} role="option">
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); insert(v) }}
                    className="magic-editor__var-btn"
                  >
                    {v.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="magic-editor__var-add">
            <input
              className="magic-editor__var-input"
              placeholder="Custom variable…"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustom() }}
            />
            <button
              type="button"
              className="magic-editor__var-add-btn"
              onMouseDown={(e) => { e.preventDefault(); addCustom() }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
