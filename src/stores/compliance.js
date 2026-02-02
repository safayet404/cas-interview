import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore('profile', () => {
    // List Data
    const profiles = ref([]);
    const isFetching = ref(false);
    const activeTab = ref('profile');

    const pagination = ref({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10
    });


    const isDrawerOpen = ref(false);

    const studentId = ref(null);
    const profileId = ref(null);
    const selectedProfile = ref(null)

    const isPreviewOpen = ref(false)
    const previewUrl = ref('')
    const previewType = ref('')


    function closePreview() {
        isPreviewOpen.value = false;
        previewUrl.value = '';
    }
    // Replace these functions in your store
    function openPreview(url, type) {
        const backendBase = "http://127.0.0.1:8000";

        // FIX: Access refs directly and use .value
        previewUrl.value = `${backendBase}/storage/${url}`;
        previewType.value = type;
        isPreviewOpen.value = true;

        console.log("Loading Image From:", previewUrl.value);
    }

    function closeDrawer() {
        isDrawerOpen.value = false;

        // FIX: Do NOT use ref() here. Just update the value.
        activeTab.value = 'profile';

        setTimeout(() => {
            if (!isDrawerOpen.value) {
                selectedProfile.value = null;
                profileId.value = null;
                studentId.value = null;
            }
        }, 300);
    }

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
        activeTab.value = 'profile';

        profileId.value = profile.id;
        studentId.value = profile.student?.student_id;
    }

    function closeDrawer() {
        isDrawerOpen.value = false;
        activeTab = ref('profile');
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
        activeTab,
        isPreviewOpen,
        previewUrl,
        previewType,

        // Actions
        fetchCompliance,
        openProfileDrawer,
        closeDrawer,
        openPreview, closePreview
    };
});