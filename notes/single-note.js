import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { getNote } from '../backend.js'
import {getUserId} from '../auth.js'
import {css} from '../custom-elements-utils.js'

import '../delete-button.js'

customElements.define('single-note', class extends HTMLElement {
  constructor(){
    super()

    css`
      single-note {
        footer {
          display: flex;
          justify-content: space-between;
        }
      }
    `
  }

  connectedCallback() {
    this.noteId = this.getAttribute('id')
    this.note = signal(null)
    getNote(getUserId(), this.noteId, this.note)
    render(this, this.render)
  }

  render = () => html`
    <article>
      ${html([this.note.value?.text])}
      <footer>
        <div><a href="/notes/" is="a-route"><i class="gg-arrow-left"></i> back</a></div>
        <delete-button id=${this.noteId}/> 
      </footer>
    </article>
  `
})
