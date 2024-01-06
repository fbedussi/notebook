import {addNote} from '../backend.js'
import { getUserId } from '../auth.js'

customElements.define('add-note', class extends HTMLFormElement {
  constructor(){
    super()
  }

  connectedCallback() {
    this.addEventListener('submit', e => {
      e.preventDefault()
      addNote(getUserId(), e.target[0].value)
      e.target[0].value = ''
    })
  }
}, {
  extends: 'form'
})
