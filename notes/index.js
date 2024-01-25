import { render, html } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import { protectedPage } from '../auth.js'
import { app } from 'a-route'
import './list-page.js'
import './single-note.js'

protectedPage()

const host = document.querySelector('#host')
app
  .use('/notes/:id', function (ctx) {
    render(host, html`<single-note id=${ctx.params.id} />`)
  })
  .use('/notes/', function () {
    render(host, html`<list-page />`)
  })

app.navigate(window.location.pathname)
