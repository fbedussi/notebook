import { render, html } from 'uhtml/preactive'
import { protectedPage } from '../auth.js'
import { app } from 'a-route'
import './pages/list/page-list.js'
import './pages/single/page-single.js'

protectedPage()

const host = document.querySelector('#host')
app
  .use('/notes/', function () {
    render(host, () => html`<page-list />`)
  })
  .use('/notes/?showArchived=:showArchived', function () {
    render(host, () => html`<page-list />`)
  })
  .use('/notes/:id', function (ctx) {
    render(host, () => html`<page-single id=${ctx.params.id} />`)
  })

app.navigate(window.location.pathname)
