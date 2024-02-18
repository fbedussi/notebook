import { render, html, Signal } from 'uhtml/preactive'
import { updateSelectedNote } from '../helpers'
import tinymce, { Editor } from 'tinymce'
import { Note } from '../model'

const EL_NAME = 'rich-editor'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    editor?: Editor
    selectedNote?: Signal<Note>

    constructor() {
      super()
    }

    connectedCallback() {
      render(this, this.render)

      tinymce.remove('#editor')

      tinymce.init({
        selector: '#editor',
        init_instance_callback: editor => {
          this.editor = editor
          editor.setContent(this.selectedNote?.value?.text || '')
          this.editor.on('change', () => {
            const text = this.editor?.getContent()
            this.selectedNote && updateSelectedNote(this.selectedNote, { text })
          })
        },
      })
    }

    disconnectedCallback() {
      this.editor?.setContent('')
      tinymce.remove('#editor')
    }

    render = () => html` <div id="editor" /> `
  },
)
