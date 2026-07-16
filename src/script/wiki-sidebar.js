/**
 * Wiki 侧边栏折叠控制
 * - PC 端：默认展开，可点击收起（不参与菜单互斥，独立管理）
 * - 移动端：默认收起（抽屉），点击按钮从左侧滑出
 *   · 与 popup/drawer 互斥：打开前关闭其他菜单
 *   · 占用 history 槽位（系统返回键可关闭）
 *   · 状态不再存 localStorage（避免与历史栈重复管理）
 *
 * 由 main.js 在检测到 .wiki-sidebar-toggle 后按需调用
 */

import { dom } from './_dom.js';
import { acquireSlot, releaseSlot, markReleased, getSlotOwner } from './history-stack.js';

const MOBILE_BREAKPOINT = 769;
const OPEN_CLASS = 'wiki-sidebar-open';

// 模块状态：移动端抽屉是否打开（PC 端折叠状态由 .wiki-sidebar-collapsed 类承担，不计入此标志）
let wikiMobileOpen = false;

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

// 公共 API：供其他模块互斥调用
// manageHistory：true（默认）= 主动 back 清理 history 栈；
//                 false = 不触碰（用于互斥关闭或 popstate 回调内）
function openWiki() {
    console.debug('[wiki-sidebar] 打开');
    // 互斥：弹窗打开中 → 静默关闭弹窗
    if (getSlotOwner() === 'popup') {
        console.debug('[wiki-sidebar] 互斥关闭弹窗');
        onPopupClose(false);
    }
    // 互斥：抽屉打开中 → 静默关闭抽屉
    if (getSlotOwner() === 'drawer') {
        console.debug('[wiki-sidebar] 互斥关闭抽屉');
        onDrawerClose(false);
    }
    layout.classList.remove('wiki-sidebar-collapsed');
    if (header) header.classList.add(OPEN_CLASS);
    wikiMobileOpen = true;
    acquireSlot('wiki');
}

function closeWiki(manageHistory = true) {
    if (isMobile() && !wikiMobileOpen) {
        console.debug('[wiki-sidebar] 已关闭，跳过');
        return;
    }
    console.debug('[wiki-sidebar] 关闭, manageHistory=' + manageHistory);
    layout.classList.add('wiki-sidebar-collapsed');
    if (header) header.classList.remove(OPEN_CLASS);
    wikiMobileOpen = false;
    if (manageHistory) {
        releaseSlot();
    } else {
        markReleased();
    }
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

// ---- 依赖注入（由 main.js 调用时传入） ----
var layout = dom.wikiLayout;
var sidebar = dom.wikiSidebar;
var toggle = dom.wikiSidebarToggle;
var header = dom.header;
var onPopupClose = function () { }; // 默认 no-op
var onDrawerClose = function () { }; // 默认 no-op

export function initWikiSidebar() {
    // ============================================================
    // 调试日志（保留）
    // ------------------------------------------------------------
    // 排查「按钮点了没反应」类问题时，这些日志能快速定位问题阶段：
    //   1. 「被调用」 → main.js 是否成功调到本函数
    //   2. 「元素检查」 → DOM 元素是否都拿到了（解决 .wiki-layout
    //                     等被 Eleventy 重命名/缺失的常见情况）
    //   3. 「关键元素缺失」 → 元素没拿到，模块主动跳过
    //   4. 「初始化」 → 模块已接管按钮，事件已绑定
    // 贡献者若需重构本模块，建议保留这四条日志以延续可调试性。
    // ============================================================
    console.debug('[wiki-sidebar] initWikiSidebar 被调用');
    console.debug('[wiki-sidebar] 元素检查:',
        'layout=' + !!layout,
        'sidebar=' + !!sidebar,
        'toggle=' + !!toggle);
    if (!layout || !sidebar || !toggle) {
        console.debug('[wiki-sidebar] 关键元素缺失，跳过初始化');
        return;
    }

    console.debug('[wiki-sidebar] 初始化');

    // 初始化状态：
    // - 移动端：默认折叠（抽屉藏在屏幕外）
    // - PC 端：默认展开（不参与菜单互斥，独立管理）
    if (isMobile()) {
        layout.classList.add('wiki-sidebar-collapsed');
    }

    // 切换按钮
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        console.debug('[wiki-sidebar] 切换按钮点击, isMobile=' + isMobile());
        if (isMobile()) {
            // 移动端：抽屉模式，受菜单互斥管理
            if (wikiMobileOpen) {
                closeWiki(true);
            } else {
                openWiki();
            }
        } else {
            // PC 端：纯折叠面板，独立 toggle，不进入互斥/history 栈
            layout.classList.toggle('wiki-sidebar-collapsed');
        }
    });

    // 监听窗口大小变化，跨设备时同步状态
    let lastMobile = isMobile();
    const handleResize = debounce(function () {
        console.debug('[wiki-sidebar] resize 防抖触发，当前是否移动端: ' + isMobile());
        const nowMobile = isMobile();
        if (nowMobile !== lastMobile) {
            lastMobile = nowMobile;
            if (nowMobile) {
                // 切到移动端：强制收起（抽屉模式），不占用 history 槽位
                layout.classList.add('wiki-sidebar-collapsed');
                if (header) header.classList.remove(OPEN_CLASS);
                wikiMobileOpen = false;
                if (getSlotOwner() === 'wiki') {
                    markReleased();
                }
            }
            // 切到 PC 端：保持当前折叠类即可（不再恢复打开，因为跨设备时交互模式已变）
        }
    }, 150);
    window.addEventListener('resize', handleResize);

    // 自动滚动到当前活跃项
    scrollToActive(sidebar);
}

// ---- 公共 API 供 main.js 注入互斥与统一事件 ----

// 供 main.js 在初始化时注入其他模块的关闭回调
export function setWikiDeps(deps) {
    if (deps && typeof deps.onPopupClose === 'function') {
        onPopupClose = deps.onPopupClose;
    }
    if (deps && typeof deps.onDrawerClose === 'function') {
        onDrawerClose = deps.onDrawerClose;
    }
}

// 供 main.js 在统一遮罩点击 / ESC / popstate 路由中调用
export function getWikiMobileOpen() {
    return wikiMobileOpen;
}

export { closeWiki };
