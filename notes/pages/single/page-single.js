import { render, html, effect, signal } from 'uhtml/preactive'
import { debounce } from 'lodash'
import { addNote, getNote, updateNote } from '../../../backend.js'
import { css } from '../../../custom-elements-utils.js'

import '../../widgets/delete-button.js'
import '../../widgets/todo-editor.js'
import { updateSelectedNote } from '../../helpers.js'

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

      this.selectedNote = signal(null)
    }

    debouncedUpdateNote = debounce(() => updateNote(this.selectedNote.value), 1000)

    connectedCallback() {
      this.noteId = this.getAttribute('id')

      let prevVersion
      effect(() => {
        if (!this.selectedNote.value) {
          return
        }

        if (prevVersion && this.selectedNote.value.version > prevVersion) {
          this.debouncedUpdateNote()
        }
        prevVersion = this.selectedNote.value.version
      })

      getNote(this.noteId, this.selectedNote)

      render(this, this.render)
    }

    render = () => html`
      <article>
        <header>
          <a
            href=${history.state !== window.location.href && history.state  
              ? history.state.substring(window.location.origin.length)
              : '/notes/'}
            is="a-route"
            ><i class="gg-arrow-left"></i
          ></a>
          <input
            class="underlined"
            type="text"
            placeholder="my note"
            value=${this.selectedNote.value?.title}
            onchange=${ev => {
              updateSelectedNote(this.selectedNote, {
                title: ev.target.value,
              })
            }}
          />
          <delete-button id=${this.noteId} />
        </header>

        <main>
          ${this.selectedNote.value?.type === 'todo'
            ? html`<todo-editor .selectedNote=${this.selectedNote} />`
            : null}
          ${this.selectedNote.value?.type === 'text'
            ? html`<rich-editor .selectedNote=${this.selectedNote} />`
            : null}
        </main>

        <footer>
          <button
            onclick=${() => {
              addNote({
                type: this.selectedNote.value.type,
                title: this.selectedNote.value.title + ' (copy)',
                text: this.selectedNote.value.text,
                todos: this.selectedNote.value.todos,
                version: 1,
              }).then(noteId => {
                history.replaceState(undefined, undefined, `/notes/${noteId}`)
                getNote(noteId, this.selectedNote, true)
              })
            }}
          >
            <i class="gg-copy"></i>
          </button>

          <button
            onclick=${() => {
              const text = `# ${this.selectedNote.value.title.trim()}\n${convertNoteContent(this.selectedNote.value)}`
              navigator.clipboard.writeText(text)
            }}
          >
            <i class="gg-clipboard"></i>
          </button>
        </footer>
      </article>
    `
  },
)
