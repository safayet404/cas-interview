<script setup>

import { onMounted, ref, watch } from 'vue';

import { useStudentStore } from '@/stores/student';
import { storeToRefs } from 'pinia';
import { Check, CheckCheck, Cross, Eye, X } from 'lucide-vue-next';
import { CanceledError } from 'axios';

const store = useStudentStore()
const { students, pagination, isFetching } = storeToRefs(store)
const { fetchStudents } = store
const headers = [
    { text: 'ID', value: 'id', sortable: true },
    { text: 'NAME', value: 'full_name', sortable: true },
    { text: 'email', value: 'email' },
    { text: 'INSTITUTION', value: 'institution' },
    { text: 'Profile', value: 'profile' },
    { text: 'ACTIONS', value: 'operation', width: 250 },
];

const serverOptions = ref({
    page: 1,
    rowsPerPage: 10,
});

watch(serverOptions, (value) => {
    fetchStudents(value.page, value.rowsPerPage);
}, { deep: true });

onMounted(async () => {
    await fetchStudents(serverOptions.value.page, serverOptions.value.rowsPerPage);
});
</script>

<template>
    <div class="min-h-screen bg-[#F8F7FA]">

        <Head title="Student Records" />

        <div class="p-4 ">
            <EasyDataTable v-model:server-options="serverOptions" :server-items-length="pagination.total"
                :loading="isFetching" :headers="headers" :items="students" buttons-pagination
                table-class-name="customize-table" class="rounded-lg shadow-md">
                <template #item-institution="{ profiles }">
                    {{ profiles[0]?.institution || 'N/A' }}
                </template>
                <template #item-profile="{ profiles }">

                    <CheckCheck v-if="profiles[0]?.profile_id" class="text-green-500 font-bold" />

                    <X v-else class="w-5 h-5 text-red-700 font-bold" />
                </template>

                <template #item-operation="{ profiles }">

                    <Eye />

                </template>

            </EasyDataTable>

        </div>
    </div>
</template>

<style>
.customize-table {
    --easy-table-header-background-color: #8176f1;
    --easy-table-header-font-color: #fff;
    --easy-table-header-height: 70px;
    --easy-table-header-font-size: 15px;
    --easy-table-body: 15px;
    --easy-table-body-row-height: 76px;
    --easy-table-footer-font-color: #7367F0;
    --easy-table-scrollbar-track-color: #2d3a4f;
    --easy-table-scrollbar-color: #2d3a4f;
    --easy-table-scrollbar-thumb-color: #4c5d7a;
    --easy-table-scrollbar-corner-color: #2d3a4f;
}
</style>