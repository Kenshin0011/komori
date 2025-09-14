<template>
  <div class="combined-example">
    <h2>検索 + ページネーション 統合例</h2>

    <!-- 検索フィルタ -->
    <div class="search-section">
      <h3>商品検索</h3>
      <div class="search-form">
        <div class="search-row">
          <div class="form-group">
            <label>商品名</label>
            <input
              v-model="searchParams.name"
              type="text"
              placeholder="商品名で検索..."
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>カテゴリ</label>
            <select v-model="searchParams.category" class="form-control">
              <option value="">すべて</option>
              <option value="electronics">電子機器</option>
              <option value="fashion">ファッション</option>
              <option value="books">書籍</option>
              <option value="home">ホーム</option>
            </select>
          </div>

          <div class="form-group">
            <label>価格帯</label>
            <select v-model="searchParams.priceRange" class="form-control">
              <option value="">指定なし</option>
              <option value="0-999">999円以下</option>
              <option value="1000-4999">1,000-4,999円</option>
              <option value="5000-9999">5,000-9,999円</option>
              <option value="10000+">10,000円以上</option>
            </select>
          </div>
        </div>

        <div class="search-actions">
          <button @click="search" class="search-btn">検索</button>
          <button v-if="isFiltered" @click="reset" class="reset-btn">
            リセット
          </button>
          <span v-if="isFiltered" class="filter-indicator">フィルタ適用中</span>
        </div>
      </div>
    </div>

    <!-- データ表示とページネーション -->
    <div class="results-section">
      <div v-if="loading" class="loading">検索中...</div>

      <div v-else-if="products.length === 0" class="no-results">
        該当する商品が見つかりませんでした。
      </div>

      <div v-else>
        <!-- 結果サマリー -->
        <div class="results-summary">
          <p>
            {{ total }}件中 {{ startItem }}-{{ endItem }}件目を表示
            <span v-if="isFiltered" class="search-terms">
              ({{ getActiveFiltersText() }})
            </span>
          </p>
        </div>

        <!-- 商品一覧 -->
        <div class="product-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <div class="product-image">
              <div class="placeholder-image">{{ product.name.charAt(0) }}</div>
            </div>
            <div class="product-info">
              <h4>{{ product.name }}</h4>
              <p class="category">{{ getCategoryName(product.category) }}</p>
              <p class="price">¥{{ product.price.toLocaleString() }}</p>
              <p class="description">{{ product.description }}</p>
            </div>
          </div>
        </div>

        <!-- ページネーション -->
        <div class="pagination-section" v-if="totalPages > 1">
          <div class="pagination-info">
            ページ {{ page }} / {{ totalPages }}
          </div>

          <div class="pagination-controls">
            <button
              @click="goToPage(page - 1)"
              :disabled="page === 1"
              class="page-btn"
            >
              前へ
            </button>

            <template v-for="pageNum in visiblePageNumbers" :key="pageNum">
              <button
                v-if="pageNum !== '...'"
                @click="goToPage(Number(pageNum))"
                :class="['page-btn', { active: pageNum === page }]"
              >
                {{ pageNum }}
              </button>
              <span v-else class="page-ellipsis">...</span>
            </template>

            <button
              @click="goToPage(page + 1)"
              :disabled="page === totalPages"
              class="page-btn"
            >
              次へ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- デバッグ情報 -->
    <details class="debug-section">
      <summary>デバッグ情報</summary>
      <div class="debug-content">
        <h4>検索パラメータ:</h4>
        <pre>{{ JSON.stringify(searchParams, null, 2) }}</pre>

        <h4>ページネーション状態:</h4>
        <pre>{{
          JSON.stringify({ page, total, perPage, totalPages }, null, 2)
        }}</pre>

        <h4>現在のURL:</h4>
        <pre>{{ currentUrl }}</pre>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRoute } from "vue-router"
import { useSearch, usePagination } from "@komori/vue-query-params"
import type { PaginatedResponse } from "@komori/vue-query-params"

// ルート情報
const route = useRoute()

// 検索パラメータ管理
const { searchParams, search, reset, isFiltered } = useSearch(
  {
    name: "",
    category: "",
    priceRange: "",
  },
  {
    autoKeys: ["name"], // 名前は自動検索
    debounceMs: 500,
  }
)

// ページネーション管理
const { page, total, perPage, totalPages, goToPage, setMetaFromResponse } =
  usePagination()

// 状態管理
const products = ref<
  Array<{
    id: number
    name: string
    category: string
    price: number
    description: string
  }>
>([])
const loading = ref(false)

// 計算プロパティ
const startItem = computed(() => (page.value - 1) * perPage.value + 1)
const endItem = computed(() =>
  Math.min(page.value * perPage.value, total.value)
)

const currentUrl = computed(() => {
  const query = new URLSearchParams()
  Object.entries(route.query).forEach(([key, value]) => {
    if (value) query.set(key, String(value))
  })
  return `${route.path}?${query.toString()}`
})

const visiblePageNumbers = computed(() => {
  const current = page.value
  const last = totalPages.value
  const pages: (number | string)[] = []

  if (last <= 5) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 3) pages.push("...")

    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < last - 2) pages.push("...")
    if (last > 1) pages.push(last)
  }

  return pages
})

// ヘルパー関数
const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    electronics: "電子機器",
    fashion: "ファッション",
    books: "書籍",
    home: "ホーム",
  }
  return names[category] || category
}

const getActiveFiltersText = () => {
  const filters = []
  if (searchParams.name) filters.push(`名前: "${searchParams.name}"`)
  if (searchParams.category)
    filters.push(`カテゴリ: ${getCategoryName(searchParams.category)}`)
  if (searchParams.priceRange)
    filters.push(`価格: ${searchParams.priceRange}円`)
  return filters.join(", ")
}

// サンプルデータ生成
const generateSampleData = () => {
  const categories = ["electronics", "fashion", "books", "home"]
  const names = {
    electronics: [
      "スマートフォン",
      "ノートPC",
      "タブレット",
      "ヘッドホン",
      "カメラ",
    ],
    fashion: ["シャツ", "ジーンズ", "スニーカー", "バッグ", "アクセサリー"],
    books: ["小説", "技術書", "漫画", "雑誌", "参考書"],
    home: ["テーブル", "椅子", "カーテン", "照明", "収納BOX"],
  }

  const products = []
  for (let i = 1; i <= 250; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const nameList = names[category as keyof typeof names]
    const baseName = nameList[Math.floor(Math.random() * nameList.length)]

    products.push({
      id: i,
      name: `${baseName} ${i}`,
      category,
      price: Math.floor(Math.random() * 50000) + 500,
      description: `${baseName}の詳細説明です。高品質で使いやすい商品です。`,
    })
  }
  return products
}

// 模擬API
const fetchProducts = async (
  searchFilters: any,
  pageNum: number
): Promise<PaginatedResponse<any>> => {
  loading.value = true

  // API遅延の模擬
  await new Promise((resolve) => setTimeout(resolve, 800))

  let filteredProducts = generateSampleData()

  // フィルタリング
  if (searchFilters.name) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchFilters.name.toLowerCase())
    )
  }

  if (searchFilters.category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === searchFilters.category
    )
  }

  if (searchFilters.priceRange) {
    const [min, max] = searchFilters.priceRange.includes("+")
      ? [parseInt(searchFilters.priceRange), Infinity]
      : searchFilters.priceRange.split("-").map((n: string) => parseInt(n))

    filteredProducts = filteredProducts.filter(
      (p) => p.price >= min && p.price <= max
    )
  }

  // ページネーション
  const itemsPerPage = 12
  const start = (pageNum - 1) * itemsPerPage
  const pageData = filteredProducts.slice(start, start + itemsPerPage)

  loading.value = false

  return {
    data: pageData,
    page: pageNum,
    perPage: itemsPerPage,
    total: filteredProducts.length,
    lastPage: Math.ceil(filteredProducts.length / itemsPerPage),
  }
}

// データ取得
const loadData = async () => {
  const response = await fetchProducts(searchParams, page.value)
  products.value = response.data
  setMetaFromResponse(response)
}

// 検索パラメータまたはページ変更時のデータ取得
watch([searchParams, page], loadData, { deep: true, immediate: true })
</script>

<style scoped>
.combined-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-btn,
.reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.search-btn {
  background: #007bff;
  color: white;
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.filter-indicator {
  color: #007bff;
  font-weight: bold;
}

.results-section {
  margin-bottom: 30px;
}

.loading,
.no-results {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.results-summary {
  margin-bottom: 20px;
  color: #666;
}

.search-terms {
  color: #007bff;
  font-weight: bold;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 120px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  width: 60px;
  height: 60px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.product-info {
  padding: 15px;
}

.product-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.category {
  color: #666;
  font-size: 12px;
  margin: 4px 0;
}

.price {
  color: #e74c3c;
  font-weight: bold;
  font-size: 18px;
  margin: 8px 0;
}

.description {
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  margin: 8px 0 0 0;
}

.pagination-section {
  text-align: center;
  padding: 20px 0;
}

.pagination-info {
  margin-bottom: 15px;
  color: #666;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  min-width: 40px;
}

.page-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.page-ellipsis {
  padding: 8px 4px;
  color: #666;
}

.debug-section {
  margin-top: 30px;
  padding: 20px;
  background: #f1f3f4;
  border-radius: 8px;
}

.debug-content pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .search-row {
    grid-template-columns: 1fr;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .pagination-controls {
    flex-wrap: wrap;
  }
}
</style>
