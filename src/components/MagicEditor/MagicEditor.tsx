import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'

import type { MagicEditorProps } from '../../types'
import { Toolbar } from '../Toolbar'

const EXTENSIONS = [
  StarterKit,
  Underline,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Highlight.configure({ multicolor: true }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
  }),
  Image,
  TextStyle,
  Color,
]

export function MagicEditor({
  content = '',
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Write something...',
  editable = true,
  autofocus = false,
  className,
  toolbarClassName,
  contentClassName,
}: MagicEditorProps) {
  const editor = useEditor({
    extensions: [
      ...EXTENSIONS,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    autofocus,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML(), editor.getJSON())
    },
    onBlur({ editor }) {
      onBlur?.(editor.getHTML(), editor.getJSON())
    },
    onFocus({ editor }) {
      onFocus?.(editor.getHTML(), editor.getJSON())
    },
  })

  // Sync editable prop after mount
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    editor.setEditable(editable)
  }, [editor, editable])

  // Sync content prop when it changes from outside
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content, false)
    }
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`magic-editor${className ? ` ${className}` : ''}`}>
      {editable && <Toolbar editor={editor} className={toolbarClassName} />}
      <EditorContent
        editor={editor}
        className={`magic-editor__content${contentClassName ? ` ${contentClassName}` : ''}`}
      />
    </div>
  )
}
