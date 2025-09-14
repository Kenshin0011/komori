import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import SearchExample from "../SearchExample.vue"
import PaginationExample from "../PaginationExample.vue"
import CombinedExample from "../CombinedExample.vue"

const routes = [
  { path: "/", redirect: "/combined" },
  { path: "/search", component: SearchExample, name: "search" },
  { path: "/pagination", component: PaginationExample, name: "pagination" },
  { path: "/combined", component: CombinedExample, name: "combined" },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount("#app")
