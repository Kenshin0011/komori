<template>
  <div class="pagination-example">
    <h2>ページネーション例</h2>

    <!-- データ読み込み状態 -->
    <div v-if="loading" class="loading">データを読み込み中...</div>

    <!-- データ表示 -->
    <div v-else class="data-section">
      <h3>ユーザー一覧 ({{ total }}件中 {{ startItem }}-{{ endItem }}件目)</h3>

      <div class="user-list">
        <div v-for="user in users" :key="user.id" class="user-card">
          <h4>{{ user.name }}</h4>
          <p>{{ user.email }}</p>
          <p>部署: {{ user.department }}</p>
        </div>
      </div>

      <!-- ページネーション情報 -->
      <div class="pagination-info">
        <p>
          現在のページ: {{ page }} / {{ totalPages }} (1ページあたり
          {{ perPage }}件)
        </p>
      </div>

      <!-- ページネーションコントロール -->
      <div class="pagination-controls">
        <button @click="goToPage(1)" :disabled="page === 1" class="page-btn">
          最初
        </button>

        <button
          @click="goToPage(page - 1)"
          :disabled="page === 1"
          class="page-btn"
        >
          前へ
        </button>

        <!-- ページ番号ボタン -->
        <template v-for="pageNum in visiblePages" :key="pageNum">
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

        <button
          @click="goToPage(totalPages)"
          :disabled="page === totalPages"
          class="page-btn"
        >
          最後
        </button>
      </div>

      <!-- ページジャンプ -->
      <div class="page-jump">
        <label>
          ページに移動:
          <input
            v-model.number="jumpPage"
            type="number"
            :min="1"
            :max="totalPages"
            class="page-input"
            @keyup.enter="goToPage(jumpPage)"
          />
          <button @click="goToPage(jumpPage)" class="jump-btn">移動</button>
        </label>
      </div>
    </div>

    <!-- 現在の状態表示 -->
    <div class="debug-info">
      <h3>現在の状態:</h3>
      <pre>{{
        JSON.stringify(
          {
            page: page,
            total: total,
            perPage: perPage,
            totalPages: totalPages,
            loading: loading,
          },
          null,
          2
        )
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { usePagination } from "@komori/vue-query-params"
import type { PaginatedResponse } from "@komori/vue-query-params"

// ページネーション管理
const { page, total, perPage, totalPages, goToPage, setMetaFromResponse } =
  usePagination()

// サンプルデータとローディング状態
const users = ref<
  Array<{ id: number; name: string; email: string; department: string }>
>([])
const loading = ref(false)
const jumpPage = ref(1)

// 表示範囲の計算
const startItem = computed(() => (page.value - 1) * perPage.value + 1)
const endItem = computed(() =>
  Math.min(page.value * perPage.value, total.value)
)

// 表示するページ番号の計算
const visiblePages = computed(() => {
  const current = page.value
  const last = totalPages.value
  const pages: (number | string)[] = []

  if (last <= 7) {
    // 7ページ以下なら全て表示
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    // 7ページより多い場合は省略表示
    pages.push(1)

    if (current > 4) {
      pages.push("...")
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < last - 3) {
      pages.push("...")
    }

    if (last > 1) {
      pages.push(last)
    }
  }

  return pages
})

// サンプルAPIの模擬実装
const fetchUsers = async (
  currentPage: number
): Promise<PaginatedResponse<any>> => {
  loading.value = true

  // APIコールの模擬（1秒の遅延）
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allUsers = Array.from({ length: 157 }, (_, i) => ({
    id: i + 1,
    name: `ユーザー ${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: ["開発部", "営業部", "人事部", "マーケティング部"][i % 4],
  }))

  const itemsPerPage = 10
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pageData = allUsers.slice(start, end)

  loading.value = false

  return {
    data: pageData,
    page: currentPage,
    perPage: itemsPerPage,
    total: allUsers.length,
    lastPage: Math.ceil(allUsers.length / itemsPerPage),
  }
}

// ページ変更時のデータ取得
watch(
  page,
  async (newPage) => {
    const response = await fetchUsers(newPage)
    users.value = response.data
    setMetaFromResponse(response)
  },
  { immediate: true }
)

// jumpPageの更新
watch(page, (newPage) => {
  jumpPage.value = newPage
})
</script>

<style scoped>
.pagination-example {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.data-section {
  margin-bottom: 30px;
}

.user-list {
  display: grid;
  gap: 15px;
  margin: 20px 0;
}

.user-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.user-card h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.user-card p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.pagination-info {
  text-align: center;
  margin: 20px 0;
  color: #666;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin: 20px 0;
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

.page-jump {
  text-align: center;
  margin: 20px 0;
}

.page-input {
  width: 60px;
  padding: 4px 8px;
  margin: 0 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.jump-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.debug-info {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.debug-info pre {
  font-size: 12px;
  color: #666;
  margin: 10px 0 0 0;
}
</style>
