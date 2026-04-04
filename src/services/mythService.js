import api from "./api";

export default {
    getMyths(params) {
        return api.get("/myths", { params });
    },

    getMyth(id) {
        return api.get(`/myths/${id}`);
    },

    createMyth(data) {
        return api.post("/myths", data);
    },

    updateMyth(id, data) {
        return api.put(`/myths/${id}`, data);
    },

    deleteMyth(id) {
        return api.delete(`/myths/${id}`);
    },

    rateMyth(id, rating) {
        return api.post(`/myths/${id}/rate`, { rating });
    },
};
