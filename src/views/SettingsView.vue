<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const router = useRouter();
const userStore = useUserStore();

const displayName = computed(() => {
    if (userStore.isAdmin) return "Admin";
    return userStore.username ? userStore.username : "User";
});

const logout = () => {
    userStore.logout();
    router.push("/");
};

const goToProfile = () => {
    router.push("/profile");
};

const goBackToMain = () => {
    router.push("/main");
};

onMounted(() => {
    if (!userStore.isLoggedIn) {
        router.push("/");
    }
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700 flex justify-end items-center px-6">
            <div class="cursor-pointer" @click="goBackToMain">
                <div class="p-2 rounded-full bg-green-600">
                    <img src="/icons/settings.svg" class="h-16 w-16 filter invert" />
                </div>
            </div>
        </div>

        <div class="relative flex-1 overflow-auto pb-10">
            <div class="absolute top-10 w-full flex justify-between items-center px-6">
                <div class="flex gap-x-8">
                    <img src="/icons/spartan.svg" class="h-28" />
                    <img src="/icons/temple.svg" class="h-28 ml-24" />
                </div>

                <h1 class="text-5xl text-orange-600 font-[Uncial Antiqua] text-center">
                    AncientMyths
                </h1>

                <div class="flex gap-x-8">
                    <img src="/icons/greek-temple.svg" class="h-28 mr-24" />
                    <img src="/icons/pyramid.svg" class="h-28" />
                </div>
            </div>

            <div class="mt-48 flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto">
                <h2 class="text-3xl text-center font-sans font-bold">Welcome {{ displayName }}!</h2>

                <div class="w-full space-y-2">
                    <h3 class="text-sm text-gray-700 font-bold">Account</h3>
                    <button
                        @click="goToProfile"
                        class="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2
                        rounded font-sans font-bold w-full text-left flex items-center gap-2"
                    >
                        <img src="/icons/user.svg" class="w-5 h-5" />
                        Edit Profile
                    </button>
                </div>

                <div class="w-full space-y-2">
                    <h3 class="text-sm text-gray-700 font-bold">Actions</h3>
                    <button
                        v-if="userStore.isAdmin"
                        @click="router.push('/manage-accounts')"
                        class="bg-gray-100 hover:bg-gray-200 text-black px-1 py-2
                        rounded font-sans font-bold w-full text-left flex items-center"
                    >
                        <img src="/icons/users.svg" class="w-10 h-10" />
                        Manage Accounts
                    </button>

                    <button
                        v-if="userStore.isAdmin"
                        @click="router.push('/dashboard')"
                        class="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2
                        rounded font-sans font-bold w-full text-left flex items-center gap-2"
                    >
                        <img src="/icons/dashboard.svg" class="w-5 h-5" />
                        Dashboard
                    </button>

                    <button
                        @click="logout"
                        class="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2
                        rounded font-sans font-bold w-full text-left flex items-center gap-2"
                    >
                        <img src="/icons/logout.svg" class="w-5 h-5" />
                        Log Out
                    </button>
                </div>
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
h3 {
    font-family: sans-serif;
}
</style>
