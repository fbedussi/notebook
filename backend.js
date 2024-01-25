import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
  browserLocalPersistence, getAuth, setPersistence,
  signInWithEmailAndPassword, signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
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
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyB-iin2A3RiV652mi3H1Y0PN-ErlL6HKY0",
  authDomain: "notebook-82ddb.firebaseapp.com",
  projectId: "notebook-82ddb",
  storageBucket: "notebook-82ddb.appspot.com",
  messagingSenderId: "486346914973",
  appId: "1:486346914973:web:98d959ccc81eca0acc6874"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const initAuth = setPersistence(auth, browserLocalPersistence).then(
  () => auth,
)

export const db = getFirestore(app)

enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    console.error(
      'Fail to enable persistence, due to a missing precondition (e.g. multiple tabs open)',
    )
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.error(
      'Fail to enable persistence, due to a lack of browser support',
    )
  }
})

export const loginBe = async ({
  email,
  password,
}) => {
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

export const getNotes = async (userId, notes) => {
  const q = query(collection(db, NOTES_COLLECTION_NAME), where("userId", "==", userId));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const updatedNotes = [];
    querySnapshot.forEach((doc) => {
      updatedNotes.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    notes.value = updatedNotes
  });
}

export const getNote = async (userId, id, note) => {
  const q = query(collection(db, NOTES_COLLECTION_NAME), where("__name__", "==", id), where("userId", "==", userId));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const updatedNotes = [];
    querySnapshot.forEach((doc) => {
      updatedNotes.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    note.value = updatedNotes[0]
  });

}

export const addNote = async (userId, note) => {
  try {
    const docRef = await addDoc(collection(db, NOTES_COLLECTION_NAME), {
      userId,
      ...note,
    });
  } catch(err) {
    alert(JSON.stringify(err))
  }
}

export const deleteNote = id => deleteDoc(doc(db, NOTES_COLLECTION_NAME, id))
