import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { deleteNote } from './backend.js'

customElements.define('delete-button', class extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback() {
    render(this, this.render)
  }

  render = () => {
    const dialog = { current: null }

    return html`
      <style>
        delete-button {
          display: flex;
          justify-content: space-between;
          gap: 0.5em;
        }
      </style>
      <dialog ref=${dialog} show="false">
        <article>
          Do you really want to delete this note?
          <footer style="display: flex; justify-content: flex-end; gap: 1em">
            <button onclick=${() => {
              dialog.current.close()
            }}>
              cancel
            </button>
            <button class="secondary" onclick=${() => {
              deleteNote(this.getAttribute('id')).then(() => {
                if (window.location.pathname !== '/list') {
                  window.location = '/list'
                }
              })
            }}>confirm</button>
          </footer>
        </article>
      </dialog>
      <button onclick=${() => {
        dialog.current.showModal()
        
      }}><i class="gg-trash"></i> Delete</button></div>
    `
  }
})
