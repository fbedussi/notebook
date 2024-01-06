import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import {notes, searchTerm} from '../state.js'
import { getNotes } from '../backend.js'
import {getToken} from '../auth.js'

import '../delete-button.js'

customElements.define('note-list', class extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback() {
    getNotes(getToken())
    render(this, this.render)
  }

  render = () => html`
      <div>
        ${notes.value
          .filter(note => searchTerm.value ? note.text.includes(searchTerm.value) : true)
          .map((note) => html`
            <article>
              <header style="display: flex; justify-content: end" ><delete-button id=${note.id}/></header>
              ${note.text.substring(0,200)}
              <footer><a href=${`/note?id=${note.id}`}>Read more <i class="gg-arrow-right"></i></a></footer>
            </article>
          `)}
      </div>`
})
