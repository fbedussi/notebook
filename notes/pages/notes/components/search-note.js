import { searchTerm } from '../../../state.js'

customElements.define(
  'search-note',
  class extends HTMLInputElement {
    constructor() {
      super()
    }

    connectedCallback() {
      this.value = ''
      this.addEventListener('input', e => {
        searchTerm.value = e.target.value
      })
    }
  },
  { extends: 'input' },
)
