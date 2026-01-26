<template>
    <div class="grid grid-cols-4 min-h-screen ">
        <aside class="col-span-1 border-r bg-[#0D172A] border-slate-800 p-6">
            <slot name="sidebar"></slot>
        </aside>

        <main class="col-span-3 bg-[#010617] p-12">
            <slot name="content"></slot>
        </main>
    </div>
</template>