const express = require("express");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { error } = require("console");
const cors = require("cors");
const port = 8000;
const fs = require("fs");
const { fail } = require("assert");

try {
  const config = require("./config.json");
  var sid = config.sid;
  var password = config.password;
}
catch {
  var sid = null;
  var password = null;
}
console.log(sid)

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

async function findTimetable(page) {
  const $ = cheerio.load(page);
  const timetableRaw = $(".diary").children();
  let timetableArr = [];
  let dayCount = 0;
  timetableRaw.each((i, el) => {
    if (dayCount < 5){
      switch ($(el).attr("class")) {
        case "diaryDay":
          timetableArr.push($(el).text());
          dayCount++;
          break;
        case "L ditm":
          let classObj = {time: '', class: '', other: ''};
          $(el).children().each((i, el) => {
            switch ($(el).attr("class")) {
            case "t":
              classObj.time =  $(el).text();
              break;
              case "c":
              classObj.class = $(el).text();
              break;
            default:
              classObj.other = $(el).text();
              break;
          }
          });
          timetableArr.push(classObj);
          break;
      default:
        break;
      }
    }
  })
  return timetableArr;
}

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/login", (req, res) => {
  // console.log(req.body);
  let { sid, password } = req.body;
  if (!sid || !password) {
    res.status(400).send("Missing SID or Password");
  } else {
    res.send("Success");
  }
  fs.writeFile("./config.json", JSON.stringify({ sid, password }), (err) => {
    if (err) throw err;
    // console.log("Data written to file");
  });
});

app.get("/scrape", async (req, res) => {
  // Starting a Puppeteer instance
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(1500);
  // Navigating to the page and handling Auth
  let failCount = 0;
  let success = false;
  while (failCount < 3 && success == false) {
    try {
      console.log(failCount);
      await page.goto("https://gihs.daymap.net/daymap/student/dayplan.aspx");
      // console.log("navigated to daymap");
      await page.waitForResponse((response) => response.status() === 200);
      // console.log("network idle");
      let submit;
      const url = await page.url() 
      const parsedUrl = new URL(url);
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      console.log(baseUrl);
      switch (baseUrl) {
        case "https://portal.edpass.sa.edu.au":
          const gihs = await page.waitForSelector("tr.idp:nth-child(166)");
          await gihs.click();
          const cont = await page.waitForSelector(".continue_button");
          await cont.click();
          // await page.waitForNavigation();
          await page.waitForSelector("#okta-signin-username");
          if (!{ sid, password }) {
            throw error("Missing Username and/or password");
          } else {
            await page.type("#okta-signin-username", sid);
            await page.type("#okta-signin-password", password);
          }
          submit = await page.waitForSelector(".button.button-primary");
          await submit.click();
          break;
        case "https://edpass-0927.okta.com/":
          console.log("okta");
          await page.waitForSelector("#okta-signin-username");
          if (!{ sid, password }) {
            throw error("Missing Username and/or password");
          } else {
            await page.type("#okta-signin-username", sid);
            await page.type("#okta-signin-password", password);
          }
          submit = await page.waitForSelector(".button.button-primary");
          await submit.click();
          break;
        case "https://gihs.daymap.net/":
          success = true;
          break;
        default:
          throw error(`unknown website ${baseUrl}`);
      }
      await page.waitForNetworkIdle();
      // console.log('idle')
      if (page.url() == "https://gihs.daymap.net/daymap/student/dayplan.aspx") {
        // console.log('daymap')
        break;
      } else {
        failCount++;
      }
    } catch {
      failCount++;
    }
  }
  if (failCount >= 3) {
    await browser.close();
    res.status(500).send("Failed to login");
  }

  // console.log('escaped' + failCount);
  await page.waitForNetworkIdle();
  
  
  const pageToday = await page.content();
  // const weekAway = new Date(Date.now() + 604800000);
  // var wYear = weekAway.getFullYear();
  // var wMonth = (weekAway.getMonth() + 1).toString().padStart(2, "0");
  // var wDay = weekAway.getDate().toString().padStart(2, "0");
  // console.log(wMonth, wYear, wDay);
  // await page.focus('#ctl00_cp_dtbDate')
  // await page.keyboard.type(`${wMonth}/${wDay}/${wYear}`)
  // const pageWeek = await page.content();
  await browser.close();

  // Cheerio Content Processing.
  const timetableToday = await findTimetable(pageToday);
  // const timetableWeek = await findTimetable(pageWeek);
  console.log(timetableToday);
  res.status(200).json({timetable: timetableToday});
});

app.listen(port);
console.log(`Server is running on http://localhost:${port}`);
