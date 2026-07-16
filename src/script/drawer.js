// ============================================================
// drawer.js — 移动端汉堡抽屉
// ------------------------------------------------------------
// 职责：
//   1. 监听 #nav-toggle checkbox change 事件，同步 CSS/状态
//   2. 暴露 closeDrawer() 供程序化触发（关闭按钮、遮罩、ESC、popstate）
//   3. 与弹窗互斥：抽屉打开时若弹窗正打开则静默关闭
//
// 关键 bug 修复（2026-07）：
//   navToggle.checked = false 不会触发 change 事件，
//   所以程序化关闭必须手动同步 .nav-drawer-open 类、drawerOpen 状态、checkbox 状态。
//   这是 closeDrawer() 必须显式处理三件事的原因。
//
// 依赖：
//   - _dom.js: navToggle / drawerCloseBtn / header 引用
//   - history-stack.js: acquireSlot / releaseSlot / markReleased
//   - onPopupClose（由 main.js 注入）：抽屉打开时关闭弹窗的回调
// ============================================================

import { dom } from './_dom.js';
import { acquireSlot, releaseSlot, markReleased, getSlotOwner } from './history-stack.js';

// ---- 模块状态 ----
let drawerOpen = false;

// ---- 公共 API ----
// 打开抽屉（程序化调用场景预留，checkbox 由用户点击触发时无需调用）
function openDrawer() {
    console.debug('[drawer] 打开抽屉');
    // 互斥：若弹窗正打开，静默关闭（复用 history 槽位，不 back）
    if (getSlotOwner() === 'popup') {
        console.debug('[drawer] 互斥关闭弹窗');
        onPopupClose(false); // 由 main.js 注入
    }
    header.classList.add('nav-drawer-open');
    drawerOpen = true;
    acquireSlot('drawer');
}

// 关闭抽屉
// 参数 manageHistory：true（默认）= 主动 back 清理 history 栈；
//                     false = 不触碰（用于 popstate 回调内 / 互斥关闭时复用槽位）
function closeDrawer(manageHistory = true) {
    if (!drawerOpen && !navToggle.checked) {
        console.debug('[drawer] 已关闭，跳过');
        return; // 已关闭，跳过
    }
    console.debug('[drawer] 关闭抽屉, manageHistory=' + manageHistory);
    header.classList.remove('nav-drawer-open');
    drawerOpen = false;
    navToggle.checked = false; // 同步 checkbox 状态（无副作用：change 不会重入）
    if (manageHistory) {
        releaseSlot();
    } else {
        markReleased(); // 互斥关闭或 popstate 触发时不 back
    }
}

// ---- 依赖注入（由 main.js 调用时传入） ----
// var 声明 + 后赋值，避开 TDZ
var header = dom.header;
var navToggle = dom.navToggle;
var drawerCloseBtn = dom.drawerCloseBtn;
var onPopupClose = function () {}; // 默认 no-op

// 初始化入口：由 main.js 调用，注入弹窗互斥回调
export function initDrawer(deps) {
    console.debug('[drawer] 初始化');
    if (deps && typeof deps.onPopupClose === 'function') {
        onPopupClose = deps.onPopupClose;
    }

    // 监听 checkbox change 事件（用户点击汉堡图标 / 切换触发）
    if (navToggle) {
        navToggle.addEventListener('change', function () {
            console.debug('[drawer] checkbox 状态变化，checked=' + navToggle.checked);
            if (navToggle.checked) {
                // 用户打开抽屉
                openDrawer();
            } else {
                // 用户关闭抽屉（点击汉堡、勾选状态变 false）
                closeDrawer(true);
            }
        });
    }

    // 抽屉内关闭按钮点击（仅移动端显示）
    if (drawerCloseBtn && navToggle) {
        drawerCloseBtn.addEventListener('click', function () {
            console.debug('[drawer] 关闭按钮点击');
            closeDrawer(true);
        });
    }
}

// 暴露给 main.js 供遮罩点击 / ESC / popstate 回调调用
export function getDrawerOpen() {
    return drawerOpen;
}

export { closeDrawer };
