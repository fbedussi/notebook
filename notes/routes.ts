import { render, html } from 'uhtml/preactive'
import { protectedPage } from '../auth'

import './pages/list/page-list'
import './pages/single/page-single'

protectedPage()

function shouldNotIntercept(navigationEvent: any) {
  return (
    !navigationEvent.canIntercept ||
    // If this is just a hashChange,
    // just let the browser handle scrolling to the content.
    navigationEvent.hashChange ||
    // If this is a download,
    // let the browser perform the download.
    navigationEvent.downloadRequest ||
    // If this is a form submission,
    // let that go to the server.
    navigationEvent.formData
  )
}

const host = document.querySelector('#host')

const loadListPage = () => {
  render(host, () => html`<page-list />`)
}

const loadSinglePage = (id: string) => {
  render(host, () => html`<page-single id=${id} />`)
}

const load404Page = (id: string) => {
  render(host, () => html`<div>Ciccia, this page does not exist</div>`)
}

//@ts-ignore
navigation.addEventListener('navigate', navigateEvent => {
  // Exit early if this navigation shouldn't be intercepted.
  // The properties to look at are discussed later in the article.
  if (shouldNotIntercept(navigateEvent)) {
    return
  }

  const url = new URL(navigateEvent.destination.url)

  const matchSingle = url.pathname.match(/notes\/(.+)/)
  if (matchSingle) {
    const id = matchSingle[1]
    navigateEvent.intercept({ handler: () => loadSinglePage(id) })
  } else if (url.pathname.includes('/notes/')) {
    navigateEvent.intercept({ handler: loadListPage })
  } else {
    navigateEvent.intercept({ handler: load404Page })
  }
})

loadListPage()
