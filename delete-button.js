import { render, html } from 'https://esm.run/uhtml'
import { deleteNote } from './backend.js'

customElements.define('delete-button', class extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback() {
    render(this, this.render)
  }

  render = () => {
    return html`
      <style>
        delete-button {
          display: flex;
          justify-content: space-between;
          gap: 0.5em;
        }
      </style>
      <button onclick=${() => {
        deleteNote(this.getAttribute('id')).then(() => {
          if (window.location.pathname !== '/list') {
            window.location = '/list'
          }
        })
      }}><i class="gg-trash"></i> Delete</button></div>
    `
  }
})
