import type { JSONContent } from '@tiptap/core'
import type { Translations } from '../i18n/types'

export type ContentType = 'html' | 'json'

export type VariableType = 'text' | 'textarea' | 'select' | 'date' | 'daterange'

export interface Variable {
  /** Display name shown in the variable picker and as the chip label in the editor. */
  label: string
  /** Input type for the variable. */
  type?: VariableType
  /** Options for variables of type 'select'. */
  options?: string[]
}

export interface MagicTextEditorProps {
  /** Content to display. Pass an HTML string when inputType="html" (default), or a JSONContent object when inputType="json". */
  content?: string | JSONContent
  /** Format of the incoming content prop. @default 'html' */
  inputType?: ContentType
  /** Format emitted by onChange/onBlur/onFocus callbacks. @default 'html' */
  outputType?: ContentType
  /** Callback fired on every content change. Receives an HTML string or JSONContent depending on outputType. */
  onChange?: (value: string | JSONContent) => void
  /** Callback fired when the editor loses focus. */
  onBlur?: (value: string | JSONContent) => void
  /** Callback fired when the editor gains focus. */
  onFocus?: (value: string | JSONContent) => void
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
  /** List of variables available in the toolbar variable picker. */
  variables?: Variable[]
  /** Called when the user adds a custom variable via the picker. */
  onVariableAdd?: (variable: Variable) => void
  /**
   * BCP 47 locale string for the editor UI (e.g. 'en', 'es').
   * Built-in locales: 'en' (default), 'es'.
   * Register additional locales with `registerLocale()` before use.
   * Changing this prop after mount has no effect — remount the component to switch locale.
   */
  locale?: string
  /**
   * Fine-grained translation overrides applied on top of the resolved locale.
   * Any key not provided falls back to the resolved locale value.
   * Useful for one-off string customisation without creating a full locale file.
   */
  translations?: Partial<Translations>
}

export type { JSONContent }
export type { Translations }

