import { authenticate, getUserId } from './auth.js'

customElements.define('login-form', class extends HTMLFormElement {
  constructor(){
    super()
    this.alert = this.querySelector('.error-alert')
  }

  connectedCallback() {
    if (getUserId()) {
        window.location = '/list'
    }

    this.addEventListener('submit', e => {
      e.preventDefault()

      authenticate(e.target[0].value, e.target[1].value)
      .then(() => {
        window.location = '/list'
      })
      .catch(err => {
        const mapError = {
          INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials'
        }
        this.alert.innerText = mapError[err.message] || 'Login error'
      })
    }) 
  }
},
{extends: 'form'}
)
