import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStudentStore = defineStore('student', () => {
    const student = ref({ first_name: '', last_name: '', email: '', password: '', dob: '' });
    const profile = ref({ institution: '', program: '', intake: '', tuition_fee: 0, scholarship: null, paid_amount: 0, remaining_amount: 0, notes: '' });

    const studentId = ref(null);
    const profileId = ref(null);
    const interviewId = ref(null);
    const docUploaded = ref(false);
    const tab = ref("student");

    // Fix: access .value before the property name
    const loading = ref({ student: false, profile: false, interview: false });

    async function createStudent() {
        loading.value.student = true; // Corrected
        try {
            const { data } = await api.post('/student', student.value);
            studentId.value = data?.data.id;
            tab.value = "compliance";
        } catch (error) {
            console.error(error);
        } finally {
            loading.value.student = false; // Corrected
        }
    }

    async function createProfile() {
        loading.value.profile = true; // Corrected
        try {
            const { data } = await api.post(`/students/${studentId.value}/compliance-profiles`, profile.value);
            profileId.value = data?.data.id;
            tab.value = "doc";
        } catch (error) {
            console.error(error);
        } finally {
            loading.value.profile = false; // Corrected
        }
    }

    async function uploadDocumentAction(formData, onProgress) {
        return api.post(`/students/${studentId.value}/documents`, formData, {
            onUploadProgress: onProgress
        });
    }

    async function createInterview() {
        loading.value.interview = true; // Corrected
        try {
            const { data } = await api.post('/interviews', {
                student_id: studentId.value,
                compliance_profile_id: profileId.value,
            });
            interviewId.value = data?.data.id;
        } catch (error) {
            console.error(error);
        } finally {
            loading.value.interview = false; // Corrected
        }
    }

    async function generateQuestions() {
        try {
            const { data } = await api.post(`/interviews/${interviewId.value}/generate-questions`, { count: 1 });
            alert("Interview creation Complete!");
            resetForm();
        } catch (error) {
            console.error(error);
            alert("Failed to generate questions.");
        }
    }

    function resetForm() {
        student.value = { first_name: '', last_name: '', email: '', password: '', dob: '' };
        profile.value = { institution: '', program: '', intake: '', tuition_fee: 0, scholarship: null, paid_amount: 0, remaining_amount: 0, notes: '' };
        studentId.value = null;
        profileId.value = null;
        interviewId.value = null;
        docUploaded.value = false;
        tab.value = "student";
    }

    return {
        student, profile, studentId, profileId, interviewId, docUploaded, tab, loading,
        createStudent, createProfile, uploadDocumentAction, createInterview, generateQuestions, resetForm
    };
});