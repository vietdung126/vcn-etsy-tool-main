function addStyles(win, options = { cssLinks: null, cssText: null }) {
  const { cssLinks, cssText } = options
  const head = win.document.getElementsByTagName('head')[0]

  cssLinks?.forEach(cssLink => {
    const link = win.document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', cssLink)
    head.appendChild(link)
  })

  if (cssText) {
    const style = win.document.createElement('style')
    style.type = 'text/css'
    head.appendChild(style)

    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = cssText
    } else {
      style.appendChild(win.document.createTextNode(cssText))
    }
  }
}

const VueHtmlToPaper = {
  install(app, options = {}) {
    app.config.globalProperties.$htmlToPaper = (el, localOptions, cb = () => true) => {
      const defaultName = '_blank',
        defaultSpecs = ['popup=yes', 'fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
        defaultReplace = true,
        defaultStyles = []
      let {
        name = defaultName,
        specs = defaultSpecs,
        replace = defaultReplace,
        styles = defaultStyles,
      } = options

      // If has localOptions
      // TODO: improve logic
      if (localOptions) {
        if (localOptions.name) name = localOptions.name
        if (localOptions.specs) specs = localOptions.specs
        if (localOptions.replace) replace = localOptions.replace
        if (localOptions.styles) styles = localOptions.styles
      }

      specs = specs.length ? specs.join(',') : ''

      const element = window.document.getElementById(el)

      if (!element) {
        alert(`Element to print #${el} not found!`)
        return
      }

      const url = ''
      const win = window.open(url, name, specs, replace)

      win.document.write(`
            <html>
              <head>
                <title>${window.document.title}</title>
              </head>
              <style type="text/css">
              body {
                margin: 4px;
                background: #fff;
              }
              </style>            
              <body>
                ${element.innerHTML}
              </body>
            </html>
          `)

      addStyles(win, styles)

      setTimeout(() => {
        win.document.close()
        win.focus()
        win.print()
        win.close()
        cb()
      }, 1000)

      return true
    }
  },
}

export default VueHtmlToPaper
