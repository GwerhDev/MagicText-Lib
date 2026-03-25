import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MagicTextEditor } from './MagicTextEditor'

describe('MagicTextEditor', () => {
  it('renders the root element', () => {
    const { container } = render(<MagicTextEditor />)
    expect(container.querySelector('.magic-text-editor')).toBeInTheDocument()
  })

  it('renders the toolbar when editable', () => {
    const { container } = render(<MagicTextEditor editable={true} />)
    expect(container.querySelector('.magic-text-editor__toolbar')).toBeInTheDocument()
  })

  it('hides the toolbar when not editable', () => {
    const { container } = render(<MagicTextEditor editable={false} />)
    expect(container.querySelector('.magic-text-editor__toolbar')).not.toBeInTheDocument()
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
})
