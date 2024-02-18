import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  enableIndexedDbPersistence,
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { getUserId } from './auth'
import { Signal } from '@preact/signals-core'
import { Note } from './notes/model'

const firebaseConfig = {
  apiKey: 'AIzaSyB-iin2A3RiV652mi3H1Y0PN-ErlL6HKY0',
  authDomain: 'notebook-82ddb.firebaseapp.com',
  projectId: 'notebook-82ddb',
  storageBucket: 'notebook-82ddb.appspot.com',
  messagingSenderId: '486346914973',
  appId: '1:486346914973:web:98d959ccc81eca0acc6874',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const initAuth = setPersistence(auth, browserLocalPersistence).then(() => auth)

export const db = getFirestore(app)

enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    // eslint-disable-next-line no-console
    console.error(
      'Fail to enable persistence, due to a missing precondition (e.g. multiple tabs open)',
    )
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    // eslint-disable-next-line no-console
    console.error('Fail to enable persistence, due to a lack of browser support')
  }
})

export const loginBe = async ({ email, password }: { email: string; password: string }) => {
  const auth = getAuth(app)
  await setPersistence(auth, browserLocalPersistence)
  const response = await signInWithEmailAndPassword(auth, email, password)
  return {
    id: response.user.uid,
    username: response.user.providerData[0].uid,
  }
}

export const logoutBe = async () => {
  const auth = getAuth(app)

  signOut(auth).then(() => {
    return true
  })
}

const NOTES_COLLECTION_NAME = 'notes'

const baseNote = {
  text: '',
  todos: [],
  version: 1,
  archived: false,
  createdAt: 0,
}

export const getNotes = async (notes: Signal<Note[]>) => {
  const userId = getUserId()
  if (!userId) {
    throw new Error('user is not logged in')
  }

  const q = query(collection(db, NOTES_COLLECTION_NAME), where('userId', '==', userId))
  onSnapshot(q, querySnapshot => {
    const updatedNotes: Note[] = []
    querySnapshot.forEach(doc => {
      updatedNotes.push({
        ...baseNote,
        ...(doc.data() as Note),
        id: doc.id,
      })
    })
    notes.value = updatedNotes
  })
}

export const getNote = async (id: string, note: Signal<Note | null>, forceUpdate?: boolean) => {
  const userId = getUserId()
  const q = query(
    collection(db, NOTES_COLLECTION_NAME),
    where('__name__', '==', id),
    where('userId', '==', userId),
  )
  onSnapshot(q, querySnapshot => {
    const updatedNotes: Note[] = []
    querySnapshot.forEach(doc => {
      updatedNotes.push({
        ...baseNote,
        ...(doc.data() as Note),
        id: doc.id,
      })
    })
    const updatedNote = updatedNotes[0]
    const newData = updatedNote && updatedNote.version > (note.value?.version || -1)
    if (forceUpdate || newData) {
      note.value = updatedNote
    }
  })
}

export const addNote = async (note: Omit<Note, 'createdAt' | 'id'>) => {
  const userId = getUserId()

  const timestamp = new Date().getTime()

  try {
    const docRef = await addDoc(collection(db, NOTES_COLLECTION_NAME), {
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...note,
    })
    return docRef.id
  } catch (err) {
    throw err
  }
}

export const updateNote = async (note: Note | null) => {
  if (!note) {
    return
  }

  const timestamp = new Date().getTime()

  try {
    console.log('updating note', note.id)
    const docRef = doc(db, NOTES_COLLECTION_NAME, note.id)
    await updateDoc(docRef, {
      ...note,
      updatedAt: timestamp,
    })
  } catch (err) {
    console.error(JSON.stringify(err))
  }
}

export const deleteNote = (id: string) => deleteDoc(doc(db, NOTES_COLLECTION_NAME, id))
