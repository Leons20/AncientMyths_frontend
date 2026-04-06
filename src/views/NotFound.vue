<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const router = useRouter();
const userStore = useUserStore();

const hasAuth = computed(() => {
    return userStore.isLoggedIn || localStorage.getItem("token");
});

const goHome = () => {
    router.push("/");
};

const goToMain = () => {
    router.push("/main");
};
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

            <div class="flex flex-col items-center text-center space-y-4">
                <p class="text-2xl font-sans text-gray-700">The page you are looking for does not exist.</p>

                <button
                    v-if="!hasAuth"
                    class="w-64 bg-orange-600 hover:bg-orange-700 text-white font-bold font-sans py-2 rounded"
                    @click="goHome"
                >
                    Go to Home
                </button>

                <button
                    v-else
                    class="w-64 bg-orange-600 hover:bg-orange-700 text-white font-bold font-sans py-2 rounded"
                    @click="goToMain"
                >
                    Go to Main
                </button>
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
</style>
