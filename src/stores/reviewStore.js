import { ref } from "vue";
import { defineStore } from "pinia";
import reviewService from "@/services/reviewService";

export const useReviewStore = defineStore("review", () => {
    const reviews = ref([]);
    const loading = ref(false);

    function formatDate(timestamp) {
        if (!timestamp) return "";

        const date = new Date(timestamp);

        if (isNaN(date)) return "";

        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });

        return `${day} ${month}`;
    }

    async function fetchReviews(mythId) {
        loading.value = true;

        try {
            const res = await reviewService.getReviews(mythId);

            const mapped = [];

            for (let i = 0; i < res.data.length; i++) {
                const r = res.data[i];

                mapped.push({
                    id: r._id,
                    username: r.username || "",
                    text: r.text || "",
                    profileImage: r.profileImage || "/icons/user.svg",
                    date: formatDate(r.createdAt),
                });
            }

            reviews.value = mapped;
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            loading.value = false;
        }
    }

    async function addReview(data) {
        try {
            await reviewService.addReview(data);
            await fetchReviews(data.mythId);
        } catch (err) {
            console.error("Error adding review:", err);
        }
    }

    async function deleteReview(reviewId, mythId) {
        try {
            await reviewService.deleteReview(reviewId);
            await fetchReviews(mythId);
        } catch (err) {
            console.error("Error deleting review:", err);
        }
    }

    return {
        reviews,
        loading,

        fetchReviews,
        addReview,
        deleteReview,
    };
});
