import { render, html } from 'uhtml/preactive'
import { css } from '../../custom-elements-utils.js'
import { selectedNote, updateSelectedNote } from '../state.js'

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
      if (selectedNote.value.type !== 'todo') {
        throw new Error('todo-editor must be used with todo type notes')
      }

      render(this, this.render)
    }

    toggleDone(id) {
      updateSelectedNote({
        todos: selectedNote.value.todos.map(todo =>
          todo.id === id ? { ...todo, done: !todo.done } : todo,
        ),
      })
    }

    setText(id, text) {
      updateSelectedNote({
        todos: selectedNote.value.todos.map(todo => (todo.id === id ? { ...todo, text } : todo)),
      })
    }

    addTodo() {
      updateSelectedNote({ todos: selectedNote.value.todos.concat(createEmptyTodo()) })
    }

    delTodo(id) {
      updateSelectedNote({ todos: selectedNote.value.todos.filter(todo => todo.id !== id) })
    }

    render = () => html`
      <ol>
        ${selectedNote.value?.todos.map(
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
                const itemToMoveIndex = selectedNote.value.todos.findIndex(
                  todo => todo.id === idToMove,
                )
                const itemToMove = selectedNote.value.todos[itemToMoveIndex]
                const filteredList = selectedNote.value.todos.filter(todo => todo.id !== idToMove)
                const insertIndex = filteredList.findIndex(t => t.id === todo.id)
                const add = insertIndex >= itemToMoveIndex ? 1 : 0
                updateSelectedNote({
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
        <button type="button" class="outline" onclick=${this.addTodo}>
          <i class="gg-add"></i>
        </button>
      </ol>
    `
  },
)
