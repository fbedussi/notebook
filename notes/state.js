import { signal } from 'uhtml/preactive'

export const searchTerm = signal('')

export const toDoList = signal([])

export const selectedNote = signal(null)

export const updateSelectedNote = update => {
  selectedNote.value = {
    ...selectedNote.value,
    ...update,
    version: (selectedNote.value.version || 1) + 1,
  }
}
