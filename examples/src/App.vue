<template>
  <div class="app">
    <nav class="navbar">
      <h1>Vue Query Params Examples</h1>
      <div class="nav-links">
        <router-link to="/search" class="nav-link">Search Example</router-link>
        <router-link to="/pagination" class="nav-link"
          >Pagination Example</router-link
        >
        <router-link to="/combined" class="nav-link"
          >Combined Example</router-link
        >
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
}

.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h1 {
  color: #333;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #333;
}

.nav-link.router-link-active {
  background-color: #007bff;
  color: white;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Global styles for examples */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.search-btn {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #218838;
}

.reset-btn {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
}

.reset-btn:hover {
  background-color: #c82333;
}

.search-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.search-form .search-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-indicator {
  color: #28a745;
  font-weight: 500;
}

.results-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.results-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}

.product-card h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.product-card .category {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.product-card .price {
  font-weight: bold;
  color: #28a745;
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-info {
  text-align: center;
  color: #666;
  margin: 1rem 0;
}
</style>
