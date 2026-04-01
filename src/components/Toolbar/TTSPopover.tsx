import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import type { TTSCharacter } from '../../types'
import { TTSIcon } from './icons'
import { useTranslations } from '../../i18n'

// Default palette used when a character has no explicit color
const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899']

function getCharacterColor(character: TTSCharacter, all: TTSCharacter[]): string {
  if (character.color) return character.color
  const index = all.indexOf(character)
  return PALETTE[index % PALETTE.length]
}

interface Props {
  editor: Editor
  characters?: TTSCharacter[]
}

export function TTSPopover({ editor, characters = [] }: Props) {
  const t = useTranslations()

  const [open, setOpen] = useState(false)
  const [characterId, setCharacterId] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [voice, setVoice] = useState('')
  const [inflection, setInflection] = useState('')
  const [activeColor, setActiveColor] = useState<string | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const btnRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const isActive = editor.isActive('tts')

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (!btnRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Detect clicks on existing TTS marks inside the editor
  useEffect(() => {
    const editorDom = editor.view.dom
    const handleClick = (e: MouseEvent) => {
      if (!editor.isEditable) return
      const target = (e.target as HTMLElement).closest('span[data-type="tts"]')
      if (!target) return
      e.preventDefault()
      editor.chain().extendMarkRange('tts').run()
      const attrs = editor.getAttributes('tts')
      openWithAttrs(attrs)
    }
    editorDom.addEventListener('click', handleClick)
    return () => editorDom.removeEventListener('click', handleClick)
  }, [editor])

  const computePosition = () => {
    const { from, to } = editor.state.selection
    const startCoords = editor.view.coordsAtPos(from)
    const endCoords = editor.view.coordsAtPos(to)
    return {
      top: startCoords.top,
      left: (startCoords.left + endCoords.left) / 2,
    }
  }

  const openWithAttrs = (attrs: Record<string, unknown>) => {
    setCharacterId((attrs.characterId as string) ?? '')
    setCharacterName((attrs.characterName as string) ?? '')
    setVoice((attrs.voice as string) ?? '')
    setInflection((attrs.inflection as string) ?? '')
    setActiveColor((attrs.color as string) ?? null)
    setPosition(computePosition())
    setOpen(true)
    setTimeout(() => nameInputRef.current?.focus(), 0)
  }

  const openPopover = () => {
    if (isActive) {
      editor.chain().extendMarkRange('tts').run()
      openWithAttrs(editor.getAttributes('tts'))
    } else {
      setCharacterId('')
      setCharacterName('')
      setVoice('')
      setInflection('')
      setActiveColor(null)
      setPosition(computePosition())
      setOpen(true)
      setTimeout(() => nameInputRef.current?.focus(), 0)
    }
  }

  const selectCharacter = (character: TTSCharacter) => {
    const color = getCharacterColor(character, characters)
    setCharacterId(character.id)
    setCharacterName(character.name)
    setVoice(character.voice ?? '')
    setActiveColor(color)
  }

  const apply = () => {
    const name = characterName.trim()
    if (!name) return
    const id = characterId || name.toLowerCase().replace(/\s+/g, '-')
    const color = activeColor ?? PALETTE[0]
    editor.chain().focus()
      .setMark('tts', {
        characterId: id,
        characterName: name,
        voice: voice.trim() || null,
        inflection: inflection.trim() || null,
        color,
      })
      .run()
    setOpen(false)
  }

  const remove = () => {
    editor.chain().focus().extendMarkRange('tts').unsetMark('tts').run()
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); apply() }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
  }

  return (
    <>
      <div ref={btnRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            if (open) { setOpen(false); return }
            openPopover()
          }}
          title={t.tts.insertTTS}
          aria-label={t.tts.insertTTS}
          aria-pressed={open}
          className={`magic-text-editor__btn${isActive || open ? ' magic-text-editor__btn--active' : ''}`}
        >
          <TTSIcon />
        </button>
      </div>

      {open && (
        <div
          ref={popoverRef}
          className="magic-text-editor__link-float magic-text-editor__tts-popover"
          style={{ top: position.top, left: position.left }}
          role="dialog"
          aria-label={t.tts.popoverAriaLabel}
        >
          {/* Character quick-select grid */}
          {characters.length > 0 && (
            <div className="magic-text-editor__tts-chars">
              {characters.map((char) => {
                const color = getCharacterColor(char, characters)
                const selected = characterId === char.id
                return (
                  <button
                    key={char.id}
                    type="button"
                    className={`magic-text-editor__tts-char-btn${selected ? ' magic-text-editor__tts-char-btn--active' : ''}`}
                    style={{
                      '--char-color': color,
                      borderColor: color,
                      backgroundColor: selected ? color : `${color}22`,
                      color: selected ? '#fff' : color,
                    } as React.CSSProperties}
                    onMouseDown={(e) => { e.preventDefault(); selectCharacter(char) }}
                  >
                    {char.name}
                  </button>
                )
              })}
            </div>
          )}

          {/* Fields */}
          <div className="magic-text-editor__link-body" style={{ flexDirection: 'column' }}>
            <div className="magic-text-editor__link-fields">
              <div className="magic-text-editor__link-field">
                <label className="magic-text-editor__link-label">{t.tts.characterLabel}</label>
                <input
                  ref={nameInputRef}
                  className="magic-text-editor__var-input"
                  placeholder={t.tts.characterPlaceholder}
                  value={characterName}
                  onChange={e => {
                    setCharacterName(e.target.value)
                    // Deselect character from list if name is manually edited
                    if (characterId && characters.find(c => c.id === characterId)?.name !== e.target.value) {
                      setCharacterId('')
                      setActiveColor(null)
                    }
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="magic-text-editor__link-field">
                <label className="magic-text-editor__link-label">{t.tts.voiceLabel}</label>
                <input
                  className="magic-text-editor__var-input"
                  placeholder={t.tts.voicePlaceholder}
                  value={voice}
                  onChange={e => setVoice(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="magic-text-editor__link-field">
                <label className="magic-text-editor__link-label">{t.tts.inflectionLabel}</label>
                <input
                  className="magic-text-editor__var-input"
                  placeholder={t.tts.inflectionPlaceholder}
                  value={inflection}
                  onChange={e => setInflection(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <button
              type="button"
              className="magic-text-editor__var-add-btn"
              onMouseDown={(e) => { e.preventDefault(); apply() }}
              disabled={!characterName.trim()}
            >
              {t.tts.applyButton}
            </button>
          </div>

          {isActive && (
            <button
              type="button"
              className="magic-text-editor__link-remove-btn"
              onMouseDown={(e) => { e.preventDefault(); remove() }}
            >
              {t.tts.removeButton}
            </button>
          )}
        </div>
      )}
    </>
  )
}
