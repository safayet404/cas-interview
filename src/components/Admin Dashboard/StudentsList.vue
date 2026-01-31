<script setup>

import { onMounted, ref, watch } from 'vue';

import { useStudentStore } from '@/stores/student';
import { storeToRefs } from 'pinia';

const store = useStudentStore()
const { students, pagination, isFetching } = storeToRefs(store)
const { fetchStudents } = store
console.log("state", students.value);
console.log("pagination", pagination.value);

const headers = [
    { text: 'ID', value: 'id', sortable: true },
    { text: 'NAME', value: 'full_name', sortable: true },
    { text: 'PERMISSIONS', value: 'permissions' }, // We will use a slot for this
    { text: 'ACTIONS', value: 'operation', width: 250 },
];

const serverOptions = ref({
    page: 1,
    rowsPerPage: 10,
});

watch(serverOptions, (value) => {
    // When the user changes page OR changes "rows per page", fetch again
    fetchStudents(value.page, value.rowsPerPage);
}, { deep: true });

onMounted(async () => {
    // Initial load using the default server options
    await fetchStudents(serverOptions.value.page, serverOptions.value.rowsPerPage);
});
</script>

<template>
    <div class="min-h-screen bg-[#F8F7FA]">

        <Head title="Student Records" />

        <EasyDataTable v-model:server-options="serverOptions" :server-items-length="pagination.total"
            :loading="isFetching" :headers="headers" :items="students" buttons-pagination
            table-class-name="customize-table" class="rounded-lg shadow-md">
            <template #item-institution="{ profiles }">
                {{ profiles[0]?.institution || 'N/A' }}
            </template>

            <template #item-operation="item">
                <div class="flex items-center gap-2 py-2">
                    <Link :href="`/students/${item.id}`"
                        class="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
                    Show
                    </Link>
                </div>
            </template>
        </EasyDataTable>
    </div>
</template>
