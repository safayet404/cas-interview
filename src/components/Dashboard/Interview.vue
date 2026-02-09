<script setup>
import { useInterviewStore } from '@/stores/interview';
import { useQuestionStore } from '@/stores/questions';
import { ArrowLeft } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const store = useInterviewStore()
const qs = useQuestionStore()
const { interviews } = storeToRefs(store)
const { fetchInterviewPerStudent } = store

const hadnleStart = (interviewId) => {
    qs.setInterviewId(interviewId)
    router.push('/setup');
}

onMounted(() => {
    fetchInterviewPerStudent()
    console.log(interviews.value);

})
</script>

<template>
    <div class="p-10 animate-in text-white fade-in duration-500">
        <h1 class="text-3xl font-bold mt-5 ">Interviews</h1>
        <p class="mt-4 text-slate-500 max-w-2xl">
            You have been invited to complete the following interviews. Please follow the instructions below.
        </p>

        <div class="mt-10">
            <h1 class="text-xl font-bold">Complete your recorded video interview</h1>
            <p class="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
                You need to complete a short video recording yourself answering some questions.
                You can do this at a time that is convenient for you. Please have your passport ready.
            </p>

            <div
                class="flex flex-col mt-8 max-w-lg gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-r-xl rounded-l-sm border-l-[6px] border-orange-500 shadow-sm">
                <h2 class="text-lg font-bold">Credibility Interview</h2>
                <p class="text-slate-600 dark:text-slate-400 text-sm">
                    You have been asked to complete a recorded video interviews.
                </p>
                <RouterLink to="/setup"
                    class="w-fit px-8 py-2.5 bg-[#0070f3] hover:bg-blue-600 text-white font-semibold rounded-lg transition-all active:scale-95">
                    Start interview
                </RouterLink>
            </div>

            <div class="flex gap-5">
                <div v-for="item in interviews"
                    :class="item.status === 'completed' ? 'border-green-800' : 'border-orange-500'"
                    class="flex flex-col mt-8 max-w-lg gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-r-xl rounded-l-sm border-l-[6px]  shadow-sm">
                    <h2 class="text-lg font-bold">{{ item.compliance_profile?.institution }}</h2>
                    <p class="text-slate-600 dark:text-slate-400 text-sm">
                        {{ item.compliance_profile?.program }} - {{ item.compliance_profile?.intake }}
                    </p>

                    <button @click="hadnleStart(item.id)"
                        :disabled="item.status !== 'ready' && item.status !== 'completed'"
                        class="w-fit px-8 py-2.5 capitalize font-semibold rounded-lg transition-all" :class="{
                            'bg-[#0070f3] hover:bg-blue-600 cursor-pointer text-white active:scale-95': item.status === 'ready',
                            'bg-green-600 text-white cursor-not-allowed': item.status === 'completed',
                            'bg-gray-400 text-gray-200 cursor-not-allowed': item.status !== 'ready' && item.status !== 'completed'
                        }">
                        {{ item.status === "ready" ? "Start Interview" : item.status }}
                    </button>
                </div>

            </div>

        </div>

        <div class="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button @click="setSection('documents')"
                class="flex items-center gap-2 text-blue-500 font-medium hover:underline group">
                <ArrowLeft class="group-hover:-translate-x-1 transition-transform" :size="18" />
                Previous task: General Documents
            </button>
        </div>
    </div>

</template>