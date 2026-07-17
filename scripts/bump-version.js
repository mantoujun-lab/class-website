/**
 * Bump package.json 的 version 字段
 *
 * 用法：
 *   node scripts/bump-version.js patch       # 1.2.3 → 1.2.4
 *   node scripts/bump-version.js minor       # 1.2.3 → 1.3.0
 *   node scripts/bump-version.js major       # 1.2.3 → 2.0.0
 *   node scripts/bump-version.js 1.3.0       # 显式指定
 *   node scripts/bump-version.js 1.3.0-rc.1  # 预发行版（可带后缀）
 *
 * 行为：
 *   - 改 package.json 的 version 字段
 *   - 同时改 package-lock.json 的 version 字段（如果存在）
 *   - 默认自动 git add + commit（可用 --no-commit 关闭）
 *   - 不自动打 tag、不自动 push，由用户自己决定
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');
const LOCK_PATH = path.join(ROOT, 'package-lock.json');

// 解析 SemVer：[主版本, 次版本, 修订号, 预发行标识]
function parseSemver(v) {
    const m = String(v).match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
    if (!m) return null;
    return {
        major: Number(m[1]),
        minor: Number(m[2]),
        patch: Number(m[3]),
        pre: m[4] || '',
    };
}

function bump(base, level) {
    const parsed = parseSemver(base);
    if (!parsed) throw new Error(`当前版本号 "${base}" 不是合法的 SemVer 格式`);

    // 显式指定 → 直接返回
    if (/^\d/.test(level)) {
        if (!parseSemver(level)) {
            throw new Error(`"${level}" 不是合法的版本号（应为 X.Y.Z 或 X.Y.Z-后缀）`);
        }
        return level;
    }

    // 升级类型
    if (level === 'major') return `${parsed.major + 1}.0.0`;
    if (level === 'minor') return `${parsed.major}.${parsed.minor + 1}.0`;
    if (level === 'patch') {
        return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
    }
    throw new Error(`未知的升级类型 "${level}"（支持：major / minor / patch / 显式版本号）`);
}

function updatePackageVersion(newVersion) {
    const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
    const old = pkg.version;
    pkg.version = newVersion;
    fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 4) + '\n');
    console.log(`> package.json: ${old} → ${newVersion}`);

    if (fs.existsSync(LOCK_PATH)) {
        const lock = JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'));
        if (lock.version) {
            lock.version = newVersion;
            fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 4) + '\n');
            console.log(`> package-lock.json: ${old} → ${newVersion}`);
        }
    }
}

function gitCommit(newVersion) {
    const files = ['package.json'];
    if (fs.existsSync(LOCK_PATH)) files.push('package-lock.json');
    execSync(`git add ${files.join(' ')}`, { cwd: ROOT, stdio: 'inherit' });
    execSync(`git commit -m "chore(release): bump to ${newVersion}"`, {
        cwd: ROOT,
        stdio: 'inherit',
    });
    console.log('> 已 commit，可手动 git push');
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        throw new Error('请指定升级类型或目标版本号，例如：npm run bump -- patch');
    }

    const noCommit = args.includes('--no-commit');
    const level = args.find((a) => !a.startsWith('--'));

    const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
    const current = pkg.version || '0.0.0';
    const next = bump(current, level);

    console.log(`当前版本: ${current}`);
    console.log(`新版本:   ${next}`);
    updatePackageVersion(next);

    if (!noCommit) {
        try {
            gitCommit(next);
        } catch (err) {
            console.warn('> 自动 commit 失败（可能没有 git 仓库或没有变更），请手动处理');
        }
    }
}

try {
    main();
} catch (err) {
    console.error(err.message);
    process.exit(1);
}
