/**
 * 拉取当前仓库的 GitHub 贡献者列表，自动生成：
 *   1. CONTRIBUTORS.md —— 根据 templates/contributors.tpl.md 渲染（头像墙 + 贡献榜）
 *   2. README.md / src/zh-cn/index.md / src/en/index.md 中的头像墙占位符内容
 *
 * 占位符格式：
 *   <!-- CONTRIBUTORS START --> ... <!-- CONTRIBUTORS END -->
 *   <!-- CONTRIBUTORS TABLE START --> ... <!-- CONTRIBUTORS TABLE END -->（仅 CONTRIBUTORS.md）
 *
 * 用法:
 *   GITHUB_TOKEN=xxx GITHUB_REPOSITORY=owner/repo node scripts/update-contributors-md.js
 *   或（在仓库内）
 *   npm run generate:contributors
 *
 * 可选环境变量:
 *   GH_TOKEN              GITHUB_TOKEN 的别名
 *   MAX_CONTRIBUTORS      头像墙/贡献榜最多人数（默认 100）
 *   INCLUDE_BOTS          设为 1 时把机器人（dependabot 等）也计入（默认排除）
 *   ALLOW_FALLBACK        设为 1 时 API 拉取失败则使用本地占位数据（仅用于调试）
 *   CONTRIBUTORS_JSON_FILE 指定一个本地 JSON 文件作为贡献者数据源（跳过 API 请求，
 *                          便于本地调试，例如先用 gh api 把数据导出到文件）
 *
 * 依赖: 无（只使用 Node.js 内置 fetch / fs / path）
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const AVATAR_WIDTH = 80; // 头像宽度（px）
const DEFAULT_MAX_CONTRIBUTORS = 100;
const REPO_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_FILE = path.join(REPO_ROOT, 'templates', 'contributors.tpl.md');
const CONTRIBUTORS_FILE = path.join(REPO_ROOT, 'CONTRIBUTORS.md');
const START_MARK = '<!-- CONTRIBUTORS START -->';
const END_MARK = '<!-- CONTRIBUTORS END -->';
const TABLE_START_MARK = '<!-- CONTRIBUTORS TABLE START -->';
const TABLE_END_MARK = '<!-- CONTRIBUTORS TABLE END -->';

// 需要更新头像墙占位符的目标文件（相对于仓库根）
// 项目采用目录隔离的 i18n 架构，语言版本首页分别在 src/zh-cn/index.md 和 src/en/index.md；
// 根路径 / 由 src/index-redirect.md 处理（JS 跳板，不含贡献者区块），不在此列。
const AVATAR_TARGET_FILES = [
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
 * 拉取 GitHub 贡献者列表（自动翻页，最多 100 条/页 × 10 页）。
 * anon=true 时也会返回匿名贡献者，后续会被过滤掉。
 */
async function fetchContributors(repo, token) {
    const headers = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'contributors-md-generator',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    const all = [];
    for (let page = 1; page <= 10; page++) {
        const url = `https://api.github.com/repos/${repo}/contributors?per_page=100&anon=true&page=${page}`;
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`GitHub API 调用失败: ${res.status} ${res.statusText}\n${text}`);
        }
        const data = await res.json();
        all.push(...data);
        // 最后一页（不足 100 条）说明已经取完
        if (!Array.isArray(data) || data.length < 100) {
            break;
        }
    }
    return all;
}

/**
 * 过滤无效条目：
 *   - 没有 login 的条目
 *   - 匿名贡献者（没有头像和主页链接，无法生成头像墙）
 *   - 机器人（dependabot[bot] 等），除非设置 INCLUDE_BOTS=1
 */
function filterContributors(list) {
    const includeBots = process.env.INCLUDE_BOTS === '1';
    return list.filter(c => {
        if (!c || !c.login) {
            return false;
        }
        // 匿名贡献者：无法生成头像墙
        if (c.type === 'Anonymous') {
            return false;
        }
        const login = String(c.login);
        // 有些机器人账号是 User 类型，但 login 以 [bot] 结尾，例如: dependabot[bot]
        const isBotLogin = /\[bot\]$/i.test(login);
        // 未设置 INCLUDE_BOTS=1 时排除机器人与以 [bot] 结尾的账号
        if (!includeBots && (c.type === 'Bot' || isBotLogin)) {
            return false;
        }
        return true;
    });
}

/**
 * 把单个贡献者转换为头像墙的 Markdown 行。
 * 头像用 ?v=4 风格的 GitHub avatar URL，width 80px。
 */
function contributorToMd(c) {
    const href = c.html_url || `https://github.com/${c.login}`;
    // avatar_url 形如 https://avatars.githubusercontent.com/u/123?v=4
    // 去掉已有 query，保证最终 URL 干净
    const avatarBase = c.avatar_url ? c.avatar_url.split('?')[0] : '';
    return `<a href="${href}" title="${c.login}"><img src="${avatarBase}?v=4" width="${AVATAR_WIDTH}" alt="${c.login}"/></a>`;
}

/**
 * 构造头像墙内容（用换行连接所有头像）。
 */
function buildAvatarWall(contributors) {
    if (contributors.length === 0) {
        return '<!-- 暂无贡献者 -->';
    }
    return contributors.map(contributorToMd).join('\n');
}

/**
 * 构造贡献榜 Markdown 表格（排名 / 贡献者 / 贡献数）。
 */
function buildLeaderboard(contributors) {
    const header = '| # | Contributor | Contributions |\n|---|-------------|--------------|';
    if (contributors.length === 0) {
        return `${header}\n| - | (暂无贡献者) | - |`;
    }
    const rows = contributors.map((c, i) => {
        const name = c.html_url ? `[${c.login}](${c.html_url})` : c.login;
        return `| ${i + 1} | ${name} | ${c.contributions || 0} |`;
    });
    return [header, ...rows].join('\n');
}

/**
 * 读取 CONTRIBUTORS.md 模板；模板缺失时使用内置兜底模板，
 * 保证工作流在任何情况下都能生成合法文件。
 */
function getTemplate() {
    if (fs.existsSync(TEMPLATE_FILE)) {
        return fs.readFileSync(TEMPLATE_FILE, 'utf8');
    }
    return [
        '# 贡献者 / Contributors',
        '',
        '<!-- CONTRIBUTORS START -->',
        '<!-- CONTRIBUTORS END -->',
        '',
        '## 贡献榜 / Leaderboard',
        '',
        '<!-- CONTRIBUTORS TABLE START -->',
        '<!-- CONTRIBUTORS TABLE END -->',
        '',
    ].join('\n');
}

function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 替换 startMark 与 endMark 之间的内容（含标记本身保留）。
 */
function replaceBetween(content, startMark, endMark, newBlock) {
    const re = new RegExp(`${escapeRegExp(startMark)}[\\s\\S]*?${escapeRegExp(endMark)}`, 'm');
    if (!re.test(content)) {
        throw new Error(`未找到占位符 ${startMark} … ${endMark}`);
    }
    return content.replace(re, `${startMark}\n${newBlock}\n${endMark}`);
}

/**
 * 内容有变化才写入，返回是否发生了写入。
 */
function writeIfChanged(filePath, content) {
    if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) {
        return false;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
}

/**
 * Fallback 占位数据（API 拉取失败且设置 ALLOW_FALLBACK=1 时使用，仅用于本地调试）。
 */
function getFallbackContributors() {
    return [
        { login: 'mantoujun12', contributions: 100, type: 'User', html_url: 'https://github.com/mantoujun12', avatar_url: 'https://avatars.githubusercontent.com/u/202384594?v=4' },
    ];
}

async function main() {
    const repo = envOrThrow('GITHUB_REPOSITORY');
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

    let contributors;
    const jsonFile = process.env.CONTRIBUTORS_JSON_FILE || '';
    if (jsonFile) {
        // 本地调试：从预先导出的 JSON 文件读取贡献者，跳过 API 请求
        console.log(`▶ 从本地文件读取贡献者列表: ${jsonFile}`);
        const raw = fs.readFileSync(jsonFile, 'utf8');
        const parsed = JSON.parse(raw);
        contributors = Array.isArray(parsed) ? parsed : [];
    } else {
        console.log(`▶ 拉取 ${repo} 的贡献者列表…`);
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
    }

    // 过滤无效条目（匿名/机器人），按贡献数降序，最多保留 N 位
    contributors = filterContributors(contributors);
    contributors.sort((a, b) => (b.contributions || 0) - (a.contributions || 0));
    const max = Number(process.env.MAX_CONTRIBUTORS) || DEFAULT_MAX_CONTRIBUTORS;
    if (contributors.length > max) {
        contributors = contributors.slice(0, max);
    }
    console.log(`  共 ${contributors.length} 位贡献者（已排除机器人与匿名贡献者）`);

    const wall = buildAvatarWall(contributors);
    const leaderboard = buildLeaderboard(contributors);

    // 1) 根据模板生成 CONTRIBUTORS.md
    console.log('▶ 生成 CONTRIBUTORS.md…');
    const template = getTemplate();
    let doc = replaceBetween(template, START_MARK, END_MARK, wall);
    doc = replaceBetween(doc, TABLE_START_MARK, TABLE_END_MARK, leaderboard);
    if (!doc.endsWith('\n')) {
        doc += '\n';
    }
    const docChanged = writeIfChanged(CONTRIBUTORS_FILE, doc);
    console.log(docChanged ? '  ✓ CONTRIBUTORS.md' : '  = CONTRIBUTORS.md（无变化）');

    // 2) 更新 README / 首页中的头像墙
    console.log('▶ 更新头像墙…');
    let totalChanged = docChanged ? 1 : 0;
    for (const rel of AVATAR_TARGET_FILES) {
        const filePath = path.join(REPO_ROOT, rel);
        if (!fs.existsSync(filePath)) {
            console.warn(`  ! 跳过（文件不存在）: ${rel}`);
            continue;
        }
        const original = fs.readFileSync(filePath, 'utf8');
        if (!original.includes(START_MARK) || !original.includes(END_MARK)) {
            console.warn(`  ! 跳过（未找到占位符）: ${rel}`);
            continue;
        }
        const updated = replaceBetween(original, START_MARK, END_MARK, wall);
        if (writeIfChanged(filePath, updated)) {
            console.log(`  ✓ ${rel}`);
            totalChanged++;
        } else {
            console.log(`  = ${rel}（无变化）`);
        }
    }
    console.log(`✓ 完成: ${totalChanged} 个文件已更新`);
}

main().catch(err => {
    console.error('✗ 失败:', err.message);
    process.exit(1);
});
