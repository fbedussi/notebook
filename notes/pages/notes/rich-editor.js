import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'

customElements.define(
  'rich-editor',
  class extends HTMLElement {
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

    // eslint-disable-next-line class-methods-use-this
    disconnectedCallback() {
      tinymce.remove('#editor')
    }

    render = () => html` <div id="editor" /> `
  },
)
