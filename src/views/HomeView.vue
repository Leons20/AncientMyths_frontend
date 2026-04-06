<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const userStore = useUserStore();
const router = useRouter();

const continueAsGuest = () => {
    userStore.continueAsGuest();
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

            <div class="flex-1 flex flex-col items-center justify-center space-y-4">
                <button
                    class="w-64 bg-orange-600 hover:bg-orange-700 text-white font-bold font-sans py-2 rounded"
                    @click="router.push('/signup')"
                >
                    Sign Up
                </button>

                <button
                    class="w-64 bg-orange-600 hover:bg-orange-700 text-white font-bold font-sans py-2 rounded"
                    @click="router.push('/signin')"
                >
                    Sign In
                </button>

                <button
                    class="w-64 bg-gray-700 hover:bg-gray-800 text-white font-bold font-sans py-2 rounded"
                    @click="continueAsGuest"
                >
                    Continue as Guest
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
