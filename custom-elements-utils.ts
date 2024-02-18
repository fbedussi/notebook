import { signal } from 'uhtml/preactive'

export const css = (strings: TemplateStringsArray, ...values: string[]) => {
  var rules = strings[0]
  for (let i = 0; i < values.length; i++) {
    rules += values[i] + strings[i + 1]
  }

  if (!rules.trim().length) {
    return
  }

  const sheet = new CSSStyleSheet()
  sheet.replaceSync(rules)
  document.adoptedStyleSheets.push(sheet)
}

export const searchParams = signal(new URLSearchParams(location.search))

export const setSearchParams = (params: Record<string, string | boolean>) => {
  const urlSearchParams = new URLSearchParams(location.search)
  Object.entries(params).forEach(([name, value]) => {
    urlSearchParams.set(name, value.toString())
  })
  history.replaceState({}, '', `${location.pathname}?${urlSearchParams}`)
  searchParams.value = urlSearchParams
}
