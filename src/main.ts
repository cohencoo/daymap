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
    timetable: [],
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

export default user

app.use(router)
app.mount("#app")
