// ============================================================
// lang.js — 语言管理模块
// ------------------------------------------------------------
// 职责：
//   1. 管理当前语言状态
//   2. 持久化语言偏好到 localStorage
//   3. 跳转到指定语言的页面
//   4. 根路径自动跳转
//
// 公共 API：
//   - getCurrentLang()   获取当前语言
//   - persistLang(lang)  保存语言偏好到 localStorage
//   - navigateToLang(lang, urlPattern)  跳转到指定语言的页面
//   - initLang()         初始化语言（根路径自动跳转）
// ============================================================

const STORAGE_KEY = "hjx-lang";
const DEFAULT_LANG = "zh-cn";
const ALLOWED_LANGS = new Set(["zh-cn", "en"]);

function normalizeLang(lang) {
    const lc = String(lang || "").toLowerCase();
    return ALLOWED_LANGS.has(lc) ? lc : DEFAULT_LANG;
}

function buildSafeLangUrl(lang, urlPattern) {
    const safeLang = normalizeLang(lang);
    const pattern = urlPattern || "/{lang}/";
    const rawUrl = pattern.replace(/\{lang\}/g, safeLang);

    try {
        const parsed = new URL(rawUrl, window.location.origin);
        if (parsed.origin !== window.location.origin) {
            return "/" + safeLang + "/";
        }
        return parsed.pathname + parsed.search + parsed.hash;
    } catch (e) {
        return "/" + safeLang + "/";
    }
}

function getBrowserLang() {
    const langs = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || ""];
    const lc = (langs[0] || "").toLowerCase();
    return lc.indexOf("zh") === 0 ? "zh-cn" : "en";
}

export function getCurrentLang() {
    let saved = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) { }

    if (saved === "zh-cn" || saved === "en") {
        return saved;
    }

    const pathMatch = location.pathname.match(/^\/(zh-cn|en)\//i);
    if (pathMatch) {
        return pathMatch[1].toLowerCase();
    }

    return DEFAULT_LANG;
}

export function persistLang(lang) {
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { }
}

export function navigateToLang(lang, urlPattern) {
    const safeLang = normalizeLang(lang);
    const safeUrl = buildSafeLangUrl(safeLang, urlPattern);

    persistLang(safeLang);

    console.debug("[lang] 跳转到:", safeUrl);
    window.location.href = safeUrl;
}

export function initLang() {
    console.debug("[lang] 初始化");

    const pathname = location.pathname;

    if (pathname === "/" || pathname === "" || pathname === "/index.html") {
        const target = getCurrentLang();
        const dest = "/" + target + "/";

        console.debug("[lang] 根路径访问，自动跳转到:", dest);
        window.location.replace(dest);
    }
}
