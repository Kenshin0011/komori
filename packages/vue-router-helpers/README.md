# @komori-kit/vue-router-helpers

Headless helpers for vue-router.

## Features

- **`isActive`** - Check if current route matches given paths with flexible matching options
- **`backTo`** - Navigate back to allowed pages with fallback support
- TypeScript support
- Zero dependencies (except peer dependencies)
- Tree-shakeable

## Installation

```bash
npm install @komori-kit/vue-router-helpers
# or
pnpm add @komori-kit/vue-router-helpers
# or
yarn add @komori-kit/vue-router-helpers
```

## Usage

### Basic Usage

```vue
<script setup>
import { usePage } from '@komori-kit/vue-router-helpers'

const { isActive, backTo } = usePage()
</script>

<template>
  <nav>
    <router-link
      to="/products"
      :class="{ active: isActive('/products') }"
    >
      Products
    </router-link>
    <router-link
      to="/about"
      :class="{ active: isActive('/about') }"
    >
      About
    </router-link>
  </nav>

  <button @click="backTo(['/products', '/about'], '/')">
    Go Back
  </button>
</template>
```

## API Reference

### `isActive(to, options?)`

Check if the current route matches the given path(s).

#### Parameters

- `to`: `string | string[] | RegExp` - Path(s) to match against
- `options?`: `{ exact?: boolean }` - Matching options

#### Examples

```js
// Exact match (default)
isActive('/products') // true only if current path is exactly '/products'

// Prefix match
isActive('/products', { exact: false }) // true if current path starts with '/products'

// Multiple paths
isActive(['/products', '/services']) // true if current path matches any

// Regex matching
isActive(/\/products\/\d+/) // true if current path matches the regex
```

### `backTo(allowed, fallback, options?)`

Navigate back to an allowed page or fallback if not allowed.

#### Parameters

- `allowed`: `ReadonlyArray<string>` - Array of allowed back URLs
- `fallback`: `string` - Fallback URL if back URL is not allowed
- `options?`: `BackToOptions` - Navigation options

#### Options

```ts
type BackToOptions = {
  prefix?: boolean    // Use prefix matching for allowed URLs (default: false)
  replace?: boolean   // Use router.replace instead of router.push (default: true)
  source?: string     // Custom back URL source (default: history.state.back)
}
```

#### Examples

```js
// Basic usage
await backTo(['/products', '/about'], '/')

// With prefix matching
await backTo(['/admin'], '/', { prefix: true })
// Allows '/admin', '/admin/users', '/admin/settings', etc.

// With custom source
await backTo(['/products'], '/', { source: '/custom-back-url' })
```

## How It Works

### `isActive`

The `isActive` function compares the current route path with the provided path(s):

- **Exact matching** (default): Path must match exactly
- **Prefix matching**: Current path must start with the given path
- **Array matching**: Returns true if any path in the array matches
- **Regex matching**: Uses regex.test() on the current path

### `backTo`

The `backTo` function:

1. Gets the back URL from `history.state.back` (or custom source)
2. Checks if the back URL is in the allowed list
3. Navigates to the back URL if allowed, otherwise uses the fallback
4. Supports both exact and prefix matching for allowed URLs

## Examples

Check out the [examples](https://github.com/Kenshin0011/komori-kit/tree/main/examples) for interactive demos.

## Requirements

- Vue 3.3+
- Vue Router 4.2+

## License

MIT