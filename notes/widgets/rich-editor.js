import { render, html } from 'uhtml/preactive'
import { updateSelectedNote } from '../helpers.js'

const EL_NAME = 'rich-editor'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    constructor() {
      super()
    }

    connectedCallback() {
      render(this, this.render)

      this.editor
      tinymce.remove('#editor')
      tinymce.init({
        selector: '#editor',
        init_instance_callback: editor => {
          this.editor = editor
          editor.setContent(this.selectedNote.value?.text || '')
          this.editor.on('change', () => {
            const text = this.editor.getContent()
            updateSelectedNote(this.selectedNote, { text })
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
