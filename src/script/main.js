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
console.debug('[main] 初始化代码高亮和主题模块');
initPrism();
initTheme();

// ============================================================
// 语言切换器：点击 .lang-btn 切换 .lang-menu.open
// 与主题切换器完全独立，不互斥（不阻挡弹窗/抽屉），
// 简化实现：点击按钮/菜单外部/ESC 时收起。
//
// 额外的"持久化"：点击菜单项时把语言偏好写入 localStorage + cookie，
// 这样根路径 / 的 JS 跳板页（src/_includes/layouts/redirect.njk）
// 能记住用户偏好，下次访问 / 时直接跳到对应语言而不是又判断一次。
// ============================================================
(function initLangSwitcher() {
    const langBtn = document.querySelector('.lang-btn');
    const langMenu = document.querySelector('.lang-menu');
    if (!langBtn || !langMenu) return;

    // 写入语言偏好的辅助函数
    function persistLang(lang) {
        try {
            localStorage.setItem('hjx-lang', lang);
        } catch (e) {
            // localStorage 可能被禁用（隐私模式），静默失败即可
        }
    }

    // 拦截语言菜单项的点击：在跳转前先持久化偏好
    langMenu.addEventListener('click', function (e) {
        var link = e.target.closest('a[data-lang]');
        if (!link) return;
        persistLang(link.getAttribute('data-lang'));
        // 让默认的链接跳转继续生效
    });

    function isOpen() {
        return langMenu.classList.contains('open');
    }
    function open() {
        langMenu.classList.add('open');
        langBtn.setAttribute('aria-expanded', 'true');
    }
    function close() {
        langMenu.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
        if (isOpen()) close();
        else open();
    }

    langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle();
    });
    // 点击菜单外部关闭
    document.addEventListener('click', function (e) {
        if (isOpen() && !langMenu.contains(e.target) && !langBtn.contains(e.target)) {
            close();
        }
    });
    // ESC 关闭
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) {
            close();
            langBtn.focus();
        }
    });
})();

    // 按需初始化 wiki 侧边栏（非 wiki 页面无相关元素，内部会优雅跳过）
    // 此处不重复打日志，由 wiki-sidebar.js 内部负责调试输出（详见该模块顶部注释）
    initWikiSidebar();

    console.debug('[main] 初始化完成 ✓');
})();
