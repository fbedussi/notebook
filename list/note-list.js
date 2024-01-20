import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import {searchTerm} from '../state.js'
import { getNotes } from '../backend.js'
import {getUserId} from '../auth.js'
import {css} from '../custom-elements-utils.js'

import '../delete-button.js'

customElements.define('note-list', class extends HTMLElement {
  constructor(){
    super()

    css`
      note-list article {
        footer {
          display: flex;
          justify-content: end;
          
          a {
            display: flex;
            align-items: center;
            gap: 0.5em;
          }
        }
      }
    `
  }

  connectedCallback() {
    this.notes = signal([])
    getNotes(getUserId(), this.notes)

    render(this, this.render)
  }

  render = () => html`
      <div>
        ${this.notes.value
          .filter(note => searchTerm.value ? note.text.includes(searchTerm.value) : true)
          .map((note) => html`
            <article>
              <header style="display: flex; justify-content: end" ><delete-button id=${note.id}/></header>
              ${note.text.substring(0,200)}
              <footer><a href=${`/note/?id=${note.id}`}>Read more <i class="gg-arrow-right"></i></a></footer>
            </article>
          `)}
      </div>`
})
