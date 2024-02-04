import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { css } from '../../../custom-elements-utils.js'

import './components/notes-list.js'
import './components/search-note.js'
import '../../widgets/note-editor.js'

import '../../widgets/delete-button.js'
import { addNote } from '../../../backend.js'
import { selectedNote } from '../../state.js'

const blankTextNote = {
  type: 'text',
  title: '',
  text: '',
  todos: [],
}

const blankTodoNote = {
  type: 'todo',
  title: '',
  text: '',
  todos: [],
}

customElements.define(
  'page-list',
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
      selectedNote.value = blankTextNote
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

          addNote(selectedNote.value)

          if (this.toDo.value) {
            selectedNote.value = blankTodoNote
          } else {
            selectedNote.value = blankTextNote
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
                selectedNote.value = this.toDo.value ? blankTodoNote : blankTextNote
              }}
            />
            <i class="gg-user-list"></i>
          </label>
        </label>

        <note-editor />

        <button type="submit"><i class="gg-push-down"></i></button>
      </form>

      <input type="search" is="search-note" />

      <notes-list />
    `
  },
)
