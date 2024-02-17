import { render, html, signal } from 'uhtml/preactive'
import { htmlFor } from 'uhtml/keyed'
import { searchTerm } from '../../../state.js'
import { getNotes } from '../../../../backend.js'
import { getUserId } from '../../../../auth.js'
import { searchParams } from '../../../../custom-elements-utils.js'

import '../../../widgets/delete-button.js'
import './note-card.js'

const Note = (note, key) => {
  return htmlFor(Note, key)`<note-card .note=${note} />`
}

const EL_NAME = 'notes-list'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    constructor() {
      super()
    }

    connectedCallback() {
      this.notes = signal([])
      getNotes(getUserId(), this.notes)

      render(this, this.render)
    }

    render = () =>
      html`<div>
        ${this.notes.value
          .filter(note => {
            const termMatch = searchTerm.value
              ? (note.title + (note.text || note.todos.map(({ text }) => text).join(' ')))
                  .toLocaleLowerCase()
                  .includes(searchTerm.value)
              : true
            const archivedMatch =
              searchParams.value.get('showArchived') === 'true' ? true : !note.archived

            return termMatch && archivedMatch
          })
          .sort((n1, n2) => (n2.createdAt || 0) - (n1.createdAt || 0))
          .map(note => Note(note, note.id))}
      </div>`
  },
)
