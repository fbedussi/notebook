import { render, html } from 'uhtml/preactive'
import { deleteNote } from '../../backend.js'

const EL_NAME = 'delete-button'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    constructor() {
      super()
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
              deleteNote(this.getAttribute('id'))
                .then(() => {
                  if (window.location.pathname !== '/notes/') {
                    window.location = '/notes/'
                  }
                  dialog.current.close()
                })
                .catch(err => alert(JSON.stringify(err)))
            }}>confirm</button>
          </footer>
        </article>
      </dialog>
      <button onclick=${() => {
        dialog.current.showModal()
      }}><i class="gg-trash"></i></button></div>
    `
    }
  },
)
