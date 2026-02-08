import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore('profile', () => {
    const profiles = ref([]);
    const isFetching = ref(false);
    const activeTab = ref('profile');
    const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
    const isDrawerOpen = ref(false);
    const selectedProfile = ref(null);
    const stats = ref({ total_cases: 0, total_students: 0 });
    // Preview State
    const isPreviewOpen = ref(false);
    const previewUrl = ref('');
    const previewType = ref('');

    function openPreview(path, type = 'application/pdf') {
        if (!path) return;
        const backendBase = "http://127.0.0.1:8000";
        // Avoid double storage prefix if path already contains it
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        const fullPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;

        previewUrl.value = `${backendBase}/${fullPath}`;
        previewType.value = type;
        isPreviewOpen.value = true;
    }

    function closePreview() {
        isPreviewOpen.value = false;
        previewUrl.value = '';
        previewType.value = '';
    }

    function openProfileDrawer(profile) {
        selectedProfile.value = profile;
        isDrawerOpen.value = true;
    }

    function closeDrawer() {
        isDrawerOpen.value = false;
        activeTab.value = 'profile';
    }

    async function fetchCompliance(page = 1, perPage = 10) {
        isFetching.value = true;
        try {
            const { data } = await api.get('/compliance-profiles', {
                params: { page, per_page: perPage }
            });
            profiles.value = data.data;
            pagination.value = {
                current_page: Number(data.meta.current_page),
                last_page: Number(data.meta.last_page),
                total: Number(data.meta.total),
                per_page: Number(data.meta.per_page)
            };

            if (data.meta && data.meta.statistics) {
                stats.value.total_cases = data.meta.statistics.total_compliance_cases;
                stats.value.total_students = data.meta.statistics.total_unique_students;
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            isFetching.value = false;
        }
    }

    return {
        profiles, pagination, isFetching, selectedProfile, isDrawerOpen, activeTab,
        isPreviewOpen, previewUrl, previewType, stats,
        fetchCompliance, openProfileDrawer, closeDrawer, openPreview, closePreview
    };
});