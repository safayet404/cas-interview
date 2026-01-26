<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { List, FileText, Headphones } from 'lucide-vue-next'; // Icons for the menu
import DashboardLayout from '@/layouts/DashboardLayout.vue';

// Individual Components
import GeneralDocuments from './GeneralDocuments.vue';
import CasChecklist from './CasChecklist.vue';
import Interview from '@/components/Dashboard/Interview.vue';

const route = useRoute();
const router = useRouter();

// 1. Precise Menu Config with Icons and Status Colors
const menuConfig = {
    checklist: {
        label: 'CAS Checklist',
        component: CasChecklist,
        icon: List,
        status: 'Done',
        statusClass: 'bg-slate-800 text-cyan-500'
    },
    documents: {
        label: 'General Documents',
        component: GeneralDocuments,
        icon: FileText,
        status: 'Done',
        statusClass: 'bg-slate-800 text-cyan-500'
    },
    interviews: {
        label: 'Interview',
        component: Interview,
        icon: Headphones,
        status: 'New',
        statusClass: 'bg-blue-600 text-white'
    }
};

const activeTab = ref(route.query.tab || 'interviews');
const currentComponent = computed(() => menuConfig[activeTab.value]?.component);

const navigate = (tabId) => {
    activeTab.value = tabId;
    router.push({ query: { tab: tabId } });
};

watch(() => route.query.tab, (newTab) => {
    if (newTab) activeTab.value = newTab;
});
</script>

<template>
    <DashboardLayout>
        <template #sidebar>
            <div class="text-center mb-10 pt-4">
                <h1 class="text-2xl font-bold text-white tracking-tight">Shabuj Global</h1>
                <h2 class="text-slate-500 font-medium mt-1">Hello Aleksandre</h2>
            </div>

            <nav class="flex flex-col gap-1 px-2">
                <button v-for="(info, id) in menuConfig" :key="id" @click="navigate(id)" :class="[
                    activeTab === id
                        ? 'bg-[#1e293b] text-white'
                        : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                ]"
                    class="group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 w-full">
                    <div class="flex items-center gap-4">
                        <component :is="info.icon" :size="20" stroke-width="1.5" />
                        <span class="text-[15px] font-medium">{{ info.label }}</span>
                    </div>

                    <span :class="info.statusClass"
                        class="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {{ info.status }}
                    </span>
                </button>
            </nav>
        </template>

        <template #content>
            <Transition name="fade" mode="out-in">
                <component :is="currentComponent" />
            </Transition>
        </template>
    </DashboardLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>