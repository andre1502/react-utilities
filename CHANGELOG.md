# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2026-10-23

### Security
- **Patched Critical CVE-2026-9277**: Enforced `shell-quote` resolution (`^1.9.0`) to fix command injection via unescaped newlines in object `.op` values.
- **Fixed SSRF in i18next-http-backend (CVE-2026-105800)**: Upgraded `i18next-http-backend` to `^4.0.4`.
- **Patched Transitive CVEs via Package Resolutions**:
  - `undici` (`^6.28.1`): Patched WebSocket client DoS (CVE-2026-12151, CVE-2026-19534), CRLF injection (CVE-2026-15157), and header injection (CVE-2026-9679).
  - `qs` (`^6.16.0`): Patched remote DoS and array-limit bypass (CVE-2026-8723, CVE-2026-82562, CVE-2026-82417).
  - `fast-uri` (`^3.1.8`): Patched host confusion and SSRF (CVE-2026-6322, CVE-2026-75975, CVE-2026-76172).
  - `postcss` (`^8.5.23`): Patched path traversal and arbitrary map disclosure (CVE-2026-45623, CVE-2026-73646).
  - `nanoid` (`^3.3.18`): Patched infinite loop and integer overflow (CVE-2026-67214, CVE-2026-67213, CVE-2026-73086).
  - `brace-expansion` (`^2.1.7`): Patched stack exhaustion and exponential DoS (CVE-2026-13149, CVE-2026-14257, etc.).
  - `browserslist` (`^4.28.7`): Patched unbounded memory growth and prototype writes (CVE-2026-73089, CVE-2026-73088).
  - `source-map-js` (`^1.2.2`): Patched event loop DoS (CVE-2026-93749).
  - `image-size` (`^2.0.3`): Patched infinite loop DoS (CVE-2025-71329, CVE-2025-71330).
  - `ws` (`^7.5.11`): Patched memory exhaustion DoS (CVE-2026-48779).
  - `@humanfs/node` (`^0.16.8`): Patched directory traversal symlink copying.
- **Prevent Credential Leaks**: Added `google_application_credentials.json`, `*.credentials.json`, and `.env*` to `.gitignore`.
- **Prevent Code & Env Injection**: In `src/Config/Config.ts`, used `JSON.stringify` and newline sanitization for config value export instead of raw string interpolation.
- **Prototype Pollution Defense**: Hardened `parseQueryString` in `src/Utils/Utils.ts` with `URLSearchParams` and blocklists for `__proto__`, `constructor`, and `prototype`.
- **Algorithmic DoS Protection**: Added optional `maxLength` parameter to `getUniquePermutations` in `src/Utils/Utils.ts` to guard against factorial CPU lockup.
- **Sensitive Header Redaction**: In `src/Sentry/Utils.ts`, redacted `Authorization`, `Cookie`, `x-api-key`, and token headers from recorded Sentry HTTP data.
- **Sensitive Data Logging Protection**: Removed raw config dumping to `console.log` in `src/Config/Output.ts` and incoming WebSocket message logging in `src/Hooks/useWebSocket.ts`.
- **Privacy Defaults**: Made `sendDefaultPii` and `attachScreenshot` configurable in Sentry initialization, defaulting to `false`.

### Added
- **Unit Test Suite (`yarn test:unit`)**: Added Vitest test runner with 40 unit tests covering `Format` (number, account, currency parsing), `Utils` (query string parsing, prototype pollution defense, permutations, path helpers), `Pagination`, `Array` utils, `I18n` initialization, and `Sentry` context sanitization.
- **Automated Standalone Pack-and-Test Runner (`yarn test:standalone`)**: Added `scripts/test-standalone.mjs` which builds `dist/`, creates a local tarball via `npm pack`, installs it into an isolated temporary consumer project, verifies consumer TypeScript typing (`tsc --noEmit`) across root and subpaths (`/format`, `/hooks`, `/i18n`, `/sentry`, `/utils`), asserts runtime execution, and performs complete cleanup offline.
- **CI/CD Test Gate**: Updated `.github/workflows/npm-publish.yml` with a two-job pipeline (`test` -> `publish`) ensuring all unit tests and standalone pack-and-test pass before any NPM release can proceed.
- **Publish Safety Hook**: Configured `"prepublishOnly": "yarn test && yarn build"` in `package.json` to prevent accidental manual publishing without passing tests.

### Fixed
- Fixed `oldPath` construction bug in `changeEntry` (`src/Config/Config.ts`).
- Fixed unhandled exception crash when `readdir` encounters an error in `deleteFile` (`src/Utils/Files.ts`).
- Fixed React state mutation bug in `useWebSocket` hook (`src/Hooks/useWebSocket.ts`).
- Fixed RegExp character class escaping in `NumberParser` (`src/Format/NumberParser.ts`).
- Fixed missing locale data runtime error in `formatNumber` and `NumberParser` (`src/Format/NumberFormat.ts`, `src/Format/NumberParser.ts`) by utilizing standard `Intl.NumberFormat` when available with fallback to `@formatjs/intl-numberformat`.
- Fixed invalid Yarn resolution syntax (`baseline-browser-mapping: "latest"` -> `"^2.11.0"`).

### Changed
- Bumped `vite` to `^8.3.5`.
- Retained `@types/howler` and `@types/lodash-es` in `dependencies` for seamless consumer TypeScript support.
- Added `@sentry/react` to `devDependencies` and optional `peerDependencies`.
- Updated `README.md` with new `## Utils` documentation (`parseQueryString`, `getUniquePermutations`, `Pagination`), `## Testing` instructions, and Sentry peer dependency usage.

---

## [1.0.8] - 2026-10-23
- Documentation improvements for local testing workflows (`yalc`, `npm pack`).
- Environment configuration updates.
