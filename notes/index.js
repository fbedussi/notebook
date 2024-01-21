import {render, html} from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
import {protectedPage} from '../auth.js'

import './list-page.js'
import './single-note.js'

protectedPage()

const {app} = ARoute

app
  .use('/notes/:id', function (ctx) {
    render(
      host,
      html`<single-note id=${ctx.params.id}/>`
    )
  })
  .use('/notes/', function (ctx) {
    render(
      host,
      html`<list-page/>`
    )
  })

app.navigate(window.location.pathname)
