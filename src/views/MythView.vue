<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";
import { useMythStore } from "@/stores/mythStore.js";
import { useReviewStore } from "@/stores/reviewStore.js";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const mythStore = useMythStore();
const reviewStore = useReviewStore();

const mythologyKey = computed(() => {
    if (!route.params.mythology) return "Egyptian";

    return route.params.mythology.charAt(0).toUpperCase() + route.params.mythology.slice(1);
});

const mythsArray = computed(() => mythStore.myths);

const currentMyth = ref(null);
const selectedRating = ref(0);

const colors = {
    egyptian: { bg: "bg-orange-600", border: "border-orange-700", hover: "hover:bg-orange-700" },
    greek: { bg: "bg-red-600", border: "border-red-700", hover: "hover:bg-red-700" },
    norse: { bg: "bg-blue-600", border: "border-blue-700", hover: "hover:bg-blue-700" },
    hindu: { bg: "bg-yellow-700", border: "border-yellow-800", hover: "hover:bg-yellow-800" },
    chinese: { bg: "bg-gray-500", border: "border-gray-600", hover: "hover:bg-gray-600" },
    mayan: { bg: "bg-green-600", border: "border-green-700", hover: "hover:bg-green-700" },
};

const selectedColors = computed(() => colors[mythologyKey.value.toLowerCase()] || colors.egyptian);

const isDefaultMyth = computed(() => currentMyth.value?.isDefault === true);

const isFavorite = computed(() => {
    if (!currentMyth.value) return false;

    return userStore.favorites.some((f) => f._id.toString() === currentMyth.value._id.toString());
});

watch(
    () => route.params,
    async () => {
        await mythStore.fetchMyths({
            mythology: mythologyKey.value,
        });

        if (!mythsArray.value.length) {
            currentMyth.value = null;
            return;
        }

        const decodedTitle = route.params.title
            ? decodeURIComponent(route.params.title).trim().toLowerCase()
            : null;

        currentMyth.value = decodedTitle
            ? mythsArray.value.find((m) => m.title.trim().toLowerCase() === decodedTitle)
            : mythsArray.value[0];

        if (currentMyth.value) {
            await reviewStore.fetchReviews(currentMyth.value._id);

            const userId = userStore.getCurrentUserId();

            const userRating = currentMyth.value.ratings?.find(
                (r) => r.userId.toString() === userId,
            );

            selectedRating.value = userRating ? userRating.value : 0;
        }
    },
    { immediate: true },
);

const goBackToMain = () => {
    router.push("/main");
};

const goToReview = () => {
    if (!currentMyth.value) return;

    router.push({
        path: "/review",
        query: {
            mythId: currentMyth.value._id,
            mythology: mythologyKey.value,
            myth: currentMyth.value.title,
        },
    });
};

const deleteMyth = async () => {
    if (!currentMyth.value) return;

    if (!confirm("Are you sure you want to delete this myth?")) return;

    await mythStore.deleteMyth(currentMyth.value._id);

    currentMyth.value = null;
    reviewStore.reviews = [];

    router.push("/main");
};

const rate = async (value) => {
    if (!currentMyth.value) return;

    selectedRating.value = value;

    await mythStore.rateMyth(currentMyth.value._id, value);

    const userId = userStore.getCurrentUserId();

    if (!currentMyth.value.ratings) {
        currentMyth.value.ratings = [];
    }

    const existing = currentMyth.value.ratings.find(
        (r) => r.userId.toString() === userId.toString(),
    );

    if (existing) {
        existing.value = value;
    } else {
        currentMyth.value.ratings.push({
            userId: userId,
            value: value,
        });
    }
};

const toggleFavorite = async () => {
    if (!currentMyth.value) return;

    if (isFavorite.value) {
        await userStore.removeFavorite(currentMyth.value._id);
        await userStore.fetchFavorites();
    } else {
        await userStore.addFavorite(currentMyth.value._id);
        await userStore.fetchFavorites();
    }
};

onMounted(async () => {
    if (userStore.isLoggedIn) {
        await userStore.fetchFavorites();
    }
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="h-screen flex flex-col bg-white">
        <div :class="['h-24 text-white px-6 py-4 flex justify-between items-center border-b-4', selectedColors.bg, selectedColors.border]">
            <h1 class="text-2xl font-bold">{{ mythologyKey }} myths</h1>

            <button @click="goBackToMain" class="flex items-center space-x-2 font-semibold">
                <img src="/icons/back.svg" class="w-10 h-10 filter invert" />
                <span class="text-xl">Back to Main</span>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6 text-center">
            <div class="max-w-3xl mx-auto">

                <div v-if="currentMyth">
                    <div class="flex items-center justify-center mb-4 relative">
                        <img :src="currentMyth.image" class="w-lg h-96 object-cover rounded shadow-lg absolute -left-137.5 top-0" />
                        <h2 class="text-3xl font-bold">{{ currentMyth.title }}</h2>

                        <span
                            v-if="userStore.isLoggedIn"
                            @click="toggleFavorite"
                            class="absolute right-0 cursor-pointer text-3xl"
                            :class="isFavorite ? 'text-pink-600' : 'text-gray-400'"
                        >
                            ♥
                        </span>
                    </div>

                    <p class="text-xl font-semibold mb-4">{{ currentMyth.mythText }}</p>

                    <a
                        :href="currentMyth.link"
                        target="_blank"
                        :class="[selectedColors.bg.replace('bg', 'text'), 'underline font-semibold mb-6 inline-block']"
                    >
                        Read more...
                    </a>

                    <h3 class="text-2xl font-bold mb-2">Interpretation</h3>
                    <p class="text-xl font-semibold mb-6">{{ currentMyth.interpretation }}</p>

                    <div v-if="userStore.isLoggedIn" class="mt-6">
                        <h3 class="text-xl font-bold mb-2">Rate this myth</h3>

                        <div class="flex justify-center gap-2">
                            <span
                                v-for="star in 5"
                                :key="star"
                                @click="rate(star)"
                                class="cursor-pointer text-3xl"
                                :class="star <= selectedRating ? 'text-yellow-400' : 'text-gray-400'"
                            >
                                ★
                            </span>
                        </div>
                    </div>

                    <div class="flex justify-center gap-4 mt-4">
                        <button
                            v-if="userStore.isLoggedIn"
                            @click="goToReview"
                            :class="[selectedColors.bg, selectedColors.hover, 'text-white px-6 py-2 rounded font-semibold']"
                        >
                            Write a Review
                        </button>

                        <button
                            v-if="userStore.isAdmin && !isDefaultMyth"
                            @click="deleteMyth"
                            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
                        >
                            Delete Myth
                        </button>

                        <button
                            v-if="userStore.isAdmin"
                            @click="router.push(`/edit-myth/${currentMyth._id}`)"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                        >
                            Edit Myth
                        </button>
                    </div>
                </div>

                <div v-else class="text-3xl font-bold mt-10" :class="selectedColors.bg.replace('bg', 'text')">
                    Myth not found.
                </div>
            </div>
        </div>

        <div class="flex-[0_0_20%] overflow-y-auto border-t border-gray-300 px-6 py-4">
            <h3 class="text-xl font-bold mb-3">Reviews</h3>

            <div v-if="reviewStore.loading" class="text-gray-500 italic">
                Loading reviews...
            </div>

            <div v-else-if="reviewStore.reviews.length" class="space-y-4">
                <div
                    v-for="review in reviewStore.reviews"
                    :key="review._id"
                    class="flex items-start gap-3 bg-gray-100 p-3 rounded shadow"
                >
                    <button
                        v-if="userStore.isAdmin"
                        @click="reviewStore.deleteReview(review._id, currentMyth._id)"
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
                    >
                        Delete
                    </button>

                    <div class="flex-1">
                        <div class="flex items-center mb-2 text-gray-700">
                            <img :src="review.profileImage || '/icons/user.svg'" class="w-6 h-6 rounded-full mr-2 object-cover" />
                            <span class="font-semibold">{{ review.username }}</span>
                            <span class="mx-1">•</span>
                            <span class="text-sm text-gray-500 font-semibold">{{ review.date }}</span>
                        </div>

                        <p class="text-lg font-semibold">{{ review.text }}</p>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No reviews yet.</div>
        </div>

        <div :class="['h-24 border-t-4', selectedColors.bg, selectedColors.border]"></div>
    </div>
</template>

<style scoped>
* {
    font-family: sans-serif;
}
</style>
