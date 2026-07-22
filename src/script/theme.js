// ============================================================
// theme.js — 主题管理模块
// ------------------------------------------------------------
// 职责：
//   1. 管理主题状态（auto / light / dark）
//   2. 持久化主题偏好到 localStorage
//   3. 监听系统主题变化（prefers-color-scheme）
//   4. 提供公共 API 供其他模块调用
//
// 公共 API：
//   - getCurrentTheme()   获取当前设置的主题（'auto' | 'light' | 'dark'）
//   - getResolvedTheme()  获取实际解析后的主题（'light' | 'dark'）
//   - applyTheme(theme)   应用指定主题并持久化
//   - initTheme()         初始化主题（读取存储 + 设置监听器）
//   - toggleTheme()       循环切换主题（auto → light → dark → auto）
// ============================================================

const STORAGE_KEY = "hjx-theme";

let cachedTheme = null;

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getCurrentTheme() {
    return cachedTheme || "auto";
}

export function getResolvedTheme() {
    const current = getCurrentTheme();
    if (current === "auto") {
        return getSystemTheme();
    }
    return current;
}

export function applyTheme(theme) {
    console.debug("[theme] 应用主题:", theme);

    if (theme === "auto") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.dataset.theme = theme;
    }

    cachedTheme = theme;

    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { }
}

export function toggleTheme() {
    const current = getCurrentTheme();
    let next;
    if (current === "auto") {
        next = "light";
    } else if (current === "light") {
        next = "dark";
    } else {
        next = "auto";
    }
    applyTheme(next);
    return next;
}

export function initTheme() {
    console.debug("[theme] 初始化");

    // 读取初始主题（仅设缓存；data-theme 已由 head-assets.njk 内联脚本在 CSS 前设置，无需再应用）
    let saved = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) { }

    cachedTheme = saved;
    console.debug("[theme] 读取初始主题:", saved);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", function () {
        console.debug("[theme] 系统主题变化，当前设置:", cachedTheme);
        const shouldRespond = !cachedTheme || cachedTheme === "auto";
        console.debug("[theme] 是否响应系统变化:", shouldRespond ? "是" : "否");

        if (shouldRespond) {
            if (mq.matches) {
                document.documentElement.dataset.theme = "dark";
            } else {
                document.documentElement.removeAttribute("data-theme");
            }
        }
    });
}
