import type { JSONContent } from '@tiptap/core'

export interface MagicEditorProps {
  /** HTML string to display. When provided alongside onChange, acts as controlled value. */
  content?: string
  /** Callback fired on every content change, receives HTML string and TipTap JSON. */
  onChange?: (html: string, json: JSONContent) => void
  /** Callback fired when the editor loses focus. */
  onBlur?: (html: string, json: JSONContent) => void
  /** Callback fired when the editor gains focus. */
  onFocus?: (html: string, json: JSONContent) => void
  /** Placeholder text shown when the editor is empty. */
  placeholder?: string
  /** Whether the editor is editable. Hides the toolbar when false. @default true */
  editable?: boolean
  /** Autofocus the editor on mount. @default false */
  autofocus?: boolean | 'start' | 'end' | 'all' | number
  /** Extra class name for the root wrapper. */
  className?: string
  /** Extra class name for the toolbar. */
  toolbarClassName?: string
  /** Extra class name for the content area. */
  contentClassName?: string
}

export type { JSONContent }
