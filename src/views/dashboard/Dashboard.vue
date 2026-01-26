<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { List, FileText, Headphones } from "lucide-vue-next";

import DashboardLayout from "@/layouts/DashboardLayout.vue";

const route = useRoute();
const router = useRouter();

const menuConfig = [
    {
        id: "checklist",
        label: "CAS Checklist",
        icon: List,
        to: "/dashboard/checklist",
        status: "Done",
        statusClass: "bg-slate-800 text-cyan-500",
    },
    {
        id: "documents",
        label: "General Documents",
        icon: FileText,
        to: "/dashboard/documents",
        status: "Done",
        statusClass: "bg-slate-800 text-cyan-500",
    },
    {
        id: "interviews",
        label: "Interview",
        icon: Headphones,
        to: "/dashboard/interviews",
        status: "New",
        statusClass: "bg-blue-600 text-white",
    },
];

const activeId = computed(() => {
    const last = route.path.split("/").filter(Boolean).pop();
    return last || "interviews";
});

const go = (to) => router.push(to);
</script>

<template>
    <DashboardLayout>
        <template #sidebar>
            <div class="text-center mb-10 pt-4">
                <h1 class="text-2xl font-bold text-white tracking-tight">Shabuj Global</h1>
                <h2 class="text-slate-500 font-medium mt-1">Hello Aleksandre</h2>
            </div>

            <nav class="flex flex-col gap-1 px-2">
                <button v-for="item in menuConfig" :key="item.id" type="button" @click="go(item.to)" :class="[
                    activeId === item.id
                        ? 'bg-[#1e293b] text-white'
                        : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200',
                ]"
                    class="group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 w-full">
                    <div class="flex items-center gap-4">
                        <component :is="item.icon" :size="20" stroke-width="1.5" />
                        <span class="text-[15px] font-medium">{{ item.label }}</span>
                    </div>

                    <span :class="item.statusClass"
                        class="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {{ item.status }}
                    </span>
                </button>
            </nav>
        </template>

        <template #content>
            <Transition name="fade" mode="out-in">
                <router-view :key="route.fullPath" />
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
