import {render, html, signal} from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'

customElements.define('rich-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    render(this, this.render)
    
    tinymce.remove('#editor')
    tinymce.init({
      selector: '#editor',
    })
  }

  disconnectedCallback() {
    tinymce.remove('#editor')
  }

  render = () => html`
    <div id="editor" />
    `
})
