/**
 * 构建并打包 _site 为 zip 发行版
 * 用法：npm run release [-- 1.2.3]
 *       不传版本号时，自动用 <package.json 版本>-<日期>-<commit-hash>
 *
 * 输出：dist/hjx-25pc1.github.io-<version>.zip
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// archiver v7 的 CJS 导出是 { Archiver, ZipArchive, ... } 对象，
// 而非早期版本的工厂函数；这里做兼容处理。
const archiverMod = require('archiver');
const ZipArchive = archiverMod.ZipArchive || archiverMod;

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const SITE_DIR = path.join(ROOT, '_site');
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

function shortHash() {
    try {
        return execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
    } catch {
        return 'nogit';
    }
}

function getVersion() {
    const cliVer = process.argv[2];
    if (cliVer) return cliVer.replace(/^v/, '');

    const base = PKG.version || '0.0.0';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `${base}-${date}-${shortHash()}`;
}

function build() {
    console.log('> 正在构建 _site ...');
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
}

function zip(version) {
    if (!fs.existsSync(SITE_DIR)) {
        throw new Error('未找到 _site 目录，请先 npm run build');
    }

    fs.mkdirSync(DIST_DIR, { recursive: true });
    const zipName = `hjx-25pc1.github.io-${version}.zip`;
    const zipPath = path.join(DIST_DIR, zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            console.log(`> 已生成 ${zipPath}（${archive.pointer()} bytes）`);
            resolve();
        });
        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') console.warn('> warn:', err);
            else reject(err);
        });
        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(SITE_DIR, false);
        archive.finalize();
    });
}

async function main() {
    const version = getVersion();
    build();
    await zip(version);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
