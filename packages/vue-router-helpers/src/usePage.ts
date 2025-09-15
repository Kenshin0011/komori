import { useRoute, useRouter } from "vue-router"

type IsActiveOptions = { exact?: boolean }
export type BackToOptions = Readonly<{
  prefix?: boolean
  replace?: boolean
  source?: string
}>

const stripTrailingSlash = (path: string) => {
  if (!path) return "/"
  const trimmed = path.replace(/\/+$/, "")
  return trimmed === "" ? "/" : trimmed
}

export const usePage = () => {
  const route = useRoute()
  const router = useRouter()

  const isActive = (
    to: string | string[] | RegExp,
    options?: IsActiveOptions
  ): boolean => {
    const current = stripTrailingSlash(route.path)
    if (to instanceof RegExp) return to.test(current)
    const targets = Array.isArray(to) ? to : [to]
    const exact = options?.exact ?? true
    return targets.some((raw) => {
      const target = stripTrailingSlash(raw)
      if (exact) return current === target
      if (target === "/") return current === "/"
      return current === target || current.startsWith(target + "/")
    })
  }

  const toInternalUrl = (raw?: string | null): string | null => {
    if (!raw) return null
    try {
      const base =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost"
      const u = new URL(raw, base)
      return `${stripTrailingSlash(u.pathname)}${u.search}${u.hash}`
    } catch {
      return raw.startsWith("/") ? raw : null
    }
  }

  const pathOf = (raw?: string | null): string | null => {
    if (!raw) return null
    try {
      const base =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost"
      const u = new URL(raw, base)
      return stripTrailingSlash(u.pathname)
    } catch {
      return raw.startsWith("/") ? stripTrailingSlash(raw.split("?")[0]) : null
    }
  }

  const backTo = async (
    allowed: ReadonlyArray<string>,
    fallback: string,
    opts: BackToOptions = {}
  ) => {
    const isRecord = (v: unknown): v is Record<string, unknown> =>
      typeof v === "object" && v !== null
    const isNonEmptyString = (v: unknown): v is string =>
      typeof v === "string" && v.length > 0

    const raw = isNonEmptyString(opts.source)
      ? opts.source
      : typeof window !== "undefined" &&
          isRecord(window.history.state) &&
          isNonEmptyString(
            (window.history.state as Record<string, unknown>).back
          )
        ? (window.history.state as { back: string }).back
        : undefined

    const backUrl = toInternalUrl(raw ?? null)
    const backPath = pathOf(raw ?? null)

    const ok =
      backPath !== null &&
      allowed.some((a) => {
        const base = stripTrailingSlash(a)
        return opts.prefix
          ? backPath === base || backPath.startsWith(base + "/")
          : backPath === base
      })

    const target = ok && backUrl ? backUrl : stripTrailingSlash(fallback)
    return (opts.replace ?? true) ? router.replace(target) : router.push(target)
  }

  return {
    isActive,
    backTo,
  }
}
