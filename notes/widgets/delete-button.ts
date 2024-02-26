import { render, html } from 'uhtml/preactive'
import { deleteNote } from '../../backend'

const EL_NAME = 'delete-button'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    noteId?: string | null
    constructor() {
      super()
    }

    connectedCallback() {
      this.noteId = this.getAttribute('id')

      if (!this.noteId) {
        throw new Error('id attribute is mandatory')
      }

      render(this, this.render)
    }

    render = () => {
      const dialog: { current: null | HTMLDialogElement } = { current: null }

      return html`
      <dialog ref=${dialog} show="false">
        <article>
          Do you really want to delete this note?
          <footer style="display: flex; justify-content: flex-end; gap: 1em">
            <button onclick=${() => {
              dialog.current?.close()
            }}>
              cancel
            </button>
            <button class="secondary" onclick=${() => {
              this.noteId &&
                deleteNote(this.noteId)
                  .then(() => {
                    if (window.location.pathname !== '/notebook/notes/') {
                      window.location.href = '/notebook/notes/'
                    }
                    dialog.current?.close()
                  })
                  .catch((err: unknown) => alert(JSON.stringify(err)))
            }}>confirm</button>
          </footer>
        </article>
      </dialog>
      <button onclick=${() => {
        dialog.current?.showModal()
      }}><i class="gg-trash"></i></button></div>
    `
    }
  },
)
