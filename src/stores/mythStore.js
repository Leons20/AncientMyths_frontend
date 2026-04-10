import { ref } from "vue";
import { defineStore } from "pinia";
import mythService from "@/services/mythService";

export const useMythStore = defineStore("myths", () => {
    const myths = ref([]);
    const selectedMyth = ref(null);

    const total = ref(0);
    const page = ref(1);
    const limit = ref(10);

    const loading = ref(false);

    async function fetchMyths(filters) {
        loading.value = true;

        try {
            let params = {
                page: page.value,
                limit: limit.value,
            };

            if (filters) {
                if (filters.search) {
                    params.search = filters.search;
                }

                if (filters.mythology) {
                    params.mythology = filters.mythology;
                }
            }

            const res = await mythService.getMyths(params);

            myths.value = res.data.myths;
            total.value = res.data.total;
        } catch (err) {
            console.error("Error fetching myths:", err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchMyth(id) {
        try {
            const res = await mythService.getMyth(id);
            selectedMyth.value = res.data;
        } catch (err) {
            console.error("Error fetching myth:", err);
        }
    }

    async function addMyth(newMyth) {
        try {
            const res = await mythService.createMyth(newMyth);

            const createdMyth = res.data.myth;

            return createdMyth;
        } catch (err) {
            console.error("Error adding myth:", err);
        }
    }

    async function updateMyth(id, updatedData) {
        try {
            await mythService.updateMyth(id, updatedData);
            await fetchMyth(id);
        } catch (err) {
            console.error("Error updating myth:", err);
        }
    }

    async function deleteMyth(id) {
        try {
            await mythService.deleteMyth(id);
            await fetchMyths();
        } catch (err) {
            console.error("Error deleting myth:", err);
        }
    }

    async function rateMyth(id, rating) {
        try {
            await mythService.rateMyth(id, rating);
            await fetchMyth(id);
        } catch (err) {
            console.error("Error rating myth:", err);
        }
    }

    function nextPage() {
        page.value++;
        fetchMyths();
    }

    function prevPage() {
        if (page.value > 1) {
            page.value--;
            fetchMyths();
        }
    }

    return {
        myths,
        selectedMyth,
        total,
        page,
        limit,
        loading,

        fetchMyths,
        fetchMyth,
        addMyth,
        updateMyth,
        deleteMyth,
        rateMyth,

        nextPage,
        prevPage,
    };
});
