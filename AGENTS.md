## Development

Do NOT run `npm run dev` or `astro dev`. For verification, use `npm run build` only:

```bash
npm run build
```

The build output goes to `dist/`. Inspect `dist/index.html` to verify the result.

## Git commit

Please use English to write git commit to push. Use Conventional Commits.

### Commit Message Format

```
<type>[optional scope]: <subject>

[optional body]

[optional footer]
```

### 1. Type (required)

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style (formatting, semicolons, etc.) — no logic change |
| `refactor` | Code refactoring — neither a fix nor a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process or tooling changes — no production code change |

### 2. Scope (optional)

A short identifier in parentheses indicating the module or component affected.

Example: `feat(auth): add biometric login`

### 3. Subject (required)

- Written in **imperative** mood (e.g., “add” not “added”)
- **Lowercase** first letter
- No period (`.`) at the end
- Max **50 characters**

### 4. Body (optional)

Used to explain **what** changed and **why**, especially for complex changes.

- Wrap at **72 characters** per line
- Focus on motivation and contrast with previous behavior

### 5. Footer (optional)

Used for:

- **Breaking changes** — start with `BREAKING CHANGE:`
- **Closing issues** — e.g., `Closes #123`, `Fixes #456`

### Full Example

```
feat(payment): integrate WeChat Pay V3 API

Support JSAPI unified order and callback signature verification.
Resolves certificate expiration issue in the legacy implementation.

Closes #456
```

### Rules Summary

| Rule | Constraint |
|------|------------|
| Subject length | ≤ 50 characters |
| Body line length | ≤ 72 characters |
| Subject language | Imperative, lowercase, no period |
| Types | Must use one of the predefined types above |


## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
