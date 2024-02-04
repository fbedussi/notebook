import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { selectedNote } from '../state'

customElements.define(
  'rich-editor',
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
          editor.setContent(selectedNote.value.text)
          this.editor.on('change', () => {
            const text = this.editor.getContent()
            selectedNote.value = {
              ...selectedNote.value,
              text,
            }
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