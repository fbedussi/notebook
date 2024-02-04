import { searchTerm } from '../../../state.js'

const EL_NAME = 'search-note'
customElements.define(
  EL_NAME,
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
