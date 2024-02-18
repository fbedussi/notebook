import { render, html, signal, Signal } from 'uhtml/preactive'
import { htmlFor } from 'uhtml/keyed'
import { searchTerm } from '../../../state'
import { getNotes } from '../../../../backend'
import { searchParams } from '../../../../custom-elements-utils'

import '../../../widgets/delete-button'
import './note-card'
import { Note } from '../../../model'

const RenderNote = (note: Note, key: string) => {
  return htmlFor(RenderNote, key)`<note-card .note=${note} />`
}

const EL_NAME = 'notes-list'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    notes?: Signal<Note[]>

    constructor() {
      super()
    }

    connectedCallback() {
      this.notes = signal([])
      getNotes(this.notes)

      render(this, this.render)
    }

    render = () =>
      html`<div>
        ${this.notes?.value
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
          .map(note => RenderNote(note, note.id))}
      </div>`
  },
)
