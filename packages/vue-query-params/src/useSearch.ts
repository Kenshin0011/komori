import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

type Primitive = string | number | boolean

/**
 * 検索用のクエリパラメータを管理する
 * @param initialParams - 初期値として設定するクエリパラメータ
 * @param options - オプション設定
 *   - autoKeys: 自動で検索を実行するキーの配列
 *   - debounceMs: 検索実行のデバウンス時間（ミリ秒）
 */
export function useSearch<P extends Record<string, Primitive | Primitive[]>>(
  initialParams: P,
  options?: {
    autoKeys?: (keyof P)[]
    debounceMs?: number
    filterKeys?: (keyof P)[]
  }
): {
  isFiltered: import("vue").ComputedRef<boolean>
  reset: () => void
  searchParams: import("vue").Ref<P, P>
  search: () => void
} {
  const route = useRoute()
  const router = useRouter()
  const { autoKeys = [], debounceMs = 200, filterKeys } = options || {}

  // 初期値を route.query からマージ
  const init: Record<string, Primitive | Primitive[]> = { ...initialParams }
  Object.entries(route.query).forEach(([k, v]) => {
    if (!(k in init)) return

    // 文字列 or 配列 を常に string[] にフラット化
    const parts: string[] =
      typeof v === "string"
        ? v.split(",")
        : Array.isArray(v)
          ? v.flatMap((x) => String(x).split(","))
          : []

    // 初期値 initialParams[k] の型に応じてセット
    if (Array.isArray(initialParams[k as keyof P])) {
      // 配列型 → Primitive[] としてそのまま parts を割り当て
      init[k] = parts as Primitive[]
    } else {
      // 単一値型 → 先頭要素 (string) を Primitive にキャスト
      init[k] = (parts[0] ?? "") as Primitive
    }
  })
  const searchParams = ref<P>(init as P)

  /**
   * 検索を実行し、クエリパラメータを更新する
   */
  const search = () => {
    // 空の値を除外してクエリパラメータを生成
    const filtered = Object.fromEntries(
      Object.entries(searchParams.value)
        .filter(([, v]) =>
          Array.isArray(v) ? v.length > 0 : v !== "" && v != null
        )
        .map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)])
    )
    router.replace({
      query: {
        page: "1",
        ...filtered,
      },
    })
  }

  /**
   * 検索パラメータをリセットする
   */
  const reset = () => {
    searchParams.value = { ...initialParams } as P
    router.replace({ query: {} })
  }

  // どのキーを「フィルタ中」と判定に使うか
  const keysToCheck = filterKeys ?? (Object.keys(initialParams) as (keyof P)[])
  // フィルタが入っているかどうか
  const isFiltered = computed<boolean>(() => {
    return keysToCheck.some((key) => {
      const v = searchParams.value[key]
      return Array.isArray(v) ? v.length > 0 : v !== "" && v != null
    })
  })

  // autoKeys があればそのキー変更で自動反映
  if (autoKeys.length > 0) {
    let timer: number | null = null
    watch(
      () => autoKeys.map((key) => searchParams.value[key]),
      () => {
        if (timer !== null) clearTimeout(timer)
        timer = window.setTimeout(search, debounceMs)
      },
      { deep: true }
    )
  }

  return {
    isFiltered,
    reset,
    searchParams: searchParams as import("vue").Ref<P, P>,
    search,
  }
}
