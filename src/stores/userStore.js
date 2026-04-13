import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/services/api.js";

export const useUserStore = defineStore("user", () => {
    const fullName = ref("");
    const email = ref("");
    const username = ref("");
    const profileImage = ref("");
    const isLoggedIn = ref(false);
    const isGuest = ref(false);
    const isAdmin = ref(false);
    const selectedMythology = ref("");
    const favorites = ref([]);

    const allUsers = ref([]);

    function clearUser(preserveGuest = false) {
        fullName.value = "";
        email.value = "";
        username.value = "";
        profileImage.value = "";
        isLoggedIn.value = false;

        if (!preserveGuest) {
            isGuest.value = false;
        }

        isAdmin.value = false;
        selectedMythology.value = "";
        favorites.value = [];
        allUsers.value = [];
    }

    async function login(credentials) {
        const res = await api.post("/auth/login", credentials);

        const { token, user } = res.data;

        localStorage.setItem("token", token);

        setUser(user);
    }

    async function register(data) {
        const res = await api.post("/auth/register", data);

        const { token, user } = res.data;

        localStorage.setItem("token", token);

        setUser(user);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("isGuest");
        clearUser();
    }

    function continueAsGuest() {
        clearUser();
        isGuest.value = true;
        localStorage.setItem("isGuest", "true");
    }

    async function initAuth() {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                await fetchCurrentUser();
            } catch (err) {
                logout();
            }
        } else {
            const wasGuest = localStorage.getItem("isGuest") === "true";
            if (wasGuest) {
                continueAsGuest();
            } else {
                clearUser(true);
            }
        }
    }

    function setUser(user) {
        fullName.value = user.fullName || "";
        email.value = user.email || "";
        username.value = user.username || "";
        profileImage.value = user.profileImage || "";
        isAdmin.value = user.role === "admin";
        selectedMythology.value = user.selectedMythology || "";
        isLoggedIn.value = true;
        isGuest.value = false;
    }

    async function fetchAllUsers() {
        if (!isAdmin.value) return;

        const res = await api.get("/users");
        allUsers.value = res.data;
    }

    async function deleteUser(userId) {
        if (userId === getCurrentUserId()) {
            console.warn("You cannot delete your own account.");
            return;
        }

        await api.delete(`/users/${userId}`);
        await fetchAllUsers();
    }

    function getCurrentUserId() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload._id || payload.id;
    }

    async function fetchCurrentUser() {
        const res = await api.get("/users/me");
        setUser(res.data);
    }

    async function updateProfile(data) {
        const res = await api.put("/users/profile", data);
        setUser(res.data);
    }

    async function fetchFavorites() {
        const res = await api.get("/users/favorites");
        favorites.value = res.data;
    }

    async function addFavorite(mythId) {
        await api.post("/users/favorites", { mythId });
        await fetchFavorites();
    }

    async function removeFavorite(mythId) {
        await api.delete(`/users/favorites/${mythId}`);
        await fetchFavorites();
    }

    return {
        fullName,
        email,
        username,
        profileImage,
        isLoggedIn,
        isGuest,
        isAdmin,
        selectedMythology,
        allUsers,
        favorites,

        login,
        register,
        logout,
        continueAsGuest,
        initAuth,

        fetchAllUsers,
        deleteUser,
        getCurrentUserId,
        fetchCurrentUser,

        updateProfile,
        fetchFavorites,
        addFavorite,
        removeFavorite,
    };
});
