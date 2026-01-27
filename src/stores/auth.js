import api from "@/services/api"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        student: null,
        checked: false
    }),

    getters: {
        isLoggedIn: (state) => !!state.student,
        fullName: (state) => {
            state.student ? `${state.student.first_name} ${state.student.last_name}` : ""
        }
    },
    actions: {
        async login(email, password) {
            const res = await api.post("/student-login", { email, password })
            console.log("login", res);

            this.student = res.data.student
            this.checked = true

            return res;
        },
        async fetchMe() {
            try {
                const res = await api.get("/student-profile");
                this.student = res.data.student;
            } catch (e) {
                this.student = null;
            } finally {
                this.checked = true;
            }
        },

        async logout() {
            try {
                await api.post("/student/logout"); // create this route on backend
            } catch (e) {
                // ignore
            }
            this.student = null;
            this.checked = true;
        },
    }
})