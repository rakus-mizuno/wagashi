import { exec } from 'child_process';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const args = process.argv.slice(2);
const packageName = args[0];

if (!packageName) {
  console.error('Error: Package name is required');
  console.error('Usage: tsx src/zip.ts <packageName>');
  console.error('Example: tsx src/zip.ts akafuku');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');

const packagePath = join(projectRoot, 'packages', packageName);
const packageJsonPath = join(packagePath, 'package.json');
const packageDistPath = join(packagePath, 'dist');

if (!existsSync(packagePath)) {
  console.error(`Error: Package "${packageName}" does not exist at ${packagePath}`);
  process.exit(1);
}

if (!existsSync(packageJsonPath)) {
  console.error(`Error: package.json for "${packageName}" does not exist at ${packageJsonPath}`);
  process.exit(1);
}

let name: string, versionSuffix: string;
try {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  name = packageJson.name || packageName;
  versionSuffix = typeof packageJson.version === 'string' ? `-v${packageJson.version}` : '';
} catch (error) {
  console.error(`Error reading package.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
  process.exit(1);
}

if (!existsSync(packageDistPath)) {
  console.error(`Error: Dist directory for package "${packageName}" does not exist at ${packageDistPath}`);
  console.error(`Make sure to build the package first with: pnpm ${packageName}:build`);
  process.exit(1);
}

const releasePath = join(projectRoot, 'release');
if (!existsSync(releasePath)) {
  mkdirSync(releasePath, { recursive: true });
  console.log(`Created release directory at ${releasePath}`);
}

const zipFileName = `${name}${versionSuffix}.zip`;
const zipFilePath = join(releasePath, zipFileName);

console.log(`Creating zip file for ${name}...`);

exec(`cd ${packageDistPath} && zip -r "${zipFilePath}" .`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
  console.log(`Successfully created ${zipFileName} in the release directory.`);
});
