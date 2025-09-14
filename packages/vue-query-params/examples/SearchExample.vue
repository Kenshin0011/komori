<template>
  <div class="search-example">
    <h2>検索フィルタ例</h2>

    <!-- 検索フォーム -->
    <div class="search-form">
      <div class="form-group">
        <label>検索キーワード</label>
        <input
          v-model="searchParams.query"
          type="text"
          placeholder="キーワードを入力..."
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label>カテゴリ</label>
        <select v-model="searchParams.category" class="form-control">
          <option value="">すべて</option>
          <option value="electronics">電子機器</option>
          <option value="clothing">衣類</option>
          <option value="books">本</option>
        </select>
      </div>

      <div class="form-group">
        <label>ステータス</label>
        <div class="checkbox-group">
          <label v-for="status in availableStatuses" :key="status">
            <input
              type="checkbox"
              :value="status"
              v-model="searchParams.status"
            />
            {{ status }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>価格帯</label>
        <select v-model="searchParams.priceRange" class="form-control">
          <option value="">指定なし</option>
          <option value="0-1000">0円 - 1,000円</option>
          <option value="1000-5000">1,000円 - 5,000円</option>
          <option value="5000+">5,000円以上</option>
        </select>
      </div>
    </div>

    <!-- 検索結果表示 -->
    <div class="search-results">
      <div class="search-info">
        <p v-if="isFiltered" class="filter-status">
          フィルタが適用されています
          <button @click="reset" class="reset-btn">リセット</button>
        </p>
        <p v-else>すべての商品を表示中</p>
      </div>

      <!-- 手動検索ボタン -->
      <button @click="search" class="search-btn">検索実行</button>

      <!-- 現在の検索パラメータ表示 -->
      <div class="current-params">
        <h3>現在の検索パラメータ:</h3>
        <pre>{{ JSON.stringify(searchParams, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearch } from "@komori/vue-query-params"

// 検索パラメータの定義
const { searchParams, search, reset, isFiltered } = useSearch(
  {
    query: "",
    category: "",
    status: [] as string[],
    priceRange: "",
  },
  {
    // queryフィールドは自動で検索実行（300msデバウンス）
    autoKeys: ["query"],
    debounceMs: 300,
    // query, category, statusをフィルタ判定に使用
    filterKeys: ["query", "category", "status"],
  }
)

const availableStatuses = ["在庫あり", "予約受付中", "セール中", "新着"]
</script>

<style scoped>
.search-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-form {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  gap: 15px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-results {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.filter-status {
  color: #007bff;
  font-weight: bold;
}

.reset-btn,
.search-btn {
  padding: 6px 12px;
  margin-left: 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-btn {
  background: #28a745;
  margin: 0;
}

.current-params {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.current-params pre {
  margin: 10px 0 0 0;
  font-size: 12px;
  color: #666;
}
</style>
