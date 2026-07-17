// src/en/ 目录数据文件
// 自动注入给本目录及子目录的所有页面：
// - locale / lang：让模板渲染时知道当前语言
// - permalink：自动给未带 locale 前缀的 permalink 加上 /en/

module.exports = {
    eleventyComputed: {
        locale: () => "en",
        lang:   () => "en",
        permalink: (data) => {
            const cur = data.permalink;
            // 缺省/禁用：保持原样，让 Eleventy 按默认规则生成
            if (!cur || typeof cur !== "string") return cur;
            // 已经带前缀：保持原样
            if (/^\/(zh-cn|en)\//.test(cur)) return cur;
            if (cur === "/zh-cn" || cur === "/en") return cur;
            // 静态资源（保险）
            if (/^\/(assets|script|style|img|favicon\.ico)\//.test(cur)) return cur;
            // 根路径：/ -> /en/
            if (cur === "/") return "/en/";
            // 补上前缀
            return "/en" + cur;
        },
    },
};