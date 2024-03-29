import { authenticate, getUserId } from './auth'

if (getUserId()) {
  window.location.href = window.location.origin + '/notebook/notes/'
}
customElements.define(
  'login-form',
  class extends HTMLFormElement {
    constructor() {
      super()
      this.alert = this.querySelector('.error-alert')
    }

    connectedCallback() {
      this.addEventListener('submit', e => {
        e.preventDefault()

        authenticate(e.target?.[0].value, e.target?.[1].value)
          .then(() => {
            window.location.href = window.location.origin + '/notebook/notes/'
          })
          .catch(err => {
            const mapError = {
              INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
            }
            this.alert.innerText = mapError[err.message] || 'Login error'
          })
      })
    }
  },
  { extends: 'form' },
)
