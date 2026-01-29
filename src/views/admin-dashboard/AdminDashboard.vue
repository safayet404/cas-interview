<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { List, FileText, Headphones } from "lucide-vue-next";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();

const menuConfig = [
    { id: "checklist", label: "Create Student", icon: List, to: "/dashboard/checklist" },
    { id: "documents", label: "General Documents", icon: FileText, to: "/dashboard/documents" },
    { id: "interviews", label: "Interview", icon: Headphones, to: "/dashboard/interviews" },


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
                    <button v-for="item in menuConfig" :key="item.id" type="button" @click="go(item.to)" :class="[
                        activeId === item.id
                            ? 'bg-[#1e293b] text-white'
                            : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                    ]"
                        class="group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 w-full">
                        <div class="flex items-center gap-4">
                            <component :is="item.icon" :size="20" stroke-width="1.5" />
                            <span class="text-[15px] font-medium">{{ item.label }}</span>
                        </div>


                    </button>
                </nav>

                <div class="flex flex-col gap-1 px-2 mt-auto">
                    <h1 class="text-center text-white ">Student ID : {{ auth.studentId }}</h1>

                    <button @click="handleLogout"
                        class="text-white cursor-pointer self-center px-5 mt-3 bg-blue-500 py-2 rounded font-semibold ">
                        Logout
                    </button>
                </div>

            </div>
        </template>

        <template #content>
            <Transition name="fade" mode="out-in">

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
