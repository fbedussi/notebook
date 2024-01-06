import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import {notes} from '../state.js'
import { getNotes } from '../backend.js'
import {getToken} from '../auth.js'

import '../delete-button.js'

customElements.define('single-note', class extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback() {
    const searchParams = new URLSearchParams(window.location.search)
    this.noteId = searchParams.get('id')
    getNotes(getToken())
    render(this, this.render)
  }

  render = () => {
      const note = notes.value
            .find(note => note.id === this.noteId)
      return html`
        <style>
          single-note {
            footer {
              display: flex;
              justify-content: space-between;
            }
          }
        </style>
        <article>
          ${note?.text}
          <footer>
            <div><a href="/list"><i class="gg-arrow-left"></i> back</a></div>
            <delete-button id=${this.noteId}/> 
          </footer>
        </article>
      `
  }
})
