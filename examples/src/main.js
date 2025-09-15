import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import SearchExample from "../SearchExample.vue"
import PaginationExample from "../PaginationExample.vue"
import CombinedExample from "../CombinedExample.vue"
import RouterExample from "../RouterExample.vue"

const routes = [
  { path: "/", redirect: "/combined" },
  { path: "/search", component: SearchExample, name: "search" },
  { path: "/pagination", component: PaginationExample, name: "pagination" },
  { path: "/combined", component: CombinedExample, name: "combined" },
  {
    path: "/router",
    component: RouterExample,
    name: "router",
    children: [
      { path: "products", name: "router-products" },
      { path: "products/:category", name: "router-products-category" },
      { path: "about", name: "router-about" },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount("#app")
