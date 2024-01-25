import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { css } from '../../../custom-elements-utils.js'
import { toDoList } from '../../state.js'

const createEmptyTodo = () => {
  return {
    id: crypto.randomUUID(),
    text: '',
    done: false,
  }
}

customElements.define(
  'todo-editor',
  class extends HTMLElement {
    constructor() {
      super()

      css`
        todo-editor {
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
      this.todos = toDoList
      render(this, this.render)
    }

    toggleDone(id) {
      this.todos.value = this.todos.value.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      )
    }

    setText(id, text) {
      this.todos.value = this.todos.value.map(todo => (todo.id === id ? { ...todo, text } : todo))
    }

    addTodo() {
      this.todos.value = this.todos.value.concat(createEmptyTodo())
    }

    delTodo(id) {
      this.todos.value = this.todos.value.filter(todo => todo.id !== id)
    }

    render = () => html`
      <ol>
        ${this.todos.value.map(
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
                const itemToMoveIndex = this.todos.value.findIndex(todo => todo.id === idToMove)
                const itemToMove = this.todos.value[itemToMoveIndex]
                const filteredList = this.todos.value.filter(todo => todo.id !== idToMove)
                const insertIndex = filteredList.findIndex(t => t.id === todo.id)
                const add = insertIndex >= itemToMoveIndex ? 1 : 0
                this.todos.value = filteredList
                  .slice(0, insertIndex + add)
                  .concat(itemToMove)
                  .concat(filteredList.slice(insertIndex + add))
              }}
            >
              <i class="gg-scroll-v"></i>
              <input
                type="checkbox"
                ?checked=${todo.done}
                onclick=${() => this.toggleDone(todo.id)}
              />
              <input
                type="text"
                value=${todo.text}
                onchange=${ev => this.setText(todo.id, ev.target.value)}
              />
              <button type="button" class="outline" onclick=${() => this.delTodo(todo.id)}>
                <i class="gg-trash"></i>
              </button>
            </li>`,
        )}
        <button type="button" class="outline" onclick=${this.addTodo.bind(this)}>
          <i class="gg-add"></i>
        </button>
      </ol>
    `
  },
)
