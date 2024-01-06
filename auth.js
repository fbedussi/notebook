import {loginBe} from './backend.js'
const TOKEN = 'token'

const setToken = token => {
  window.localStorage.setItem(TOKEN, token)
}

export const getToken = () => {
  return window.localStorage.getItem(TOKEN)
}

export const authenticate = (email, password) =>{
  return loginBe({email, password})
      .then(res => {
        setToken(res.id)
      })
}

export const protectedPage = () => {
  if (!getToken()) {
    window.location = '/'
  }
}
