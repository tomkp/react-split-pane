# Contributing to React Split Pane

[Bug Reports](#bugs) | [Feature Requests](#features) | [Pull Requests](#pull-requests) | [Development Setup](#development-setup) | [Running Tests](#running-tests)

Thank you for considering contributing to React Split Pane! Please take a moment to review this document to make the contribution process easy and effective.

## Using the Issue Tracker

The issue tracker is the preferred channel for bug reports and feature requests. Please respect these guidelines:

- **Do not** use the issue tracker for personal support requests.
- **Do not** derail or troll issues. Keep discussions on topic.

<a name="bugs"></a>

## Bug Reports

A bug is a _demonstrable problem_ caused by the code in the repository. Good bug reports are extremely helpful!

Guidelines for bug reports:

1. **Search first** — Check if the issue has already been reported.
2. **Test latest** — Try to reproduce it using the latest `master` branch.
3. **Isolate** — Create a minimal reproduction using [CodeSandbox](https://codesandbox.io/) or [StackBlitz](https://stackblitz.com/).

A good bug report includes:

- React Split Pane version
- React version
- Browser and OS
- Steps to reproduce
- Expected vs actual behavior
- Link to reproduction

<a name="features"></a>

## Feature Requests

Feature requests are welcome! Please provide:

- Clear use case
- Why existing features don't solve your problem
- API suggestions (if applicable)
- Examples from similar libraries (if applicable)

<a name="pull-requests"></a>

## Pull Requests

Good pull requests are a fantastic help! They should remain focused and avoid unrelated changes.

**Please ask first** before starting significant work (new features, major refactoring). Open an issue to discuss your idea.

### Pull Request Process

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/<your-username>/react-split-pane
   cd react-split-pane
   git remote add upstream https://github.com/tomkp/react-split-pane
   ```

2. Create a branch from `master`:

   ```bash
   git checkout master
   git pull upstream master
   git checkout -b my-feature
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Make your changes, following the [code style](#code-style).

5. Add tests for new functionality.

6. Ensure all tests pass:

   ```bash
   npm test
   ```

7. Ensure code passes linting:

   ```bash
   npm run lint
   ```

8. Commit with a clear message:

   ```bash
   git commit -m "feat: add new feature"
   ```

9. Push and open a pull request against `master`:

   ```bash
   git push origin my-feature
   ```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation only
- `style:` — Formatting, no code change
- `refactor:` — Code change that neither fixes a bug nor adds a feature
- `test:` — Adding or fixing tests
- `chore:` — Build process or auxiliary tools

<a name="development-setup"></a>

## Development Setup

### Prerequisites

- Node.js 20+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/tomkp/react-split-pane
cd react-split-pane

# Install dependencies
npm install

# Start the development server (examples)
npm run dev
```

The examples will be available at http://localhost:5173

### Project Structure

```
src/
├── components/       # React components (SplitPane, Pane, Divider)
├── hooks/           # React hooks (useResizer, useKeyboardResize)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── test/            # Test setup
└── index.ts         # Main entry point

examples/            # Example applications
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start examples dev server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run build` | Build for production |
| `npm run typecheck` | Run TypeScript type checking |

<a name="running-tests"></a>

## Running Tests

All tests must pass before a pull request will be merged.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place tests next to the code they test (e.g., `useResizer.test.ts`)
- Use descriptive test names
- Test both success and error cases
- For hooks, use `@testing-library/react` and `renderHook`

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useResizer } from './useResizer';

describe('useResizer', () => {
  it('initializes with provided sizes', () => {
    const { result } = renderHook(() =>
      useResizer({
        direction: 'horizontal',
        sizes: [300, 700],
        minSizes: [100, 100],
        maxSizes: [500, 900],
      })
    );

    expect(result.current.currentSizes).toEqual([300, 700]);
  });
});
```

<a name="code-style"></a>

## Code Style

- **TypeScript** — All code must be typed
- **ESLint** — Run `npm run lint` before committing
- **Prettier** — Code is auto-formatted
- **No `any`** — Avoid `any` types; use `unknown` if necessary
- **Functional** — Prefer functional components and hooks
- **Comments** — Add JSDoc comments to exported functions

### Example Component

```typescript
import type { CSSProperties } from 'react';

interface MyComponentProps {
  /** Description of the prop */
  value: string;
  /** Optional prop with default */
  size?: number;
}

/**
 * Description of the component.
 *
 * @example
 * ```tsx
 * <MyComponent value="hello" />
 * ```
 */
export function MyComponent({ value, size = 10 }: MyComponentProps) {
  // Implementation
}
```

## License

By contributing, you agree to license your work under the [MIT License](./LICENSE).
