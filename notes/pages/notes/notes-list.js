import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { searchTerm } from '../../state.js'
import { getNotes } from '../../../backend.js'
import { getUserId } from '../../../auth.js'
import { css } from '../../../custom-elements-utils.js'

import '../../widgets/delete-button.js'

const EL_NAME = 'notes-list'
const htmlUnsafe = str => html([str])
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    constructor() {
      super()

      css`
        ${EL_NAME} article {
          header,
          footer {
            padding: 1rem;
          }

          footer {
            display: flex;
            justify-content: end;

            a {
              display: flex;
              align-items: center;
              gap: 0.5em;
            }
          }
        }
      `
    }

    connectedCallback() {
      this.notes = signal([])
      getNotes(getUserId(), this.notes)

      render(this, this.render)
    }

    render = () =>
      html` <div>
        ${this.notes.value
          .filter(note =>
            searchTerm.value
              ? (note.text || note.todos.map(({ text }) => text).join(' ')).includes(
                  searchTerm.value,
                )
              : true,
          )
          .map(
            note => html`
              <article>
                <header style="display: flex; justify-content: end">
                  <delete-button id=${note.id} />
                </header>

                <main>
                  <h1>${note.title}</h1>
                  ${note.type === 'text'
                    ? htmlUnsafe(note.text.substring(0, 200))
                    : html` <ol>
                        ${note.todos.map(todo => html`<li>${todo.done} ${todo.text}</li>`)}
                      </ol>`}
                </main>

                <footer>
                  <a is="a-route" href=${`/notes/${note.id}`}
                    ><i class="gg-details-more"></i> <i class="gg-arrow-right"></i
                  ></a>
                </footer>
              </article>
            `,
          )}
      </div>`
  },
)
