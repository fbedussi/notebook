import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { css } from '../../../custom-elements-utils.js'

import './notes-list.js'
import './search-note.js'
import './todo-editor.js'
import './rich-editor.js'

import '../../widgets/delete-button.js'
import { toDoList } from '../../state.js'
import { addNote } from '../../../backend.js'
import { getUserId } from '../../../auth.js'

customElements.define(
  'page-notes',
  class extends HTMLElement {
    constructor() {
      super()
      css`
        .tox .tox-promotion-link,
        .tox-statusbar__right-container {
          display: none !important;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `
    }

    connectedCallback() {
      this.toDo = signal(false)

      render(this, this.render)
    }

    render = () => html`
      <style>
        @scope {
          display: flex;
          flex-direction: column;
          gap: var(--block-spacing-vertical);

          button {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5em;
          }
        }
      </style>

      <form
        onsubmit=${ev => {
          ev.preventDefault()

          const userId = getUserId()

          const newNote = {
            type: this.toDo.value ? 'todo' : 'text',
            title: ev.target[1].value,
          }
          if (this.toDo.value) {
            newNote.todos = toDoList.value.filter(({ text }) => text)
          } else {
            newNote.text = tinymce.activeEditor.getContent('#editor')
          }

          addNote(userId, newNote)

          ev.target[1].value = ''
          if (this.toDo.value) {
            toDoList.value = []
          } else {
            tinymce.activeEditor.setContent('')
          }
        }}
      >
        <label>
          <label>
            <i class="gg-format-text"></i>&nbsp;
            <input
              type="checkbox"
              role="switch"
              ?checked=${this.toDo.value}
              onclick=${() => {
                this.toDo.value = !this.toDo.value
              }}
            />
            <i class="gg-user-list"></i>
          </label>
        </label>

        <input type="text" placeholder="my note" />

        ${this.toDo.value ? html`<todo-editor />` : html`<rich-editor />`}

        <button type="submit"><i class="gg-push-down"></i></button>
      </form>

      <input type="search" is="search-note" />

      <notes-list />
    `
  },
)
