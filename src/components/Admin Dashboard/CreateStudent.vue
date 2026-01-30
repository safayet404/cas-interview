<script setup>
import api from '@/services/api';
import axios from 'axios';
import { computed, ref } from 'vue';
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';



const student = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    dob: ''
});

const profile = ref({
    institution: '',
    program: '',
    intake: '',
    tuition_fee: 0,
    scholarship: null,
    paid_amount: 0,
    remaining_amount: 0,
    notes: '',
});

const studentId = ref(null);
const profileId = ref(null);

const interviewId = ref(null);
const docFile = ref([]);
const questions = ref([]);

const creatingStudent = ref(false);
const creatingProfile = ref(false);
const uploadingDoc = ref(false);
const creatingInterview = ref(false);

const questionsPreview = computed(() =>
    questions.value.length ? JSON.stringify(questions.value, null, 2) : '',
);

function onFile(e) {
    docFile.value = Array.from(e.target.files);
}

async function createStudent() {
    creatingStudent.value = true;

    try {
        const { data } = await api.post('/student', student.value);
        console.log('student data ', data);

        studentId.value = data?.data.id;
    } catch (error) {
        console.log(error);
    } finally {
        creatingStudent.value = false;
    }
}

async function createProfile() {
    creatingProfile.value = true;
    try {
        const { data } = await api.post(
            `/students/${studentId.value}/compliance-profiles`,
            profile.value,
        );
        console.log('complaince profile', data);

        profileId.value = data?.data.id;
    } catch (error) {
        console.log(error);
    } finally {
        creatingProfile.value = false;
    }
}



const FilePond = vueFilePond(FilePondPluginImagePreview);
const pond = ref(null);
const serverOptions = {
    url: 'http://localhost:8000/', // Base URL is usually handled by your 'api' service, but FilePond needs a string or config
    process: (fieldName, file, metadata, load, error, progress, abort) => {
        const formData = new FormData();
        formData.append('files[]', file, file.name);

        // We use your existing 'api' instance to keep headers/interceptors
        api.post(`/students/${studentId.value}/documents`, formData, {
            onUploadProgress: (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
            }
        }).then(res => {
            load(res.data);
            alert('Upload successful!');
        }).catch(err => {
            error('Upload failed');
        });

        return {
            abort: () => {
                abort();
            }
        };
    }
};
async function uploadDoc() {
    if (!docFile.value) return;

    uploadingDoc.value = true;
    try {
        const formData = new FormData();

        docFile.value.forEach((file) => {
            formData.append('files[]', file);
        });

        const docsUpload = await api.post(
            `/students/${studentId.value}/documents`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );

        console.log(docsUpload);

        alert('Upload successful!');
        docFile.value = [];
    } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
    } finally {
        uploadingDoc.value = false;
    }
}

async function createInterview() {
    creatingInterview.value = true;

    try {
        const { data } = await api.post('/interviews', {
            student_id: studentId.value,
            compliance_profile_id: profileId.value,
        });
        console.log('interview create', data);
        interviewId.value = data?.data.id;
    } catch (error) {
        console.log(error);
    } finally {
        creatingInterview.value = false;
    }
}

async function generateQuestions() {
    try {
        const { data } = await api.post(
            `/interviews/${interviewId.value}/generate-questions`,
            { count: 1 },
        );
        console.log('generate questions', data);

        questions.value = data?.data.questions;
    } catch (error) { }
}
</script>

<template>

    <div class=" min-h-screen  bg-[#F8F7FA]">

        <Head title="Student Create" />

        <div class=" p-6">
            <h1 class="mb-4 text-xl font-semibold">Student Setup</h1>

            <div v-if="!studentId" class="mb-4 rounded-xl p-4 shadow-[0_0_20px_5px_rgba(0,0,0,0.1)]">


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

                <button class="mt-3 rounded-lg shadow-2xl border cursor-pointer bg-[#7367F0] text-white px-3 py-2"
                    @click="createStudent" :disabled="creatingStudent">
                    Continue
                </button>

                <div v-if="studentId" class="mt-2 text-sm opacity-80">
                    Student ID: {{ studentId }}
                </div>
            </div>
            <!-- v-if="studentId && !profileId" -->

            <div class="mb-4 rounded-xl p-4  shadow-[0_0_20px_5px_rgba(0,0,0,0.1)]">
                <h2 class="mb-5 font-semibold">Compliance Packet</h2>

                <div class="grid grid-cols-2 gap-2 space-y-3">

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.institution" placeholder="Institution"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">University of Sunderland</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.program" placeholder="Computer Science and Engineering"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">Program</label>
                    </div>

                    <div class="flex flex-col-reverse">
                        <input v-model="profile.intake" placeholder="Intake"
                            class="w-full peer rounded border border-gray-400 outline-none focus:border-[#7367F0] p-2" />
                        <label class="mb-1 text-sm  peer-focus:text-[#7367F0]">January 2026</label>
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

                <button class="mt-3 rounded bg-[#7367F0] text-white px-3 py-2" @click="createProfile"
                    :disabled="creatingProfile">
                    Continue
                </button>

                <div v-if="profileId" class="mt-2 text-sm opacity-80">
                    Profile ID : {{ profileId }}
                </div>
            </div>

            <!-- v-if="studentId && profileId"  -->

            <div class="mb-4 rounded-xl p-4 shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] bg-white"
                v-if="studentId && profileId">
                <h2 class="mb-4 font-semibold text-gray-700">Upload Documents</h2>

                <file-pond name="files" ref="pond"
                    label-idle="Drop files here or <span class='filepond--label-action font-bold text-[#7367F0]'>Browse</span>"
                    :allow-multiple="true" accepted-file-types="image/*, application/pdf" :server="serverOptions"
                    class="cursor-pointer" />

                <p class="mt-2 text-xs text-gray-400 italic">
                    Supported formats: Images, PDF. Max files: 10.
                </p>
            </div>

            <div class="mb-4 rounded border p-4">
                <h2 class="mb-2 font-semibold">Upload Documents</h2>

                <input type="file" @change="onFile" multiple />

                <button class="mt-3 rounded border px-3 py-2" @click="uploadDoc" :disabled="!docFile || uploadingDoc">
                    Upload
                </button>
            </div>

            <div class="rounded border p-4" v-if="studentId && profileId">
                <h2 class="mb-2 font-semibold">Create Interview</h2>

                <button class="rounded border px-3 py-2" @click="createInterview" :disabled="creatingInterview">
                    Create Interview
                </button>

                <div v-if="interviewId" class="mt-2">
                    Interview ID : {{ interviewId }}

                    <div class="mt-2 flex gap-2">
                        <button class="rounded border px-3 py-2" @click="generateQuestions">
                            Generate Questions (AI)
                        </button>
                        <Link class="inline-block rounded border px-3 py-2" :href="`/session/${interviewId}`">
                        Go to Interview Session
                        </Link>
                        <router-link class="inline-block rounded border px-3 py-2" :to="{
                            name: 'InterviewReview',
                            params: { interviewId },
                        }">
                            Review/Compliance
                        </router-link>
                    </div>
                </div>
            </div>

            <pre class="mt-4 text-xs opacity-80"> {{ questionsPreview }} </pre>
        </div>
    </div>

</template>

<style lang="css">
/* FilePond customization to match your #7367F0 theme */
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

.filepond--label-action {
    text-decoration-color: #7367F0;
}
</style>