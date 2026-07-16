// ============================================================
// popup-modal.js — 通用模态弹窗（Modal）
// ------------------------------------------------------------
// 职责：
//   1. 接管页面内所有 .modal 节点：data-modal-state 切换 + body.modal-open 切换
//   2. 委托式事件绑定（document 级）：
//        - [data-modal-open="<id>"]   点击 → 打开对应弹窗
//        - [data-modal-close="<id>"]  点击 → 关闭对应弹窗
//        - [data-modal-backdrop]      点击 → 不响应（关闭只走 close 触发器 / ESC / popstate）
//   3. 焦点陷阱：复用 focus-trap.js 的工具（Tab 循环 + 焦点归还）
//   4. 多弹窗互斥：打开新弹窗时关闭当前已打开的弹窗（栈语义，最新的最上层）
//   5. 与现有菜单互斥：弹窗打开时静默关闭 nav-popup / drawer / wiki
//   6. 历史栈：复用 history-stack 的单槽位机制，owner 为 'modal:<id>'。
//      注意：history-stack 为单槽位设计，多 modal 实际是互斥的（openModal 会先
//      关闭已有 modal），同一时间只有一个 modal 占用槽位。
//   7. 暴露 window.openModal / window.closeModal 供外部 JS 调用
//
// 关键设计：
//   - DOM 查询懒加载：第一次 openModal(id) 时按需查找节点，避免空页报错
//   - closeModal(id, manageHistory)：popstate 回调里传 false 避免重复 back
//
// 依赖：
//   - focus-trap.js：rememberFocus / restoreFocus / focusFirst / trapFocus / clearFocusableCache
//   - history-stack.js：acquireSlot / releaseSlot / markReleased / getSlotOwner / onPopState
//   - popup.js / drawer.js / wiki-sidebar.js：互斥关闭（由 main.js 注入）
// ============================================================

import { rememberFocus, restoreFocus, focusFirst, trapFocus, clearFocusableCache } from './focus-trap.js';
import { acquireSlot, releaseSlot, markReleased } from './history-stack.js';

// ---- 模块状态 ----
// openStack: 后进先出的栈，记录当前打开的弹窗 id（用于多弹窗互斥）
const openStack = [];
// 缓存 id -> { modal, backdrop } 引用，避免重复 querySelector
const modalCache = new Map();

// ---- 依赖注入（由 main.js 调用 initModal 时传入） ----
let onPopupClose = function () { };
let onDrawerClose = function () { };
let onWikiClose = function () { };

// ---- 内部工具 ----
function findModal(id) {
    if (modalCache.has(id)) return modalCache.get(id);
    const modal = document.getElementById('modal-' + id);
    if (!modal) {
        console.debug('[modal] 未找到 id=' + id + ' 的弹窗节点');
        return null;
    }
    const backdrop = document.querySelector('.modal-backdrop[data-modal-backdrop="' + id + '"]');
    const entry = { modal: modal, backdrop: backdrop };
    modalCache.set(id, entry);
    return entry;
}

function getOwnerId(id) {
    // history-stack 的 owner 用 'modal:<id>' 与 popup/drawer/wiki 区分
    return 'modal:' + id;
}

// ---- 核心 API ----
export function openModal(id) {
    console.debug('[modal] 打开弹窗: ' + id);
    const entry = findModal(id);
    if (!entry) return;

    // 互斥：若其他菜单正打开，静默关闭（复用 history 槽位）
    // 注：nav-popup/drawer/wiki 占用的是同一个单槽位 'popup'/'drawer'/'wiki'，
    // 本模态弹窗用的是 'modal:<id>' 多槽位，互不冲突。
    if (typeof onPopupClose === 'function') onPopupClose(false);
    if (typeof onDrawerClose === 'function') onDrawerClose(false);
    if (typeof onWikiClose === 'function') onWikiClose(false);

    // 多弹窗互斥：若已有别的弹窗打开，先关闭（保留各自 history 释放）
    while (openStack.length > 0) {
        const prevId = openStack[openStack.length - 1];
        if (prevId === id) {
            // 同一个弹窗重复打开：仅把焦点拉回去即可
            entry.modal.setAttribute('data-modal-state', 'open');
            document.body.classList.add('modal-open');
            focusFirst(entry.modal);
            return;
        }
        closeModal(prevId, false);
    }

    // 入栈
    openStack.push(id);
    document.body.classList.add('modal-open');
    entry.modal.setAttribute('data-modal-state', 'open');

    // 占用 history 槽位（按 id 区分，支持多弹窗共存于 history 栈）
    acquireSlot(getOwnerId(id));

    // 焦点管理
    rememberFocus();
    // 等动画结束后再聚焦，避免 transition 与 focus 抢资源
    requestAnimationFrame(function () {
        focusFirst(entry.modal);
    });

    // 触发自定义事件，方便外部 hook
    entry.modal.dispatchEvent(new CustomEvent('modal:open', { bubbles: true, detail: { id: id } }));
}

export function closeModal(id, manageHistory) {
    if (manageHistory === undefined) manageHistory = true;
    const idx = openStack.lastIndexOf(id);
    if (idx === -1) {
        console.debug('[modal] 关闭弹窗: ' + id + '（未打开，跳过）');
        return;
    }
    console.debug('[modal] 关闭弹窗: ' + id + ', manageHistory=' + manageHistory);

    const entry = findModal(id);
    if (!entry) return;

    entry.modal.setAttribute('data-modal-state', 'closed');
    clearFocusableCache(entry.modal);

    openStack.splice(idx, 1);

    // 栈空时移除 body 类
    if (openStack.length === 0) {
        document.body.classList.remove('modal-open');
    }

    // 释放 history 槽位
    if (manageHistory) {
        releaseSlot();
    } else {
        markReleased();
    }

    // 归还焦点
    restoreFocus();

    // 触发自定义事件
    entry.modal.dispatchEvent(new CustomEvent('modal:close', { bubbles: true, detail: { id: id } }));
}

// 查询是否打开了某个 / 任意弹窗
export function isModalOpen(id) {
    if (id) return openStack.indexOf(id) !== -1;
    return openStack.length > 0;
}

// 关闭当前最顶层弹窗（用于 ESC 等"关一个就行"的场景）
export function closeTopModal() {
    if (openStack.length === 0) return false;
    const topId = openStack[openStack.length - 1];
    closeModal(topId, true);
    return true;
}

// ---- 初始化入口 ----
export function initModal(deps) {
    console.debug('[modal] 初始化');
    if (deps && typeof deps.onPopupClose === 'function') onPopupClose = deps.onPopupClose;
    if (deps && typeof deps.onDrawerClose === 'function') onDrawerClose = deps.onDrawerClose;
    if (deps && typeof deps.onWikiClose === 'function') onWikiClose = deps.onWikiClose;

    // ---- 委托式点击事件 ----
    document.addEventListener('click', function (e) {
        // 打开触发器
        const opener = e.target.closest('[data-modal-open]');
        if (opener) {
            e.preventDefault();
            const id = opener.getAttribute('data-modal-open');
            openModal(id);
            return;
        }
        // 关闭触发器（关闭按钮 / 自定义链接）
        const closer = e.target.closest('[data-modal-close]');
        if (closer) {
            e.preventDefault();
            const id = closer.getAttribute('data-modal-close');
            closeModal(id, true);
            return;
        }
        // 遮罩点击：永远不响应（弹窗关闭只走 [data-modal-close] / ESC / popstate）
        const backdrop = e.target.closest('[data-modal-backdrop]');
        if (backdrop) return;
    });

    // ---- 全局键盘：ESC 关闭栈顶 + Tab 焦点陷阱 ----
    document.addEventListener('keydown', function (e) {
        if (openStack.length === 0) return;

        if (e.key === 'Escape') {
            e.stopPropagation(); // 避免 main.js 的 ESC 处理器重复关闭其它菜单
            closeTopModal();
            return;
        }

        if (e.key === 'Tab') {
            const topId = openStack[openStack.length - 1];
            const entry = findModal(topId);
            if (entry) trapFocus(e, entry.modal);
        }
    });

    console.debug('[modal] 初始化完成 ✓');
}

// ---- 暴露给 window 方便外部脚本调用 ----
if (typeof window !== 'undefined') {
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeTopModal = closeTopModal;
    window.isModalOpen = isModalOpen;
}