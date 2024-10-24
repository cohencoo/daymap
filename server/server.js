const express = require("express")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const { error } = require("console")
const cors = require("cors")
const port = 8000
const fs = require("fs")
const { fail } = require("assert")
// checking if file exists before loading it
console.log(fs.existsSync("./config.json"))
if (fs.existsSync("./config.json")) {
    const config = require("./config.json")
    console.log(config.sid)
    var sid = config.sid
    var password = config.password
} else {
    var sid = null
    var password = null
}
// console.log(password)

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: "*",
    })
)

app.get("/", (req, res) => {
    res.send(sid)
})

app.post("/login", (req, res) => {
    console.log(req.body)
    let { sid, password } = req.body
    if (!sid || !password) {
        res.status(400).send("Missing SID or Password")
    } else {
        res.send("Success")
    }
    fs.writeFile("./config.json", JSON.stringify({ sid, password }), (err) => {
        if (err) throw err
        console.log("Data written to file")
    })
})

app.get("/scrape", async (req, res) => {
    // Starting a Puppeteer instance
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    // await page.setDefaultNavigationTimeout(1500);
    // Navigating to the page and handling Auth
    let failCount = 0
    while (failCount < 3) {
        try {
            await page.goto("https://gihs.daymap.net/daymap/student/classdiary.aspx")
            console.log("navigated to daymap")
            await page.waitForResponse((response) => response.status() === 200)
            console.log("network idle")
            let submit
            switch (await page.url()) {
                case "https://portal.edpass.sa.edu.au/":
                    console.log("portal")
                    const gihs = await page.waitForSelector("tr.idp:nth-child(166)")
                    await gihs.click()
                    const cont = await page.waitForSelector(".continue_button")
                    await cont.click()
                    await page.waitForNavigation()
                    await page.waitForSelector("#okta-signin-username")
                    if (!{ sid, password }) {
                        throw error("Missing Username and/or password")
                    } else {
                        await page.type("#okta-signin-username", sid)
                        await page.type("#okta-signin-password", password)
                    }
                    submit = await page.waitForSelector(".button.button-primary")
                    await submit.click()
                    break
                case "https://edpass-0927.okta.com/":
                    console.log("okta")
                    await page.waitForSelector("#okta-signin-username")
                    if (!{ sid, password }) {
                        throw error("Missing Username and/or password")
                    } else {
                        await page.type("#okta-signin-username", sid)
                        await page.type("#okta-signin-password", password)
                    }
                    submit = await page.waitForSelector(".button.button-primary")
                    await submit.click()
                    break
                default:
                    throw error("unknown website")
            }
            await page.waitForNetworkIdle()
            console.log("idle")
            if ((await page.url()) == "https://gihs.daymap.net/daymap/student/dayplan.aspx") {
                console.log("daymap")
                break
            } else {
                failCount++
            }
        } catch {
            failCount++
        }
    }
    if (failCount == 3) {
        res.status(500).send("Failed to login")
        await browser.close()
        throw error("Failed to login")
    }

    console.log("escaped" + failCount)
    await page.waitForNetworkIdle()
    const diaryContent = await page.content()
    await browser.close()
    // console.log(content);
})

app.post("/test-scrape", async (req, res) => {
    const testData = {
        id: "200076",
        name: "Cohen",
        timetable: [
            /**
             * We need the timetable array to be in the following format:
             *
             * Array <{ title: string; start: string; end: string }>
             *
             * The date scraped from DayMap that then be put as YYYY-MM-DDTHH:MM:SS
             */

            // My mock timetable
            // Week 13, Semester 2
            { title: "Mentor Group", start: "2024-10-14T08:45:00", end: "2024-10-14T08:55:00" },
            { title: "General Maths", start: "2024-10-14T08:55:00", end: "2024-10-14T10:35:00" },
            {
                title: "Digital Technologies",
                start: "2024-10-14T14:25:00",
                end: "2024-10-14T15:25:00",
            },

            { title: "English", start: "2024-10-15T10:50:00", end: "2024-10-15T11:50:00" },
            { title: "Mentoring", start: "2024-10-15T11:50:00", end: "2024-10-15T12:40:00" },
            {
                title: "Business Innovation",
                start: "2024-10-15T13:25:00",
                end: "2024-10-15T14:25:00",
            },

            {
                title: "Digital Technologies",
                start: "2024-10-16T09:50:00",
                end: "2024-10-16T11:05:00",
            },
            { title: "English", start: "2024-10-16T13:25:00", end: "2024-10-16T14:25:00" },
            { title: "General Maths", start: "2024-10-16T14:25:00", end: "2024-10-16T15:25:00" },

            { title: "Mentoring", start: "2024-10-17T10:50:00", end: "2024-10-17T11:40:00" },
            {
                title: "Business Innovation",
                start: "2024-10-17T11:40:00",
                end: "2024-10-17T12:40:00",
            },
            { title: "English", start: "2024-10-17T14:25:00", end: "2024-10-17T15:25:00" },

            { title: "Mentor Group", start: "2024-10-18T08:45:00", end: "2024-10-18T08:55:00" },
            { title: "General Maths", start: "2024-10-18T11:40:00", end: "2024-10-18T12:40:00" },
            {
                title: "Digital Technologies",
                start: "2024-10-18T13:25:00",
                end: "2024-10-18T14:25:00",
            },
            {
                title: "Business Innovation",
                start: "2024-10-18T14:25:00",
                end: "2024-10-18T15:25:00",
            },

            // Week 14, Semester 2

            { title: "Mentor Group", start: "2024-10-21T08:45:00", end: "2024-10-21T08:55:00" },
            {
                title: "Digital Technologies",
                start: "2024-10-21T08:55:00",
                end: "2024-10-21T10:35:00",
            },
            {
                title: "Business Innovation",
                start: "2024-10-21T11:00:00",
                end: "2024-10-21T12:40:00",
            },
            { title: "General Maths", start: "2024-10-21T14:25:00", end: "2024-10-21T15:25:00" },

            { title: "English", start: "2024-10-22T08:45:00", end: "2024-10-22T10:25:00" },
            { title: "Mentoring", start: "2024-10-22T11:50:00", end: "2024-10-22T12:40:00" },
            {
                title: "Business Innovation",
                start: "2024-10-22T14:25:00",
                end: "2024-10-22T15:25:00",
            },

            { title: "General Maths", start: "2024-10-23T09:50:00", end: "2024-10-23T11:05:00" },
            {
                title: "Digital Technologies",
                start: "2024-10-23T13:25:00",
                end: "2024-10-23T14:25:00",
            },

            {
                title: "Business Innovation",
                start: "2024-10-24T08:45:00",
                end: "2024-10-24T10:05:00",
            },
            { title: "Mentoring", start: "2024-10-24T10:30:00", end: "2024-10-24T11:20:00" },
            { title: "English", start: "2024-10-24T13:25:00", end: "2024-10-24T14:25:00" },

            { title: "Mentor Group", start: "2024-10-25T08:45:00", end: "2024-10-25T08:55:00" },
            { title: "English", start: "2024-10-25T08:55:00", end: "2024-10-25T10:15:00" },
            {
                title: "Digital Technologies",
                start: "2024-10-25T10:40:00",
                end: "2024-10-25T11:40:00",
            },
            { title: "General Maths", start: "2024-10-25T13:25:00", end: "2024-10-25T14:25:00" },
        ],
        tasks: [
            {
                id: Math.random().toString(),
                title: "AT2 Collaboration Task",
                teacher: "Hocking",
                class: "Digital Technologies",
                description: "Collaborate with your group to complete the AT2 task",
                submitted: false,
                dueDate: new Date(),
            },
            {
                id: Math.random().toString(),
                title: "AT3 Individual Solution",
                teacher: "Hocking",
                class: "Digital Technologies",
                description: "Create a solution for the AT3 task",
                submitted: false,
                dueDate: new Date(),
            },
        ],
        photo: "https://avatars.githubusercontent.com/u/77449569?v=4",
        password: "123456", // no need for hash, as we aren't using the password, it is needed for DayMap auth!
    }

    res.json(testData)
})

app.listen(port)
console.log(`Server is running on http://localhost:${port}`)
