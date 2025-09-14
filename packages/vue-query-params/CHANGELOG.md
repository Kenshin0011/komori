# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.0] - 2024-09-14

### Added

- Initial release of `@komori-kit/vue-query-params`
- `usePagination` composable for managing pagination state with URL synchronization
- `useSearch` composable for managing search state with URL synchronization
- `paginationQuerySchema` Zod schema for validating pagination query parameters
- TypeScript support with complete type definitions
- Vue 3.3+ and Vue Router 4.2+ compatibility
- ESM and CommonJS module support
- Automatic URL query parameter synchronization
- Built-in debouncing for search inputs
- Page size management with customizable options

### Features

- **Pagination Management**: Handle page, pageSize, total items with URL sync
- **Search Management**: Debounced search input with URL parameter binding
- **Type Safety**: Full TypeScript support with Zod validation
- **SSR Ready**: Works with server-side rendering
- **Framework Agnostic**: Uses Vue 3 Composition API patterns
- **Tree Shakeable**: Modular exports for optimal bundle size

### Dependencies

- Vue 3.3.0 or higher (peer dependency)
- Vue Router 4.2.0 or higher (peer dependency)
- Zod 3.24.1 for schema validation
