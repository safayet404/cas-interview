<script setup>
import { onMounted, ref, watch } from 'vue';
import { useStudentStore } from '@/stores/student';
import { storeToRefs } from 'pinia';
import {
    CheckCheck, X, Eye, Mail, GraduationCap,
    FileText, Calendar, Wallet, Info
} from 'lucide-vue-next';
import { formatLocalTime } from '@/utils/formatLocalTime';

const store = useStudentStore();
const { students, pagination, isFetching, selectedStudent, isDrawerOpen } = storeToRefs(store);
const { fetchStudents, openStudentDrawer, closeDrawer } = store;

const activeTab = ref('profile');

const headers = [
    { text: 'ID', value: 'id', sortable: true },
    { text: 'Student Details', value: 'student_details' },
    { text: 'University/Course', value: 'details' },
    { text: 'Profile', value: 'profile' },
    { text: 'Counselor', value: 'counselor' },
    { text: 'Created At', value: 'created' },
    { text: 'ACTIONS', value: 'operation', width: 80 },
];

const serverOptions = ref({
    page: 1,
    rowsPerPage: 10,
});

watch(serverOptions, (value) => {
    fetchStudents(value.page, value.rowsPerPage);
}, { deep: true });

onMounted(async () => {
    await fetchStudents(serverOptions.value.page, serverOptions.value.rowsPerPage);
});
</script>

<template>
    <div class="min-h-screen bg-[#F8F7FA] p-4">

        <Head title="Student Records" />

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <EasyDataTable v-model:server-options="serverOptions" :server-items-length="pagination.total"
                :loading="isFetching" :headers="headers" :items="students" buttons-pagination
                table-class-name="customize-table">
                <template #item-student_details="{ full_name, email }">
                    <div class="py-2">
                        <p class="font-bold text-gray-800">{{ full_name }}</p>
                        <p class="text-xs text-gray-500">{{ email }}</p>
                    </div>
                </template>

                <template #item-details="{ profiles }">
                    <div class="text-xs leading-relaxed">
                        <p class="font-semibold text-indigo-600">{{ profiles[0]?.institution || 'N/A' }}</p>
                        <p class="text-gray-600">{{ profiles[0]?.program || 'N/A' }}</p>
                        <p class="text-gray-600">{{ profiles[0]?.intake || 'N/A' }}</p>
                    </div>
                </template>
                <template #item-counselor="{ profiles }">
                    <div class="text-xs leading-relaxed">
                        <p class="font-semibold text-indigo-600">{{ profiles[0]?.counselor_name || 'N/A' }}</p>
                        <p class="text-gray-600">{{ profiles[0]?.counselor_email || 'N/A' }}</p>
                    </div>
                </template>

                <template #item-profile="{ profiles }">
                    <CheckCheck v-if="profiles[0]?.profile_id" class="text-green-500" :size="20" />
                    <X v-else class="text-red-400" :size="20" />
                </template>

                <template #item-operation="item">
                    <button @click="openStudentDrawer(item)"
                        class="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                        <Eye :size="18" />
                    </button>
                </template>

                <template #item-created="{ created_at }">
                    <p class="text-xs text-gray-500"> {{ formatLocalTime(created_at) }} </p>
                </template>
            </EasyDataTable>
        </div>

        <Teleport to="body">
            <Transition name="fade">
                <div v-if="isDrawerOpen" class="fixed inset-0 z-[100]">
                    <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        @click="closeDrawer()">
                    </div>

                    <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <Transition name="slide">
                            <div v-if="isDrawerOpen" class="w-screen max-w-5xl bg-white shadow-2xl flex flex-col">

                                <div
                                    class="relative bg-gradient-to-r from-indigo-700 to-violet-800 px-6 py-10 text-white">
                                    <button @click="closeDrawer()"
                                        class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-all">
                                        <X :size="24" />
                                    </button>
                                    <div class="flex items-center gap-5">
                                        <div
                                            class="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/30">
                                            {{ selectedStudent?.full_name?.charAt(0) }}
                                        </div>
                                        <div>
                                            <h2 class="text-2xl font-extrabold tracking-tight">{{
                                                selectedStudent?.full_name }}
                                            </h2>
                                            <p class="flex items-center gap-2 text-indigo-100 mt-1">
                                                <Mail :size="14" /> {{ selectedStudent?.email }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex border-b border-gray-100 px-6 sticky top-0 bg-white z-10">
                                    <button v-for="tab in ['profile', 'documents', 'interviews']" :key="tab"
                                        @click="activeTab = tab"
                                        :class="[activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600', 'py-4 border-b-2 font-bold text-xs uppercase tracking-widest mr-8 transition-all']">
                                        {{ tab }}
                                    </button>
                                </div>

                                <div class="flex-1 overflow-y-auto p-6 bg-gray-50/50">

                                    <div v-if="activeTab === 'profile'" class="space-y-6">
                                        <div v-for="profile in selectedStudent?.profiles" :key="profile.profile_id"
                                            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <div class="flex items-center gap-2 text-indigo-700 font-bold mb-4">
                                                <GraduationCap :size="20" />
                                                <span>Academic & Financial Summary</span>
                                            </div>
                                            <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                                <div>
                                                    <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">
                                                        Institution
                                                    </p>
                                                    <p class="text-gray-800 font-semibold">{{ profile.institution }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">
                                                        Program</p>
                                                    <p class="text-gray-800 font-semibold">{{ profile.program }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">Intake
                                                    </p>
                                                    <p class="text-gray-800 font-semibold">{{ profile.intake }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">
                                                        Counselor</p>
                                                    <p class="text-gray-800 font-semibold">{{ profile.counselor_name }}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                class="mt-6 pt-6 border-t border-gray-50 grid grid-cols-3 gap-4 text-center">
                                                <div class="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                    <p class="text-[10px] text-gray-500 font-bold mb-1">TUITION</p>
                                                    <p class="text-sm font-black text-gray-900">${{ profile.tuition_fee
                                                    }}</p>
                                                </div>
                                                <div class="p-3 rounded-xl bg-green-50 border border-green-100">
                                                    <p class="text-[10px] text-green-600 font-bold mb-1">PAID</p>
                                                    <p class="text-sm font-black text-green-700">${{ profile.paid_amount
                                                    }}</p>
                                                </div>
                                                <div class="p-3 rounded-xl bg-red-50 border border-red-100">
                                                    <p class="text-[10px] text-red-500 font-bold mb-1">BALANCE</p>
                                                    <p class="text-sm font-black text-red-600">${{
                                                        profile.remaining_amount }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="activeTab === 'documents'" class="space-y-3">
                                        <div v-for="doc in selectedStudent?.documents" :key="doc.id"
                                            class="flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-300 transition-all group shadow-sm">
                                            <div
                                                class="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <FileText :size="24" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-bold text-gray-800 truncate">{{ doc.file_name }}
                                                </p>
                                                <p class="text-xs text-gray-400 font-medium">{{ doc.file_size }} • {{
                                                    formatLocalTime(doc.uploaded_at) }}</p>
                                            </div>
                                            <a :href="doc.url" target="_blank"
                                                class="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all">View</a>
                                        </div>
                                    </div>
                                    <div v-if="activeTab === 'interviews'" class="space-y-8">
                                        <div v-if="!selectedStudent?.interviews?.length" class="text-center py-20">
                                            <div
                                                class="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Info class="text-gray-400" />
                                            </div>
                                            <p class="text-gray-500 font-medium">No interviews scheduled yet.</p>
                                        </div>

                                        <div v-for="(interview, index) in selectedStudent?.interviews"
                                            :key="interview.id"
                                            class="relative pl-8 border-l-2 border-indigo-100 pb-4 last:pb-0">

                                            <div
                                                class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm">
                                            </div>

                                            <div
                                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                <div
                                                    class="px-5 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                                    <h4 class="text-sm font-bold text-gray-700">Interview #{{ index + 1
                                                    }}</h4>
                                                    <div class="flex items-center gap-3">
                                                        <span class="text-[10px] text-gray-400 font-bold uppercase">{{
                                                            formatLocalTime(interview.created_at) }}</span>
                                                        <span :class="[
                                                            interview.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
                                                            'px-2 py-0.5 rounded text-[10px] font-black uppercase'
                                                        ]">{{ interview.status }}</span>
                                                    </div>
                                                </div>

                                                <div class="p-5 space-y-4">
                                                    <div v-for="(q, qIndex) in interview.questions" :key="q.id"
                                                        class="flex gap-4">
                                                        <div
                                                            class="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                            Q{{ qIndex + 1 }}
                                                        </div>
                                                        <div class="flex-1">
                                                            <p
                                                                class="text-sm text-gray-800 font-medium leading-relaxed">
                                                                {{ q.question_text }}
                                                            </p>
                                                            <div class="mt-2 flex gap-2">
                                                                <span
                                                                    class="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded italic">
                                                                    Type: {{ q.type }}
                                                                </span>
                                                                <span
                                                                    class="text-[10px] bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded italic">
                                                                    Status: {{ q.status }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style>
/* 1. Table Customization */
.customize-table {
    --easy-table-header-background-color: #8176f1;
    --easy-table-header-font-color: #fff;
    --easy-table-header-height: 70px;
    --easy-table-body-row-height: 80px;
    --easy-table-footer-font-color: #7367F0;
}

/* 2. Backdrop Fade Animation */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.0s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 3. Slide from Right Animation */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

/* 4. Custom Scrollbar for Drawer Content */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>