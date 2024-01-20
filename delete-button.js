import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { deleteNote } from './backend.js'
import {css} from './custom-elements-utils.js'

customElements.define('delete-button', class extends HTMLElement {
  constructor(){
    super()

    css`
      delete-button {
        button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1em;
        }
      }
    `
  }

  connectedCallback() {
    render(this, this.render)
  }

  render = () => {
    const dialog = { current: null }

    return html`
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
