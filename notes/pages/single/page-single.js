import { render, html, effect } from 'uhtml/preactive'
import { debounce } from 'lodash'
import { getNote, updateNote } from '../../../backend.js'
import { getUserId } from '../../../auth.js'
import { css } from '../../../custom-elements-utils.js'

import '../../widgets/delete-button.js'
import '../../widgets/todo-editor.js'
import { selectedNote, updateSelectedNote } from '../../state.js'

const debouncedUpdateNote = debounce(() => updateNote(selectedNote.value), 1000)

const EL_NAME = 'page-single'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    constructor() {
      super()

      css`
        ${EL_NAME} {
          header {
            display: flex;
            gap: 1rem;
            align-items: center;
          }

          footer {
            display: flex;
            justify-content: space-between;
          }
        }
      `
    }

    connectedCallback() {
      this.noteId = this.getAttribute('id')

      let prevVersion
      effect(() => {
        if (!selectedNote.value) {
          return
        }

        if (prevVersion && selectedNote.value.version > prevVersion) {
          debouncedUpdateNote()
        }
        prevVersion = selectedNote.value.version
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
              <a href="/notes/" is="a-route"><i class="gg-arrow-left"></i></a>
              <input
                class="underlined"
                type="text"
                placeholder="my note"
                value=${selectedNote.value.title}
                onchange=${ev => {
                  updateSelectedNote({
                    title: ev.target.value,
                  })
                }}
              />
              <delete-button id=${this.noteId} />
            </header>

            <main>
              ${selectedNote.value.type === 'todo' ? html`<todo-editor />` : html`<rich-editor />`}
            </main>

            <footer></footer>
          </article>
        `
      )
    }
  },
)
