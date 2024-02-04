import { signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'

export const searchTerm = signal('')

export const toDoList = signal([])

export const selectedNote = signal(null)

export const updateSelectedNote = update => {
  selectedNote.value = {
    ...selectedNote.value,
    ...update,
    version: (selectedNote.version || 1) + 1,
  }
}
