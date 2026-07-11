/**
 * 把 src/wiki/**.md 同步到 GitHub Wiki 仓库
 * 用法:node scripts/sync-wiki.js
 *
 * 流程:
 *   1. 复用或克隆 .wiki-tmp/ 缓存目录
 *   2. 收集 src/wiki/**.md,同时列出 .wiki-tmp/ 中多余的文件
 *   3. 写入新版本条目,并 git rm 过期文件
 *   4. 生成 Home.md
 *   5. 提交并推送
 *   6. 成功推送后清理 .wiki-tmp/ 缓存
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src', 'wiki');
const SRC_INDEX = path.join(ROOT, 'src', 'wiki.md');
const WIKI_DIR = path.join(ROOT, '.wiki-tmp');
const WIKI_REPO = 'https://github.com/hjx-25pc1/hjx-25pc1.github.io.wiki.git';

// ============================================================
// 工具函数
// ============================================================

// 递归收集 SRC_DIR 下所有 .md 文件,返回 [{ absPath, relPath }]
function collectMarkdownFiles(dir, base = dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...collectMarkdownFiles(abs, base));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            out.push({ absPath: abs, relPath: path.relative(base, abs) });
        }
    }
    return out;
}

// 去掉 YAML frontmatter,兼容 \r\n / \n
function stripFrontmatter(content) {
    const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
    return match ? content.slice(match[0].length).replace(/^\s+/, '') : content;
}

// 从 YAML 文本里抽取 title / description
function parseFrontmatter(fm) {
    const result = { title: '', description: '' };
    const titleMatch = fm.match(/^title:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    if (titleMatch) result.title = titleMatch[1].trim();
    if (descMatch) result.description = descMatch[1].trim();
    return result;
}

// 读取 .md 文件,返回 { title, description },出错时返回空对象
function readEntry(absPath) {
    try {
        const raw = fs.readFileSync(absPath, 'utf8');
        const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!fmMatch) return { title: path.basename(absPath, '.md'), description: '' };
        return parseFrontmatter(fmMatch[1]);
    } catch (e) {
        return { title: path.basename(absPath, '.md'), description: '' };
    }
}

// 按顶级子目录分组条目;顶层文件归入 "(root)"
function groupByCategory(entries) {
    const groups = new Map();
    for (const e of entries) {
        const parts = e.relPath.split(path.sep);
        const category = parts.length > 1 ? parts[0] : '(root)';
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(e);
    }
    return groups;
}

// 生成 Home.md:按分组罗列所有条目
function buildHomeMarkdown(entries) {
    const groups = groupByCategory(entries);

    // 稳定排序:根目录优先,其它按字母序
    const sortedKeys = [...groups.keys()].sort((a, b) => {
        if (a === '(root)') return -1;
        if (b === '(root)') return 1;
        return a.localeCompare(b);
    });

    const sections = sortedKeys.map(cat => {
        const items = groups.get(cat)
            .map(e => {
                const { title, description } = readEntry(e.absPath);
                return `- **${title}**${description ? ` — ${description}` : ''}`;
            })
            .join('\n');
        const heading = cat === '(root)' ? '## 通用' : `## ${cat}`;
        return `${heading}\n\n${items}`;
    }).join('\n\n');

    return `# Wiki

这里是 25 计算机应用 1 班的集体 Wiki,由同学们共同维护。

## 所有条目

${sections}

## 如何贡献

在 \`src/wiki/\` 目录下新建 \`.md\` 文件,参考仓库内的模板填写。
`;
}

// ============================================================
// 同步步骤
// ============================================================

// 1. 准备 .wiki-tmp/:存在则 pull,否则 clone
function prepareWikiDir() {
    if (fs.existsSync(WIKI_DIR)) {
        console.log('复用已有 .wiki-tmp/,拉取远端更新...');
        execSync(`git -C "${WIKI_DIR}" pull`, { stdio: 'inherit' });
    } else {
        console.log('克隆 Wiki 仓库...');
        execSync(`git clone "${WIKI_REPO}" "${WIKI_DIR}"`, { stdio: 'inherit' });
    }
}

// 2. 列出 .wiki-tmp/ 下需要删除的 .md 文件(跳过 Home.md , 带 _ 的 markdown 文件 ,与 .git/)
//    输入 srcRelSet:src 条目的相对路径集合(正斜杠)
function collectWikiExtraFiles(srcRelSet) {
    const extra = [];
    if (!fs.existsSync(WIKI_DIR)) return extra;

    function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const abs = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === '.git') continue;
                walk(abs);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                // Home.md 由脚本动态生成,不算"多余"
                if (entry.name === 'Home.md') continue;
                 // GitHub Wiki 特殊文件(_Footer / _Sidebar / _Header)不参与同步,保留
                if (entry.name.startsWith('_')) continue;
                const rel = path.relative(WIKI_DIR, abs).replace(/\\/g, '/');
                if (!srcRelSet.has(rel)) {
                    extra.push({ absPath: abs, relPath: rel });
                }
            }
        }
    }

    walk(WIKI_DIR);
    return extra;
}

// 3. 在 .wiki-tmp/ 内删除过期文件
//    优先用 git rm(让 Git 记录删除),失败时 fallback 到 fs.unlinkSync
function pruneExtraFiles(extraFiles) {
    if (extraFiles.length === 0) return 0;
    for (const f of extraFiles) {
        try {
            execSync(`git -C "${WIKI_DIR}" rm -- "${f.relPath}"`, { stdio: 'pipe' });
        } catch (e) {
            // 未被 Git 追踪的文件,直接物理删除
            try {
                fs.unlinkSync(f.absPath);
            } catch (e2) {
                // ignore
            }
        }
    }
    return extraFiles.length;
}

// 4. 把 src 条目复制到 .wiki-tmp/(保留目录结构,剥离 frontmatter)
function copyEntries(entries) {
    for (const e of entries) {
        const dest = path.join(WIKI_DIR, e.relPath);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const content = fs.readFileSync(e.absPath, 'utf8');
        fs.writeFileSync(dest, stripFrontmatter(content));
    }
    console.log(`已同步 ${entries.length} 个条目(含子目录)`);
}

// 5. 基于 src 集合生成 Home.md(覆盖现有)
function generateHomeFile(entries) {
    if (!fs.existsSync(SRC_INDEX)) return;
    fs.writeFileSync(path.join(WIKI_DIR, 'Home.md'), buildHomeMarkdown(entries));
    console.log('已生成 Home.md');
}

// 6. 提交并推送(失败时抛错,由调用方决定是否清理缓存)
function commitAndPush() {
    execSync(`git -C "${WIKI_DIR}" add .`, { stdio: 'inherit' });
    const status = execSync(`git -C "${WIKI_DIR}" status --porcelain`).toString();
    if (!status.trim()) {
        console.log('无变更,跳过 commit / push');
        return;
    }
    execSync(`git -C "${WIKI_DIR}" commit -m "docs: 同步 Wiki"`, { stdio: 'inherit' });
    execSync(`git -C "${WIKI_DIR}" push`, { stdio: 'inherit' });
    console.log('已推送到 Wiki');
}

// 7. 删除缓存目录
function cleanup() {
    if (!fs.existsSync(WIKI_DIR)) return;
    fs.rmSync(WIKI_DIR, { recursive: true, force: true });
    console.log('已清理缓存目录 .wiki-tmp/');
}

// ============================================================
// 主流程
// ============================================================

function sync() {
    // 1. 准备本地缓存
    prepareWikiDir();

    // 2. 收集源条目与 Wiki 端多余文件
    const entries = collectMarkdownFiles(SRC_DIR);
    const srcRelSet = new Set(entries.map(e => e.relPath.replace(/\\/g, '/')));
    const extraFiles = collectWikiExtraFiles(srcRelSet);

    // 3. 写入新版本,清理过期文件
    copyEntries(entries);
    const removed = pruneExtraFiles(extraFiles);

    // 4. 生成 Home.md(基于 src 集合)
    generateHomeFile(entries);

    if (removed > 0) {
        console.log(`已清理 ${removed} 个过期文件`);
    }

    // 5. 提交并推送 → 成功才清理缓存
    //    commitAndPush() 失败会抛错,自然跳过 cleanup() 保留缓存以便排查
    commitAndPush();
    cleanup();

    const summary = removed > 0
        ? `同步完成:写入 ${entries.length} 个条目,删除 ${removed} 个条目`
        : `同步完成:写入 ${entries.length} 个条目`;
    console.log(summary);
}

sync();
