import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../components/pages/HomePage.vue";
import SignIn from "../components/pages/SignIn.vue";
import RegisterPage from "../components/pages/RegisterPage.vue";
import ToDoDirectory from "../components/pages/ToDoDirectory.vue";
import ToDoTask from "../components/pages/ToDoTask.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: HomePage,
  },
  {
    path: "/sign-in",
    component: SignIn,
    meta: { requiresUnauth: true },
  },
  {
    path: "/register",
    component: RegisterPage,
    meta: { requiresUnauth: true },
  },
  {
    path: "/to-do-directory",
    component: ToDoDirectory,
    meta: { requiresAuth: true },
  },
  {
    path: "/to-do-task",
    component: ToDoTask,
    meta: { requiresAuth: true },
  },
  {
    path: "/to-do-task/:taskId",
    component: ToDoTask,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(function(to, _, next) {
  store.dispatch("autoLogin").then(() => {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
      next("/sign-in");
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
      next("/to-do-directory");
    } else {
      next();
    }
  });
});
export default router;
