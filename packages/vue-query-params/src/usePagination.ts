import { ref, computed, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { PaginatedResponse } from "./types/paginationType"
import { paginationQuerySchema } from "./paginationQuerySchema"

export const usePagination = () => {
  const route = useRoute()
  const router = useRouter()

  const page = ref<number>(1)
  const total = ref<number>(0)
  const perPage = ref<number>(20)
  const totalPages = computed<number>(() => {
    const t = Number(total.value)
    const p = Number(perPage.value)

    const safeTotal = Number.isFinite(t) && t >= 0 ? t : 0
    const safePerPage = Number.isFinite(p) && p > 0 ? p : 1

    return Math.max(1, Math.ceil(safeTotal / safePerPage))
  })

  /**
   * 指定したページに移動する
   * @param target - 移動先のページ番号
   * @return void
   */
  const goToPage = (target: number) => {
    if (target >= 1 && target <= totalPages.value) {
      router.push({
        query: {
          ...route.query,
          page: String(target),
        },
      })
    }
  }

  /**
   * レスポンスからメタ情報を設定する
   * @param res - ページネーションされたレスポンス
   * @return void
   */
  const setMetaFromResponse = <T>(res: PaginatedResponse<T>) => {
    total.value = res.total
    perPage.value = res.perPage

    const parsed = paginationQuerySchema.safeParse(route.query)
    const newPage = parsed.success ? parsed.data.page : 1

    const maxPage = totalPages.value
    if (newPage > maxPage && maxPage > 0) {
      if (route.query.page !== String(maxPage)) {
        router.replace({ query: { ...route.query, page: String(maxPage) } })
      }
      page.value = maxPage
    } else {
      page.value = newPage
    }
  }

  watchEffect(() => {
    const parsed = paginationQuerySchema.safeParse(route.query)

    if (!parsed.success) {
      router.replace({ query: { ...route.query, page: "1" } })
      page.value = 1
      return
    }

    const newPage = parsed.data.page

    if (total.value === 0) {
      page.value = newPage
      return
    }

    const maxPage = totalPages.value
    if (newPage > maxPage) {
      if (route.query.page !== String(maxPage)) {
        router.replace({ query: { ...route.query, page: String(maxPage) } })
      }
      page.value = maxPage
    } else {
      page.value = newPage
    }
  })

  return {
    page,
    total,
    perPage,
    totalPages,
    goToPage,
    setMetaFromResponse,
  }
}
