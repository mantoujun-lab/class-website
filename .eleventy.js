const sass = require("sass");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

// 编译 Sass + PostCSS（Autoprefixer）函数
// 扫描 src/style/ 下所有非 _ 前缀的 .scss 文件作为编译入口，分别输出为独立 CSS
async function compileSass() {
    try {
        const styleDir = "src/style";
        const outDir = "_site/style";
        fs.mkdirSync(outDir, { recursive: true });

        const entries = fs.readdirSync(styleDir)
            .filter(f => f.endsWith(".scss") && !f.startsWith("_"))
            .sort();

        for (const file of entries) {
            const srcPath = path.join(styleDir, file);
            const destName = file.replace(/\.scss$/, ".css");
            const result = sass.compile(srcPath, { style: "compressed" });
            const postcssResult = await postcss([autoprefixer()]).process(result.css, { from: path.join(styleDir, destName) });
            fs.writeFileSync(path.join(outDir, destName), postcssResult.css);
        }
    } catch (error) {
        console.error("[Sass/PostCSS] 编译失败:", error.message || error);
        throw error;
    }
}

module.exports = function (eleventyConfig) {
    // 允许处理的模板格式：Markdown + Nunjucks
    eleventyConfig.setTemplateFormats(['md', 'njk']);

    // 注册语法高亮插件，仅在 Markdown 文件中启用
    // preAttributes 给 <pre> 自动加上 line-numbers 类，让 Prism line-numbers 插件接管。
    // 注意：不要设置 codeAttributes.class = ""，否则会把默认的 "language-xxx" class 清掉，
    // 导致 line-numbers / toolbar 插件识别不到语言、拒绝注入行号和按钮。
    eleventyConfig.addPlugin(syntaxHighlight, {
        templateFormats: ["md"],
        preAttributes: {
            class: "line-numbers",
        },
    });

    // 注册导航插件
    eleventyConfig.addPlugin(eleventyNavigation);

    // Wiki 集合：递归匹配所有 .md 文件，按 order 排序
    eleventyConfig.addCollection("wiki", (api) => {
        return api.getFilteredByGlob("src/wiki/**/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Event 集合：递归匹配 src/event/ 下的所有 .md 文件，按 order 排序
    eleventyConfig.addCollection("event", (api) => {
        return api.getFilteredByGlob("src/event/**/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Article 集合：递归匹配 src/article/ 下的所有 .md 文件，按 order 排序
    eleventyConfig.addCollection("article", (api) => {
        return api.getFilteredByGlob("src/article/**/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Zone 集合：匹配 src/zone/*.md 顶层文件，按 order 排序
    // 用于首页「专区入口」卡片和 zone.md 分区列表的数据驱动
    eleventyConfig.addCollection("zone", (api) => {
        return api.getFilteredByGlob("src/zone/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Wiki 按分类分组：按父目录归类，用于侧边栏独立导航
    // 数据结构：[{ name, label, pages: [...] }, ...]
    // - name：分类标识（顶层为 "all"）
    // - label：分类显示名（取自 frontmatter 的 wikiCategory，否则用目录名）
    // - pages：该分类下的所有页面
    eleventyConfig.addCollection("wikiByCategory", (api) => {
        const all = api.getFilteredByGlob("src/wiki/**/*.md");
        const groups = new Map();

        for (const page of all) {
            // 提取分类：相对 src/wiki/ 的父目录路径
            const relPath = page.inputPath.replace(/\\/g, "/");
            const match = relPath.match(/src\/wiki\/(.*)\/[^/]+\.md$/);
            const category = match ? match[1] : "_root";

            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category).push(page);
        }

        // 转成数组并排序：分类按 wikiCategoryOrder，页内按 order
        const result = [];
        for (const [category, pages] of groups) {
            const sortedPages = pages.sort((a, b) => {
                return (a.data.order || 999) - (b.data.order || 999);
            });
            // 取分类的 label 和 order（用第一页的 frontmatter）
            const first = sortedPages[0];
            // _root 是顶层 wiki/ 目录的占位分类，给个友好的默认 label
            // 同时让 _root 默认排在最前（用 -1 强制小于所有 wikiCategoryOrder）
            const defaultLabel = category === '_root' ? '📖 首页' : category;
            const defaultOrder = category === '_root' ? -1 : 999;
            result.push({
                name: category,
                label: first.data.wikiCategory || defaultLabel,
                order: first.data.wikiCategoryOrder ?? defaultOrder,
                pages: sortedPages
            });
        }
        result.sort((a, b) => a.order - b.order);
        return result;
    });

    // 日期格式化 filter：强制锁定北京时间 + 24 小时制
    // 输入可能是 Luxon DateTime 实例、JS Date、ISO 字符串，统一转成 DateTime 再格式化
    // 用法：{{ page.date | bjDate }}
    //
    // ⚠️ 关键背景：
    // Eleventy 3.x 解析 frontmatter 时，如果日期字符串没有时区后缀（如 "2026-07-09 07:00:00"），
    // 会按 **UTC** 解析，然后存为 JS Date（toISOString 输出 "2026-07-09T07:00:00.000Z"）。
    // 这意味着我们写的北京时间 07:00 实际被理解为 UTC 07:00，
    // 如果再用本地时区去读就会变成 +08:00 的 15:00，时区错位 8 小时。
    //
    // 解决：filter 拿到 JS Date 后，**直接把它当成已经位于 Asia/Shanghai 时区的字面值**输出。
    eleventyConfig.addFilter("bjDate", (date) => {
        const { DateTime } = require("luxon");
        if (!date) return "";

        // 1) 已经是 Luxon DateTime 实例
        if (typeof date.toFormat === "function") {
            return date.setZone("Asia/Shanghai").toFormat("yyyy-MM-dd HH:mm");
        }

        // 2) JS Date / ISO 字符串：
        //    Eleventy 已经把它转成 UTC 时间的 JS Date（无时区字符串被当 UTC 解析）。
        //    我们直接取出它的字面值当北京时间输出，不再做时区转换。
        //    修复了原本用 fromJSDate/setZone 把 +0 误转成 +8 的问题。
        let dt;
        if (date instanceof Date) {
            dt = DateTime.fromObject({
                year: date.getUTCFullYear(),
                month: date.getUTCMonth() + 1,
                day: date.getUTCDate(),
                hour: date.getUTCHours(),
                minute: date.getUTCMinutes(),
                second: date.getUTCSeconds(),
            }, { zone: "Asia/Shanghai" });
        } else if (typeof date === "string") {
            const iso = date.includes("T") ? date : date.replace(" ", "T");
            dt = DateTime.fromISO(iso, { zone: "Asia/Shanghai" });
        } else {
            return "";
        }

        return dt.isValid ? dt.toFormat("yyyy-MM-dd HH:mm") : String(date);
    });

    // Image shortcode for responsive images
    // 行为：按 srcWidths 生成多分辨率文件（如 [1280, 1920]），
    //      但 <img> 的渲染尺寸由 displayWidths 控制（默认 [300, 600]），
    //      浏览器根据视口用 srcset 选最合适的源，显示大小始终受 displayWidths 约束。
    // 兜底：先用 sharp 读取原图宽度，剔除 srcWidths 中超过原图宽度的项，
    //      避免小图被强制放大模糊。原图本身始终会被保留输出。
    // 用法：
    //   {% image '{"src": "...", "alt": "...", "srcWidths": [1280, 1920], "displayWidths": [300, 600]}' %}
    //   {% image '{"src": "...", "alt": "..."}' %}  // 用默认 [1280,1920]/[300,600]
    eleventyConfig.addShortcode("image", async function (json) {
        const {
            src,
            alt = "",
            srcWidths = [1280, 1920],
            displayWidths = [300, 600],
        } = JSON.parse(json);
        const fullPath = path.join("src", src);

        // 读取原图实际宽度，作为 srcWidths 的上限兜底
        // sharp 由 @11ty/eleventy-img 间接依赖，无需单独安装
        let originalWidth = Infinity;
        try {
            const sharp = require("sharp");
            const meta = await sharp(fullPath).metadata();
            if (meta && typeof meta.width === "number") {
                originalWidth = meta.width;
            }
        } catch (e) {
            // 元数据读取失败时不做过滤，沿用用户传入的 srcWidths
        }

        // 剔除超过原图宽度的项，并保证至少保留一项（原图本身）
        const effectiveWidths = srcWidths.filter(w => w <= originalWidth);
        if (effectiveWidths.length === 0) {
            effectiveWidths.push(Math.min(...srcWidths));
        }

        const stats = await Image(fullPath, {
            widths: effectiveWidths,
            formats: ["webp", "jpeg"],
            outputDir: "_site/img/",
            urlPath: "/img/",
            // 自适应质量：仅 webp 和 jpeg 应用，png 不受影响
            qualityFormatMap: {
                webp: 80,
                jpeg: 85,
            },
        });

        // displayWidths 的最后一个值作为默认 sizes（最大显示尺寸），
        // 移动端自适应撑满（图片通常会占满父容器宽度）
        const maxDisplay = displayWidths[displayWidths.length - 1];

        return `<picture>
                ${stats.webp.map(e => `<source type="image/webp" srcset="${e.srcset}">`).join("\n")}
                <img src="${stats.jpeg[0].url}"
                     width="${displayWidths[0]}"
                     height="${Math.round(stats.jpeg[0].height * displayWidths[0] / stats.jpeg[0].width)}"
                     alt="${alt}"
                     loading="lazy"
                     decoding="async"
                     srcset="${stats.jpeg.map(e => e.srcset).join(", ")}"
                     sizes="(max-width: 768px) 100vw, ${maxDisplay}px">
            </picture>`;
    });

    // 将资源文件原样复制到输出目录
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/script');

    // 构建前编译 Sass
    eleventyConfig.on("beforeBuild", compileSass);

    // 监听 style/ 目录变化
    eleventyConfig.addWatchTarget("src/style/");

    // .scss 文件变化时重新编译
    eleventyConfig.on("watch", async (changedFiles) => {
        if (changedFiles.some(f => f.endsWith(".scss"))) {
            await compileSass();
        }
    });

    return {
        pathPrefix: "/",
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        templateFormats: ["njk", "html", "md"]
    };
};
