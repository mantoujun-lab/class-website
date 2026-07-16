// ============================================================
// focus-trap.js — 焦点陷阱工具集
// ------------------------------------------------------------
// 职责：
//   1. 查询容器内可见可聚焦元素（用于弹窗/抽屉内的 Tab 循环）
//   2. 处理 Tab / Shift+Tab 焦点首尾循环
//   3. 记忆与归还焦点（菜单打开前/关闭后）
//
// 与具体菜单无关，纯工具函数。被 popup.js 复用，
// 未来若抽屉需要焦点管理也可直接引用。
//
// ============================================================

// ---- 状态：记忆打开菜单前的活动元素 ----
let lastFocused = null;

// ---- 缓存：容器 -> 可聚焦元素数组 ----
const focusableCache = new Map();

// 记录当前焦点（菜单打开前调用）
export function rememberFocus() {
    console.debug('[focus-trap] 记录当前焦点');
    lastFocused = document.activeElement;
}

// 归还焦点到记忆的元素（菜单关闭后调用）
export function restoreFocus() {
    console.debug('[focus-trap] 恢复焦点到原元素');
    if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
    }
}

// 获取容器内所有可见可聚焦元素（带缓存）
// display:none 的元素无法接收焦点，通过 offsetParent 过滤
export function getVisibleFocusable(container) {
    // 先查缓存
    if (focusableCache.has(container)) {
        const cached = focusableCache.get(container);
        console.debug(`[focus-trap] 缓存命中，容器内可聚焦元素数量: ${cached.length}`);
        return cached;
    }

    console.debug('[focus-trap] 缓存未命中，重新查询可聚焦元素');
    const candidates = container.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const visible = [];
    for (let i = 0; i < candidates.length; i++) {
        // offsetParent 对 position:fixed 元素返回 null（即使可见），
        // 改用 getClientRects 判断可见性并排除 display:none/visibility:hidden
        const el = candidates[i];
        if (el.offsetParent !== null || (el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden')) {
            visible.push(el);
        }
    }
    focusableCache.set(container, visible);
    return visible;
}

// 清除指定容器的可聚焦元素缓存
export function clearFocusableCache(container) {
    console.debug('[focus-trap] 清除缓存');
    focusableCache.delete(container);
}

// 将焦点移至容器内首个可见可聚焦元素
export function focusFirst(container) {
    console.debug('[focus-trap] 焦点移至首个可聚焦元素');
    const focusable = getVisibleFocusable(container);
    if (focusable.length) {
        focusable[0].focus();
    }
}

// 处理 Tab 键焦点循环：到末尾后跳回首部，到首部按 Shift+Tab 跳到末尾
export function trapFocus(e, container) {
    const focusable = getVisibleFocusable(container);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        // Shift+Tab：在首个元素上按则跳到末尾
        if (document.activeElement === first) {
            console.debug('[focus-trap] 焦点循环: 首部→末尾');
            e.preventDefault();
            last.focus();
        }
    } else {
        // Tab：在末尾元素上按则跳回首部
        if (document.activeElement === last) {
            console.debug('[focus-trap] 焦点循环: 末尾→首部');
            e.preventDefault();
            first.focus();
        }
    }
}
