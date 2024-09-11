const express = require("express")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const { error } = require("console")
const cors = require('cors')
const port = 8000

const app = express()
app.use(express.json())
app.use(cors({
  origin: '*'
}))


app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/login", (req, res) => {
    const {sid, password} = req.body
})

app.get('/scrape', async (req, res) => {
  // Starting a Puppeteer instance
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  // Navigating to the page and handling Auth
  let failCount = 0;
  while (failCount<3){
    await page.goto('https://gihs.daymap.net/daymap/student/dayplan.aspx');
    await page.waitForNetworkIdle();
    switch(await page.url()){
      case "https://portal.edpass.sa.edu.au/":
        const gihs = await page.waitForSelector('tr.idp:nth-child(166)')
        await gihs.click();
        const cont = await page.waitForSelector('.continue_button');
        await cont.click();
        await page.waitForNavigation();
      case "https://edpass-0927.okta.com/":
        //enter username and password
      default:
        throw error("unknown website")
    }
    

    const content = await page.content();
  }
});

app.listen(port)
console.log(`Server is running on http://localhost:${port}`)
