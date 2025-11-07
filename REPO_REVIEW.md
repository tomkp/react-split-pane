# Repository Review: react-split-pane

**Review Date:** November 7, 2025
**Version:** 0.1.92
**Last Update:** August 10, 2020

## Executive Summary

`react-split-pane` is a mature React component library for creating resizable split panes. The codebase is well-structured and functional, but shows signs of maintenance lag with outdated dependencies and limited recent activity. The project has good documentation and follows best practices in many areas, though several improvements are recommended for modernization and maintainability.

---

## 1. Code Quality & Architecture

### Strengths

- **Clean Component Structure**: Well-organized code with clear separation of concerns
  - `SplitPane.js` (393 lines): Main component with drag/resize logic
  - `Resizer.js` (70 lines): Resizer bar component
  - `Pane.js` (56 lines): Individual pane component

- **Modern React Patterns**: Uses lifecycle methods appropriately
  - Implements `getDerivedStateFromProps` for controlled components
  - Proper event listener cleanup in `componentWillUnmount`
  - Uses `React.PureComponent` for performance optimization in Pane

- **Comprehensive PropTypes**: All components have thorough prop validation

- **Good Code Organization**: Small, focused files with single responsibilities

### Areas for Improvement

1. **Class Components**: Uses legacy class components instead of functional components with hooks
   - Consider migrating to functional components with `useState`, `useEffect`, and `useRef`
   - Would reduce bundle size and improve maintainability

2. **Outdated Polyfills**: Uses `react-lifecycles-compat` which is unnecessary for React 16.3+
   ```javascript
   // src/SplitPane.js:4
   import { polyfill } from 'react-lifecycles-compat';
   ```

3. **Legacy Ref Pattern**: Uses callback refs instead of `React.createRef()` or `useRef()`
   ```javascript
   // src/SplitPane.js:306-308
   ref={node => {
     this.splitPane = node;
   }}
   ```

4. **State Management Complexity**: `getSizeUpdate` static method adds complexity
   - Line 205-235 in SplitPane.js
   - Could be simplified with hooks

5. **Touch Event Normalization**: Creates synthetic touch events from mouse events
   ```javascript
   // src/SplitPane.js:87-92
   onMouseDown(event) {
     const eventWithTouches = Object.assign({}, event, {
       touches: [{ clientX: event.clientX, clientY: event.clientY }],
     });
     this.onTouchStart(eventWithTouches);
   }
   ```
   - This pattern works but adds unnecessary complexity

---

## 2. Dependencies & Security

### Production Dependencies (All OK)

```json
{
  "prop-types": "^15.7.2",           // Latest: 15.8.1 (minor update available)
  "react-lifecycles-compat": "^3.0.4", // UNNECESSARY for React 16.3+
  "react-style-proptype": "^3.2.2"    // Up to date
}
```

### Security Status

- **Production Dependencies**: 0 vulnerabilities found ✅
- **Development Dependencies**: Not audited (many are outdated)

### Concerns

1. **React Versions**: Peer dependency on React 16 is outdated
   - Current React version: 18.x
   - Library uses React 16 patterns and APIs
   - Should update to support React 17-18 features

2. **Unnecessary Dependencies**:
   - `react-lifecycles-compat` can be removed entirely
   - Direct React 16.3+ support makes it obsolete

3. **Development Dependencies**: Many packages are severely outdated
   - Rollup plugins use deprecated APIs
   - Babel configuration is multiple major versions behind
   - Storybook v5.x (current: v8.x)

---

## 3. Testing

### Current State

- **Test Framework**: Mocha + Chai
- **Test Files**: 3 files, 572 total lines
  - `default-split-pane-tests.js` (189 lines)
  - `horizontal-split-pane-tests.js` (174 lines)
  - `vertical-split-pane-tests.js` (209 lines)

### Strengths

- Tests cover core functionality
- Uses custom asserter pattern for readability
- Tests include StrictMode compatibility (line 165-188 in default tests)

### Weaknesses

1. **No Modern Testing Tools**: Uses outdated Mocha/Chai instead of Jest/React Testing Library
2. **Coverage Disabled**: Line 32 in `.github/workflows/build-test.yml` shows coverage is commented out
3. **Limited Interaction Testing**: Most tests check static rendering, not user interactions
4. **No Visual Regression Tests**: Important for a UI component library
5. **No E2E Tests**: No browser-based testing with tools like Playwright or Cypress

---

## 4. TypeScript Support

### Current Implementation

```typescript
// index.d.ts
export type Size = string | number;
export type Split = 'vertical' | 'horizontal';
export type SplitPaneProps = { /* 20+ props */ };
```

### Strengths

- Type definitions exist and are well-documented
- Covers all props and their types correctly
- Includes exports for both SplitPane and Pane components

### Issues

1. **Incomplete State Type**: `SplitPaneState` only defines 2 of ~6 actual state properties
   ```typescript
   // index.d.ts:31-34
   export type SplitPaneState = {
     active: boolean;
     resized: boolean;
   };
   ```
   Missing: `pane1Size`, `pane2Size`, `position`, `draggedSize`, `instanceProps`

2. **Missing `children` Prop in PropTypes**: Not properly typed
   - Line 28 in index.d.ts marks it optional, but it's required in PropTypes (line 354 in SplitPane.js)

3. **Should Use `.d.ts` Generation**: Manual type definitions lead to sync issues
   - Consider using TypeScript source files or automated generation

---

## 5. Build & Distribution

### Current Setup

- **Bundler**: Rollup
- **Output Formats**: CommonJS + ESM
- **Entry Points**:
  ```json
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "source": "src/index.js"
  ```

### Issues

1. **Outdated Rollup Plugins**:
   ```javascript
   // rollup.config.js
   import commonjs from 'rollup-plugin-commonjs';  // Deprecated
   import resolve from 'rollup-plugin-node-resolve'; // Deprecated
   ```
   Should use `@rollup/plugin-commonjs` and `@rollup/plugin-node-resolve`

2. **Missing Modern Features**:
   - No source maps configuration
   - No minification
   - No tree-shaking optimization
   - No exports field in package.json

3. **Build Script**: Uses Yarn but GitHub Actions could cache better

---

## 6. CI/CD

### Current Workflow

```yaml
name: Build Test
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
```

### Issues

1. **Node Version**: Pinned to Node 14.x (EOL: April 2023)
   - Should use Node 18.x LTS or 20.x LTS

2. **Actions Versions**: Using outdated action versions
   - `actions/checkout@v2` (current: v4)
   - `actions/setup-node@v1` (current: v4)

3. **Coverage Disabled**: Line 32 comments out coverage reporting
   ```yaml
   # run: yarn test:coverage
   ```

4. **No Matrix Testing**: Doesn't test across multiple Node/React versions

5. **No Automated Releases**: No semantic-release or publish workflow

---

## 7. Documentation

### Strengths

- **Comprehensive README**: Well-written with examples
- **Clear API Documentation**: All props explained with examples
- **Contribution Guidelines**: CONTRIBUTING.md with clear process
- **Code of Conduct**: CODE_OF_CONDUCT.md present
- **Changelog**: Maintained with standard-version

### Areas for Improvement

1. **Outdated Examples**: README mentions React 16
2. **No Migration Guide**: For v2 mentioned in README (lines 194-233)
3. **No API Reference**: Could benefit from generated docs
4. **Missing JSDoc Comments**: Source code lacks inline documentation
5. **Storybook Not Deployed**: Stories exist but no live demo link that works

---

## 8. Accessibility

### Current State

- Resizer uses `role="presentation"` (Resizer.js:24)
- No keyboard navigation support
- No ARIA attributes for pane relationships

### Required Improvements

1. **Keyboard Support**: Should support arrow keys for resizing
2. **Focus Management**: Resizer should be focusable with proper outline
3. **ARIA Attributes**:
   - `aria-valuemin`, `aria-valuemax`, `aria-valuenow` for current size
   - `aria-label` or `aria-labelledby` for screen readers
   - `role="separator"` instead of `role="presentation"`
4. **Announce Changes**: Screen readers should know when panes resize

---

## 9. Performance

### Current Optimizations

- `Pane` uses `PureComponent` for render optimization
- Event listeners properly cleaned up

### Potential Issues

1. **setState in Mouse Move**: Calls `setState` on every pixel during drag
   ```javascript
   // SplitPane.js:176-180
   this.setState({
     position: newPosition,
     resized: true,
   });
   ```
   - Could benefit from debouncing or RAF throttling

2. **Style Calculations**: Repeated `getBoundingClientRect()` calls
   - Lines 134-135 in SplitPane.js during drag
   - Could cache these values

3. **No Virtualization**: Fine for simple layouts, but could mention in docs

---

## 10. Browser Compatibility

### Legacy Code Present

```javascript
// SplitPane.js:10-17
if (document.selection) {
  document.selection.empty(); // IE-specific API
}
```

### Issues

1. **IE Support Unclear**: Code supports IE but not documented
2. **Touch Events**: Well-supported, good mobile compatibility
3. **Modern CSS**: Uses flexbox (well-supported)
4. **Vendor Prefixes**: Manual prefixes in style objects (lines 272-275)
   - Should use autoprefixer in build process

---

## 11. Project Maintenance

### Concerns

1. **Last Release**: August 10, 2020 (5+ years ago)
2. **README Mentions V2**: "I'm working on an updated version" (line 196)
   - PR #240 mentioned but status unclear
3. **Dependabot Alerts**: Recent commits show security fixes
   - Lines in git log show dependency updates from automated PRs
4. **Stale Dependencies**: Development environment severely outdated

### Recommendations

1. **Clarify Project Status**: Is this actively maintained?
2. **V2 Status**: What's the plan for the rewrite mentioned in README?
3. **Security Updates**: Establish regular dependency update schedule
4. **Maintainer Count**: Consider adding co-maintainers

---

## 12. Package Configuration

### Issues in package.json

1. **Missing Fields**:
   ```json
   "sideEffects": false,  // Could enable better tree-shaking
   "exports": {},         // Modern entry point resolution
   "engines": {},         // No Node version requirements specified
   ```

2. **Script Issues**:
   - `website:start` script not defined but referenced in CONTRIBUTING.md
   - Should be `"start": "parcel website/index.html"`

3. **Husky Configuration**: Uses old Husky v4 format
   ```json
   "husky": {
     "hooks": {
       "pre-commit": "pretty-quick --staged"
     }
   }
   ```
   - Husky v8+ uses different setup

---

## Priority Recommendations

### High Priority (Critical)

1. **Update CI Node Version**: Move to Node 18 or 20 LTS
2. **Fix TypeScript Definitions**: Complete the state type definition
3. **Security Updates**: Update development dependencies with known vulnerabilities
4. **Clarify Maintenance Status**: Add note to README about project status

### Medium Priority (Important)

5. **Remove Unnecessary Dependencies**: Drop `react-lifecycles-compat`
6. **Update Rollup Plugins**: Use modern @rollup/* scoped packages
7. **Add Keyboard Accessibility**: Implement keyboard navigation for a11y
8. **Enable Test Coverage**: Re-enable coverage reporting in CI
9. **Modern React Version**: Update peer dependencies to React 17-18

### Low Priority (Nice to Have)

10. **Migrate to Hooks**: Convert class components to functional components
11. **Add Visual Regression Tests**: Use Chromatic or similar
12. **Generate Type Definitions**: Move to TypeScript source or use automated generation
13. **Improve Storybook**: Update to v8 and deploy live version
14. **Performance Optimizations**: Add RAF throttling for drag events
15. **Add ESLint Plugins**: Add react-hooks and jsx-a11y linting rules

---

## Conclusion

`react-split-pane` is a well-designed component library with solid fundamentals. The code is clean and functional, but the project shows signs of reduced maintenance with outdated dependencies and missing modern features. The library would benefit significantly from:

1. Modernization of dependencies and build tooling
2. Migration to functional components and hooks
3. Improved accessibility support
4. Better TypeScript integration
5. Clarification of project maintenance status and V2 roadmap

**Overall Grade: B-**
- Code Quality: A-
- Testing: C+
- Documentation: B+
- Maintenance: C-
- Security: B+
- Accessibility: D

The library is production-ready for its current feature set, but potential users should be aware of the maintenance status and lack of modern React patterns.
