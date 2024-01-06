import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { getNote } from '../backend.js'
import {getUserId} from '../auth.js'

import '../delete-button.js'

customElements.define('single-note', class extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback() {
    const searchParams = new URLSearchParams(window.location.search)
    this.noteId = searchParams.get('id')
    this.note = signal(null)
    getNote(getUserId(), this.noteId, this.note)
    render(this, this.render)
  }

  render = () => html`
    <style>
      single-note {
        footer {
          display: flex;
          justify-content: space-between;
        }
      }
    </style>
    <article>
      ${this.note.value?.text}
      <footer>
        <div><a href="/list"><i class="gg-arrow-left"></i> back</a></div>
        <delete-button id=${this.noteId}/> 
      </footer>
    </article>
  `
})
