import api from "@/services/api"
import { defineStore } from "pinia"
import { useAuthStore } from "./auth"

export const useQuestionStore = defineStore("question", {
    state: () => ({
        questions: [],
        loading: false,
        error: null,
        interviewStatus: ''
    }),

    actions: {
        async fetchQuestions() {
            const authStore = useAuthStore()
            this.loading = true
            this.error = null
            try {
                const id = authStore?.userId
                if (!id) return []

                const response = await api.get(`interview-questions/${id}`)

                // Store the questions array and status
                this.questions = response.data.data
                this.interviewStatus = response.data.interview_status

                return this.questions // Return for component resume logic
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to load questions"
                return []
            } finally {
                this.loading = false
            }
        },

        async uploadVideo(questionId, blob) {
            const formData = new FormData();
            // 1. Ensure the key 'recording' matches $request->hasFile('recording')
            formData.append('recording', blob, 'video.webm');

            try {
                // 2. Ensure the URL matches your backend route
                const response = await api.post(`upload-question/${questionId}`, formData);


                const q = this.questions.find(q => q.id === questionId);
                if (q) q.status = 'uploaded';

                return response.data;
            } catch (error) {
                console.error("Upload failed:", error.response?.data);
                throw error;
            }
        }
    }
})