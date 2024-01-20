export const css = (rules) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(rules)
  document.adoptedStyleSheets.push(sheet)
}
