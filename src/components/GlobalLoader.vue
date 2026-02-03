<template>
    <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-[2px]">
        <div class="relative flex items-center justify-center">
            <div class="h-20 w-20 rounded-full border-4 border-[#7367F0]/20 border-t-[#7367F0] animate-spin"></div>

            <div class="absolute">
                <svg class="w-8 h-8 text-[#7367F0]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
            </div>
        </div>

        <p class="mt-4 text-white font-medium animate-pulse">
            Loading Please wait
        </p>
    </div>
</template>