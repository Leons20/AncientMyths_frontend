<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const router = useRouter();
const userStore = useUserStore();

const users = ref([]);
const selectedUser = ref(null);
const successMessage = ref("");

const goToSettings = () => {
    router.push("/settings");
};

const selectUser = (user) => {
    if (user.isCurrent || user.isAdmin) return;

    if (selectedUser.value && selectedUser.value.id === user.id) {
        selectedUser.value = null;
    } else {
        selectedUser.value = user;
    }
};

const refreshUsers = async () => {
    await userStore.fetchAllUsers();

    users.value = userStore.allUsers
        .map((user) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
            isAdmin: user.role === "admin",
            isCurrent: user._id === userStore.getCurrentUserId(),
        }))
        .sort((a, b) => {
            if (a.isAdmin) return -1;
            if (b.isAdmin) return 1;
            return 0;
        });

    if (selectedUser.value && selectedUser.value.isCurrent) {
        selectedUser.value = null;
    }
};

const deleteUser = async () => {
    if (!selectedUser.value) return;

    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
        await userStore.deleteUser(selectedUser.value.id);

        refreshUsers();
        selectedUser.value = null;
        successMessage.value = "Account successfully deleted";

        setTimeout(() => {
            successMessage.value = "";
        }, 2000);
    } catch (err) {
        successMessage.value = "Delete failed";

        setTimeout(() => {
            successMessage.value = "";
        }, 2000);
    }
};

onMounted(async () => {
    if (!userStore.isAdmin) {
        router.push("/");
        return;
    }

    await userStore.fetchAllUsers();

    users.value = userStore.allUsers
        .map((user) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
            isAdmin: user.role === "admin",
            isCurrent: user._id === userStore.getCurrentUserId(),
        }))
        .sort((a, b) => {
            if (a.isAdmin) return -1;
            if (b.isAdmin) return 1;
            return 0;
        });
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <div class="h-24 bg-orange-600 text-white px-6 py-4 flex justify-between items-center border-b-4 border-orange-700">
            <h1 class="text-2xl font-bold">Account Management</h1>
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

            <div class="flex-1 flex flex-col items-center relative pt-20">
                <div class="w-full max-w-md px-4 flex flex-col justify-between h-full">

                    <div class="space-y-3">
                        <h2 class="text-3xl font-bold font-sans text-center mb-30">Accounts</h2>

                        <div class="max-h-40 overflow-y-auto pr-1 space-y-2">
                            <div v-for="user in users" :key="user.id" class="w-full">
                                <input
                                    type="text"
                                    :value="(user.email || user.username) + (user.isCurrent ? ' (you)' : '')"
                                    readonly
                                    :disabled="user.isCurrent || user.isAdmin"
                                    class="w-full border rounded px-3 py-2 font-sans"
                                    :class="{
                                        'cursor-pointer': !user.isCurrent && !user.isAdmin,
                                        'border-red-500 bg-red-200': selectedUser?.email === user.email && !user.isCurrent,
                                        'bg-gray-200 text-gray-500 cursor-not-allowed': user.isCurrent || user.isAdmin
                                    }"
                                    @click="!user.isCurrent && selectUser(user)"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="mt-30 space-y-2">
                        <button
                            @click="deleteUser"
                            :disabled="!selectedUser || selectedUser.isCurrent || selectedUser.isAdmin"
                            :class="[
                                'px-4 py-2 rounded font-bold font-sans w-full',
                                selectedUser && !selectedUser.isCurrent
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-red-400 text-white cursor-not-allowed'
                            ]"
                        >
                            Delete Account
                        </button>

                        <button
                            @click="goToSettings"
                            class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold font-sans w-full"
                        >
                            Back to Settings
                        </button>

                        <p v-if="successMessage" class="success-message text-red-600 flex flex-col items-center font-bold mt-4">
                            {{ successMessage }}
                        </p>
                    </div>

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
