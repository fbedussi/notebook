import { Signal } from '@preact/signals-core'
import { Note } from './model'

export const updateSelectedNote = (
  selectedNote: Signal<Omit<Note, 'id'> | null>,
  update: Partial<Note>,
) => {
  if (selectedNote.value === null) {
    return
  }

  selectedNote.value = {
    ...selectedNote.value,
    ...update,
    version: (selectedNote.value?.version || 1) + 1,
  }
}
