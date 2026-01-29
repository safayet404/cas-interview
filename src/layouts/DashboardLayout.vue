<template>
    <div class="grid grid-cols-5 h-screen overflow-hidden">

        <aside class="col-span-1 border-r bg-[#0D172A] border-slate-800 p-6 overflow-y-auto custom-scrollbar">
            <slot name="sidebar"></slot>
        </aside>

        <main class="col-span-4 bg-[#010617] p-12 overflow-y-auto">
            <slot name="content"></slot>
        </main>

    </div>
</template>

<style lang="css">
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 10px;
}
</style>