import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStudentStore = defineStore('student', () => {
    const student = ref({ first_name: '', last_name: '', email: '', password: '', dob: '' });
    const profile = ref({ institution: '', program: '', intake: '', tuition_fee: '', scholarship: null, paid_amount: 0, remaining_amount: 0, notes: '' });

    const studentId = ref(null);
    const profileId = ref(null);
    const interviewId = ref(null);
    const docUploaded = ref(false);
    const tab = ref("student");

    const selectedStudent = ref(null);
    const isDrawerOpen = ref(false);

    function selectExistingStudent(id) {
        studentId.value = id ?? null;
    }
    function selectExistingProfile(id) {

        profileId.value = id ?? null;
    }
    const students = ref([])
    const searchStudents = ref([])
    const searchProfiles = ref([])
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        total: 0
    })
    const isFetching = ref(false)

    const loading = ref({ student: false, profile: false, interview: false, generateQuestion: false });

    function openStudentDrawer(student) {
        selectedStudent.value = student
        isDrawerOpen.value = true
    }

    function closeDrawer() {
        isDrawerOpen.value = false

        setTimeout(() => { if (!isDrawerOpen.value) selectedStudent.value = null; }, 300);
    }

    async function createStudent() {
        loading.value.student = true;
        try {
            const { data } = await api.post('/student', student.value);
            studentId.value = data?.data.id;
            tab.value = "compliance";
        } catch (error) {
            console.error(error);
        } finally {
            loading.value.student = false;
        }
    }

    async function createProfile(forStudentId = null) {
        loading.value.profile = true;
        try {
            const isManualId = forStudentId && typeof forStudentId !== 'object';
            const sid = isManualId ? forStudentId : studentId.value;
            const { data } = await api.post(`/students/${sid}/compliance-profiles`, profile.value);
            if (forStudentId) {
                tab.value = "doc";
            } else {
                tab.value = "interview";
            }
            profileId.value = data?.data.id;

        } catch (error) {
            console.error("Profile creation failed:", error);
        } finally {
            loading.value.profile = false;
        }
    }

    async function uploadDocumentAction(formData, onProgress) {
        return api.post(`/students/${studentId.value}/documents`, formData, {
            onUploadProgress: onProgress
        });
    }

    async function createInterview(forStudentId = null, forProfileId = null) {
        loading.value.interview = true;
        try {
            const isManualSid = forStudentId && typeof forStudentId !== 'object';
            const isManualPid = forProfileId && typeof forProfileId !== 'object';

            const sid = isManualSid ? forStudentId : studentId.value;
            const pid = isManualPid ? forProfileId : profileId.value;


            if (!sid || !pid) {
                alert("Missing Student or Profile ID");
                return;
            }

            const { data } = await api.post('/interviews', {
                student_id: sid,
                compliance_profile_id: pid,
            });

            interviewId.value = data?.data.id;


        } catch (error) {
            console.error("Interview Creation Error:", error);
        } finally {
            loading.value.interview = false;
        }
    }

    async function generateQuestions() {
        loading.value.generateQuestion = true;
        try {
            const { data } = await api.post(`/interviews/${interviewId.value}/generate-questions`, { count: 5 });
            alert("Interview creation Complete!");
            resetForm();
        } catch (error) {
            console.error(error);
            alert("Failed to generate questions.");
        } finally {
            loading.value.generateQuestion = false;
        }
    }

    async function fetchStudents(page = 1, perPage = 10) {
        isFetching.value = true;
        try {
            const { data } = await api.get('/fetch-students', {
                params: { page, per_page: perPage }
            });


            students.value = data.data;

            pagination.value = {
                current_page: data.meta.current_page,
                last_page: data.meta.last_page,
                total: data.meta.total,
                per_page: data.meta.per_page
            };

            return data;
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            isFetching.value = false;
        }
    }

    async function searchStudent() {
        isFetching.value = true;
        try {
            const { data } = await api.get('/students', {
            });
            searchStudents.value = data.data;
            return data;
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            isFetching.value = false;
        }
    }

    async function searchProfile() {
        isFetching.value = true;
        try {
            const { data } = await api.get('/profiles', {

            });
            searchProfiles.value = data.data;
            return data;
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            isFetching.value = false;
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
        student, profile, studentId, profileId, interviewId, searchStudents, docUploaded, tab, loading, students, pagination, isFetching, selectedStudent, isDrawerOpen, searchProfiles,
        createStudent, createProfile, uploadDocumentAction, createInterview, searchStudent, generateQuestions, resetForm, fetchStudents, closeDrawer, openStudentDrawer, selectExistingProfile, selectExistingStudent, searchProfile
    };
});