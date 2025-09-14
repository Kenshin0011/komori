# Vue Query Params Examples

このディレクトリには、`@komori/vue-query-params`パッケージの使用例が含まれています。

## 例一覧

### 1. SearchExample.vue - 検索機能の例

検索フィルタの基本的な使用方法を示します。

**主な機能:**

- テキスト検索（自動実行）
- セレクトボックスによるフィルタ
- チェックボックスによる複数選択
- フィルタのリセット機能
- フィルタ状態の表示

**使用するcomposable:**

- `useSearch`

### 2. PaginationExample.vue - ページネーション機能の例

ページネーション機能の詳細な実装例です。

**主な機能:**

- ページ移動（前へ/次へ/最初/最後）
- ページ番号ボタン（省略表示対応）
- ページジャンプ機能
- ページネーション情報の表示
- APIレスポンスからのメタデータ設定

**使用するcomposable:**

- `usePagination`

### 3. CombinedExample.vue - 検索 + ページネーション統合例

検索機能とページネーション機能を組み合わせた実用的な例です。

**主な機能:**

- 商品検索（名前、カテゴリ、価格帯）
- 検索結果のページネーション
- 検索条件変更時の自動ページリセット
- URLクエリパラメータとの完全同期
- レスポンシブ対応のUI

**使用するcomposable:**

- `useSearch`
- `usePagination`

## 実行方法

これらの例をVueアプリケーションで実行するには：

1. パッケージをインストール:

```bash
pnpm add @komori/vue-query-params
```

2. Vue RouterとZodが必要です:

```bash
pnpm add vue-router zod
```

3. 例をコンポーネントとしてインポート:

```vue
<template>
  <div>
    <!-- 例のコンポーネントを使用 -->
    <SearchExample />
    <PaginationExample />
    <CombinedExample />
  </div>
</template>

<script setup>
import SearchExample from "@komori/vue-query-params/examples/SearchExample.vue"
import PaginationExample from "@komori/vue-query-params/examples/PaginationExample.vue"
import CombinedExample from "@komori/vue-query-params/examples/CombinedExample.vue"
</script>
```

## 重要な実装ポイント

### 1. 検索機能

```typescript
const { searchParams, search, reset, isFiltered } = useSearch(
  {
    query: "", // 検索キーワード
    category: "", // カテゴリ（単一選択）
    tags: [] as string[], // タグ（複数選択）
  },
  {
    autoKeys: ["query"], // 自動実行するキー
    debounceMs: 300, // デバウンス時間
    filterKeys: ["query"], // フィルタ判定に使用するキー
  }
)
```

### 2. ページネーション機能

```typescript
const { page, total, perPage, totalPages, goToPage, setMetaFromResponse } =
  usePagination()

// APIレスポンスの例
const response = await fetchData({ page: page.value })
setMetaFromResponse(response) // メタ情報を自動設定
```

### 3. URL同期

両方のcomposableは、URLクエリパラメータと状態を自動的に同期します：

- 検索条件の変更 → URLが更新される
- URLの変更（戻る/進む） → 状態が更新される
- 検索実行時 → ページが1にリセットされる

## カスタマイズ

これらの例をベースに、プロジェクトの要件に合わせてカスタマイズしてください：

- APIエンドポイントの変更
- UIコンポーネントの差し替え
- 検索パラメータの追加/変更
- ページサイズの調整
- エラーハンドリングの追加
