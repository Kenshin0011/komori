<template>
  <div class="router-example">
    <div class="example-section">
      <h2>Vue Router Helpers (usePage) Example</h2>
      <p>Demonstration of isActive and backTo functionality</p>
    </div>

    <div class="navigation-section">
      <h3>Navigation with isActive</h3>
      <div class="nav-buttons">
        <button
          @click="navigateTo('/router/products')"
          :class="{ active: isActive('/router/products') }"
          class="nav-btn"
        >
          Products {{ isActive("/router/products") ? "(Active)" : "" }}
        </button>
        <button
          @click="navigateTo('/router/products/electronics')"
          :class="{ active: isActive('/router/products/electronics') }"
          class="nav-btn"
        >
          Electronics
          {{ isActive("/router/products/electronics") ? "(Active)" : "" }}
        </button>
        <button
          @click="navigateTo('/router/products/books')"
          :class="{ active: isActive('/router/products/books') }"
          class="nav-btn"
        >
          Books {{ isActive("/router/products/books") ? "(Active)" : "" }}
        </button>
        <button
          @click="navigateTo('/router/about')"
          :class="{ active: isActive('/router/about') }"
          class="nav-btn"
        >
          About {{ isActive("/router/about") ? "(Active)" : "" }}
        </button>
      </div>
    </div>

    <div class="test-section">
      <h3>isActive Tests</h3>
      <div class="test-grid">
        <div class="test-card">
          <h4>Exact Match</h4>
          <p>Current path: {{ $route.path }}</p>
          <ul>
            <li>isActive('/router'): {{ isActive("/router") }}</li>
            <li>
              isActive('/router', { exact: true }):
              {{ isActive("/router", { exact: true }) }}
            </li>
            <li>
              isActive('/router/products'): {{ isActive("/router/products") }}
            </li>
          </ul>
        </div>

        <div class="test-card">
          <h4>Prefix Match</h4>
          <ul>
            <li>
              isActive('/router', { exact: false }):
              {{ isActive("/router", { exact: false }) }}
            </li>
            <li>
              isActive('/router/products', { exact: false }):
              {{ isActive("/router/products", { exact: false }) }}
            </li>
          </ul>
        </div>

        <div class="test-card">
          <h4>Multiple Paths</h4>
          <ul>
            <li>
              isActive(['/router/products', '/router/about']):
              {{ isActive(["/router/products", "/router/about"]) }}
            </li>
            <li>
              isActive(['/router/nonexistent', '/router/about']):
              {{ isActive(["/router/nonexistent", "/router/about"]) }}
            </li>
          </ul>
        </div>

        <div class="test-card">
          <h4>Regex Match</h4>
          <ul>
            <li>
              isActive(/\/router\/products/):
              {{ isActive(/\/router\/products/) }}
            </li>
            <li>
              isActive(/\/router\/.*books/): {{ isActive(/\/router\/.*books/) }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="back-section">
      <h3>BackTo Functionality</h3>
      <div class="back-controls">
        <div class="form-group">
          <label>Set back URL in history state:</label>
          <select v-model="backUrl" class="form-control">
            <option value="">None</option>
            <option value="/router/products">Products Page</option>
            <option value="/router/about">About Page</option>
            <option value="/external">External URL (not allowed)</option>
          </select>
          <button @click="setBackHistory" class="btn btn-secondary">
            Set History State
          </button>
        </div>

        <div class="back-buttons">
          <button @click="backToAllowed" class="btn btn-primary">
            Back to Allowed Pages
          </button>
          <button @click="backToWithPrefix" class="btn btn-secondary">
            Back with Prefix Match
          </button>
        </div>

        <div class="back-info">
          <p><strong>Allowed pages:</strong> /router/products, /router/about</p>
          <p><strong>Fallback:</strong> /router</p>
          <p>
            <strong>History state back URL:</strong> {{ getCurrentBackUrl() }}
          </p>
        </div>
      </div>
    </div>

    <div class="current-state">
      <h3>Current State</h3>
      <div class="state-info">
        <p><strong>Current Path:</strong> {{ $route.path }}</p>
        <p>
          <strong>History State:</strong> {{ JSON.stringify(historyState) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePage } from "@komori-kit/vue-router-helpers"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const { isActive, backTo } = usePage()
const router = useRouter()
const backUrl = ref("")

const historyState = computed(() => {
  return typeof window !== "undefined" ? window.history.state : null
})

const navigateTo = (path) => {
  router.push(path)
}

const setBackHistory = () => {
  if (backUrl.value) {
    const newState = { ...window.history.state, back: backUrl.value }
    window.history.replaceState(newState, "", window.location.href)
  }
}

const getCurrentBackUrl = () => {
  if (
    typeof window !== "undefined" &&
    window.history.state &&
    window.history.state.back
  ) {
    return window.history.state.back
  }
  return "None"
}

const backToAllowed = async () => {
  await backTo(["/router/products", "/router/about"], "/router")
}

const backToWithPrefix = async () => {
  await backTo(["/router/products"], "/router", { prefix: true })
}
</script>

<style scoped>
.router-example {
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
}

.example-section h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.navigation-section,
.test-section,
.back-section,
.current-state {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.navigation-section h3,
.test-section h3,
.back-section h3,
.current-state h3 {
  margin-bottom: 1rem;
  color: #333;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-btn:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.nav-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.test-card {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 1rem;
  background: #fafafa;
}

.test-card h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.test-card ul {
  list-style: none;
  padding: 0;
}

.test-card li {
  font-family: monospace;
  font-size: 0.9rem;
  background: white;
  margin: 0.25rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.back-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.back-info {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #28a745;
}

.back-info p {
  margin: 0.25rem 0;
}

.state-info {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9rem;
}

.state-info p {
  margin: 0.5rem 0;
  word-break: break-all;
}

@media (max-width: 768px) {
  .nav-buttons,
  .back-buttons {
    flex-direction: column;
  }

  .test-grid {
    grid-template-columns: 1fr;
  }
}
</style>
