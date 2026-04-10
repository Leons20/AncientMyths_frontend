<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";
import { useMythStore } from "@/stores/mythStore.js";
import { useReviewStore } from "@/stores/reviewStore.js";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const mythStore = useMythStore();
const reviewStore = useReviewStore();

const currentMyth = ref(null);
const reviewText = ref("");

const mythId = route.params.id;

const mythology = computed(() => currentMyth.value?.mythology?.toLowerCase() || "egyptian");

const mythologyTitle = computed(
    () => mythology.value.charAt(0).toUpperCase() + mythology.value.slice(1),
);

const colors = {
    egyptian: { bg: "bg-orange-600", border: "border-orange-700", hover: "hover:bg-orange-700" },
    greek: { bg: "bg-red-600", border: "border-red-700", hover: "hover:bg-red-700" },
    norse: { bg: "bg-blue-600", border: "border-blue-700", hover: "hover:bg-blue-700" },
    hindu: { bg: "bg-yellow-700", border: "border-yellow-800", hover: "hover:bg-yellow-800" },
    chinese: { bg: "bg-gray-500", border: "border-gray-600", hover: "hover:bg-gray-600" },
    mayan: { bg: "bg-green-600", border: "border-green-700", hover: "hover:bg-green-700" },
};

const selectedColors = computed(() => colors[mythology.value] || colors.egyptian);

const goBackToMyth = () => {
    if (!currentMyth.value) return;

    router.push(`/myths/${currentMyth.value.mythology.toLowerCase()}/${currentMyth.value._id}`);
};

const postReview = async () => {
    if (!reviewText.value.trim()) return;

    try {
        await reviewStore.addReview({
            mythId,
            text: reviewText.value,
        });

        reviewText.value = "";
        goBackToMyth();
    } catch (error) {
        console.error("Failed to post review:", error);
        alert("Failed to post review. Please try again.");
    }
};

onMounted(async () => {
    if (!userStore.isLoggedIn || !mythId) {
        router.push("/");
        return;
    }

    await mythStore.fetchMyth(mythId);
    currentMyth.value = mythStore.selectedMyth;
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div :class="['h-24 text-white px-6 py-4 flex justify-between items-center border-b-4', selectedColors.bg, selectedColors.border]">
            <h1 class="text-2xl font-bold">{{ mythologyTitle }} myths</h1>
            <button @click="goBackToMyth" class="flex items-center space-x-2 font-semibold">
                <img src="/icons/back.svg" class="w-10 h-10 filter invert" />
                <span class="text-xl">Back to Myth</span>
            </button>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center relative">

            <div class="absolute top-10 w-full flex justify-between items-center px-6">
                <div class="flex gap-x-8">
                    <img src="/icons/spartan.svg" class="h-28" />
                    <img src="/icons/temple.svg" class="h-28 ml-24" />
                </div>

                <div class="flex gap-x-8">
                    <img src="/icons/greek-temple.svg" class="h-28 mr-24" />
                    <img src="/icons/pyramid.svg" class="h-28" />
                </div>
            </div>

            <div class="text-center mt-20">
                <h2 class="text-3xl font-bold mb-8">{{ currentMyth?.title }}</h2>
            </div>

            <div class="flex-1 flex flex-col justify-center items-center px-6 text-center">
                <div class="max-w-lg w-full">
                    <textarea
                        v-model="reviewText"
                        placeholder="Write your review..."
                        :class="['w-full rounded p-3 text-lg mb-6 resize-none border-2', selectedColors.border]"
                        rows="7"
                    ></textarea>

                    <button
                        @click="postReview"
                        :class="['text-white px-6 py-2 rounded font-semibold', selectedColors.bg, selectedColors.hover]"
                    >
                        Post Review
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

        <div :class="['h-24 border-t-4', selectedColors.bg, selectedColors.border]"></div>
    </div>
</template>

<style scoped>
* {
    font-family: sans-serif;
}
</style>
