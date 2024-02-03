import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { css } from '../../custom-elements-utils.js'

import './todo-editor.js'
import './rich-editor.js'
import { selectedNote } from '../state.js'

customElements.define(
  'note-editor',
  class extends HTMLElement {
    constructor() {
      super()

      css``
    }

    connectedCallback() {
      render(this, this.render)
    }

    render = () => html`
      <input
        type="text"
        placeholder="my note"
        value=${selectedNote.value.title}
        onchange=${ev => {
          selectedNote.value = {
            ...selectedNote.value,
            title: ev.target.value,
          }
        }}
      />

      ${selectedNote.value.type === 'todo' ? html`<todo-editor />` : html`<rich-editor />`}
    `
  },
)
