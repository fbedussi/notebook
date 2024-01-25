import {render, html, signal} from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import {css} from '../custom-elements-utils.js'

import './note-list.js'
import './search-note.js'
import './todo-editor.js'
import './rich-editor.js'

import './delete-button.js'

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
    this.toDo = signal(true)

    render(this, this.render)
  }

  render = () => html`
    <style>
      @scope {
        display: flex;
        flex-direction: column;
        gap: var(--block-spacing-vertical);

        button {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5em;
        }
      }
    </style>
    
    <form is="add-note" onsubmit=${ev => {
      ev.preventDefault()
      // addNote(getUserId(), editor.value)
      // editor.value = ''
    }}>

    <!-- Radios -->
<fieldset>
  <label for="small">
    <input type="radio" id="small" name="size" value="small" checked>
    <i class="gg-push-down"></i>
  </label>
  <label for="medium">
    <input type="radio" id="medium" name="size" value="medium">
     <i class="gg-user-list"></i>
  </label>
</fieldset>

      <label>
        <label>
          <i class="gg-format-text"></i>&nbsp;
          <input type="checkbox" role="switch" ?checked=${this.toDo.value} onclick=${() => {
            this.toDo.value = !this.toDo.value
            }}>
          <i class="gg-user-list"></i>
        </label>
          
      </label>
      
      ${this.toDo.value ? html`<todo-editor/>` : html`<rich-editor/>`}
      
      <button type="submit"><i class="gg-push-down"></i></button>
    </form>

    <input type="search" is="search-note">

    <note-list></note-list>
    `
})
