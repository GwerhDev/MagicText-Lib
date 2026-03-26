import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MagicTextEditor } from './MagicTextEditor'
import type { Variable } from '../../types'

describe('MagicTextEditor', () => {
  // ─── Root & layout ──────────────────────────────────────────────────────────

  it('renders the root element', () => {
    const { container } = render(<MagicTextEditor />)
    expect(container.querySelector('.magic-text-editor')).toBeInTheDocument()
  })

  it('renders the content area', () => {
    const { container } = render(<MagicTextEditor />)
    expect(container.querySelector('.magic-text-editor__content')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<MagicTextEditor className="my-custom-class" />)
    expect(container.querySelector('.magic-text-editor.my-custom-class')).toBeInTheDocument()
  })

  it('accepts custom toolbarClassName', () => {
    const { container } = render(<MagicTextEditor toolbarClassName="my-toolbar" />)
    expect(container.querySelector('.magic-text-editor__toolbar.my-toolbar')).toBeInTheDocument()
  })

  it('accepts custom contentClassName', () => {
    const { container } = render(<MagicTextEditor contentClassName="my-content" />)
    expect(container.querySelector('.magic-text-editor__content.my-content')).toBeInTheDocument()
  })

  // ─── Toolbar visibility ──────────────────────────────────────────────────────

  it('renders the toolbar when editable', () => {
    const { container } = render(<MagicTextEditor editable={true} />)
    expect(container.querySelector('.magic-text-editor__toolbar')).toBeInTheDocument()
  })

  it('hides the toolbar when not editable', () => {
    const { container } = render(<MagicTextEditor editable={false} />)
    expect(container.querySelector('.magic-text-editor__toolbar')).not.toBeInTheDocument()
  })

  // ─── Toolbar buttons ─────────────────────────────────────────────────────────

  it('renders undo and redo buttons in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Undo')).toBeInTheDocument()
    expect(screen.getByTitle('Redo')).toBeInTheDocument()
  })

  it('renders heading buttons in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 3')).toBeInTheDocument()
  })

  it('renders the link button in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Insert link')).toBeInTheDocument()
  })

  it('renders the image button in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Insert image')).toBeInTheDocument()
  })

  // ─── Callbacks ───────────────────────────────────────────────────────────────

  it('accepts an onChange handler without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicTextEditor onChange={onChange} />)).not.toThrow()
  })

  it('accepts an onBlur handler without throwing', () => {
    const onBlur = vi.fn()
    expect(() => render(<MagicTextEditor onBlur={onBlur} />)).not.toThrow()
  })

  it('accepts an onFocus handler without throwing', () => {
    const onFocus = vi.fn()
    expect(() => render(<MagicTextEditor onFocus={onFocus} />)).not.toThrow()
  })

  // ─── Input / output types ────────────────────────────────────────────────────

  it('accepts inputType="html" without throwing', () => {
    expect(() => render(<MagicTextEditor inputType="html" content="<p>hello</p>" />)).not.toThrow()
  })

  it('accepts inputType="json" without throwing', () => {
    const json = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }] }
    expect(() => render(<MagicTextEditor inputType="json" content={json} />)).not.toThrow()
  })

  it('accepts outputType="html" without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicTextEditor outputType="html" onChange={onChange} />)).not.toThrow()
  })

  it('accepts outputType="json" without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicTextEditor outputType="json" onChange={onChange} />)).not.toThrow()
  })

  // ─── Variables ───────────────────────────────────────────────────────────────

  it('renders the variable picker button when variables prop is provided', () => {
    const variables: Variable[] = [{ label: 'First name' }]
    render(<MagicTextEditor variables={variables} />)
    expect(screen.getByTitle('Insert variable')).toBeInTheDocument()
  })

  it('does not render the variable picker when variables prop is omitted', () => {
    render(<MagicTextEditor />)
    expect(screen.queryByTitle('Insert variable')).not.toBeInTheDocument()
  })

  it('accepts variables with type without throwing', () => {
    const variables: Variable[] = [
      { label: 'Name', type: 'text' },
      { label: 'Bio', type: 'textarea' },
      { label: 'Country', type: 'select', options: ['US', 'MX', 'AR'] },
      { label: 'Birthday', type: 'date' },
      { label: 'Vacation', type: 'daterange' },
    ]
    expect(() => render(<MagicTextEditor variables={variables} />)).not.toThrow()
  })

  it('accepts an onVariableAdd callback without throwing', () => {
    const onVariableAdd = vi.fn()
    expect(() => render(<MagicTextEditor variables={[]} onVariableAdd={onVariableAdd} />)).not.toThrow()
  })
})
