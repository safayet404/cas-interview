<script setup>

import { computed, onMounted, ref, watch } from 'vue';
import { useStudentStore } from '@/stores/student';
import { storeToRefs } from 'pinia';
import GlobalLoader from '../GlobalLoader.vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

const store = useStudentStore()
const { profile, interviewId, tab, searchProfiles, loading, isFetching } = storeToRefs(store)
const { selectExistingStudent, selectExistingProfile, searchProfile, createInterview, generateQuestions } = store

const isGlobalLoading = computed(() => {
    return loading.value.student || loading.value.profile || loading.value.interview || loading.value.generateQuestion;
})

const selectedStudent = ref(null);

console.log("val", searchProfiles.value);


watch(selectedStudent, (val) => {
    if (val) {
        selectExistingStudent(val.student_id);
        selectExistingProfile(val.id);
        profile.value.institution = val.institution;
    } else {
        selectExistingStudent(null);
        selectExistingProfile(null);
    }
});
async function handleFinalStep() {
    await generateQuestions();
    selectedStudent.value = null;
}

onMounted(() => {
    searchProfile();

});

</script>

<template>

    <div class=" min-h-screen  bg-[#F8F7FA]">
        <GlobalLoader v-if="isGlobalLoading" />

        <Head title="Student Create" />

        <div class=" p-6">
            <h1 class="mb-4 text-xl font-semibold">Student Setup</h1>

            <div v-if="tab === 'student'" class="mb-4 rounded-xl p-4 shadow-[0_0_20px_5px_rgba(0,0,0,0.1)]">

                <multiselect v-model="selectedStudent" :options="searchProfiles" :searchable="true"
                    :close-on-select="true" :show-labels="false" placeholder="Search for a student..." label="name"
                    track-by="id" :loading="isFetching">
                    <template #option="{ option }">
                        <div> {{ option.name }} - {{ option.email }} - {{ option.institution }} </div>
                    </template>

                    <template #singleLabel="{ option }">
                        <div> {{ option.name }} - {{ option.email }} - {{ option.institution }} </div>
                    </template>
                </multiselect>

                <div>
                    <button @click="tab = 'interview'" class="px-4 py-2 bg-[#7367f0] mt-5 rounded-lg text-white">
                        Continue
                    </button>
                </div>

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