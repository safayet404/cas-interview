<script setup>

import { computed, onMounted, ref, watch } from 'vue';
import { useStudentStore } from '@/stores/student';
import { storeToRefs } from 'pinia';
import GlobalLoader from '../GlobalLoader.vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

const store = useStudentStore()
const { searchStudents, profile, profileId, interviewId, tab, loading, isFetching } = storeToRefs(store)
const { createProfile, selectExistingStudent, searchStudent, createInterview, generateQuestions } = store

const isGlobalLoading = computed(() => {
    return loading.value.student || loading.value.profile || loading.value.interview || loading.value.generateQuestion;
})

const selectedStudent = ref(null);

watch(selectedStudent, (s) => {
    selectExistingStudent(s?.id ?? null);
});

async function handleFinalStep() {
    await generateQuestions();
    selectedStudent.value = null;
}

onMounted(() => {
    searchStudent()
});

</script>

<template>

    <div class=" min-h-screen  bg-[#F8F7FA]">
        <GlobalLoader v-if="isGlobalLoading" />

        <Head title="Student Create" />

        <div class=" p-6">
            <h1 class="mb-4 text-xl font-semibold">Student Setup</h1>

            <div v-if="tab === 'student'" class="mb-4 rounded-xl p-4 shadow-[0_0_20px_5px_rgba(0,0,0,0.1)]">

                <multiselect v-model="selectedStudent" :options="searchStudents" :searchable="true"
                    :close-on-select="true" :show-labels="false" placeholder="Search for a student..." label="name"
                    track-by="id" :loading="isFetching">
                    <template #option="{ option }">
                        <div> {{ option.name }} - {{ option.email }} </div>
                    </template>

                    <template #singleLabel="{ option }">
                        <div> {{ option.name }} - {{ option.email }} </div>
                    </template>
                </multiselect>

                <div>
                    <button @click="tab = 'compliance'" class="px-4 py-2 bg-[#7367f0] mt-5 rounded-lg text-white">
                        Continue
                    </button>
                </div>

            </div>

            <div v-if="tab === 'compliance'" class="mb-4 rounded-xl p-4  shadow-[0_0_20px_5px_rgba(0,0,0,0.1)]">
                <h2 class="mb-5 font-semibold">Compliance Packet</h2>

                <div class="grid grid-cols-2 gap-2 space-y-3">

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.institution" placeholder="University of Sunderland"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Institution</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.program" placeholder="Computer Science and Engineering"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Program</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.intake" placeholder="January 2026"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Intake</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.tuition_fee" type="number" placeholder="1200"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Tuition fees</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.scholarship" type="number" placeholder="0"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Scholarship</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.paid_amount" type="number" placeholder="500"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Paid Amount</label>
                    </div>

                    <div class="flex flex-col-reverse col-span-2">
                        <input v-model="profile.remaining_amount" type="number" placeholder="2000"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Remaining Amount</label>
                    </div>

                    <div class="flex flex-col-reverse col-span-2">
                        <textarea v-model="profile.notes" placeholder="Notes (Optional)"
                            class="w-full h-28 peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2"></textarea>
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Notes</label>
                    </div>
                </div>

                <button class="mt-3 rounded bg-[#7367F0] cursor-pointer text-white px-3 py-2" @click="createProfile()"
                    :disabled="loading.profile">
                    <span v-if="loading.profile" class="loader"></span>
                    <span>{{ loading.profile ? 'Saving...' : 'Continue' }}</span>
                </button>


            </div>





            <div v-if="tab === 'interview'" class="rounded-xl shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-8">
                <div class="flex justify-center">
                    <button v-if="!interviewId" class="rounded bg-[#7367F0] text-white px-3 py-2"
                        @click="createInterview()" :disabled="loading.interview">
                        <span v-if="loading.interview" class="loader"></span>
                        <span>{{ loading.interview ? 'Creating...' : 'Create Interview' }}</span>
                    </button>

                    <button v-else class="rounded bg-[#7367F0] text-white px-3 py-2" @click="handleFinalStep"
                        :disabled="loading.generateQuestion">
                        <span v-if="loading.generateQuestion" class="loader"></span>
                        <span>{{ loading.generateQuestion ? 'Generating...' : 'Generate Questions (AI)' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<style lang="css">
.filepond--panel-root {
    background-color: #f8f9fa;
    border: 2px dashed #d1d5db;
}

.filepond--item-panel {
    background-color: #7367F0 !important;
}

.filepond--file-action-button {
    background-color: rgba(0, 0, 0, 0.5);
}

[data-filepond-item-state='processing-complete'] .filepond--item-panel {
    background-color: #28c76f !important;
    /* Success Green */
}

[data-filepond-item-state='processing-complete'] .filepond--file-wrapper {
    border: 2px solid #28c76f;
    border-radius: 8px;
}

.filepond--label-action {
    text-decoration-color: #7367F0;
}

.loader {
    width: 16px;
    height: 16px;
    border: 2px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s linear infinite;
}

.loader-lg {
    width: 40px;
    height: 40px;
    border: 4px solid #7367F0;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>