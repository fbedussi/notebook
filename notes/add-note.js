import {addNote} from '../backend.js'
import { getUserId } from '../auth.js'
// import {css} from '../custom-elements-utils.js'
customElements.define('add-note', class extends HTMLFormElement {
  constructor(){
    super()

    // css`
    //   [is="add-note"] {
    //     button {
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //       gap: 0.5em;
    //     }
    //   }
    // `
  }

  connectedCallback() {
    this.addEventListener('submit', e => {
      e.preventDefault()
      addNote(getUserId(), editor.value)
      editor.value = ''
    })
  }
}, {
  extends: 'form'
})
