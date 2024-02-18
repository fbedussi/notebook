import { css } from '../../custom-elements-utils'

const EL_NAME = 'reveal-panel'
customElements.define(
  EL_NAME,
  class extends HTMLElement {
    transition = '250'

    constructor() {
      super()
    }

    connectedCallback() {
      this.transition = this.getAttribute('transition') || this.transition

      css`
        ${EL_NAME} {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          transition: grid-template-rows ${this.transition}ms;

          .content {
            min-height: 0;
          }

          &[open] {
            grid-template-rows: 1fr;
          }
        }
      `

      const children = Array.from(this.children)
      const div = document.createElement('div')
      div.className = 'content'
      this.appendChild(div)
      children.forEach(child => div.appendChild(child))
    }
  },
)
