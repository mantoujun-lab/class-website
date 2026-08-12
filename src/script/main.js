// ============================================================
// main.js — 移动端导航交互编排入口
// ------------------------------------------------------------
// 职责：
//   1. 初始化各功能模块（popup / drawer / wiki-sidebar / modal）
//   2. 注入模块间的互斥回调（弹窗关抽屉/wiki / 抽屉关弹窗/wiki / wiki 关弹窗/抽屉 / modal 关抽屉/wiki/弹窗）
//   3. 绑定全局事件：统一遮罩点击、ESC 关闭、文档外部点击
//   4. 路由 popstate：按优先级关闭对应菜单（modal: 优先于 nav 类）
//
// 模块拆分（参考 SCSS 的 @use 分文件组织）：
//   - _dom.js          DOM 元素引用集中
//   - focus-trap.js    焦点陷阱工具
//   - history-stack.js History API 单槽位管理（modal 使用 owner='modal:<id>'）
//   - popup.js         导航弹窗模块
//   - drawer.js        抽屉模块
//   - wiki-sidebar.js  Wiki 侧边栏模块（仅 wiki 页生效）
//   - popup-modal.js   通用模态弹窗模块（公告、确认框、富文本展示）
//
// 互斥约定（优先级：modal > 弹窗 > 抽屉 > wiki）：
//   - modal 打开时若弹窗/抽屉/wiki 正打开 → 静默关闭（复用槽位）
//   - 弹窗打开时若抽屉/wiki 正打开 → 静默关闭（复用槽位）
//   - 抽屉打开时若弹窗/wiki 正打开 → 静默关闭（复用槽位）
//   - wiki 打开时若弹窗/抽屉正打开 → 静默关闭（复用槽位）
//   - history 槽位由 historyStack 统一管理，调用方不可直接操作
// ============================================================

import { dom } from './_dom.js';
import { trapFocus } from './focus-trap.js';
import { onPopState } from './history-stack.js';
import { initPopup, closePopup, getPopupOpen } from './popup.js';
import { initDrawer, closeDrawer, getDrawerOpen } from './drawer.js';
import { initPrism } from './prism.js';
import { initTheme } from './theme.js';
import { initLang } from './lang.js';
import { initSettings } from './settings.js';
import { initWikiSidebar, setWikiDeps, getWikiMobileOpen, closeWiki } from './wiki-sidebar.js';
import { initModal, isModalOpen, closeTopModal } from './popup-modal.js';

(function () {
    'use strict';

    // 关键元素缺失时直接退出（优雅降级）
    if (!dom.header || !dom.popupBtn || !dom.popup) {
        console.debug('[main] 关键元素缺失，退出初始化');
        return;
    }
    console.debug('[main] 初始化开始');

    console.debug('[main] 初始化各功能模块');
    // ---- 初始化模块 + 注入互斥回调 ----
    // 弹窗互斥关闭抽屉 / wiki：manageHistory=false 复用 history 槽位
    initPopup({
        onDrawerClose: function (manageHistory) { closeDrawer(manageHistory); },
        onWikiClose: function (manageHistory) { closeWiki(manageHistory); }
    });
    // 抽屉互斥关闭弹窗 / wiki：manageHistory=false 复用 history 槽位
    initDrawer({
        onPopupClose: function (manageHistory) { closePopup(manageHistory); },
        onWikiClose: function (manageHistory) { closeWiki(manageHistory); }
    });
    // wiki 侧边栏互斥关闭弹窗 / 抽屉（仅 wiki 页生效）
    setWikiDeps({
        onPopupClose: function (manageHistory) { closePopup(manageHistory); },
        onDrawerClose: function (manageHistory) { closeDrawer(manageHistory); }
    });
    // 通用模态弹窗：弹窗打开时互斥关闭 nav-popup / drawer / wiki
    initModal({
        onPopupClose: function (manageHistory) { closePopup(manageHistory); },
        onDrawerClose: function (manageHistory) { closeDrawer(manageHistory); },
        onWikiClose: function (manageHistory) { closeWiki(manageHistory); }
    });

    const overlay = dom.overlay;
    const header = dom.header;
    const navToggle = dom.navToggle;

    // ============================================================
    // 全局事件绑定
    // ============================================================

    // 统一遮罩层点击关闭：按优先级关闭弹窗 > 抽屉 > wiki
    if (overlay) {
        overlay.addEventListener('click', function () {
            if (getPopupOpen()) {
                closePopup(true);
            } else if (getDrawerOpen()) {
                closeDrawer(true);
            } else if (getWikiMobileOpen()) {
                closeWiki(true);
            }
        });
    }

    // 点击 header 外部区域关闭弹窗（桌面端下拉面板的主要关闭方式）
    document.addEventListener('click', function (e) {
        if (getPopupOpen() && !header.contains(e.target)) {
            closePopup(true);
        }
    });

    // 键盘事件：ESC 关闭 + Tab 焦点陷阱
    document.addEventListener('keydown', function (e) {
        // ESC：优先关 modal > 弹窗 > 抽屉 > wiki
        // （modal 自身监听器已 stopPropagation 时跳过本分支）
        if (e.key === 'Escape' && !e.defaultPrevented) {
            if (isModalOpen()) {
                // 由 popup-modal.js 的 stopPropagation 提前截获，这里理论走不到
                closeTopModal();
            } else if (getPopupOpen()) {
                closePopup(true);
            } else if (getDrawerOpen()) {
                closeDrawer(true);
            } else if (getWikiMobileOpen()) {
                closeWiki(true);
            }
        }
        // Tab：菜单打开时启用焦点陷阱（modal 由 popup-modal.js 自行处理）
        if (e.key === 'Tab' && !isModalOpen()) {
            if (getPopupOpen()) {
                trapFocus(e, dom.popup);
            } else if (getDrawerOpen() && dom.header) {
                trapFocus(e, dom.header);
            } else if (getWikiMobileOpen() && dom.wikiSidebar) {
                trapFocus(e, dom.wikiSidebar);
            }
        }
    });

    console.debug('[main] 全局事件绑定完成');

    // ============================================================
    // popstate 路由
    // 系统返回键/手势触发时，按槽位占用方关闭对应菜单
    // ============================================================

    onPopState(function (e) {
        // historyStack 已自动释放槽位，manageHistory=false 避免重复 back
        if (!e.owner) return;
        if (e.owner.indexOf('modal:') === 0) {
            // 通用模态弹窗：owner 形如 'modal:<id>'，调用 closeTopModal 关闭栈顶
            closeTopModal();
        } else if (e.owner === 'popup') {
            closePopup(false);
        } else if (e.owner === 'drawer') {
            closeDrawer(false);
        } else if (e.owner === 'wiki') {
            closeWiki(false);
        }
    });

    console.debug('[main] popstate 路由注册完成');

    // ============================================================
    // 代码块增强：行号 + 复制按钮（动态加载 Prism 插件）
    // 异步执行，不阻塞上面菜单初始化
    // ============================================================
    console.debug('[main] 初始化代码高亮、主题、语言和设置模块');
    initPrism();
    initTheme();
    initLang();
    initSettings();

    // 按需初始化 wiki 侧边栏（非 wiki 页面无相关元素，内部会优雅跳过）
    // 此处不重复打日志，由 wiki-sidebar.js 内部负责调试输出（详见该模块顶部注释）
    initWikiSidebar();

    console.debug('[main] 初始化完成 ✓');
})();

// ============================================================
// Vercel Web Analytics + Speed Insights 注入
// ------------------------------------------------------------
// 目的：在纯静态站（Eleventy，无打包器）中复刻 `inject()` /
//       `injectSpeedInsights()` 的行为，避免因 5 个布局都需要
//       接入而新增多处 <script> 标签。
//
// 工作原理：
//   1. Vercel 平台在部署后会自动挂载两个边缘函数路由：
//        /_vercel/insights/script.js
//        /_vercel/speed-insights/script.js
//      它们负责收集 pageview / 性能指标并上报。
//   2. 我们在 main.js 末尾动态 createElement + appendChild，
//      等价于 npm 包里的 `inject()` / `injectSpeedInsights()`：
//        - Web Analytics：先建立 `window.va` 队列（用于 track()），
//          再注入 insights/script.js
//        - Speed Insights：先建立 `window.si` 队列，再注入
//          speed-insights/script.js
//   3. 因为 main.js 是 type="module" 且 defer，自动在 DOMContentLoaded
//      之后异步加载，不会影响 LCP / FCP。
//   4. 重复执行保护：querySelector 检查 src 是否已存在，避免反复注入。
// ============================================================

(function injectVercelAnalytics() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // ============================================================
    // 主机名闸门：
    //   Vercel 的 /_vercel/insights/* 路由只在部署后由平台边缘函数
    //   提供。本地 dev server（localhost/127.0.0.1/0.0.0.0/*.local）
    //   没有这些路由，请求必然 404/ABORT，污染 console。
    //   这里直接跳过注入，本地预览保持静默。
    // ============================================================
    var host = window.location.hostname || '';
    if (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        host === '[::1]' ||
        /\.local$/.test(host)
    ) {
        return;
    }

    // ---------- Vercel Web Analytics ----------
    // 等价于 @vercel/analytics 的 inject()
    if (!window.va) {
        window.va = function () {
            (window.vaq = window.vaq || []).push(arguments);
        };
    }

    var insightsSrc = '/_vercel/insights/script.js';
    if (!document.head.querySelector('script[src*="' + insightsSrc + '"]')) {
        var insightsScript = document.createElement('script');
        insightsScript.src = insightsSrc;
        insightsScript.defer = true;
        // 与 npm 包的 loadProps() 输出对齐：告知 Vercel 后台 SDK 信息
        insightsScript.dataset.sdkn = '@vercel/analytics';
        insightsScript.dataset.sdkv = '2.0.1';
        // 静默处理：上线后偶发网络抖动不值得污染 console。
        // 真要排查时，把这一段改成 console.warn(...) 即可。
        insightsScript.onerror = null;
        document.head.appendChild(insightsScript);
    }

    // ---------- Vercel Speed Insights ----------
    // 等价于 @vercel/speed-insights 的 injectSpeedInsights()
    if (!window.si) {
        window.si = function () {
            (window.siq = window.siq || []).push(arguments);
        };
    }

    var speedSrc = '/_vercel/speed-insights/script.js';
    if (!document.head.querySelector('script[src*="' + speedSrc + '"]')) {
        var speedScript = document.createElement('script');
        speedScript.src = speedSrc;
        speedScript.defer = true;
        speedScript.dataset.sdkn = '@vercel/speed-insights';
        speedScript.dataset.sdkv = '2.0.0';
        // 静默处理（与 Web Analytics 同样的收敛策略）。
        // 如需排查，把这一段改成 console.warn(...) 即可。
        speedScript.onerror = null;
        document.head.appendChild(speedScript);
    }
})();
