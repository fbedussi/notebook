export const updateSelectedNote = (selectedNote, update) => {
  selectedNote.value = {
    ...selectedNote.value,
    ...update,
    version: (selectedNote.value.version || 1) + 1,
  }
}
