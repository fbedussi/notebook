import { render, html } from 'uhtml/preactive'
import { updateNote } from '../../../../backend'
import { css } from '../../../../custom-elements-utils'
import { HTMLInputEvent, Note } from '../../../model'

import '../../../widgets/delete-button'

const htmlUnsafe = (str: string) => html([str] as any)

const EL_NAME = 'note-card'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    note?: Note

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
      render(this, this.render)
    }

    render = () => {
      if (!this.note) {
        throw new Error('note attribute is mandatory')
      }

      return html`
        <article>
          <header style="display: flex; justify-content: space-between">
            <h1>${this.note.title}</h1>
            <div class="note-actions">
              <label>
                <input
                  type="checkbox"
                  ?checked=${this.note.archived}
                  onclick=${(ev: HTMLInputEvent) => {
                    this.note &&
                      updateNote({
                        ...this.note,
                        archived: ev.target.checked,
                      })
                  }}
                />
                Archived
              </label>
              <delete-button id=${this.note.id} />
            </div>
          </header>

          <main>
            ${this.note.type === 'text'
              ? htmlUnsafe(this.note.text.substring(0, 200))
              : html`<ol>
                  ${this.note.todos.map(
                    todo =>
                      html`<li>
                        <input
                          type="checkbox"
                          ?checked=${todo.done}
                          onclick=${() => {
                            this.note &&
                              updateNote({
                                ...this.note,
                                todos: this.note.todos.map(t =>
                                  t.id === todo.id ? { ...t, done: !t.done } : t,
                                ),
                              })
                          }}
                        />
                        <span class=${todo.done ? 'todo-done' : ''}>${todo.text}</span>
                      </li>`,
                  )}
                </ol>`}
          </main>

          <footer>
            <a href=${`/notes/${this.note.id}`}
              ><i class="gg-details-more"></i> <i class="gg-arrow-right"></i
            ></a>
          </footer>
        </article>
      `
    }
  },
)
