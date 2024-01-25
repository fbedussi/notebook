import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { protectedPage } from '../auth.js'
import { app } from 'a-route'
import './pages/notes/page-notes.js'
import './pages/page-note.js'

protectedPage()

const host = document.querySelector('#host')
app
  .use('/notes/:id', function (ctx) {
    render(host, html`<page-note id=${ctx.params.id} />`)
  })
  .use('/notes/', function () {
    render(host, html`<page-notes />`)
  })

app.navigate(window.location.pathname)
