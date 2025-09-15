# komori-kit

A monorepo of Vue.js utilities and composables.

## Packages

### [@komori-kit/vue-query-params](./packages/vue-query-params)

Synchronize Vue state with URL query parameters for search, pagination, and more.

[![npm](https://img.shields.io/npm/v/@komori-kit/vue-query-params.svg)](https://www.npmjs.com/package/@komori-kit/vue-query-params)

```bash
npm install @komori-kit/vue-query-params
```

### [@komori-kit/vue-router-helpers](./packages/vue-router-helpers)

Headless helpers for vue-router.

[![npm](https://img.shields.io/npm/v/@komori-kit/vue-router-helpers.svg)](https://www.npmjs.com/package/@komori-kit/vue-router-helpers)

```bash
npm install @komori-kit/vue-router-helpers
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Type check all packages
pnpm typecheck

# Lint and format
pnpm lint-all
pnpm format

# Run examples
pnpm examples

# Create changeset
pnpm changeset
```

## Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing. When you create a changeset and merge it to main, the CI will automatically:

- Create a "Release" pull request with updated versions and changelogs
- Publish packages to npm when the release PR is merged

To create a changeset:

```bash
pnpm changeset
```

## License

MIT
