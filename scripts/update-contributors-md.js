/**
 * 拉取当前仓库的贡献者列表，生成可点击跳转的 Markdown 头像墙，
 * 然后替换 README.md / src/zh-cn/index.md / src/en/index.md 中的占位符。
 *
 * 占位符格式（每个文件都需要这一对标记）：
 *   <!-- CONTRIBUTORS START -->
 *   （这里的内容会被整个替换）
 *   <!-- CONTRIBUTORS END -->
 *
 * 用法:
 *   GITHUB_TOKEN=xxx GITHUB_REPOSITORY=owner/repo node scripts/update-contributors-md.js
 *   或（在仓库内）
 *   npm run generate:contributors
 *
 * 依赖: 无（只使用 Node.js 内置 fetch / fs / path）
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const AVATAR_WIDTH = 80; // 头像宽度（px）
const MAX_CONTRIBUTORS = 100;
const START_MARK = '<!-- CONTRIBUTORS START -->';
const END_MARK = '<!-- CONTRIBUTORS END -->';

// 需要更新贡献者区块的目标文件（相对于仓库根）
// 项目采用目录隔离的 i18n 架构，语言版本首页分别在 src/zh-cn/index.md 和 src/en/index.md；
// 根路径 / 由 src/index-redirect.md 处理（JS 跳板，不含贡献者区块），不在此列。
const TARGET_FILES = [
    'README.md',
    'src/zh-cn/index.md',
    'src/en/index.md',
];
// ========================

function envOrThrow(name) {
    const v = process.env[name];
    if (!v) {
        throw new Error(`缺少环境变量: ${name}`);
    }
    return v;
}

/**
 * 拉取 GitHub 贡献者列表。
 */
async function fetchContributors(repo, token) {
    const url = `https://api.github.com/repos/${repo}/contributors?per_page=100&anon=true`;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'contributors-md-generator',
            'X-GitHub-Api-Version': '2022-11-28',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API 调用失败: ${res.status} ${res.statusText}\n${text}`);
    }
    const data = await res.json();
    return data.filter(c => c && c.login);
}

/**
 * 把单个贡献者转换为 Markdown 行。
 * 头像用 `?v=4` 风格的 GitHub avatar URL，width 80px。
 */
function contributorToMd(c) {
    const href = c.html_url || `https://github.com/${c.login}`;
    // avatar_url 形如 https://avatars.githubusercontent.com/u/123?v=4
    // 去掉已有 query，保证最终 URL 干净
    const avatarBase = c.avatar_url ? c.avatar_url.split('?')[0] : '';
    return `<a href="${href}" title="${c.login}"><img src="${avatarBase}?v=4" width="${AVATAR_WIDTH}" alt="${c.login}"/></a>`;
}

/**
 * 构造完整的内容（用换行连接所有头像）。
 */
function buildContributorsBlock(contributors) {
    if (contributors.length === 0) {
        return '<!-- 暂无贡献者 -->';
    }
    return contributors.map(contributorToMd).join('\n');
}

/**
 * 在指定文件中替换占位符之间的内容。
 * 返回 { changed, newContent }。
 */
function replaceInFile(filePath, newBlock) {
    if (!fs.existsSync(filePath)) {
        console.warn(`  ! 跳过（文件不存在）: ${filePath}`);
        return { changed: false };
    }
    const original = fs.readFileSync(filePath, 'utf8');
    const re = new RegExp(`${escapeRegExp(START_MARK)}[\\s\\S]*?${escapeRegExp(END_MARK)}`, 'm');
    if (!re.test(original)) {
        console.warn(`  ! 跳过（未找到占位符）: ${filePath}`);
        return { changed: false };
    }
    const updated = original.replace(re, `${START_MARK}\n${newBlock}\n${END_MARK}`);
    if (updated === original) {
        return { changed: false };
    }
    fs.writeFileSync(filePath, updated, 'utf8');
    return { changed: true };
}

function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Fallback 占位数据（API 拉取失败且未传 ALLOW_FALLBACK 时使用）。
 */
function getFallbackContributors() {
    return [
        { login: 'mantoujun12', contributions: 100, html_url: 'https://github.com/mantoujun12', avatar_url: 'https://avatars.githubusercontent.com/u/202384594?v=4' },
    ];
}

async function main() {
    const repo = envOrThrow('GITHUB_REPOSITORY');
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

    console.log(`▶ 拉取 ${repo} 的贡献者列表…`);
    let contributors;
    try {
        contributors = await fetchContributors(repo, token);
    } catch (err) {
        console.warn(`  ! 拉取失败: ${err.message}`);
        if (process.env.ALLOW_FALLBACK === '1') {
            console.warn('  → 使用本地占位数据继续（仅用于本地调试）');
            contributors = getFallbackContributors();
        } else {
            throw err;
        }
    }
    console.log(`  共 ${contributors.length} 位贡献者`);

    // 按贡献数降序，最多保留 N 位
    contributors.sort((a, b) => (b.contributions || 0) - (a.contributions || 0));
    if (contributors.length > MAX_CONTRIBUTORS) {
        contributors = contributors.slice(0, MAX_CONTRIBUTORS);
    }

    const block = buildContributorsBlock(contributors);

    console.log('▶ 更新目标文件…');
    let totalChanged = 0;
    for (const f of TARGET_FILES) {
        const r = replaceInFile(f, block);
        if (r.changed) {
            console.log(`  ✓ ${f}`);
            totalChanged++;
        }
    }
    console.log(`✓ 完成: ${totalChanged} 个文件已更新`);
}

main().catch(err => {
    console.error('✗ 失败:', err.message);
    process.exit(1);
});
