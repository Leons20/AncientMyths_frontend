<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const fullName = ref("");
const email = ref("");
const username = ref("");
const password = ref("");

const successMessage = ref("");
const errorMessages = ref([]);

const router = useRouter();
const userStore = useUserStore();

const isFormValid = computed(() => {
    return fullName.value && email.value && username.value && password.value;
});

async function createAccount() {
    errorMessages.value = [];

    if (!email.value.includes("@")) {
        errorMessages.value.push("Invalid email address.");
    }

    if (password.value.length < 6) {
        errorMessages.value.push("Password should be at least 6 characters.");
    }

    if (errorMessages.value.length > 0) return;

    try {
        await userStore.register({
            fullName: fullName.value,
            email: email.value,
            username: username.value,
            password: password.value,
        });

        successMessage.value = "Account successfully created";

        setTimeout(() => {
            router.push("/main");
        }, 1500);
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            errorMessages.value.push(error.response.data.message);
        } else {
            errorMessages.value.push("Registration failed.");
        }
    }
}
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700"></div>

        <div class="flex-1 flex items-center justify-center relative overflow-hidden">
            <div class="absolute top-10 w-full flex justify-between items-center px-6">
                <div class="flex gap-x-8">
                    <img src="/icons/spartan.svg" class="h-28" />
                    <img src="/icons/temple.svg" class="h-28 ml-24" />
                </div>

                <h1 class="text-5xl text-orange-600 font-[Uncial Antiqua] text-center">AncientMyths</h1>

                <div class="flex gap-x-8">
                    <img src="/icons/greek-temple.svg" class="h-28 mr-24" />
                    <img src="/icons/pyramid.svg" class="h-28" />
                </div>
            </div>

            <div class="w-full max-w-xs flex flex-col items-center space-y-3">
                <input
                    v-model="fullName"
                    type="text"
                    placeholder="Full Name"
                    class="w-full border border-gray-400 rounded px-3 py-2"
                />
                <input
                    v-model="email"
                    type="email"
                    placeholder="Email"
                    class="w-full border border-gray-400 rounded px-3 py-2"
                />
                <input
                    v-model="username"
                    type="text"
                    placeholder="Username"
                    class="w-full border border-gray-400 rounded px-3 py-2"
                />
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    class="w-full border border-gray-400 rounded px-3 py-2"
                />

                <button
                    @click="createAccount"
                    :disabled="!isFormValid"
                    :class="[
                        'w-full text-white font-bold font-sans py-2 rounded',
                        isFormValid ? 'bg-orange-600 hover:bg-orange-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed',
                    ]"
                >
                    Create Account
                </button>

                <div v-if="errorMessages.length" class="mt-4 text-red-600 font-bold flex flex-col items-center space-y-1">
                    <p v-for="(msg, index) in errorMessages" :key="index" class="error-message text-center">{{ msg }}</p>
                </div>

                <p v-if="successMessage" class="success-message text-green-600 font-bold mt-4">{{ successMessage }}</p>
            </div>

            <div class="absolute bottom-8 w-full flex justify-between items-center px-6">
                <div class="flex gap-x-8">
                    <img src="/icons/buddha.svg" class="h-28" />
                    <img src="/icons/hieroglyph.svg" class="h-28 ml-24" />
                </div>

                <div class="flex gap-x-8">
                    <img src="/icons/vase.svg" class="h-28 mr-24" />
                    <img src="/icons/sphinx.svg" class="h-28" />
                </div>
            </div>
        </div>

        <div class="h-24 bg-orange-600 border-t-4 border-orange-700"></div>
    </div>
</template>

<style scoped>
h1 {
    font-family: "Uncial Antiqua", serif;
}
input,
.success-message,
.error-message {
    font-family: sans-serif;
}
</style>
