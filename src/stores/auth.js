import api from "@/services/api"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        userType: null,
        userRole: null,
        checked: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        userId: (state) => state.user.id,
        fullName: (state) => state.user?.name ? state.user?.name : `${state.user?.first_name} ${state.student?.last_name}`

    },
    actions: {
        async login(email, password) {
            const res = await api.post("/unified-login", { email, password })

            console.log("Login in data", res);


            if (res.data.status === 'success') {
                this.user = res.data.user
                this.userType = res.data.user_type
                this.userRole = res.data.role
            }

            this.checked = true

            return res;
        },
        async fetchMe() {
            try {
                const res = await api.get("/profile");
                this.user = res.data.user;
                this.userRole = res.data.role
                this.userType = res.data.user_type
            } catch (e) {
                this.user = null;
                this.userRole = null;
                this.userType = null;
            } finally {
                this.checked = true;
            }
        },

        async logout() {
            try {
                await api.post("/logout");

            } catch (e) {
                // ignore
            }
            this.user = null;
            this.checked = true;
        },
    }
})