import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/Dashboard.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: HomeView,
        },
        {
            path: "/assignments",
            name: "assignments",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/Assignments.vue"),
        },
        {
            path: "/tasks",
            name: "tasks",
            component: () => import("../views/Tasks.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/Login.vue"),
        },
    ],
})

export default router
