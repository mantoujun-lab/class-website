// 全站统一的构建时间，每次 Eleventy 构建时动态生成。
// 用于 footer 展示「最后更新」，避免依赖 page.date（文件 mtime 在 CI checkout 时会全量刷新）。

module.exports = {
    iso: new Date().toISOString(),
    // 直接使用系统时区输出的本地时间字符串（与 bjDate filter 行为一致）
    display: new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Shanghai",
    }).replace(/\//g, "-"),
};
