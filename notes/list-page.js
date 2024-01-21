import {render, html} from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import {css} from '../custom-elements-utils.js'

import './add-note.js'
import './note-list.js'
import './search-note.js'

import '../delete-button.js'

customElements.define('list-page', class extends HTMLElement {
  constructor() {
    super()
    css`
      .tox .tox-promotion-link,
      .tox-statusbar__right-container {
        display: none !important;
      } 
    `
  }

  connectedCallback() {
    render(this, this.render)
    tinymce.remove('#editor')
    tinymce.init({
      selector: '#editor',
    })
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
      <div id="editor"></div>
      
      <button type="submit"><i class="gg-add"></i> Add</button>
    </form>
    <note-list></note-list>
    `
})
