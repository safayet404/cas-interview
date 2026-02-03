<script setup>

import { ref } from 'vue';
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginPdfPreview from 'filepond-plugin-pdf-preview';
import 'filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.min.css';
import { useStudentStore } from '@/stores/student';
import { storeToRefs } from 'pinia';

const store = useStudentStore()
const { student, studentId, profile, profileId, interviewId, tab, docUploaded, loading } = storeToRefs(store)
const { createStudent, createProfile, createInterview, uploadDocumentAction, generateQuestions } = store
const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginPdfPreview);
const pond = ref(null);
const serverOptions = {

    process: async (fieldName, file, metadata, load, error, progress, abort) => {
        const formData = new FormData();
        formData.append('files[]', file, file.name);

        try {

            const res = await uploadDocumentAction(formData, (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
            });

            if (res.data.status === 'success') {
                load(res.data);
                docUploaded.value = true;
            }
        } catch (err) {
            console.error("Upload error", err);
            error('Upload failed');
        }

        return { abort: () => abort() };
    }
};

function interviewSection() {
    tab.value = "interview"
}
</script>

<template>

    <div class=" min-h-screen  bg-[#F8F7FA]">

        <Head title="Student Create" />

        <div class=" p-6">
            <h1 class="mb-4 text-xl font-semibold">Student Setup</h1>

            <div v-if="tab === 'student'" class="mb-4 rounded-xl p-4 shadow-[0_0_20px_5px_rgba(0,0,0,0.1)]">


                <div class="grid grid-cols-2 gap-4">
                    <div class="flex  flex-col-reverse">

                        <input v-model="student.first_name" placeholder="First name"
                            class="w-full peer rounded border border-gray-400 p-2 outline-none focus:border-[#7367F0]" />
                        <label class="mb-1 transition-colors peer-focus:text-[#7367F0] text-sm ">First
                            Name</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="student.last_name" placeholder="Last name"
                            class="w-full peer rounded border border-gray-400 p-2 outline-none focus:border-[#7367F0]" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Last Name</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="student.email" type="email" autocomplete="off" placeholder="Email"
                            class="w-full peer rounded border border-gray-400 p-2 outline-none focus:border-[#7367F0]" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Email</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="student.password" autocomplete="new-password" type="password"
                            placeholder="Password"
                            class="w-full peer rounded border border-gray-400 p-2 outline-none focus:border-[#7367F0]" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Password</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="student.dob" type="date" placeholder="Password"
                            class="w-full peer rounded border border-gray-400 p-2 outline-none focus:border-[#7367F0]" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Date of birth</label>
                    </div>

                </div>

                <button class="mt-3 rounded-lg shadow-2xl border  cursor-pointer bg-[#7367F0] text-white px-3 py-2"
                    @click="createStudent" :disabled="loading.student">
                    <span v-if="loading.student" class="loader"></span>
                    <span>{{ loading.student ? 'Saving...' : 'Continue' }}</span>
                </button>

                <div v-if="studentId" class="mt-2 text-sm opacity-80">
                    Student ID: {{ studentId }}
                </div>
            </div>
            <!-- v-if="studentId && !profileId" -->

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

                <button class="mt-3 rounded bg-[#7367F0] cursor-pointer text-white px-3 py-2" @click="createProfile"
                    :disabled="loading.profile">
                    <span v-if="loading.profile" class="loader"></span>
                    <span>{{ loading.profile ? 'Saving...' : 'Continue' }}</span>
                </button>

                <div v-if="profileId" class="mt-2 text-sm opacity-80">
                    Profile ID : {{ profileId }}
                </div>
            </div>

            <!-- v-if="studentId && profileId"  -->

            <div class="mb-4 rounded-xl p-4 shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] bg-white" v-if="tab === 'doc'">
                <h2 class="mb-4 font-semibold text-gray-700">Upload Documents</h2>

                <file-pond name="files" ref="pond"
                    label-idle="Drop files here or <span class='filepond--label-action font-bold text-[#7367F0]'>Browse</span>"
                    :allow-multiple="true" accepted-file-types="image/*, application/pdf,.docx" :server="serverOptions"
                    class="cursor-pointer" />

                <p class="mt-2 text-xs text-gray-400 italic">
                    Supported formats: Images, PDF. Max files: 10.
                </p>

                <div v-if="docUploaded" class="flex justify-center">

                    <button @click="interviewSection" class="bg-[#7367F0] cursor-pointer text-white py-2 px-4 rounded">
                        Continue
                    </button>

                </div>
            </div>

            <!-- v-if="studentId && profileId" -->



            <div v-if="tab === 'interview'" class="rounded-xl  shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-8">

                <div class="flex justify-center">

                    <button v-if="!interviewId" class="rounded bg-[#7367F0] cursor-pointer  text-white px-3 py-2"
                        @click="createInterview" :disabled="loading.interview">
                        <span v-if="loading.interview" class="loader"></span>
                        <span>{{ loading.interview ? 'Creating...' : 'Create Interview' }}</span>
                    </button>

                    <button v-if="interviewId" class="rounded bg-[#7367F0] cursor-pointer text-white px-3 py-2"
                        @click="generateQuestions">
                        <span v-if="loading.generateQuestion" class="loader"></span>
                        <span>{{ loading.generateQuestion ? 'Generating...' : 'Generate Questions(AI)' }}</span>
                    </button>
                </div>


            </div>

            <!-- <pre class="mt-4 text-xs opacity-80"> {{ questionsPreview }} </pre> -->
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