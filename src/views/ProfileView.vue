<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const router = useRouter();
const userStore = useUserStore();

const fullName = ref("");
const email = ref("");
const username = ref("");
const previewImage = ref("");
const selectedMythology = ref("");

const mythologyInputFocused = ref(false);
const mythologyInput = ref(null);
const mythologiesDropdown = ref(null);

const mythologies = [
    { name: "Egyptian", color: "text-orange-600" },
    { name: "Greek", color: "text-red-600" },
    { name: "Norse", color: "text-blue-600" },
    { name: "Hindu", color: "text-yellow-700" },
    { name: "Chinese", color: "text-gray-600" },
    { name: "Mayan", color: "text-green-600" },
];

const selectedMythologyObj = computed(() =>
    mythologies.find((m) => m.name === selectedMythology.value),
);

const goToSettings = () => {
    router.push("/settings");
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

async function saveChanges() {
    try {
        await userStore.updateProfile({
            fullName: fullName.value,
            email: email.value,
            profileImage: previewImage.value,
            selectedMythology: selectedMythology.value,
        });

        goToSettings();
    } catch (error) {
        console.error("Update failed:", error);
    }
}

const hasChanges = computed(() => {
    return (
        fullName.value !== userStore.fullName ||
        email.value !== userStore.email ||
        previewImage.value !== userStore.profileImage ||
        selectedMythology.value !== userStore.selectedMythology
    );
});

const handleClickOutside = (event) => {
    if (
        mythologyInput.value &&
        mythologiesDropdown.value &&
        !mythologyInput.value.contains(event.target) &&
        !mythologiesDropdown.value.contains(event.target)
    ) {
        mythologyInputFocused.value = false;
    }
};

onMounted(async () => {
    if (!userStore.isLoggedIn) {
        router.push("/");
    }

    document.addEventListener("click", handleClickOutside);

    fullName.value = userStore.fullName;
    email.value = userStore.email;
    username.value = userStore.username;
    previewImage.value = userStore.profileImage;
    selectedMythology.value = userStore.selectedMythology;
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700 flex justify-end items-center px-6">
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

                <div class="flex gap-x-8">
                    <img src="/icons/greek-temple.svg" class="h-28 mr-24" />
                    <img src="/icons/pyramid.svg" class="h-28" />
                </div>
            </div>

            <div class="flex-1 flex flex-col items-center relative pt-12">
                <div class="w-full max-w-md px-4 space-y-3">
                    <h2 class="text-2xl font-bold font-sans text-center mb-2">Profile</h2>

                    <div class="flex justify-center py-2">
                        <div class="relative w-32 h-32">
                            <div
                                class="w-full h-full border-2 border-gray-400 rounded-full flex items-center justify-center overflow-hidden"
                            >
                                <img :src="previewImage || '/icons/user.svg'" class="w-full h-full object-cover" />
                            </div>

                            <label
                                class="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-12 h-12 border-2
                                border-gray-400 rounded-full flex items-center justify-center bg-white cursor-pointer"
                            >
                                <img src="/icons/camera.svg" class="w-6 h-6" />
                                <input type="file" accept="image/*" @change="onFileChange" class="hidden" />
                            </label>
                        </div>
                    </div>

                    <input
                        v-model="fullName"
                        type="text"
                        placeholder="Full Name"
                        class="w-full border border-gray-400 rounded px-3 py-2 font-sans"
                    />
                    <input
                        v-model="email"
                        type="email"
                        placeholder="Email"
                        class="w-full border border-gray-400 rounded px-3 py-2 font-sans"
                    />
                    <input
                        v-model="username"
                        type="text"
                        readonly
                        class="w-full border border-gray-300 bg-gray-100 text-gray-500 rounded px-3 py-2 font-sans"
                    />

                    <div class="relative w-full">
                        <img src="/icons/select.svg" class="w-5 h-5 absolute left-3 top-3" />
                        <input
                            ref="mythologyInput"
                            @focus="mythologyInputFocused = true"
                            type="text"
                            v-model="selectedMythology"
                            placeholder="Select preferred mythology..."
                            :class="[
                                'w-full pl-10 border border-gray-400 rounded px-4 py-2 font-sans font-bold',
                                selectedMythologyObj?.color,
                            ]"
                        />
                        <div
                            ref="mythologiesDropdown"
                            v-if="mythologyInputFocused"
                            class="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow p-2 space-y-2 z-10"
                        >
                            <div
                                v-for="(myth, index) in mythologies"
                                :key="index"
                                @click="selectedMythology = myth.name; mythologyInputFocused = false;"
                                :class="['cursor-pointer hover:underline font-sans text-base font-bold', myth.color]"
                            >
                                {{ myth.name }}
                            </div>
                        </div>
                    </div>

                    <button
                        @click="saveChanges"
                        :disabled="!hasChanges"
                        class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold font-sans w-full"
                    >
                        Save Changes
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
* {
    font-family: sans-serif;
}
</style>
