import {protectedPage} from '../auth.js'

import './add-note.js'
import './note-list.js'
import './search-note.js' 

protectedPage()

navigator.serviceWorker.register("/sw.js", { scope: "./" }).then(
    (registration) => {
      console.log("Service worker registration succeeded:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    })
