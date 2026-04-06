<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";
import userService from "@/services/userService.js";

const router = useRouter();
const userStore = useUserStore();

const stats = ref(null);
const loading = ref(true);

const goToSettings = () => {
    router.push("/settings");
};

onMounted(async () => {
    if (!userStore.isAdmin) {
        router.push("/");
        return;
    }

    try {
        const res = await userService.getStats();
        stats.value = res.data;
    } catch (err) {
        console.error("Error fetching stats:", err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div class="h-24 bg-orange-600 text-white px-6 py-4 flex justify-between items-center border-b-4 border-orange-700">
            <h2 class="text-2xl font-bold">Admin Dashboard</h2>
            <div class="cursor-pointer p-2" @click="goToSettings">
                <img src="/icons/settings.svg" class="h-16 w-16 filter invert" />
            </div>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center relative">

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

            <div class="z-10">
                <div v-if="loading" class="text-xl font-bold">Loading...</div>

                <div
                    v-else-if="stats"
                    class="bg-gray-100 p-6 rounded shadow w-full max-w-md space-y-4 border-2 border-orange-600"
                >
                    <h2 class="text-xl font-bold text-center text-orange-600">
                        Statistics
                    </h2>

                    <div class="flex justify-between">
                        <span>Total Users:</span>
                        <span class="font-bold">{{ stats.totalUsers }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span>Total Myths:</span>
                        <span class="font-bold">{{ stats.totalMyths }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span>Total Reviews:</span>
                        <span class="font-bold">{{ stats.totalReviews }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span>Favorites Count:</span>
                        <span class="font-bold">{{ stats.totalFavorites }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span>Average Rating:</span>
                        <span class="font-bold">
                            {{ stats.avgRating?.toFixed(2) || "0.00" }}
                        </span>
                    </div>
                </div>

                <div v-else class="text-red-600 font-bold">
                    Failed to load statistics.
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
* {
    font-family: sans-serif;
}
</style>
