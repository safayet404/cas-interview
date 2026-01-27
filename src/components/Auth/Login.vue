<template>
    <section class="bg-[#021133] h-screen flex items-center justify-center font-sans">
        <div class="container mx-auto p-5">
            <div class="bg-white w-full max-w-md mx-auto rounded-3xl p-10 shadow-xl">

                <div class="flex justify-center mb-8">
                    <img class="h-10 w-auto" src="@/assets/SGE-Logo.webp" alt="SGE Logo" />
                </div>

                <div class="space-y-6">
                    <h1 class="text-3xl font-bold text-[#021133]">Log in</h1>

                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-700">Email address</label>
                        <input type="email" v-model="email"
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-700">Password</label>
                        <input type="password" v-model="password"
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    <button @click="handleLogin"
                        class="w-full bg-[#5D9CEC] hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-md mt-2">
                        Log in
                    </button>

                    <div class="text-center mt-4">
                        <a href="#" class="text-blue-600 font-medium hover:underline">Reset password</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter()
const auth = useAuthStore()

const email = ref("")
const password = ref("")
const error = ref("")

const handleLogin = async () => {
    error.value = ""
    try {
        const res = await auth.login(email.value, password.value)

        if (res.data.status === "success") {
            router.push({ name: "dashboard" })
        } else {
            error.value = res.data.message || "login failed"
        }
    } catch (error) {
        error.value = "Invalid credentials";

    }
}

</script>