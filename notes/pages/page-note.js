import { render, html, signal, computed } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { getNote, updateNote } from '../../backend.js'
import { getUserId } from '../../auth.js'
import { css } from '../../custom-elements-utils.js'

import '../widgets/delete-button.js'
import '../widgets/todo-editor.js'

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

      this.toDoList = computed(() => {
        return this.note.value?.todos || []
      })
      getNote(getUserId(), this.noteId, this.note)
      render(this, this.render)
    }

    render = () => {
      return html`
        <article>
          <header>
            <div>
              <a href="/notes/" is="a-route"><i class="gg-arrow-left"></i></a>
            </div>
            <input
              disabled=${!this.note.value}
              type="text"
              value=${this.note.value?.title}
              onfocus=${ev => ev.target.select()}
              onblur=${ev => {
                updateNote({
                  ...this.note.value,
                  title: ev.target.value,
                })
              }}
            />
          </header>
          ${this.note.value?.type === 'text'
            ? html([this.note.value?.text])
            : html`<todo-editor .toDoList=${this.toDoList} />`}
          <footer>
            <delete-button id=${this.noteId} />
          </footer>
        </article>
      `
    }
  },
)
