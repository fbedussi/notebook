import { render, html } from 'uhtml/preactive'
import { protectedPage } from '../auth.js'
import { app } from 'a-route'
import './pages/list/page-list.js'
import './pages/single/page-single.js'

protectedPage()

const host = document.querySelector('#host')
app
  .use('/notes/:id', function (ctx) {
    render(host, html`<page-single id=${ctx.params.id} />`)
  })
  .use('/notes/', function () {
    render(host, html`<page-list />`)
  })

app.navigate(window.location.pathname)
