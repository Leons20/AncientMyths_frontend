<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";
import { useMythStore } from "@/stores/mythStore.js";

const router = useRouter();
const userStore = useUserStore();
const mythStore = useMythStore();

const isGuest = computed(() => userStore.isGuest);

const selectedMyth = ref("");
const selectedMythology = ref("");

const searchFocused = ref(false);
const selectFocused = ref(false);
const settingsClicked = ref(false);

const mythInput = ref(null);
const mythDropdown = ref(null);
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

const filteredMyths = computed(() => mythStore.myths);

const selectedMythologyObj = computed(() => {
    return mythologies.find((myth) => myth.name === selectedMythology.value);
});

const displayName = computed(() => {
    if (userStore.isAdmin) {
        return "Admin";
    }

    if (userStore.isGuest) {
        return "Guest";
    }

    if (userStore.username) {
        return userStore.username;
    }

    return "User";
});

const totalPages = computed(() => {
    return Math.ceil(mythStore.total / mythStore.limit);
});

const logout = () => {
    userStore.logout();
    router.push("/");
};

const goToSettings = () => {
    settingsClicked.value = !settingsClicked.value;
    router.push("/settings");
};

const goToMyth = (myth) => {
    router.push(`/myths/${myth.mythology.toLowerCase()}/${myth._id}`);
};

const handleClickOutside = (event) => {
    if (
        mythInput.value &&
        mythDropdown.value &&
        !mythInput.value.contains(event.target) &&
        !mythDropdown.value.contains(event.target)
    ) {
        searchFocused.value = false;
    }

    if (
        mythologyInput.value &&
        mythologiesDropdown.value &&
        !mythologyInput.value.contains(event.target) &&
        !mythologiesDropdown.value.contains(event.target)
    ) {
        selectFocused.value = false;
    }
};

async function fetchPage() {
    await mythStore.fetchMyths({
        search: selectedMyth.value,
        mythology: selectedMythology.value,
    });
}

async function searchMyths() {
    mythStore.page = 1;

    await fetchPage();
}

let debounceTimeout = null;

const handleSearchInput = () => {
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
        searchMyths();
    }, 300);
};

const nextPage = async () => {
    if (mythStore.page >= totalPages.value) return;

    mythStore.page++;
    await fetchPage();
};

const prevPage = async () => {
    if (mythStore.page <= 1) return;

    mythStore.page--;
    await fetchPage();
};

onMounted(async () => {
    document.addEventListener("click", handleClickOutside);

    await userStore.initAuth();

    await mythStore.fetchMyths();
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);

    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700 flex justify-end items-center px-6">
            <div class="cursor-pointer" @click="isGuest ? logout() : goToSettings()">
                <template v-if="isGuest">
                    <span class="text-white text-xl font-bold font-sans">Log Out</span>
                </template>
                <template v-else>
                    <div class="p-2 rounded-full" :class="settingsClicked ? 'bg-green-600' : ''">
                        <img src="/icons/settings.svg" class="h-16 w-16 filter invert" />
                    </div>
                </template>
            </div>
        </div>

        <div class="relative flex-1 overflow-auto pb-10">
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

            <div class="mt-48 flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto">
                <h2 class="text-3xl text-center font-sans font-bold">Welcome {{ displayName }}!</h2>

                <div class="relative w-full">
                    <img src="/icons/select.svg" class="w-5 h-5 absolute left-3 top-3" />
                    <input
                        ref="mythologyInput"
                        v-model="selectedMythology"
                        @focus="selectFocused = true"
                        type="text"
                        placeholder="Select mythology..."
                        :class="[
                            'w-full pl-10 border border-gray-400 rounded px-4 py-2 font-sans font-bold',
                            selectedMythologyObj?.color,
                        ]"
                    />
                    <div
                        ref="mythologiesDropdown"
                        v-if="selectFocused"
                        class="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow p-2 space-y-2 z-10"
                    >
                        <div
                            v-for="(myth, index) in mythologies"
                            :key="index"
                            :class="['text-base font-bold font-sans cursor-pointer hover:underline', myth.color]"
                            @click="
                                selectedMythology = myth.name;
                                selectFocused = false;
                                searchMyths();
                            "
                        >
                            {{ myth.name }}
                        </div>
                    </div>
                </div>

                <div class="relative w-full">
                    <img src="/icons/search.svg" class="w-5 h-5 absolute left-3 top-3" />
                    <input
                        ref="mythInput"
                        v-model="selectedMyth"
                        @focus="searchFocused = true"
                        @input="handleSearchInput"
                        type="text"
                        placeholder="Search for myths..."
                        class="w-full pl-10 border border-gray-400 rounded px-4 py-2 font-sans font-bold"
                    />
                    <div
                        ref="mythDropdown"
                        v-if="searchFocused"
                        class="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow p-2 space-y-2 z-10"
                    >
                        <div
                            v-for="myth in filteredMyths"
                            :key="myth._id"
                            class="text-base font-bold font-sans cursor-pointer hover:underline"
                            @click="
                                selectedMyth = myth.title;
                                searchFocused = false;
                                goToMyth(myth);
                            "
                        >
                            {{ myth.title }}
                            <span class="text-sm text-gray-500" v-if="!selectedMythology">
                                ({{ myth.mythology }})
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="!isGuest" class="w-full">
                    <button
                        @click="router.push('/add-myth')"
                        class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold font-sans w-full"
                    >
                        Add a Myth
                    </button>
                </div>

                <div class="flex justify-center items-center gap-4 mt-4">
                    <button
                        @click="prevPage"
                        :disabled="mythStore.page <= 1"
                        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span class="font-bold">Page {{ mythStore.page }} / {{ totalPages }}</span>

                    <button
                        @click="nextPage"
                        :disabled="mythStore.page >= totalPages"
                        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
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
* {
    font-family: sans-serif;
}
</style>
