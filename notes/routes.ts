import { render, html } from 'uhtml/preactive'
import { protectedPage } from '../auth'
import { app } from 'a-route'
import './pages/list/page-list'
import './pages/single/page-single'

protectedPage()

const host = document.querySelector('#host')
app
  .use('/notes/', function () {
    render(host, () => html`<page-list />`)
  })
  .use('/notes/?showArchived=:showArchived', function () {
    render(host, () => html`<page-list />`)
  })
  .use('/notes/:id', function (ctx: { params: { id: string } }) {
    render(host, () => html`<page-single id=${ctx.params.id} />`)
  })

app.navigate(window.location.pathname)
