<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { List, FileText, Headphones, PersonStanding, Pen } from "lucide-vue-next";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();

const menuConfig = [
    { id: "checklist", roles: ['Student'], label: "CAS Checklist", icon: List, to: "/dashboard/checklist", status: "Done", statusClass: "bg-slate-800 text-cyan-500" },
    { id: "documents", roles: ['Student'], label: "General Documents", icon: FileText, to: "/dashboard/documents", status: "Done", statusClass: "bg-slate-800 text-cyan-500" },
    { id: "interviews", roles: ['Student'], label: "Interview", icon: Headphones, to: "/dashboard/interviews", status: "New", statusClass: "bg-blue-600 text-white" },

    { id: "create-student", roles: ['Admin'], label: "New Record", icon: Pen, to: "/admin-dashboard/create-student", },
    { id: "all-students", roles: ['Admin'], label: "Create Studebt", icon: PersonStanding, to: "/admin-dashboard/all-students", },
];

const auth = useAuthStore()

const handleLogout = async () => {
    await auth.logout()
    router.replace({ name: "login" });
}

onMounted(async () => {
    if (!auth.checked) {
        await auth.fetchMe();
    }

})

const helloName = computed(() => auth.fullName || "Student")
const filteredMenu = computed(() => {
    return menuConfig.filter(item => {
        if (!item.roles) return true

        return item.roles.includes(auth.userRole)
    })
})
const activeId = computed(() => route.path.split("/").filter(Boolean).pop() || "interviews");
const go = (to) => router.push(to);
</script>

<template>
    <DashboardLayout>
        <template #sidebar>
            <div class="flex flex-col h-full">
                <div class="text-center mb-10 pt-4 ">
                    <h1 class="text-2xl font-bold text-white tracking-tight">Shabuj Global</h1>
                    <h2 class="text-slate-500 font-medium mt-1">Hello {{ helloName }}</h2>
                </div>

                <nav class="flex flex-col px-1">
                    <button v-for="item in filteredMenu" :key="item.id" type="button" @click="go(item.to)" :class="[
                        activeId === item.id
                            ? 'bg-[#1e293b] text-white'
                            : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                    ]"
                        class="group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 w-full">
                        <div class="flex items-center gap-4">
                            <component :is="item.icon" :size="20" stroke-width="1.5" />
                            <span class="text-[15px] font-medium">{{ item.label }}</span>
                        </div>

                        <span :class="item.statusClass"
                            class="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            {{ item?.status }}
                        </span>
                    </button>
                </nav>

                <div class="flex flex-col gap-1 px-2 mt-auto">
                    <h1 class="text-center text-white "> {{ auth.userType === "student" ? 'Student' : "User" }} ID : {{
                        auth.userId }}</h1>

                    <button @click="handleLogout"
                        class="text-white cursor-pointer self-center px-5 mt-3 bg-blue-500 py-2 rounded font-semibold ">
                        Logout
                    </button>
                </div>

            </div>
        </template>

        <template #content>
            <Transition name="fade" mode="out-in">
                <!-- THIS is the important part -->
                <router-view />
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
