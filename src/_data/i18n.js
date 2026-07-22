// 全站 i18n 字典
// 用法：在模板里 {{ 'nav.home' | i18n }}
// 插件会根据 page.url 的第一段（如 /zh-cn/、/en/）自动推断 locale，
// 找不到时按 fallbackLocales 兜底。
//
// 维护规则：
//   1) 任何写在模板里的"展示文案"都应抽到字典里，而不是硬编码
//   2) key 用点号分隔的命名空间（nav.* / footer.* / home.* ...）
//   3) 每个 key 必须同时给出 zh-cn 和 en 的翻译，否则会触发回退警告
//   4) 站内链接 / 资源路径不在字典里（这些走 permalink 与 url filter）

module.exports = {
    // ============================================================
    // 导航栏
    // ============================================================
    "nav.home":         { "zh-cn": "首页",       "en": "Home" },
    "nav.article":      { "zh-cn": "文章",       "en": "Articles" },
    "nav.wiki":         { "zh-cn": "Wiki",       "en": "Wiki" },
    "nav.zone":         { "zh-cn": "分区",       "en": "Zones" },
    "nav.github":       { "zh-cn": "此 Github 项目", "en": "GitHub Repo" },
    "nav.astro":        { "zh-cn": "Astro Playground", "en": "Astro Playground" },
    "nav.siteMap":      { "zh-cn": "导航",       "en": "Sitemap" },
    "nav.themeToggle":  { "zh-cn": "切换主题",   "en": "Theme" },
    "nav.themeAuto":    { "zh-cn": "跟随系统",   "en": "Auto" },
    "nav.themeLight":   { "zh-cn": "浅色",       "en": "Light" },
    "nav.themeDark":    { "zh-cn": "深色",       "en": "Dark" },
    "nav.langSwitch":   { "zh-cn": "语言",       "en": "Language" },

    // ============================================================
    // 设置页
    // ============================================================
    "settings.title":                   { "zh-cn": "设置",                   "en": "Settings" },
    "settings.category.appearance":     { "zh-cn": "外观",                   "en": "Appearance" },
    "settings.category.language":       { "zh-cn": "语言",                   "en": "Language" },
    "settings.theme.title":             { "zh-cn": "主题",                   "en": "Theme" },
    "settings.theme.description":       { "zh-cn": "选择网站的颜色主题",     "en": "Choose the color theme of the website" },
    "settings.language.title":          { "zh-cn": "显示语言",               "en": "Display Language" },
    "settings.language.description":    { "zh-cn": "选择网站的显示语言",     "en": "Choose the display language of the website" },

    // ============================================================
    // Footer
    // ============================================================
    "footer.copyright": {
        "zh-cn": "25级计算机应用1班",
        "en":    "Class of 2025 — Computer Applications",
    },
    "footer.wiki":      { "zh-cn": "Wiki",       "en": "Wiki" },
    "footer.contribute":{ "zh-cn": "贡献指南",   "en": "Contributing" },
    "footer.lastBuild": { "zh-cn": "最后更新",   "en": "Last updated" },
    "footer.poweredBy": { "zh-cn": "由",         "en": "Powered by" },

    // ============================================================
    // 通用 / 按钮 / 卡片
    // ============================================================
    "common.enter":     { "zh-cn": "进入",       "en": "Enter" },
    "common.viewMore":  { "zh-cn": "查看更多",   "en": "View more" },
    "common.viewDetail":{ "zh-cn": "查看详细信息","en": "Read more" },
    "common.author":    { "zh-cn": "作者",       "en": "Author" },
    "common.date":      { "zh-cn": "日期",       "en": "Date" },
    "common.page":      { "zh-cn": "页面",       "en": "Page" },
    "common.close":     { "zh-cn": "关闭",       "en": "Close" },

    // ============================================================
    // 首页
    // ============================================================
    "home.heroTag":     { "zh-cn": "25级计算机应用1班", "en": "Class of 2025 — Computer Applications" },
    "home.heroTitle1":  { "zh-cn": "欢迎来到我们的",   "en": "Welcome to our" },
    "home.heroTitle2":  { "zh-cn": "班级网站",         "en": "class website" },
    "home.heroSubtitle1":{
        "zh-cn": "基于 Eleventy 构建的静态站点,由同学们共同维护。",
        "en":    "A static site built with Eleventy, maintained by our classmates.",
    },
    "home.heroSubtitle2":{
        "zh-cn": "记录学习心得、笔记、事件与项目～",
        "en":    "Documenting study notes, events, and projects~",
    },
    "home.stat.students": { "zh-cn": "同学",   "en": "Students" },
    "home.stat.maintainers": { "zh-cn": "维护者","en": "Maintainers" },
    "home.stat.zones":   { "zh-cn": "分区",   "en": "Zones" },
    "home.stat.stack":   { "zh-cn": "技术栈", "en": "Stack" },
    "home.stat.views":   { "zh-cn": "浏览量", "en": "Views" },
    "home.aboutTitle":   { "zh-cn": "🏫 关于我们", "en": "🏫 About Us" },
    "home.aboutP1":      {
        "zh-cn": "我们是来自海南省经济技术学校的25级计算机应用1班(大专班),一个由 37 名同学组成的小集体",
        "en":    "We are the Class of 2025 — Computer Applications, a small collective of 37 students from Hainan Province Economical Technical School.",
    },
    "home.aboutP2":      {
        "zh-cn": "网站使用 GitHub 托管代码,GitHub Pages 部署静态页面,Eleventy 作为静态站点生成器。",
        "en":    "Source code is hosted on GitHub, static pages are deployed via GitHub Pages, and Eleventy powers the build.",
    },
    "home.aboutP3":      {
        "zh-cn": "目前处于半完成状态,内容会随时变化,欢迎每次都回来看看～",
        "en":    "Still a work in progress — content evolves often, feel free to come back anytime~",
    },
    "home.btnGetStarted":   { "zh-cn": "快速开始", "en": "Get Started" },
    "home.btnWiki":         { "zh-cn": "进入班级 Wiki", "en": "Visit Wiki" },
    "home.btnMoreZones":    { "zh-cn": "更多分区", "en": "More Zones" },
    "home.btnRepo":         { "zh-cn": "GitHub 仓库", "en": "GitHub Repo" },
    "home.btnLearnMore":    { "zh-cn": "了解更多", "en": "Learn More" },
    "home.btnMoreEvents":   { "zh-cn": "查看更多事件", "en": "More Events" },
    "home.btnMoreArticles": { "zh-cn": "查看更多文章", "en": "More Articles" },
    "home.btnAstro":        { "zh-cn": "Astro 站点",  "en": "Astro Site" },
    "home.sectionZones":    { "zh-cn": "📌 分区", "en": "📌 Zones" },
    "home.sectionEvents":   { "zh-cn": "🔔 事件", "en": "🔔 Events" },
    "home.sectionArticles": { "zh-cn": "📰 文章", "en": "📰 Articles" },
    "home.sectionContribs": { "zh-cn": "👥 贡献者", "en": "👥 Contributors" },
    "home.friendsTitle":    { "zh-cn": "🔗 友情链接", "en": "🔗 Friends" },

    // ============================================================
    // Wiki
    // ============================================================
    "wiki.title":          { "zh-cn": "📚 Wiki", "en": "📚 Wiki" },
    "wiki.all":            { "zh-cn": "📖 全部", "en": "📖 All" },
    "wiki.root":           { "zh-cn": "📖 首页", "en": "📖 Home" },
    "wiki.editOnGithub":   { "zh-cn": "✏️ 在 GitHub 上编辑此页", "en": "✏️ Edit this page on GitHub" },
    "wiki.toggleSidebar":  { "zh-cn": "切换侧边栏", "en": "Toggle sidebar" },

    // ============================================================
    // Zone / Article 列表
    // ============================================================
    "article.listTitle":   { "zh-cn": "文章", "en": "Articles" },
    "zone.listTitle":      { "zh-cn": "分区", "en": "Zones" },

    // ============================================================
    // 关于页
    // ============================================================
    "about.title":         { "zh-cn": "关于",   "en": "About" },

    // ============================================================
    // 事件页
    // ============================================================
    "event.title":         { "zh-cn": "事件",   "en": "Events" },

    // ============================================================
    // 语言切换提示
    // ============================================================
    "lang.zh-cn":          { "zh-cn": "简体中文", "en": "简体中文" },
    "lang.en":             { "zh-cn": "English",  "en": "English" },
};
