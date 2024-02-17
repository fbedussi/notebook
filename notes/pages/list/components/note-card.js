import { render, html } from 'uhtml/preactive'
import { htmlFor } from 'uhtml/keyed'
import { updateNote } from '../../../../backend.js'
import { css } from '../../../../custom-elements-utils.js'

import '../../../widgets/delete-button.js'

const htmlUnsafe = str => html([str])

const EL_NAME = 'note-card'
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

          .note-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
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
      render(this, () => this.render(this.note, this.note.id))
    }

    render = (note, key) => htmlFor(this.render, key)`
    <article>
      <header style="display: flex; justify-content: space-between">
        <h1>${note.title}</h1>
        <div class="note-actions">
          <label>
            <input
              type="checkbox"
              ?checked=${note.archived}
              onclick=${ev => {
                updateNote({
                  ...note,
                  archived: ev.target.checked,
                })
              }}
            />
            Archived
          </label>
          <delete-button id=${note.id} />
        </div>
      </header>

      <main>
        ${
          note.type === 'text'
            ? htmlUnsafe(note.text.substring(0, 200))
            : html`<ol>
                ${note.todos.map(
                  todo =>
                    html`<li>
                      <input
                        type="checkbox"
                        ?checked=${todo.done}
                        onclick=${() => {
                          updateNote({
                            ...note,
                            todos: note.todos.map(t =>
                              t.id === todo.id ? { ...t, done: !t.done } : t,
                            ),
                          })
                        }}
                      />
                      <span class=${todo.done ? 'todo-done' : ''}>${todo.text}</span>
                    </li>`,
                )}
              </ol>`
        }
      </main>

      <footer>
        <a is="a-route" href=${`/notes/${note.id}`}
          ><i class="gg-details-more"></i> <i class="gg-arrow-right"></i
        ></a>
      </footer>
    </article>
  `
  },
)
