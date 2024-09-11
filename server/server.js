const express = require("express")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const { error } = require("console")
const port = 8000

// Temporary username and password
const app = express()

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/scrape", async (req, res) => {
    // Starting a Puppeteer instance
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    // Navigating to the page and handling Auth
    let failCount = 0
    while (failCount < 3) {
        await page.goto("https://gihs.daymap.net/daymap/student/dayplan.aspx")
        switch (await page.url()) {
            case "https://portal.edpass.sa.edu.au/":
                console.log(await page.$("tr.idp:nth-child(166)"))
                await page.$("tr.idp:nth-child(166)").click()
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
