import { createStore } from "vuex"

export interface User {
    id?: string
    name?: string
    timetable: Array<{ title: string; start: string; end: string }>
    tasks: Array<{
        id: string
        title: string
        teacher: string
        class: string
        description: string
        submitted: boolean
        dueDate: Date
    }>
    photo?: string
    password?: string
}

export default createStore({
    state: {
        user: {
            id: "Loading...",
            name: "Loading...",
            timetable: [],
            tasks: [],
            photo: "",
            password: "",
        } as User,
    },
    mutations: {
        setUser(state, userData: User) {
            state.user = userData
        },
    },
    actions: {
        updateUser({ commit }, userData: User) {
            console.log("Updating user data...", userData)
            commit("setUser", userData)
        },
    },
    getters: {
        user: (state) => state.user,
    },
})
