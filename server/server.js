const express = require("express")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const { error } = require("console")
const port = 8000

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/login", (req, res) => {
    console.log(res)
})

app.get("/scrape", async (req, res) => {
    // Starting a Puppeteer instance
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    // Navigating to the page and handling Auth
    let failCount = 0
    while (failCount < 3) {
        await page.goto("https://gihs.daymap.net/daymap/student/dayplan.aspx")
        await page.waitForNetworkIdle()
        switch (await page.url()) {
            case "https://portal.edpass.sa.edu.au/":
                console.log(await page.$$x('//*[@id="0oamc0sv2IbQE6VD33l6"]'))
                await page.$$x('//*[@id="0oamc0sv2IbQE6VD33l6"]').click()
                await page.waitForNavigation()
            case "https://edpass-0927.okta.com/":
            //enter username and password
            default:
                throw error("unknown website")
        }

        const content = await page.content()
    }
})

app.listen(port)
console.log(`Server is running on http://localhost:${port}`)
