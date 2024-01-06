import { render, html } from 'https://esm.run/uhtml'
import { deleteNote } from './backend.js'

customElements.define('delete-button', class extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback() {
    this.render()
  }

  render(){
    render(this, html`
      <style>
        delete-button {
          display: flex;
          justify-content: space-between;
          gap: 0.5em;
        }
      </style>
      <button onclick=${() => deleteNote(this.getAttribute('key'))}><i class="gg-trash"></i> Delete</button></div>
    `)
  }
})
