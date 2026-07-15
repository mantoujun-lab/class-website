// ============================================================
// history-stack.js — History API 单槽位管理
// ------------------------------------------------------------
// 职责：
//   1. 弹窗/抽屉共用一个 history 槽位（因互斥），由本模块统一管理
//   2. 提供 acquire / release / markReleased 三个语义清晰的 API
//   3. 注册 popstate 路由，弹出回调让调用方决定关闭哪个菜单
//
// 关键设计：
//   - 单槽位：弹窗与抽屉不会同时打开（互斥），所以一个 history 记录就够
//   - 槽位由 historyStack 强制管理，调用方无法绕过
//   - 旧浏览器不支持 pushState/popstate 时，所有 API 静默降级为 no-op
// ============================================================

// ---- History API 能力检测 ----
const supportsHistory = !!(window.history && typeof window.history.pushState === 'function');

if (!supportsHistory) {
    console.debug('[history-stack] 浏览器不支持 History API，降级为 no-op');
}

// ---- 状态：当前槽位占用者 ----
// null = 未占用；'popup' = 弹窗占用；'drawer' = 抽屉占用
let slot = null;

// ---- popstate 回调列表 ----
// 调用方通过 onPopState 注册，popstate 触发时按注册顺序逆序调用（栈语义）
const popHandlers = [];

// 占用槽位：未占用时才推入 history 记录；已占用则复用（不会重复 push）
// owner: 'popup' | 'drawer'
export function acquireSlot(owner) {
    if (!supportsHistory) return;
    if (slot) {
        console.debug('[history-stack] 槽位已被 ' + slot + ' 占用，复用');
        return; // 槽位已被占用，复用即可
    }
    console.debug('[history-stack] 占用槽位: ' + owner);
    history.pushState({ navMenu: true }, '');
    slot = owner;
}

// 释放槽位：占用方主动调用，主动 back() 清理 history 栈
// 未占用时调用为 no-op
export function releaseSlot() {
    if (!supportsHistory) return;
    if (!slot) {
        console.debug('[history-stack] 槽位未占用，跳过 release');
        return;
    }
    console.debug('[history-stack] 释放槽位，主动 back');
    slot = null;
    history.back(); // 异步触发 popstate，但 slot 已是 null，回调不会再处理
}

// 仅标记释放：用于 popstate 回调内（history 已自动回退，无需再 back）
export function markReleased() {
    console.debug('[history-stack] 标记槽位已释放');
    slot = null;
}

// 查询当前槽位占用者
export function getSlotOwner() {
    return slot;
}

// 注册 popstate 处理器：返回 disposer 用于反注册
// handler({ owner })：owner 为 popstate 触发时槽位的占用方（可能为 null）
export function onPopState(handler) {
    popHandlers.push(handler);
    return function dispose() {
        const i = popHandlers.indexOf(handler);
        if (i !== -1) popHandlers.splice(i, 1);
    };
}

// ---- 内部：注册全局 popstate 监听 ----
if (supportsHistory) {
    window.addEventListener('popstate', function () {
        const owner = slot;
        console.debug('[history-stack] popstate 触发，原槽位: ' + owner);
        slot = null; // popstate 已回退，槽位强制释放
        // 倒序调用：后注册先处理（栈语义）
        for (let i = popHandlers.length - 1; i >= 0; i--) {
            popHandlers[i]({ owner: owner });
        }
    });
}
