import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { getNote } from '../../backend.js'
import { getUserId } from '../../auth.js'
import { css } from '../../custom-elements-utils.js'

import '../widgets/delete-button.js'

const EL_NAME = 'page-note'
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
      this.note = signal(null)
      getNote(getUserId(), this.noteId, this.note)
      render(this, this.render)
    }

    render = () => html`
      <article>
        <header>
          <div>
            <a href="/notes/" is="a-route"><i class="gg-arrow-left"></i></a>
          </div>
        </header>

        ${html([this.note.value?.text])}
        <footer>
          <delete-button id=${this.noteId} />
        </footer>
      </article>
    `
  },
)
