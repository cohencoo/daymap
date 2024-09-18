const express = require("express")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const { error } = require("console")
const cors = require('cors')
const port = 8000
const fs = require('fs')
// checking if file exists before loading it
console.log(fs.existsSync('./config.json'))
if (fs.existsSync('./config.json')){
  const config = require('./config.json')
  console.log(config.sid)
  var sid = config.sid;
  var password = config.password;
} else{
  var sid = null;
  var password = null;
}
// console.log(password)

const app = express()
app.use(express.json())
app.use(cors({
  origin: '*'
}))


app.get("/", (req, res) => {
    res.send(sid)
})

app.post("/login", (req, res) => {
  console.log(req.body)
  let {sid, password} = req.body
  if (!sid || !password){
    res.status(400).send("Missing SID or Password")
  }
  else{
    res.send("Success")
  }
  fs.writeFile('./config.json', JSON.stringify({sid, password}), (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
})

app.get('/scrape', async (req, res) => {
  // Starting a Puppeteer instance
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(1500); 
  // Navigating to the page and handling Auth
  let failCount = 0;
  while (failCount<3){
    try{
      await page.goto('https://gihs.daymap.net/daymap/student/dayplan.aspx');
      console.log("navigated to daymap");
      await page.waitForNetworkIdle();
      console.log("network idle");
      let submit;
      switch(await page.url()){
        case "https://portal.edpass.sa.edu.au/":
          console.log("portal");
          const gihs = await page.waitForSelector('tr.idp:nth-child(166)')
          await gihs.click();
          const cont = await page.waitForSelector('.continue_button');
          await cont.click();
          await page.waitForNavigation();
          await page.waitForSelector('#okta-signin-username')
          if (!{sid, password}){
            throw error('Missing Username and/or password')
          }
          else{
            await page.type('#okta-signin-username', sid);
            await page.type('#okta-signin-password', password);
          }
          submit = await page.waitForSelector('.button.button-primary');
          await submit.click();
          break;
        case "https://edpass-0927.okta.com/":
          console.log("okta");
          await page.waitForSelector('#okta-signin-username')
          if (!{sid, password}){
            throw error('Missing Username and/or password')
          }
          else{
            await page.type('#okta-signin-username', sid);
            await page.type('#okta-signin-password', password);
          }
          submit = await page.waitForSelector('.button.button-primary');
          await submit.click();
          break;
        default:
          throw error("unknown website")
        }
      await page.waitForNetworkIdle();
      console.log('idle')
      if (await page.url() == "https://gihs.daymap.net/daymap/student/dayplan.aspx") {
        console.log('daymap')
        break;
      }
      else{
        failCount++;
      }
    }
    catch {
      failCount++;
    }
    
    console.log('escaped');
    const content = await page.content();
    await browser.close();
    res.send(content);
  }
});

app.listen(port)
console.log(`Server is running on http://localhost:${port}`)
