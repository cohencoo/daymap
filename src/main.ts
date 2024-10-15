import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { type User } from "./store";

const app = createApp(App);

/**
 * MOCK DATA (the req to the backend will be made here, the OBJ below is the mock data)
 * And is delayed by 1 second to simulate a real request
 * As long as we can scrape in the following format, this will work (obv. replace the timeout with the real fetch req)
 */
const updateUserDetails: User = {
    id: "200076",
    name: "John Doe",
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
        { title: "Digital Technologies", start: "2024-10-14T14:25:00", end: "2024-10-14T15:25:00" },
        
        { title: "English", start: "2024-10-15T10:50:00", end: "2024-10-15T11:50:00" },
        { title: "Mentoring", start: "2024-10-15T11:50:00", end: "2024-10-15T12:40:00" },
        { title: "Business Innovation", start: "2024-10-15T13:25:00", end: "2024-10-15T14:25:00" },
        
        { title: "Digital Technologies", start: "2024-10-16T09:50:00", end: "2024-10-16T11:05:00" },
        { title: "English", start: "2024-10-16T13:25:00", end: "2024-10-16T14:25:00" },
        { title: "General Maths", start: "2024-10-16T14:25:00", end: "2024-10-16T15:25:00" },
        
        { title: "Mentoring", start: "2024-10-17T10:50:00", end: "2024-10-17T11:40:00" },
        { title: "Business Innovation", start: "2024-10-17T11:40:00", end: "2024-10-17T12:40:00" },
        { title: "English", start: "2024-10-17T14:25:00", end: "2024-10-17T15:25:00" },
        
        { title: "Mentor Group", start: "2024-10-18T08:45:00", end: "2024-10-18T08:55:00" },
        { title: "General Maths", start: "2024-10-18T11:40:00", end: "2024-10-18T12:40:00" },
        { title: "Digital Technologies", start: "2024-10-18T13:25:00", end: "2024-10-18T14:25:00" },
        { title: "Business Innovation", start: "2024-10-18T14:25:00", end: "2024-10-18T15:25:00" },

        // Week 14, Semester 2
        { title: "Mentor Group", start: "2024-10-21T08:45:00", end: "2024-10-21T08:55:00" },
        { title: "Digital Technologies", start: "2024-10-21T08:55:00", end: "2024-10-21T10:35:00" },
        { title: "Business Innovation", start: "2024-10-21T11:00:00", end: "2024-10-21T12:40:00" },
        { title: "General Maths", start: "2024-10-21T14:25:00", end: "2024-10-21T15:25:00" },
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
};

// Simulate mock data (real data) being loaded in
setTimeout(() => {
    store.dispatch('updateUser', updateUserDetails);
}, 1000);

// Once we have this fetched data, use LocalStorage to store user data for offline use

app.use(store);
app.use(router);
app.mount("#app");
