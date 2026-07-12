/**
 * Wiki 侧边栏折叠控制
 * - PC 端：默认展开，可点击收起
 * - 移动端：默认收起（抽屉），点击按钮从左侧滑出
 * - 状态保存到 localStorage
 * - 移动端展开时给 <body> 加 .wiki-sidebar-open，复用 header 的统一遮罩
 */

import { dom } from './_dom.js';

(function () {
    'use strict';

    const STORAGE_KEY = 'wiki-sidebar-collapsed';
    const MOBILE_BREAKPOINT = 769;
    const OPEN_CLASS = 'wiki-sidebar-open';

    // 防抖工具函数
    function debounce(fn, delay) {
        let timer = null;
        return function () {
            const context = this;
            const args = arguments;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    function isMobile() {
        return window.innerWidth < MOBILE_BREAKPOINT;
    }

    function syncOverlay(layout) {
        if (isMobile()) {
            const open = !layout.classList.contains('wiki-sidebar-collapsed');
            document.body.classList.toggle(OPEN_CLASS, open);
        } else {
            document.body.classList.remove(OPEN_CLASS);
        }
    }

    function init() {
        console.debug('[wiki-sidebar] 初始化');

        const layout = dom.wikiLayout;
        if (!layout) return;

        const sidebar = dom.wikiSidebar;
        const toggle = dom.wikiSidebarToggle;
        if (!sidebar || !toggle) return;

        // 初始化状态：
        // - 移动端：默认折叠（抽屉藏在屏幕外）
        // - PC 端：读取用户偏好
        if (isMobile()) {
            layout.classList.add('wiki-sidebar-collapsed');
        } else {
            const saved = localStorage.getItem(STORAGE_KEY);
            console.debug('[wiki-sidebar] 读取本地存储状态: ' + saved);
            if (saved === 'true') {
                layout.classList.add('wiki-sidebar-collapsed');
            }
        }
        syncOverlay(layout);

        // 切换按钮
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const collapsed = layout.classList.toggle('wiki-sidebar-collapsed');
            console.debug('[wiki-sidebar] 切换状态: collapsed=' + collapsed);
            localStorage.setItem(STORAGE_KEY, String(collapsed));
            console.debug('[wiki-sidebar] 保存状态到本地存储: ' + collapsed);
            syncOverlay(layout);
        });

        // 移动端：点击统一遮罩（.overlay）关闭
        const overlay = dom.overlay;
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (!isMobile()) return;
                if (layout.classList.contains('wiki-sidebar-collapsed')) return;
                if (!document.body.classList.contains(OPEN_CLASS)) return;
                e.stopPropagation();
                console.debug('[wiki-sidebar] 遮罩点击关闭侧边栏');
                layout.classList.add('wiki-sidebar-collapsed');
                localStorage.setItem(STORAGE_KEY, 'true');
                console.debug('[wiki-sidebar] 保存状态到本地存储: true');
                syncOverlay(layout);
            });
        }

        // 监听窗口大小变化，跨设备时同步状态
        let lastMobile = isMobile();
        const handleResize = debounce(function () {
            console.debug('[wiki-sidebar] resize 防抖触发，当前是否移动端: ' + isMobile());
            const nowMobile = isMobile();
            if (nowMobile !== lastMobile) {
                lastMobile = nowMobile;
                if (nowMobile) {
                    layout.classList.add('wiki-sidebar-collapsed');
                }
                syncOverlay(layout);
            }
        }, 150);
        window.addEventListener('resize', handleResize);

        // ESC 键收起（仅 PC）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' &&
                !layout.classList.contains('wiki-sidebar-collapsed') &&
                !isMobile()) {
                console.debug('[wiki-sidebar] ESC 键收起侧边栏');
                layout.classList.add('wiki-sidebar-collapsed');
                localStorage.setItem(STORAGE_KEY, 'true');
                console.debug('[wiki-sidebar] 保存状态到本地存储: true');
                syncOverlay(layout);
            }
        });

        // 自动滚动到当前活跃项
        scrollToActive(sidebar);
    }

    function scrollToActive(sidebar) {
        const active = sidebar.querySelector('a.active');
        if (!active) return;
        console.debug('[wiki-sidebar] 滚动到当前活跃项');
        // 等动画完成后滚动，避免抖动
        requestAnimationFrame(() => {
            active.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
