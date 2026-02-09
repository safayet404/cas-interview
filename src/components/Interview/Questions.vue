<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { CheckCircle2, Square, Video, Loader2 } from 'lucide-vue-next';
import { useQuestionStore } from '@/stores/questions';
import { useRouter } from 'vue-router'; // Import router
import { useInterviewStore } from '@/stores/interview';
const qs = useQuestionStore();

// --- State Management ---
const interviewStarted = ref(false);
const currentQuestionIndex = ref(0);
const isPreparing = ref(false);
const isRecording = ref(false);
const isUploading = ref(false);
const prepTimer = ref(0);
const recordingTimer = ref(0);
const router = useRouter(); // Initialize router
// Media Refs
const videoElement = ref(null);
const stream = ref(null);
let mediaRecorder = null;
let recordedChunks = [];
let timerInterval = null;

const questions = computed(() => qs.questions || []);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const interview = useInterviewStore()
onMounted(async () => {
    const data = await qs.fetchQuestionByInterview();



    // RESUME LOGIC: Find the first question that isn't 'uploaded'
    const firstPending = data.findIndex(q => q.status === 'pending');
    if (firstPending !== -1) {
        currentQuestionIndex.value = firstPending;
    }

    await setupCamera();
});

const setupCamera = async () => {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true
        });
        if (videoElement.value) {
            videoElement.value.srcObject = stream.value;
        }
    } catch (err) {
        console.error("Camera access denied:", err);
    }
};

const stopMediaTracks = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => {
            track.stop();
            console.log(`${track.kind} track stopped`);
        });
        stream.value = null;
    }
};

const finishInterview = () => {
    stopMediaTracks(); // Stop Camera/Mic
    interviewStarted.value = false;
    interview.done()

    // Redirect to dashboard
    router.push('/dashboard');

};

const startInterviewFlow = () => {
    if (!questions.value.length) return;
    interviewStarted.value = true;
    startPreparation();
};

const startPreparation = () => {
    if (!currentQuestion.value) return;
    isPreparing.value = true;
    isRecording.value = false;
    prepTimer.value = currentQuestion.value.prep_seconds;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (prepTimer.value > 0) prepTimer.value--;
        else startRecording();
    }, 1000);
};

const startRecording = () => {
    clearInterval(timerInterval);
    isPreparing.value = false;
    isRecording.value = true;
    recordingTimer.value = currentQuestion.value.answer_seconds;
    recordedChunks = [];

    // Initialize MediaRecorder
    mediaRecorder = new MediaRecorder(stream.value, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };

    // Automatic upload when recording stops
    mediaRecorder.onstop = handleUpload;

    mediaRecorder.start(1000);

    timerInterval = setInterval(() => {
        if (recordingTimer.value > 0) recordingTimer.value--;
        else stopRecording();
    }, 1000);
};

const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    clearInterval(timerInterval);
    isRecording.value = false;
};

const handleUpload = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    isUploading.value = true;

    try {
        await qs.uploadVideo(currentQuestion.value.id, blob);

        // Move to next question or finish
        if (currentQuestionIndex.value < questions.value.length - 1) {
            currentQuestionIndex.value++;
            startPreparation();
        } else {
            interviewStarted.value = false;
            await interview.done()
            router.push('/dashboard');
        }
    } catch (err) {
        alert("Upload failed. Check internet and try this question again.");
    } finally {
        isUploading.value = false;
    }
};

onUnmounted(() => {
    if (stream.value) stream.value.getTracks().forEach(t => t.stop());
    clearInterval(timerInterval);
});
</script>

<template>
    <div class="grid grid-cols-10 h-screen overflow-hidden bg-white font-sans">

        <div class="col-span-3 p-12 border-r bg-slate-50/50 flex flex-col justify-center">
            <h3 class="text-xl font-bold mb-8 text-slate-800">Progress</h3>

            <div v-if="qs.loading" class="flex justify-center">
                <Loader2 class="animate-spin text-blue-600" />
            </div>

            <div v-else class="space-y-4">
                <div v-for="(q, index) in questions" :key="q.id"
                    class="flex items-center gap-4 p-4 rounded-xl border transition-all"
                    :class="index === currentQuestionIndex ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent'">

                    <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                        <CheckCircle2 v-if="q.status === 'uploaded'" class="text-emerald-500" :size="20" />
                        <span v-else :class="index === currentQuestionIndex ? 'text-blue-600' : 'text-slate-400'">{{
                            index + 1 }}</span>
                    </div>

                    <div>
                        <p class="text-sm font-bold text-slate-800">Question {{ index + 1 }}</p>
                        <p class="text-xs capitalize"
                            :class="q.status === 'uploaded' ? 'text-emerald-500' : 'text-slate-400'">
                            {{ q.status }}
                        </p>
                    </div>
                </div>

                <button v-if="!interviewStarted && questions.length > 0" @click="startInterviewFlow"
                    class="w-full mt-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 uppercase">
                    {{ currentQuestionIndex > 0 ? 'Resume Interview' : 'Start Interview' }}
                </button>
            </div>
        </div>

        <div class="col-span-7 bg-[#0047FF] relative flex items-center justify-center p-16">
            <div
                class="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-blue-400/30 shadow-2xl">

                <video ref="videoElement" autoplay playsinline class="w-full h-full object-cover"></video>

                <div v-if="isRecording"
                    class="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-2 rounded-full flex items-center gap-3 text-white border border-white/10">
                    <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                    <span class="font-mono font-bold">REC: 00:{{ recordingTimer.toString().padStart(2, '0') }}</span>
                </div>

                <div v-if="isRecording" class="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <button @click="stopRecording"
                        class="bg-red-500 text-white px-10 py-3 rounded-full flex items-center gap-3 font-bold uppercase text-xs tracking-widest shadow-lg">
                        <Square :size="16" fill="currentColor" /> Stop Recording
                    </button>
                </div>

                <div v-if="isPreparing"
                    class="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-10">
                    <p class="text-blue-600 font-bold mb-2 uppercase tracking-tighter">Preparation</p>
                    <h2 class="text-2xl font-bold text-slate-800 mb-8 max-w-md">{{ currentQuestion?.question_text }}
                    </h2>
                    <div class="w-24 h-24 rounded-full border-4 border-blue-600 flex items-center justify-center mb-8">
                        <span class="text-3xl font-bold text-blue-600">{{ prepTimer }}s</span>
                    </div>
                    <button @click="startRecording"
                        class="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-xl">Start
                        Now</button>
                </div>

                <div v-if="isUploading"
                    class="absolute inset-0 bg-blue-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-white text-center p-10">
                    <Loader2 class="animate-spin w-16 h-16 mb-6 text-blue-300" />
                    <h3 class="text-2xl font-bold mb-2">Saving Response...</h3>
                    <p class="text-blue-200">Please wait while we securely upload your video.</p>
                </div>
            </div>
        </div>
    </div>
</template>