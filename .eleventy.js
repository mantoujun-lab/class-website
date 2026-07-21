const sass = require("sass");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const translations = require("./src/_data/i18n.js");
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

    // 注：eleventy-plugin-i18n 已移除（package.json），改用自定义实现
    // 原因：插件的 lodash.get 路径解析将 "nav.home" 视为嵌套，与我们的点号键名冲突
    // 替代方案见下方：addFilter("i18n"/"lang"/"localUrl") + 目录数据文件（zh-cn.11tydata.js）

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

    // 自定义 filter：按 locale 过滤导航树
    // 用法：collections.all | eleventyNavigation | filterNavByLocale('zh-cn')
    eleventyConfig.addFilter("filterNavByLocale", function(navTree, locale) {
        const prefix = "/" + locale;
        const navTreeArr = Array.isArray(navTree) ? navTree : [];
        return navTreeArr
            .filter(entry => {
                return entry.url && (entry.url.startsWith(prefix + "/") || entry.url === prefix || entry.url === prefix + "/");
            })
            .map(entry => {
                const children = (entry.children || []).filter(child => {
                    return child.url && (child.url.startsWith(prefix + "/") || child.url === prefix || child.url === prefix + "/");
                });
                return { ...entry, children };
            });
    });

    // 自定义 i18n filter：从 page.data.locale 读取（由 eleventy.permalink hook 写入）
    // 字典从 src/_data/i18n.js 读取；缺失时双向 fallback。
    const lodashGet = require("lodash.get");
    const templite = require("templite");
    eleventyConfig.addFilter("i18n", function (key, data, localeOverride) {
        // 多层兜底：参数 > ctx > page.data > 默认
        const locale = localeOverride
            || (this.ctx && this.ctx.locale)
            || (this.page && this.page.data && this.page.data.locale)
            || (this.env && this.env.locale) // 全局兜底
            || "zh-cn";
        const t = lodashGet(translations, [key, locale]);
        if (t !== undefined) {
            try { return templite(t, data || {}); } catch (e) { return t; }
        }
        // 兜底：双向 fallback
        const fallback = (locale === "zh-cn") ? "en" : "zh-cn";
        const tf = lodashGet(translations, [key, fallback]);
        if (tf !== undefined) {
            try { return templite(tf, data || {}); } catch (e) { return tf; }
        }
        return key; // 都找不到就返回 key（最少不会崩）
    });

    // 自定义 filter：从 page.data.locale 取当前 locale
    // （由 eleventy.permalink hook 写入）
    eleventyConfig.addFilter("lang", function (fallback) {
        const l = (this.ctx && this.ctx.locale) || (this.page && this.page.data && this.page.data.locale);
        return l || fallback || "zh-cn";
    });

    // localUrl filter：把"语义路径"自动加上当前 locale 前缀
    // 用法：{{ "/wiki/" | localUrl }} 在 zh-cn 页面输出 /zh-cn/wiki/，在 en 页面输出 /en/wiki/
    // 工作原理：
    //   1. 模板里继续写不带 locale 前缀的链接（保持可读性、便于翻译模板时复用）
    //   2. filter 从 page.data.locale 推断当前 locale
    //   3. 跳过已是绝对外链（http/https/mailto/#）或已含 locale 前缀的路径
    //   4. 内部路由（/assets、/script、/style、/img）也不加前缀
    const INTERNAL_NO_PREFIX = /^\/(assets|script|style|img|favicon\.ico)\//;
    eleventyConfig.addFilter("localUrl", function (path, overrideLang) {
        if (!path || typeof path !== "string") return path;
        // 外链 / 锚点 / 已带前缀：原样返回
        if (/^(https?:|mailto:|#|javascript:)/i.test(path)) return path;
        if (path.startsWith("//")) return path;
        // 取当前 locale
        const l = (this.ctx && this.ctx.locale) || (this.page && this.page.data && this.page.data.locale);
        const lang = overrideLang || l || "zh-cn";
        // 已是 /zh-cn/xxx 或 /en/xxx 形式
        if (/^\/(zh-cn|en)\//.test(path)) return path;
        if (path === "/zh-cn" || path === "/en") return path;
        // 内部静态资源：直接返回
        if (INTERNAL_NO_PREFIX.test(path)) return path;
        // 根路径特殊处理：/ -> /zh-cn/
        if (path === "/") return "/" + lang + "/";
        // 给路径加前缀
        return "/" + lang + path;
    });

    // 切换语言链接：在当前 URL 上替换 /zh-cn/ → /en/ 等
    // 用法：{{ page.url | switchLang('en') }}
    eleventyConfig.addFilter("switchLang", function (url, targetLang) {
        if (!url || typeof url !== "string") return url;
        return url.replace(/^\/(zh-cn|en)(\/|$)/, "/" + targetLang + "$2");
    });

    // 按 locale 创建独立的集合（修复：Eleventy 的 addCollection 是全局的，
    // 不能在回调中用 api.page 获取当前页面的 locale，因为集合只计算一次）
    // 模板中使用 collections['xxx_' + page.data.locale] 动态访问
    const _locales = ["zh-cn", "en"];

    for (const _lang of _locales) {
        // Wiki 集合
        eleventyConfig.addCollection(`wiki_${_lang}`, (api) => {
            return api.getFilteredByGlob(`src/${_lang}/wiki/**/*.md`).sort((a, b) => {
                return (a.data.order || 999) - (b.data.order || 999);
            });
        });

        // Event 集合
        eleventyConfig.addCollection(`event_${_lang}`, (api) => {
            return api.getFilteredByGlob(`src/${_lang}/event/**/*.md`).sort((a, b) => {
                return (a.data.order || 999) - (b.data.order || 999);
            });
        });

        // Article 集合
        eleventyConfig.addCollection(`article_${_lang}`, (api) => {
            return api.getFilteredByGlob(`src/${_lang}/article/**/*.md`).sort((a, b) => {
                return (a.data.order || 999) - (b.data.order || 999);
            });
        });

        // Zone 集合
        eleventyConfig.addCollection(`zone_${_lang}`, (api) => {
            return api.getFilteredByGlob(`src/${_lang}/zone/*.md`).sort((a, b) => {
                return (a.data.order || 999) - (b.data.order || 999);
            });
        });

        // Wiki 按分类分组
        eleventyConfig.addCollection(`wikiByCategory_${_lang}`, (api) => {
            const all = api.getFilteredByGlob(`src/${_lang}/wiki/**/*.md`);
            const groups = new Map();

            for (const page of all) {
                const relPath = page.inputPath.replace(/\\/g, "/");
                const match = relPath.match(/src\/[^/]+\/wiki\/(.*)\/[^/]+\.md$/);
                const category = match ? match[1] : "_root";

                if (!groups.has(category)) {
                    groups.set(category, []);
                }
                groups.get(category).push(page);
            }

            const result = [];
            for (const [category, pages] of groups) {
                const sortedPages = pages.sort((a, b) => {
                    return (a.data.order || 999) - (b.data.order || 999);
                });
                const first = sortedPages[0];
                const rootLabel = translations['wiki.root']?.[_lang] || '📖 首页';
                const defaultLabel = category === '_root' ? rootLabel : category;
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
    }

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

    // 仅日期格式化 filter（同 bjDate 逻辑，但只输出 yyyy-MM-dd）
    // 用法：{{ entry.data.date | bjDateOnly }}
    eleventyConfig.addFilter("bjDateOnly", (date) => {
        const { DateTime } = require("luxon");
        if (!date) return "";

        if (typeof date.toFormat === "function") {
            return date.setZone("Asia/Shanghai").toFormat("yyyy-MM-dd");
        }

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

        return dt.isValid ? dt.toFormat("yyyy-MM-dd") : String(date);
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

        if (/^https?:\/\//i.test(src)) {
            return `<img src="${src}"
                     alt="${alt}"
                     loading="lazy"
                     decoding="async">`;
        }

        const fullPath = path.join("src", src);
        const isLocalAsset = fs.existsSync(fullPath);

        if (!isLocalAsset) {
            const remoteUrl = `${ASSETS_BASE_URL}/${src.startsWith("/") ? src.slice(1) : src}`;
            return `<img src="${remoteUrl}"
                     alt="${alt}"
                     loading="lazy"
                     decoding="async">`;
        }

        let originalWidth = Infinity;
        try {
            const sharp = require("sharp");
            const meta = await sharp(fullPath).metadata();
            if (meta && typeof meta.width === "number") {
                originalWidth = meta.width;
            }
        } catch (e) {
        }

        const effectiveWidths = srcWidths.filter(w => w <= originalWidth);
        if (effectiveWidths.length === 0) {
            effectiveWidths.push(Math.min(...srcWidths));
        }

        const stats = await Image(fullPath, {
            widths: effectiveWidths,
            formats: ["webp", "jpeg"],
            outputDir: "_site/img/",
            urlPath: "/img/",
            qualityFormatMap: {
                webp: 80,
                jpeg: 85,
            },
        });

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

    const ASSETS_BASE_URL = "https://raw.githubusercontent.com/hjx-25pc1/assets/main";

    eleventyConfig.addFilter("assetsUrl", function (path) {
        if (!path || typeof path !== "string") return path;
        if (/^https?:\/\//i.test(path)) return path;
        const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
        return `${ASSETS_BASE_URL}/${normalizedPath}`;
    });

    eleventyConfig.addShortcode("assetImage", async function (src, alt, options = {}) {
        const fullUrl = (/^https?:\/\//i.test(src)) ? src : `${ASSETS_BASE_URL}/${src.startsWith("/") ? src.slice(1) : src}`;
        const displayWidths = options.displayWidths || [300, 600];
        const maxDisplay = displayWidths[displayWidths.length - 1];
        return `<img src="${fullUrl}"
                     alt="${alt}"
                     loading="lazy"
                     decoding="async"
                     sizes="(max-width: 768px) 100vw, ${maxDisplay}px">`;
    });

    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/script');

    // ==================== Permalink i18n 增强 ====================
    // 目标：现有页面 frontmatter 里写的是不带 locale 前缀的"短路径"
    // （permalink: /wiki/、/article/、/event/、/about/、/discussion/、/zone/study/...），
    // 我们希望按页面所在的 locale 子目录自动加上 /zh-cn/ 或 /en/ 前缀。
    //
    // 实现思路：用 eleventyConfig 的 permalink 计算钩子，
    // 如果 permalink 以 / 开头、且不含 /zh-cn/ /en/ 前缀，则读取 page.inputPath
    // 推断 locale 并加前缀。
    //
    // 例：
    //   src/zh-cn/wiki.md     permalink: /wiki/    → /zh-cn/wiki/
    //   src/zh-cn/zone/study.md permalink: /zone/study/ → /zh-cn/zone/study/
    //   src/en/index.md       permalink: /         → /en/
    // ==================== Permalink i18n 增强 ====================
    // Eleventy 3.x 已弃用 eleventy.permalink 事件钩子，
    // 改用 directory data file（src/{locale}/{locale}.11tydata.js）
    // 在 eleventyComputed.permalink 里加 locale 前缀。
    // 见 src/zh-cn/zh-cn.11tydata.js 与 src/en/en.11tydata.js。
    // 这里仅注册一个全局 eleventyComputed，回退到 inputPath 推断：
    eleventyConfig.addGlobalData("eleventyComputed", {
        // permalink 兜底：仅当页面没显式声明 permalink 且未在目录数据中注入时生效
        permalink: function (data) {
            // 已经设置过（含目录级 eleventyComputed）就不再覆盖
            const cur = data && data.permalink;
            if (cur && typeof cur === "string") {
                // 已带前缀就不再处理（重复注入兜底）
                if (/^\/(zh-cn|en)\//.test(cur)) return cur;
                if (cur === "/zh-cn" || cur === "/en") return cur;
                if (INTERNAL_NO_PREFIX.test(cur)) return cur;
                // 根路径特殊页：不加 locale 前缀
                if (cur === "/index.html") return cur;
                if (cur === "/404.html") return cur;
                if (cur === "/") {
                    const locale = (data.locale) || "zh-cn";
                    return "/" + locale + "/";
                }
                // 给未带前缀的 permalink 补上前缀
                const locale = (data.locale) || "zh-cn";
                return "/" + locale + cur;
            }
            return cur; // undefined / null / false / 空 等保持原样
        },
        locale: function (data) {
            // 由 src/{locale}/{locale}.11tydata.js 注入，否则默认 zh-cn
            return data.locale || "zh-cn";
        },
        lang: function (data) {
            if (data.lang) return data.lang;
            const loc = data.locale || "zh-cn";
            return loc === "zh-cn" ? "zh-CN" : loc;
        },
    });

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
