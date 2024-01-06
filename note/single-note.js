import { render, html } from 'https://esm.run/uhtml'
import {subscribeSignals} from '../signals.js'
import {notes} from '../state.js'
import { getNotes } from '../backend.js'
import {getToken} from '../auth.js'

import '../delete-button.js'

customElements.define('single-note', class extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback() {
    const searchParams = new URLSearchParams(window.location.search)
    this.noteId = searchParams.get('id')
    subscribeSignals(this)
    getNotes(getToken())
  }

  render(){
    const note = notes.value
          .find(note => note.id === this.noteId)
    render(this, html`
            <style>
              single-note {
                footer {
                  display: flex;
                  justify-content: space-between;
                }
              }
            </style>
            <article>
              ${note?.text}
              <footer>
                <div><a href="/list"><i class="gg-arrow-left"></i> back</a></div>
                <delete-button id=${this.noteId}/> 
              </footer>
            </article>
          `)
  }
})
