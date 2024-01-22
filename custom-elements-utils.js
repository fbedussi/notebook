import { signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'

export const css = (rules) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(rules)
  document.adoptedStyleSheets.push(sheet)
}

export const searchParams = signal(new URLSearchParams(location.search))

export const setSearchParams = (params) => {
  const urlSearchParams = new URLSearchParams(location.search)
  Object.entries(params).forEach(([name, value]) => {
    urlSearchParams.set(name, value)
  })
  history.replaceState({}, '', `${location.pathname}?${urlSearchParams}`);
  searchParams.value = urlSearchParams
}
