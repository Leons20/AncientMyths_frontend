import api from "./api";

export default {
    getCurrentUser() {
        return api.get("/users/me");
    },

    getFavorites() {
        return api.get("/users/favorites");
    },

    addFavorite(mythId) {
        return api.post("/users/favorites", { mythId });
    },

    removeFavorite(mythId) {
        return api.delete(`/users/favorites/${mythId}`);
    },

    getStats() {
        return api.get("/users/stats");
    },
};
