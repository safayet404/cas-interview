<script setup>
import { useProfileStore } from '@/stores/compliance';
import { storeToRefs } from 'pinia';
import { X, FileText, Download } from 'lucide-vue-next';

const store = useProfileStore();
const { isPreviewOpen, previewUrl, previewType } = storeToRefs(store);
const { closePreview } = store;

const downloadCurrentFile = () => {
    window.open(previewUrl.value, '_blank');
};
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isPreviewOpen" class="fixed inset-0 z-200 flex items-center justify-center p-4 md:p-10">
                <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closePreview"></div>

                <div
                    class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full flex flex-col overflow-hidden animate-in zoom-in duration-300">

                    <div class="flex items-center justify-between px-6 py-4 border-b bg-white">
                        <h3 class="font-bold text-gray-800 flex items-center gap-2">
                            <FileText :size="18" class="text-indigo-600" />
                            Document Preview
                        </h3>
                        <div class="flex items-center gap-2">
                            <button @click="downloadCurrentFile"
                                class="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                title="Download">
                                <Download :size="20" />
                            </button>
                            <button @click="closePreview"
                                class="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X :size="20" />
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 bg-gray-100 overflow-hidden flex items-center justify-center">
                        <img v-if="previewType?.includes('image')" :src="previewUrl"
                            class="max-w-full max-h-full object-contain shadow-lg p-4" />

                        <iframe v-else-if="previewType?.includes('pdf')" :src="`${previewUrl}#view=FitH`"
                            class="w-full h-full rounded-md shadow-lg border-none">
                        </iframe>

                        <iframe v-else-if="previewType?.includes('officedocument')"
                            :src="`https://docs.google.com/gview?url=${previewUrl}&embedded=true`"
                            class="w-full h-full">
                        </iframe>

                        <div v-else class="text-center p-10 bg-white rounded-xl shadow-sm">
                            <p class="text-gray-500 mb-4">Preview not available for this file type.</p>
                            <a :href="previewUrl" target="_blank"
                                class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Download File</a>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>