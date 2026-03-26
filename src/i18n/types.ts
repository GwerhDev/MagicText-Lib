export interface Translations {
  toolbar: {
    /** aria-label for the toolbar wrapper element */
    ariaLabel: string
  }

  history: {
    undo: string
    redo: string
  }

  formatting: {
    bold: string
    italic: string
    underline: string
    strikethrough: string
    highlight: string
  }

  headings: {
    heading1: string
    heading2: string
    heading3: string
  }

  blocks: {
    bulletList: string
    orderedList: string
    blockquote: string
    codeBlock: string
    horizontalRule: string
  }

  alignment: {
    alignLeft: string
    alignCenter: string
    alignRight: string
  }

  link: {
    /** Tooltip and aria-label for the link toolbar button */
    insertLink: string
    /** aria-label for the link editor dialog */
    editorAriaLabel: string
    textLabel: string
    textPlaceholder: string
    urlLabel: string
    urlPlaceholder: string
    applyButton: string
    removeLinkButton: string
  }

  image: {
    /** Tooltip and aria-label for the image toolbar button */
    insertImage: string
    /** aria-label for the image inserter dialog */
    inserterAriaLabel: string
    urlTab: string
    uploadTab: string
    imageUrlLabel: string
    urlPlaceholder: string
    altTextLabel: string
    altTextPlaceholder: string
    insertButton: string
    dropzoneHint: string
  }

  variables: {
    /** Tooltip and aria-label for the variable toolbar button */
    insertVariable: string
    /** aria-label for the variable picker dialog */
    pickerAriaLabel: string
    /** Text for the "add custom variable" list item */
    addCustomVariable: string
    /** Text for the back button */
    back: string
    /** aria-label for the back button */
    backAriaLabel: string
    newVariableTitle: string
    namePlaceholder: string
    addButton: string
    addOptionButton: string
    addOptionPlaceholder: string
    /** Returns the aria-label for removing a select option */
    removeOption: (option: string) => string
    typeLabels: {
      text: string
      textarea: string
      select: string
      date: string
      daterange: string
    }
  }

  /**
   * Strings used inside variable chips (rendered by VariableExtension).
   * These are delivered via TipTap extension options, not React context,
   * because the node view runs in a separate React root.
   */
  variableNode: {
    fromLabel: string
    toLabel: string
    /** Returns the chip tooltip when the variable has no value yet */
    clickToFill: (label: string) => string
    /** Returns the chip tooltip when the variable has a value */
    variableTitle: (label: string, value: string) => string
  }
}
