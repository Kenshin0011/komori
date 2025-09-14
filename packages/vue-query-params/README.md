# @komori-kit/vue-query-params

Vue 3のComposition APIを使用してURLクエリパラメータと状態を同期するライブラリです。検索とページネーション機能を提供します。

## インストール

```bash
pnpm add @komori-kit/vue-query-params
```

## 機能

- 🔍 **検索機能**: `useSearch` - クエリパラメータと検索状態を同期
- 📄 **ページネーション**: `usePagination` - ページネーションの状態管理
- 🔄 **自動同期**: URLとコンポーネント状態の双方向同期
- 📱 **TypeScript完全対応**: 型安全性を保証
- ⚡ **Vue 3最適化**: Composition APIとReactivity Systemを活用

## 使用方法

### useSearch

```typescript
import { useSearch } from "@komori-kit/vue-query-params"

// 検索パラメータの管理
const { searchParams, search, reset, isFiltered } = useSearch(
  {
    query: "",
    category: [],
    status: "active",
  },
  {
    autoKeys: ["query"], // 自動で検索実行するキー
    debounceMs: 300, // デバウンス時間
    filterKeys: ["query", "category"], // フィルタリング判定に使用するキー
  }
)
```

### usePagination

```typescript
import { usePagination } from "@komori-kit/vue-query-params"

// ページネーションの管理
const { page, total, perPage, totalPages, goToPage, setMetaFromResponse } =
  usePagination()

// APIレスポンスからメタ情報を設定
const response = await api.getUsers({ page: page.value })
setMetaFromResponse(response)
```

## ライセンス

MIT
