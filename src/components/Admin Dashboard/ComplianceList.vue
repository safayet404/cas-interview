<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useProfileStore } from '@/stores/compliance';
import { storeToRefs } from 'pinia';
import {
    CheckCheck, X, Eye, Mail, GraduationCap,
    FileText, Calendar, Wallet, Info, User
} from 'lucide-vue-next';
import { formatLocalTime } from '@/utils/formatLocalTime';
import GlobalLoader from '../GlobalLoader.vue';

const store = useProfileStore();
const {
    profiles, pagination, isFetching, selectedProfile,
    isDrawerOpen, activeTab, stats, isPreviewOpen,
    previewType, previewUrl
} = storeToRefs(store);

const {
    fetchCompliance, openProfileDrawer, closeDrawer,
    openPreview, closePreview
} = store;

const headers = [
    { text: 'ID', value: 'id' },
    { text: 'Student', value: 'student_info' },
    { text: 'University/Program/Intake', value: 'program_info' },
    { text: 'Counselor', value: 'counselor' },
    { text: 'Created At', value: 'created' },
    { text: 'ACTIONS', value: 'operation', width: 80 },
];

const serverOptions = ref({
    page: 1,
    rowsPerPage: 10,
});

watch(serverOptions, (value) => {
    fetchCompliance(value.page, value.rowsPerPage);
}, { deep: true });

onMounted(async () => {
    await fetchCompliance(serverOptions.value.page, serverOptions.value.rowsPerPage);
});
</script>

<template>
    <div class="min-h-screen bg-[#F8F7FA] p-4 font-sans">
        <GlobalLoader v-if="isFetching" />

        <div class=" mx-auto">
            <div class="flex gap-5 justify-end mb-6">
                <div class="p-5 bg-linear-to-br from-green-800 to-green-400 text-white rounded-2xl shadow-lg min-w-50">
                    <p class="text-[10px] uppercase font-black tracking-widest opacity-80">Total Cases</p>
                    <p class="text-2xl font-black">{{ stats?.total_cases || 0 }}</p>
                </div>
                <div
                    class="p-5 bg-linear-to-br from-purple-800 to-purple-400 text-white rounded-2xl shadow-lg min-w-50">
                    <p class="text-[10px] uppercase font-black tracking-widest opacity-80">Total Students</p>
                    <p class="text-2xl font-black">{{ stats?.total_students || 0 }}</p>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <EasyDataTable v-model:server-options="serverOptions" :server-items-length="pagination.total"
                    :headers="headers" :items="profiles" :loading="isFetching" buttons-pagination
                    table-class-name="customize-table">
                    <template #item-student_info="{ student }">
                        <div class="py-3">
                            <p class="font-bold text-gray-800 leading-tight">{{ student?.full_name || 'N/A' }}</p>
                            <p class="text-[11px] text-gray-500 mt-0.5">{{ student?.email || 'N/A' }}</p>
                        </div>
                    </template>

                    <template #item-program_info="{ program, intake, institution }">
                        <div class="text-xs">
                            <p class="font-semibold text-indigo-500">{{ institution }}</p>
                            <p class="font-semibold text-gray-700">{{ program }}</p>
                            <p class="font-medium text-gray-400">{{ intake }}</p>
                        </div>
                    </template>

                    <template #item-counselor="{ counselor_name, counselor_email }">
                        <div class="text-xs">
                            <p class="font-semibold text-gray-800">{{ counselor_name }}</p>
                            <p class="text-gray-400">{{ counselor_email }}</p>
                        </div>
                    </template>

                    <template #item-created="{ created_at }">
                        <p class="text-[11px] text-gray-500">{{ formatLocalTime(created_at) }}</p>
                    </template>

                    <template #item-operation="item">
                        <button @click="openProfileDrawer(item)"
                            class="p-2 bg-indigo-50 text-indigo-600 cursor-pointer rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <Eye :size="18" />
                        </button>
                    </template>
                </EasyDataTable>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="fade">
                <div v-if="isDrawerOpen" class="fixed inset-0 z-100 bg-gray-900/40 backdrop-blur-sm"
                    @click="closeDrawer">
                </div>
            </Transition>

            <Transition name="slide">
                <div v-if="isDrawerOpen"
                    class="fixed right-0 top-0 z-110 w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">

                    <div
                        class="relative bg-linear-to-br from-indigo-700 via-indigo-800 to-violet-900 px-8 py-10 text-white shadow-lg">
                        <button @click="closeDrawer"
                            class="absolute cursor-pointer top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-all border border-white/10">
                            <X :size="24" />
                        </button>
                        <div class="flex items-center gap-6">
                            <div
                                class="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-black border border-white/20 shadow-inner">
                                {{ selectedProfile?.student?.full_name?.charAt(0) }}
                            </div>
                            <div>
                                <h2 class="text-3xl font-extrabold tracking-tight uppercase">
                                    {{ selectedProfile?.student?.full_name }}
                                </h2>
                                <div class="flex flex-wrap items-center gap-4 mt-2 text-indigo-100">
                                    <p class="flex items-center gap-2 text-sm">
                                        <Mail :size="16" /> {{ selectedProfile?.student?.email }}
                                    </p>
                                    <p class="flex items-center gap-2 text-sm">
                                        <GraduationCap :size="16" /> ID: {{ selectedProfile?.id }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex border-b border-gray-100 px-8 sticky top-0 bg-white z-10 shadow-sm">
                        <button v-for="tab in ['profile', 'documents', 'interviews']" :key="tab"
                            @click="activeTab = tab"
                            class="cursor-pointer py-5 border-b-2 font-black text-[11px] uppercase tracking-[0.2em] mr-10 transition-all"
                            :class="activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'">
                            {{ tab }}
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/40">

                        <Transition name="tab" mode="out-in">
                            <div v-if="activeTab === 'profile'" class="space-y-6">
                                <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        <div v-for="(label, key) in { institution: 'Institution', program: 'Program', intake: 'Intake Period', counselor_name: 'Assigned Counselor' }"
                                            :key="key">
                                            <p
                                                class="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">
                                                {{ label
                                                }}</p>
                                            <p class="text-gray-900 font-bold text-sm leading-snug">{{
                                                selectedProfile[key]
                                            }}</p>
                                        </div>
                                    </div>
                                    <div
                                        class="mt-10 pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div class="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                            <p class="text-[10px] text-gray-400 font-black mb-1 uppercase">Tuition Fee
                                            </p>
                                            <p class="text-xl font-black text-gray-900">${{ selectedProfile.tuition_fee
                                            }}
                                            </p>
                                        </div>
                                        <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <p class="text-[10px] text-emerald-600 font-black mb-1 uppercase">Total Paid
                                            </p>
                                            <p class="text-xl font-black text-emerald-700">${{
                                                selectedProfile.paid_amount
                                            }}</p>
                                        </div>
                                        <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <p class="text-[10px] text-emerald-600 font-black mb-1 uppercase">
                                                Scholarship
                                            </p>
                                            <p class="text-xl font-black text-emerald-700">${{
                                                selectedProfile.scholarship
                                            }}</p>
                                        </div>
                                        <div class="p-5 rounded-2xl bg-rose-50 border border-rose-100">
                                            <p class="text-[10px] text-rose-500 font-black mb-1 uppercase">Balance Due
                                            </p>
                                            <p class="text-xl font-black text-rose-700">${{
                                                selectedProfile.remaining_amount
                                            }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="activeTab === 'documents'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="doc in selectedProfile?.documents" :key="doc.id"
                                    class="flex items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-300 group shadow-sm transition-all">
                                    <div
                                        class="p-4 bg-indigo-50 text-indigo-600 rounded-xl mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <FileText :size="28" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-bold text-gray-800 truncate">{{ doc.file_name }}</p>
                                        <p class="text-[11px] text-gray-400 mt-0.5">{{ doc.file_size }} • {{
                                            formatLocalTime(doc.uploaded_at) }}</p>
                                    </div>
                                    <button @click="openPreview(doc.url, doc.file_type)"
                                        class="ml-2 px-4 cursor-pointer py-2 bg-gray-50 text-indigo-600 text-[11px] font-black uppercase rounded-lg hover:bg-indigo-600 hover:text-white transition-all">View</button>
                                </div>
                            </div>

                            <div v-else class="space-y-10">
                                <div v-if="!selectedProfile?.interviews?.length"
                                    class="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                    <Info class="text-gray-200 mx-auto mb-4" :size="48" />
                                    <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">No Sessions
                                        Recorded</p>
                                </div>
                                <div v-for="(interview, index) in selectedProfile?.interviews"
                                    :key="interview.interview_id"
                                    class="relative pl-10 border-l-2 border-indigo-100 pb-2">
                                    <div
                                        class="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white shadow-md">
                                    </div>
                                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div
                                            class="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center">
                                            <h4 class="text-xs font-black text-indigo-900 uppercase tracking-widest">
                                                Session
                                                #{{
                                                    index + 1 }}</h4>
                                            <button v-if="interview.report_path"
                                                @click="openPreview(interview.report_path, 'application/pdf')"
                                                class="flex items-center cursor-pointer gap-1.5 px-3 py-1 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">
                                                <Eye :size="12" /> View Report
                                            </button>
                                            <span
                                                :class="[interview.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700', 'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter']">{{
                                                    interview.status }}</span>
                                        </div>
                                        <div class="p-6 space-y-8">
                                            <div v-for="(q, qIndex) in interview.questions" :key="q.question_id">
                                                <div class="flex gap-5">
                                                    <div
                                                        class="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black">
                                                        {{ qIndex + 1 }}</div>
                                                    <div class="flex-1">
                                                        <h5 class="text-sm text-gray-800 font-bold mb-2">{{ q.text }}
                                                        </h5>
                                                        <div
                                                            class="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                                                            <p class="text-sm text-gray-600 italic">{{ q?.transcript }}
                                                            </p>
                                                        </div>
                                                        <div v-if="q.status === 'completed'"
                                                            class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div
                                                                class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                                                <p
                                                                    class="text-[10px] uppercase font-black text-indigo-600 mb-3 tracking-widest flex items-center gap-2">
                                                                    <CheckCheck :size="14" /> AI Observations
                                                                </p>
                                                                <ul class="space-y-1">
                                                                    <li v-for="point in q.summary" :key="point"
                                                                        class="text-xs text-gray-600">• {{ point }}</li>
                                                                </ul>
                                                            </div>
                                                            <div
                                                                class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                                                <div class="flex justify-between items-center mb-3">
                                                                    <p
                                                                        class="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                                                                        Consistency</p><span
                                                                        :class="q.consistency === 'concerning' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'"
                                                                        class="px-2 py-0.5 rounded text-[10px] font-black uppercase">{{
                                                                            q.consistency }}</span>
                                                                </div>
                                                                <div class="flex flex-wrap gap-2 mt-4"><span
                                                                        v-for="kp in q.key_points" :key="kp"
                                                                        class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">{{
                                                                            kp }}</span></div>
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

        <Teleport to="body">
            <Transition name="fade">
                <div v-if="isPreviewOpen" class="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm"
                    @click="closePreview">
                </div>
            </Transition>

            <Transition name="zoom">
                <div v-if="isPreviewOpen"
                    class="fixed inset-0 z-210 flex items-center justify-center p-4 md:p-10 pointer-events-none">
                    <div
                        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full flex flex-col overflow-hidden pointer-events-auto">
                        <div class="flex items-center justify-between px-6 py-4 border-b">
                            <h3 class="font-bold text-gray-800 flex items-center gap-2">
                                <FileText :size="18" class="text-indigo-600" /> Document Preview
                            </h3>
                            <button @click="closePreview"
                                class="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors">
                                <X :size="20" />
                            </button>
                        </div>
                        <div class="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-4">
                            <img v-if="previewType.includes('image')" :src="previewUrl"
                                class="max-w-full max-h-full object-contain shadow-lg" />
                            <iframe v-else-if="previewType.includes('pdf')" :src="previewUrl"
                                class="w-full h-full rounded-md shadow-lg"></iframe>
                            <iframe v-else-if="previewType.includes('officedocument')"
                                :src="`https://docs.google.com/gview?url=${previewUrl}&embedded=true`"
                                class="w-full h-full"></iframe>
                            <div v-else class="text-center">
                                <p class="text-gray-500">Preview not available.</p><a :href="previewUrl" target="_blank"
                                    class="mt-4 inline-block text-indigo-600 font-bold">Download</a>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style>
/* Grid Container for v4 compatibility */
.max-w-7xl {
    max-width: 80rem;
}

/* Table Styling */
.customize-table {
    --easy-table-header-background-color: #4f46e5;
    --easy-table-header-font-color: #ffffff;
    --easy-table-header-height: 70px;
    --easy-table-body-row-height: 80px;
    --easy-table-header-font-size: 13px;
    --easy-table-body-font-size: 13px;
    --easy-table-footer-font-color: #4f46e5;
    --easy-table-row-border: 1px solid #f1f5f9;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.tab-enter-active,
.tab-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease-out;
}

.tab-enter-from {
    opacity: 0;
    transform: translateX(15px);
}

.tab-leave-to {
    opacity: 0;
    transform: translateX(-15px);
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.zoom-enter-active,
.zoom-leave-active {
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.zoom-enter-from,
.zoom-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

/* Scrollbar Styling */
.overflow-y-auto::-webkit-scrollbar {
    width: 5px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>