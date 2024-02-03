import { render, html, computed, effect } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { getNote, updateNote } from '../../../backend.js'
import { getUserId } from '../../../auth.js'
import { css } from '../../../custom-elements-utils.js'

import '../../widgets/delete-button.js'
import '../../widgets/todo-editor.js'
import { selectedNote } from '../../state.js'

const EL_NAME = 'page-single'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    constructor() {
      super()

      css`
        ${EL_NAME} {
          footer {
            display: flex;
            justify-content: space-between;
          }
        }
      `
    }

    connectedCallback() {
      this.noteId = this.getAttribute('id')

      effect(() => {
        updateNote(selectedNote.value)
      })

      getNote(getUserId(), this.noteId, selectedNote)

      render(this, this.render)
    }

    render = () => {
      return (
        selectedNote.value &&
        html`
          <article>
            <header>
              <div>
                <a href="/notes/" is="a-route"><i class="gg-arrow-left"></i></a>
              </div>
            </header>

            <main>
              <note-editor />
            </main>

            <footer>
              <delete-button id=${this.noteId} />
            </footer>
          </article>
        `
      )
    }
  },
)
