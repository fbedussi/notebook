import {loginBe} from './backend.js'
const USER_ID = 'userId'

const setUserId = userId => {
  window.localStorage.setItem(USER_ID, userId)
}

export const getUserId = () => {
  return window.localStorage.getItem(USER_ID)
}

export const authenticate = (email, password) =>{
  return loginBe({email, password})
      .then(res => {
        setUserId(res.id)
      })
}

export const protectedPage = () => {
  if (!getUserId()) {
    window.location = window.location.origin
  }
}
