import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { useQuestionStore } from "./questions";

export const useInterviewStore = defineStore('interview', () => {

    const interviews = ref([])



    async function fetchInterviewPerStudent() {
        const authStore = useAuthStore()
        try {
            const studentId = authStore?.userId
            const { data } = await api.get(`/interview-per-user/${studentId}`)
            interviews.value = data.data
        } catch (error) {
            console.log(error);

        }
    }
    async function done() {
        const interview = useQuestionStore()
        try {
            const id = interview.currentInterviewId ?? []
            await api.post(`interviews/${id}/done`);

        } catch (error) {
            console.log(error);

        }
    }

    return {
        interviews,
        fetchInterviewPerStudent, done
    };
});