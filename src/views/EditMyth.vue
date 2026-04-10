<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useMythStore } from "@/stores/mythStore.js";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const mythStore = useMythStore();

const mythology = ref("");
const title = ref("");
const mythText = ref("");
const interpretation = ref("");
const image = ref("");
const link = ref("");

const errorMessage = ref("");

const colors = {
    egyptian: { bg: "bg-orange-600", border: "border-orange-700", hover: "hover:bg-orange-700" },
    greek: { bg: "bg-red-600", border: "border-red-700", hover: "hover:bg-red-700" },
    norse: { bg: "bg-blue-600", border: "border-blue-700", hover: "hover:bg-blue-700" },
    hindu: { bg: "bg-yellow-700", border: "border-yellow-800", hover: "hover:bg-yellow-800" },
    chinese: { bg: "bg-gray-500", border: "border-gray-600", hover: "hover:bg-gray-600" },
    mayan: { bg: "bg-green-600", border: "border-green-700", hover: "hover:bg-green-700" },
};

const selectedColors = computed(() => colors[mythology.value.toLowerCase()] || colors.egyptian);

const goBackToMyth = () => {
    const id = route.params.id;
    router.push(`/myths/${mythology.value.toLowerCase()}/${id}`);
};

const updateMyth = async () => {
    const id = route.params.id;

    if (!title.value || !mythText.value) {
        errorMessage.value = "Fill all required fields";

        setTimeout(() => {
            errorMessage.value = "";
        }, 3000);
        return;
    }

    const updated = {
        mythology: mythology.value,
        title: title.value,
        mythText: mythText.value,
        interpretation: interpretation.value,
        image: image.value,
        link: link.value,
    };

    try {
        await mythStore.updateMyth(id, updated);
        goBackToMyth();
    } catch (err) {
        console.error(err);
        errorMessage.value = "Update failed";
    }
};

onMounted(async () => {
    if (!userStore.isAdmin) {
        router.push("/");
        return;
    }

    const id = route.params.id;

    if (!id) return;

    await mythStore.fetchMyth(id);

    watch(
        () => mythStore.selectedMyth,
        (myth) => {
            if (!myth) return;

            mythology.value = myth.mythology || "";
            title.value = myth.title || "";
            mythText.value = myth.mythText || "";
            interpretation.value = myth.interpretation || "";
            image.value = myth.image || "";
            link.value = myth.link || "";
        },
        { immediate: true },
    );
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div :class="['h-24 text-white px-6 py-4 flex justify-between items-center border-b-4', selectedColors.bg, selectedColors.border]">
            <h1 class="text-2xl font-bold">Edit Myth</h1>
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

            <div class="flex-1 flex justify-center items-center">
                <div class="max-w-lg w-full">
                    <input v-model="mythology" class="w-full mb-3 p-2 border" placeholder="Mythology" />
                    <input v-model="title" class="w-full mb-3 p-2 border" placeholder="Title" />
                    <textarea v-model="mythText" class="w-full mb-3 p-2 border" placeholder="Text" />
                    <textarea v-model="interpretation" class="w-full mb-3 p-2 border" placeholder="Interpretation" />
                    <input v-model="image" class="w-full mb-3 p-2 border" placeholder="Image URL" />
                    <input v-model="link" class="w-full mb-3 p-2 border" placeholder="Link" />

                    <button
                        @click="updateMyth"
                        :class="['text-white px-6 py-2 rounded font-semibold w-full', selectedColors.bg, selectedColors.hover]"
                    >
                        Save Changes
                    </button>

                    <div v-if="errorMessage" class="text-red-600 font-bold mt-2 text-center">{{ errorMessage }}</div>
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
