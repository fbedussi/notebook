import {render, html} from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'

import './add-note.js'
import './note-list.js'
import './search-note.js' 

import '../delete-button.js'

customElements.define('list-page', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    render(this, this.render)
  }

  render = () => html`
    <input type="search" is="search-note">
    <form is="add-note">
      <style>
        @scope {
          button {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5em;
          }
        }
      </style>
      <textarea rows="3" placeholder="Add a note"></textarea>
      <button type="submit"><i class="gg-add"></i> Add</button>
    </form>
    <note-list></note-list>
    `
})
