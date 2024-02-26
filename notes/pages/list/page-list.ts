import { render, html, signal, Signal } from 'uhtml/preactive'
import { css, searchParams, setSearchParams } from '../../../custom-elements-utils'
import { updateSelectedNote } from '../../helpers'
import { addNote } from '../../../backend'
import { HTMLInputEvent, Note } from '../../model'

import './components/notes-list'
import './components/search-note'
import '../../widgets/todo-editor'
import '../../widgets/rich-editor'
import '../../widgets/delete-button'
import '../../widgets/reveal-panel'

const blankNote = {
  title: '',
  text: '',
  todos: [],
  createdAt: 0,
  updatedAt: 0,
  version: 0,
}

const blankTextNote: Omit<Note, 'id'> = {
  type: 'text',
  ...blankNote,
}

const blankTodoNote: Omit<Note, 'id'> = {
  type: 'todo',
  ...blankNote,
}

const EL_NAME = 'page-list'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    showAddNoteForm: Signal<boolean>
    selectedNote: Signal<Omit<Note, 'id'>>
    toDo: Signal<boolean>

    constructor() {
      super()

      css`
        ${EL_NAME} {
          display: flex;
          flex-direction: column;
          gap: 1rem;

          .tox .tox-promotion-link,
          .tox-statusbar__right-container {
            display: none !important;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .action-bar {
            display: grid;
            grid-template-columns: auto max-content;
            gap: 1rem;
            align-items: center;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      `

      this.showAddNoteForm = signal(false)

      this.selectedNote = signal(blankTextNote)
      this.toDo = signal(false)
    }

    connectedCallback() {
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

      <button
        ?hidden=${this.showAddNoteForm.value}
        type="button"
        onclick=${() => (this.showAddNoteForm.value = !this.showAddNoteForm.value)}
      >
        <i class="gg-add"></i>
      </button>

      <reveal-panel transition="300" ?open=${this.showAddNoteForm.value}>
        <form
          onsubmit=${(ev: SubmitEvent) => {
            ev.preventDefault()

            addNote(this.selectedNote.value)

            if (this.toDo.value) {
              this.selectedNote.value = blankTodoNote
            } else {
              this.selectedNote.value = blankTextNote
            }
          }}
        >
          <div class="header">
            <label>
              <i class="gg-format-text"></i>&nbsp;
              <input
                type="checkbox"
                role="switch"
                ?checked=${this.toDo.value}
                onclick=${() => {
                  this.toDo.value = !this.toDo.value
                  this.selectedNote.value = this.toDo.value ? blankTodoNote : blankTextNote
                }}
              />
              <i class="gg-user-list"></i>
            </label>

            <button
              class="icon outline"
              type="button"
              onclick=${() => (this.showAddNoteForm.value = !this.showAddNoteForm.value)}
            >
              <i class="gg-chevron-up"></i>
            </button>
          </div>

          <input
            type="text"
            placeholder="my note"
            value=${this.selectedNote.value?.title}
            onchange=${(ev: HTMLInputEvent) => {
              updateSelectedNote(this.selectedNote, {
                title: ev.target.value,
              })
            }}
          />

          ${this.selectedNote.value?.type === 'todo'
            ? html`<todo-editor .selectedNote=${this.selectedNote} hideDeleteDone=${true} />`
            : undefined}
          ${this.selectedNote.value?.type === 'text'
            ? html`<rich-editor .selectedNote=${this.selectedNote} />`
            : undefined}

          <button type="submit"><i class="gg-push-down"></i></button>
        </form>
      </reveal-panel>

      <div class="action-bar">
        <input type="search" is="search-note" />
        <label>
          <input
            type="checkbox"
            ?checked=${searchParams.value.get('showArchived') === 'true'}
            onclick=${(ev: HTMLInputEvent) => {
              setSearchParams({ showArchived: ev.target.checked })
            }}
          />
          Show archived
        </label>
      </div>

      <notes-list />
    `
  },
)
