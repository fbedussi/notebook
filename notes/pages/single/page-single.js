import { render, html, effect } from 'uhtml/preactive'
import { debounce } from 'lodash'
import { addNote, getNote, updateNote } from '../../../backend.js'
import { css } from '../../../custom-elements-utils.js'

import '../../widgets/delete-button.js'
import '../../widgets/todo-editor.js'
import { selectedNote, updateSelectedNote } from '../../state.js'

const debouncedUpdateNote = debounce(() => updateNote(selectedNote.value), 1000)

const convertHtmlToText = html => {
  const el = document.createElement('div')
  el.innerHTML = html
  const text = el.innerText
  return text
}

const convertNoteContent = note =>
  note.type === 'text'
    ? convertHtmlToText(note.text)
    : note.todos
        .map(({ done, text }, index) => `${index}- ${done ? '(X)' : '( )'} ${text.trim()}`)
        .join('\n')

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
            gap: 1rem;
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

      getNote(this.noteId, selectedNote)

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

            <footer>
              <button
                onclick=${() => {
                  addNote({
                    type: selectedNote.value.type,
                    title: selectedNote.value.title + ' (copy)',
                    text: selectedNote.value.text,
                    todos: selectedNote.value.todos,
                    version: 1,
                  }).then(noteId => {
                    history.replaceState(undefined, undefined, `/notes/${noteId}`)
                    getNote(noteId, selectedNote, true)
                  })
                }}
              >
                <i class="gg-copy"></i>
              </button>

              <button
                onclick=${() => {
                  const text = `# ${selectedNote.value.title.trim()}\n${convertNoteContent(selectedNote.value)}`
                  navigator.clipboard.writeText(text)
                }}
              >
                <i class="gg-clipboard"></i>
              </button>
            </footer>
          </article>
        `
      )
    }
  },
)
