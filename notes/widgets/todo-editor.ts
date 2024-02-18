import { render, html, Signal } from 'uhtml/preactive'
import { htmlFor } from 'uhtml/keyed'
import { css } from '../../custom-elements-utils'
import { updateSelectedNote } from '../helpers'
import { HTMLInputEvent, Note, Todo } from '../model'

const createEmptyTodo = (): Todo => {
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
    selectedNote?: Signal<Note>

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
      if (this.selectedNote?.value?.type !== 'todo') {
        throw new Error('todo-editor must be used with todo type notes')
      }

      render(this, this.render)
    }

    toggleDone(id: string) {
      this.selectedNote &&
        updateSelectedNote(this.selectedNote, {
          todos: this.selectedNote.value.todos.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo,
          ),
        })
    }

    setText(id: string, text: string) {
      this.selectedNote &&
        updateSelectedNote(this.selectedNote, {
          todos: this.selectedNote.value.todos.map(todo =>
            todo.id === id ? { ...todo, text } : todo,
          ),
        })
    }

    addTodo() {
      this.selectedNote &&
        updateSelectedNote(this.selectedNote, {
          todos: this.selectedNote.value.todos.concat(createEmptyTodo()),
        })
      setTimeout(() => {
        ;(this.querySelector('li:last-of-type input[type="text"]') as HTMLElement).focus()
      }, 0)
    }

    delTodo(id: string) {
      this.selectedNote &&
        updateSelectedNote(this.selectedNote, {
          todos: this.selectedNote.value.todos.filter(todo => todo.id !== id),
        })
    }

    delDone() {
      this.selectedNote &&
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
        ${this.selectedNote?.value?.todos.map(todo => this.renderTodo(todo, todo.id))}
        <button type="button" class="outline" onclick=${() => this.addTodo()}>
          <i class="gg-add"></i>
        </button>
      </ol>
    `

    renderTodo = (todo: Todo, key: string) => htmlFor(this.renderTodo, key)`<li
              draggable="true"
              ondragstart=${(ev: DragEvent & { target: HTMLElement }) => {
                ev.dataTransfer?.setData('text/plain', todo.id)
                ev.dataTransfer?.setData('text/html', ev.target.outerHTML)
              }}
              ondragover=${(ev: DragEvent & { dataTransfer: DataTransfer }) => {
                ev.preventDefault()
                ev.dataTransfer.dropEffect = 'move'
              }}
              ondragenter=${(ev: DragEvent) => {
                ev.preventDefault()
              }}
              ondrop=${(ev: DragEvent & { dataTransfer: DataTransfer }) => {
                ev.preventDefault()
                if (!this.selectedNote) {
                  return
                }

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
                oninput=${(ev: HTMLInputEvent) => this.setText(todo.id, ev.target.value)}
              />
              <button type="button" class="outline" onclick=${() => this.delTodo(todo.id)}>
                <i class="gg-trash"></i>
              </button>
            </li>`
  },
)
