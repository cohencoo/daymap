import "./assets/main.css"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

const app = createApp(App)

/**
 * MOCK DATA
 */

interface User {
    id?: string
    name?: string
    timetable: Object[]
    tasks: Object[]
    photo?: string
    password?: string
}

const user: User = {
    id: Date.now().toString(),
    name: "John Doe",
    timetable: [
        { title: "Digital Technologies", start: "2024-09-16T14:25:00", end: "2024-09-16T15:25:00" },
        { title: "Digital Technologies", start: "2024-09-18T09:50:00", end: "2024-09-18T11:05:00" },
        { title: "Digital Technologies", start: "2024-09-20T13:25:00", end: "2024-09-20T14:25:00" },
    ],
    tasks: [
        {
            id: Math.random().toString(),
            title: "AT3",
            teacher: "Hocking",
            class: "Digital Technologies",
            description: "Description 1",
            submitted: false,
            dueDate: new Date(),
        },
    ],
    photo: "https://avatars.githubusercontent.com/u/77449569?v=4",
    password: "hashed_password",
}

app.use(router)
app.mount("#app")

export default user
