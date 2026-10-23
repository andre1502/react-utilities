import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const tempDir = path.join(rootDir, '.test-standalone-consumer');

console.log('🚀 Starting Standalone Consumer Integration Test...');
console.log('📦 Testing package via local npm pack & npm install (no publishing/pushing)\n');

let packedTarball = null;

try {
  // 1. Ensure build exists
  console.log('🔨 Step 1: Building distribution bundle...');
  execSync('yarn build', { cwd: rootDir, stdio: 'inherit' });

  // 2. Pack the package locally
  console.log('\n📦 Step 2: Creating local package tarball via npm pack...');
  const packOutput = execSync('npm pack', { cwd: rootDir, encoding: 'utf-8' }).trim();
  const tarballName = packOutput.split('\n').filter(Boolean).pop();
  packedTarball = path.join(rootDir, tarballName);
  console.log(`   Tarball created: ${tarballName}`);

  // 3. Set up isolated test directory
  console.log('\n📁 Step 3: Initializing isolated standalone test project...');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Create consumer package.json
  const consumerPackageJson = {
    name: 'standalone-consumer-test',
    version: '1.0.0',
    private: true,
    type: 'module',
  };
  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify(consumerPackageJson, null, 2),
  );

  // 4. Install the locally packed tarball
  console.log('\n📥 Step 4: Installing local tarball via npm install...');
  execSync(`npm install "${packedTarball}" --no-package-lock`, {
    cwd: tempDir,
    stdio: 'inherit',
  });

  // 5. Create consumer tsconfig.json
  const consumerTsConfig = {
    compilerOptions: {
      target: 'ESNext',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true,
    },
    include: ['test.ts'],
  };
  fs.writeFileSync(
    path.join(tempDir, 'tsconfig.json'),
    JSON.stringify(consumerTsConfig, null, 2),
  );

  // 6. Create consumer test file verifying types and runtime
  const testScriptContent = `
import {
  formatAccountNumber,
  formatNumber,
  getCurrencySymbol,
  parseFormatNumber,
  parseQueryString,
  getUniquePermutations,
  padNumber,
  getV,
} from '@andre1502/react-utilities';

import {
  formatAccountNumber as formatAccountSub,
  formatNumber as formatNumberSub,
} from '@andre1502/react-utilities/format';

import {
  parseQueryString as parseQuerySub,
  getUniquePermutations as getPermSub,
} from '@andre1502/react-utilities/utils';

import { initI18n } from '@andre1502/react-utilities/i18n';
import { useSound, useDevice, useSEStore, useWebSocket } from '@andre1502/react-utilities/hooks';
import { initSentry } from '@andre1502/react-utilities/sentry';

console.log('   -> Running assertions inside standalone consumer...');

// Test 1: formatAccountNumber
const account = formatAccountNumber('1234567890123456', ' ');
if (account !== '1234 5678 9012 3456') {
  throw new Error('formatAccountNumber failed: ' + account);
}

// Test 2: formatNumber & parseFormatNumber
const formattedNumber = formatNumber({
  lang: 'en-US',
  currency: 'USD',
  value: 1234.56,
  showValue: true,
  showCurrency: true,
});
if (!formattedNumber.includes('1,235') || !formattedNumber.includes('US$')) {
  throw new Error('formatNumber failed: ' + formattedNumber);
}

const parsedNumber = parseFormatNumber('en-US', '1,234.56');
if (parsedNumber !== 1234.56) {
  throw new Error('parseFormatNumber failed: ' + parsedNumber);
}

// Test 3: parseQueryString with prototype pollution protection
const parsedQuery = parseQueryString('https://example.com/api?user=john&token=abc=123&__proto__[polluted]=true');
if (parsedQuery.user !== 'john' || parsedQuery.token !== 'abc=123') {
  throw new Error('parseQueryString values mismatch');
}
const testObj: any = {};
if (testObj.polluted) {
  throw new Error('PROTOTYPE POLLUTION DETECTED!');
}

// Test 4: getUniquePermutations with maxLength guard
const perms = getUniquePermutations(['A', 'B', 'C'], 2);
if (perms.length !== 6) {
  throw new Error('getUniquePermutations expected 6 perms, got: ' + perms.length);
}

let caughtLimit = false;
try {
  getUniquePermutations(['A', 'B', 'C', 'D'], 3, 2);
} catch (e: any) {
  caughtLimit = true;
}
if (!caughtLimit) {
  throw new Error('getUniquePermutations maxLength guard failed');
}

// Test 5: Verify subpath exports exist and are callable
if (typeof formatAccountSub !== 'function' || typeof parseQuerySub !== 'function' || typeof initI18n !== 'function') {
  throw new Error('Subpath exports failed');
}
if (typeof useSound !== 'function' || typeof useDevice !== 'function' || typeof useSEStore !== 'function' || typeof useWebSocket !== 'function') {
  throw new Error('Hooks subpath exports failed');
}
if (typeof initSentry !== 'function') {
  throw new Error('Sentry subpath exports failed');
}

// Test 6: Verify TypeScript types resolve properly (e.g. Howl from @types/howler)
type SoundHookReturn = ReturnType<typeof useSound>;
const dummySoundTuple: SoundHookReturn = [null];
if (dummySoundTuple[0] !== null) {
  throw new Error('Type inference test failed');
}

console.log('   -> All consumer assertions passed successfully!');
`;
  fs.writeFileSync(path.join(tempDir, 'test.ts'), testScriptContent);

  // 7. Verify TypeScript type checking on the consumer
  console.log('\n🔍 Step 5: Checking consumer TypeScript compilation (tsc --noEmit)...');
  execSync('npx tsc --noEmit', { cwd: tempDir, stdio: 'inherit' });
  console.log('   ✅ Consumer TypeScript validation passed with 0 errors.');

  // 8. Execute runtime test in Node
  console.log('\n⚡ Step 6: Executing standalone consumer code in Node...');
  execSync('npx tsx test.ts', { cwd: tempDir, stdio: 'inherit' });
  console.log('   ✅ Consumer runtime execution completed successfully.');

  console.log('\n🎉 Standalone consumer integration test PASSED completely!\n');
} catch (err) {
  console.error('\n❌ Standalone consumer test FAILED:', err);
  process.exit(1);
} finally {
  // 9. Clean up temporary files
  console.log('🧹 Cleaning up local test artifacts...');
  if (packedTarball && fs.existsSync(packedTarball)) {
    try {
      fs.unlinkSync(packedTarball);
      console.log(`   Removed local tarball: ${path.basename(packedTarball)}`);
    } catch (_) {}
  }
  if (fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('   Removed isolated consumer directory: .test-standalone-consumer/');
    } catch (_) {}
  }
}
