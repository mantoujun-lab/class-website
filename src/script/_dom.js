// ============================================================
// _dom.js — DOM 元素引用集中处
// ------------------------------------------------------------
// 职责：
//   1. 一次性查询并导出所有需要操作的 DOM 节点
//   2. 为其他模块（popup / drawer / focus-trap）提供统一引用
//
// 命名约定：与 SCSS 中 _variables.scss 一致，下划线前缀
// 语义上表示"内部模块"，通常不作为主入口被直接 import，
// 而是被其他模块按需引用。
// ============================================================

export const dom = {
    header: document.querySelector('header'),
    popupBtn: document.querySelector('.nav-popup-btn'),
    popup: document.querySelector('.nav-popup'),
    overlay: document.querySelector('.overlay'),
    closeBtn: document.querySelector('.nav-popup-close'),
    drawerCloseBtn: document.querySelector('.nav-drawer-close'),
    navToggle: document.getElementById('nav-toggle'),
    themeBtn: document.querySelector('.theme-btn'),
    themeMenu: document.querySelector('.theme-menu'),
    wikiLayout: document.querySelector('.wiki-layout'),
    wikiSidebar: document.querySelector('.wiki-sidebar'),
    wikiSidebarToggle: document.querySelector('.wiki-sidebar-toggle'),
};
