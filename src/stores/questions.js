import api from "@/services/api"
import { defineStore } from "pinia"
import { useAuthStore } from "./auth"

export const useInterviewStore = defineStore("interview", {
    state: () => ({
        questions: [],
        loading: false,
        error: null
    }),


    actions: {
        async fetchQuestions() {
            const authStore = useAuthStore()
            this.loading = true,
                this.error = null
            try {
                const id = authStore?.studentId
                console.log("student id", id);


                if (!id) return
                const response = await api.get(`interview-questions/${id}`)
                console.log("qs response", response);

                this.questions = response.data


            } catch (error) {
                this.error = error.response?.data?.message || "Failed to load questions";
                console.error("Error fetching questions:", error);
            } finally {
                this.loading = false
            }
        },

        resetStore() {
            this.questions = [];
            this.error = null;
        }
    }
})