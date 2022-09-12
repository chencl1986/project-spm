import puppeteer from 'puppeteer'
;(async () => {
  const browser = await puppeteer.launch()
  const pages = await browser.pages()
  pages?.[0].close()

  const page = await browser.newPage()
  await page.goto('http://localhost:9001/')

  page.on('console', (msg): void => {
    const text = msg.text()

    if (!/Vue|nuxt|vite|Suspense/.test(text)) {
      console.log(text)
    }
  })

  page.exposeFunction('closeBrowser', (): void => {
    browser.close()
  })

  page.evaluate(async () => {
    function wait(timeout) {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          resolve()
        }, timeout)
      })
    }
    const count = 1000
    await wait(1500)

    for (let i = 0; i < count; i++) {
      const elements = window.document.querySelectorAll('[data-spm-visible]')
      const index = Math.floor(Math.random() * elements.length)
      elements[index].scrollIntoView()

      await wait(4000)

      if (i === count - 1) {
        // @ts-ignore
        window.closeBrowser()
      }
    }
  })
})()
