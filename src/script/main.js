// ============================================================
// main.js — 移动端导航交互编排入口
// ------------------------------------------------------------
// 职责：
//   1. 初始化各功能模块（popup / drawer / wiki-sidebar）
//   2. 注入模块间的互斥回调（弹窗关抽屉/wiki / 抽屉关弹窗/wiki / wiki 关弹窗/抽屉）
//   3. 绑定全局事件：统一遮罩点击、ESC 关闭、文档外部点击
//   4. 路由 popstate：按优先级关闭对应菜单
//
// 模块拆分（参考 SCSS 的 @use 分文件组织）：
//   - _dom.js          DOM 元素引用集中
//   - focus-trap.js    焦点陷阱工具
//   - history-stack.js History API 单槽位管理
//   - popup.js         弹窗模块
//   - drawer.js        抽屉模块
//   - wiki-sidebar.js  Wiki 侧边栏模块（仅 wiki 页生效）
//
// 互斥约定（优先级：弹窗 > 抽屉 > wiki）：
//   - 弹窗打开时若抽屉/wiki 正打开 → 静默关闭（复用槽位）
//   - 抽屉打开时若弹窗/wiki 正打开 → 静默关闭（复用槽位）
//   - wiki 打开时若弹窗/抽屉正打开 → 静默关闭（复用槽位）
//   - history 槽位由 historyStack 统一管理，调用方不可直接操作
// ============================================================

import { dom } from './_dom.js';
import { trapFocus } from './focus-trap.js';
import { onPopState } from './history-stack.js';
import { initPopup, closePopup, getPopupOpen } from './popup.js';
import { initDrawer, closeDrawer, openDrawer, getDrawerOpen } from './drawer.js';
import { initPrism } from './prism.js';
import { initTheme } from './theme.js';
import { initWikiSidebar, setWikiDeps, getWikiMobileOpen, closeWiki } from './wiki-sidebar.js';

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
        // ESC：优先关弹窗 > 抽屉 > wiki
        if (e.key === 'Escape') {
            if (getPopupOpen()) {
                closePopup(true);
            } else if (getDrawerOpen()) {
                closeDrawer(true);
            } else if (getWikiMobileOpen()) {
                closeWiki(true);
            }
        }
        // Tab：弹窗打开时启用焦点陷阱
        if (getPopupOpen() && e.key === 'Tab') {
            trapFocus(e, dom.popup);
        }
    });

    console.debug('[main] 全局事件绑定完成');

    // ============================================================
    // popstate 路由
    // 系统返回键/手势触发时，按槽位占用方关闭对应菜单
    // ============================================================

    onPopState(function (e) {
        // historyStack 已自动释放槽位，manageHistory=false 避免重复 back
        if (e.owner === 'popup') {
            closePopup(false);
        } else if (e.owner === 'drawer') {
            closeDrawer(false);
        } else if (e.owner === 'wiki') {
            closeWiki(false);
        }
        // e.owner 为 null 时不处理（可能由其他代码 push 的 history）
    });

    console.debug('[main] popstate 路由注册完成');

    // ============================================================
    // 代码块增强：行号 + 复制按钮（动态加载 Prism 插件）
    // 异步执行，不阻塞上面菜单初始化
    // ============================================================
    console.debug('[main] 初始化代码高亮和主题模块');
    initPrism();
    initTheme();

    // 按需初始化 wiki 侧边栏（非 wiki 页面无相关元素，内部会优雅跳过）
    // 此处不重复打日志，由 wiki-sidebar.js 内部负责调试输出（详见该模块顶部注释）
    initWikiSidebar();

    console.debug('[main] 初始化完成 ✓');
})();
