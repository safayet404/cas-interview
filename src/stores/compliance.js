import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore('profile', () => {
    // List Data
    const profiles = ref([]);
    const isFetching = ref(false);
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10
    });

    // Drawer / Selection State
    // Renamed to selectedProfile because the root of the data is the Profile
    const selectedProfile = ref(null);
    const isDrawerOpen = ref(false);

    // Helpers for specific IDs (if needed for other forms)
    const studentId = ref(null);
    const profileId = ref(null);

    /**
     * Actions
     */
    async function fetchCompliance(page = 1, perPage = 10) {
        isFetching.value = true;
        try {
            const { data } = await api.get('/compliance-profiles', {
                params: { page, per_page: perPage }
            });

            profiles.value = data.data;
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

    function openProfileDrawer(profile) {
        selectedProfile.value = profile;
        isDrawerOpen.value = true;

        // Sync helper IDs in case you need them for API calls like "Update Profile"
        profileId.value = profile.id;
        studentId.value = profile.student?.student_id;
    }

    function closeDrawer() {
        isDrawerOpen.value = false;
        // Clean up after transition
        setTimeout(() => {
            if (!isDrawerOpen.value) {
                selectedProfile.value = null;
                profileId.value = null;
                studentId.value = null;
            }
        }, 300);
    }

    return {
        // State
        profiles,
        pagination,
        isFetching,
        selectedProfile,
        isDrawerOpen,
        studentId,
        profileId,

        // Actions
        fetchCompliance,
        openProfileDrawer,
        closeDrawer
    };
});