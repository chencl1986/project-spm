import puppeteer from 'puppeteer'
;(async () => {
  const browser = await puppeteer.launch()
  const pages = await browser.pages()
  pages?.[0].close()
  const count = 1000

  for (let i = 0; i < count; i++) {
    const page = await browser.newPage()
    await page.goto('http://localhost:9001/')

    page.on('response', async function (res) {
      const url = res.url()

      if (url.endsWith('/log')) {
        await page.close()

        if (i === count - 1) {
          await browser.close()
        }
      }
    })
    const elements = await page.$$('a')
    const index = Math.floor(Math.random() * elements.length)
    elements[index].click()
  }
})()
