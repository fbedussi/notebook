export type Todo = {
  id: string
  text: string
  done: boolean
}

export type Note = {
  id: string
  type: 'todo' | 'text'
  title: string
  text: string
  todos: Todo[]
  archived?: boolean
  createdAt: number
  updatedAt?: number
  version: number
}

export type HTMLInputEvent = InputEvent & { target: HTMLInputElement }
