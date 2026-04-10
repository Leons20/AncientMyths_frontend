import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SignUp from "@/views/SignUp.vue";
import SignIn from "@/views/SignIn.vue";
import MainView from "@/views/MainView.vue";
import MythView from "@/views/MythView.vue";
import AddMyth from "@/views/AddMyth.vue";
import EditMyth from "@/views/EditMyth.vue";
import ReviewView from "@/views/ReviewView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ManageView from "@/views/ManageView.vue";
import DashboardView from "@/views/DashboardView.vue";
import NotFound from "@/views/NotFound.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/home", redirect: { name: "Home" } },
        { path: "/", name: "Home", component: HomeView },
        { path: "/signup", name: "SignUp", component: SignUp },
        { path: "/signin", name: "SignIn", component: SignIn },
        { path: "/main", name: "Main", component: MainView },
        { path: "/myths/:mythology/:id", name: "Myth", component: MythView },
        { path: "/add-myth", name: "AddMyth", component: AddMyth },
        { path: "/edit-myth/:id", name: "EditMyth", component: EditMyth },
        { path: "/review/:id", name: "Review", component: ReviewView },
        { path: "/settings", name: "Settings", component: SettingsView },
        { path: "/profile", name: "Profile", component: ProfileView },
        { path: "/manage-accounts", name: "ManageAccounts", component: ManageView },
        { path: "/dashboard", name: "Dashboard", component: DashboardView },
        { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
    ],
});

export default router;
