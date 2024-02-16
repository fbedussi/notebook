import { render, html } from 'uhtml/preactive'
import { css } from '../../custom-elements-utils.js'
import { updateSelectedNote } from '../helpers.js'

const createEmptyTodo = () => {
  return {
    id: crypto.randomUUID(),
    text: '',
    done: false,
  }
}

const EL_NAME = 'todo-editor'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    constructor() {
      super()

      css`
        ${EL_NAME} {
          button {
            margin-bottom: 1rem;
          }

          ol {
            list-style-type: none;
            padding: 0;
          }

          li {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;

            button {
              width: auto;
            }
          }
        }
      `
    }

    connectedCallback() {
      if (this.selectedNote.value.type !== 'todo') {
        throw new Error('todo-editor must be used with todo type notes')
      }

      render(this, this.render)
    }

    toggleDone(id) {
      updateSelectedNote(this.selectedNote, {
        todos: this.selectedNote.value.todos.map(todo =>
          todo.id === id ? { ...todo, done: !todo.done } : todo,
        ),
      })
    }

    setText(id, text) {
      updateSelectedNote(this.selectedNote, {
        todos: this.selectedNote.value.todos.map(todo =>
          todo.id === id ? { ...todo, text } : todo,
        ),
      })
    }

    addTodo() {
      updateSelectedNote(this.selectedNote, {
        todos: this.selectedNote.value.todos.concat(createEmptyTodo()),
      })
    }

    delTodo(id) {
      updateSelectedNote(this.selectedNote, {
        todos: this.selectedNote.value.todos.filter(todo => todo.id !== id),
      })
    }

    delDone() {
      updateSelectedNote(this.selectedNote, {
        todos: this.selectedNote.value.todos.filter(todo => !todo.done),
      })
    }

    render = () => html`
      <button class="outline" onclick=${() => this.delDone()}>
        <i class="gg-trash"></i>
        Delete all done
      </button>
      <ol>
        ${this.selectedNote.value?.todos.map(
          todo =>
            html` <li
              draggable="true"
              ondragstart=${ev => {
                ev.dataTransfer.setData('text/plain', todo.id)
                ev.dataTransfer.setData('text/html', ev.target.outerHTML)
              }}
              ondragover=${ev => {
                ev.preventDefault()
                ev.dataTransfer.dropEffect = 'move'
              }}
              ondragenter=${ev => {
                ev.preventDefault()
              }}
              ondrop=${ev => {
                ev.preventDefault()
                const idToMove = ev.dataTransfer.getData('text/plain')
                const itemToMoveIndex = this.selectedNote.value.todos.findIndex(
                  todo => todo.id === idToMove,
                )
                const itemToMove = this.selectedNote.value.todos[itemToMoveIndex]
                const filteredList = this.selectedNote.value.todos.filter(
                  todo => todo.id !== idToMove,
                )
                const insertIndex = filteredList.findIndex(t => t.id === todo.id)
                const add = insertIndex >= itemToMoveIndex ? 1 : 0
                updateSelectedNote(this.selectedNote, {
                  todos: filteredList
                    .slice(0, insertIndex + add)
                    .concat(itemToMove)
                    .concat(filteredList.slice(insertIndex + add)),
                })
              }}
            >
              <i class="gg-scroll-v"></i>
              <input
                type="checkbox"
                ?checked=${todo.done}
                onclick=${() => this.toggleDone(todo.id)}
              />
              <input
                class=${['underlined', todo.done ? 'todo-done' : ''].join(' ')}
                type="text"
                value=${todo.text}
                oninput=${ev => this.setText(todo.id, ev.target.value)}
              />
              <button type="button" class="outline" onclick=${() => this.delTodo(todo.id)}>
                <i class="gg-trash"></i>
              </button>
            </li>`,
        )}
        <button type="button" class="outline" onclick=${() => this.addTodo()}>
          <i class="gg-add"></i>
        </button>
      </ol>
    `
  },
)
