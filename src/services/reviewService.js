import api from "./api";

export default {
    getReviews(mythId) {
        return api.get(`/reviews/${mythId}`);
    },

    addReview(data) {
        return api.post("/reviews", data);
    },

    deleteReview(id) {
        return api.delete(`/reviews/${id}`);
    },
};
