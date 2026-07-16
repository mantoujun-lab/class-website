import { dom } from './_dom.js';

const STORAGE_KEY = 'hjx-theme';
const OPEN_CLASS = 'theme-menu-open';
const TABLET_BP = 768;

let cachedTheme = null;

function applyTheme(mode) {
    console.debug('[theme] 应用主题:', mode);
    if (mode === 'auto') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.dataset.theme = mode;
    }
    cachedTheme = mode;
    console.debug('[theme] 保存主题到本地存储');
    try {
        localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) { }
}

function isDesktop() {
    return window.innerWidth > TABLET_BP;
}

function setMenuOpen(menu, btn, open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (isDesktop()) {
        document.body.classList.toggle(OPEN_CLASS, open);
    }
    if (open) {
        console.debug('[theme] 菜单打开');
    } else {
        console.debug('[theme] 菜单关闭');
    }
}

export function initTheme() {
    console.debug('[theme] 初始化');

    const btn = dom.themeBtn;
    const menu = dom.themeMenu;
    if (!btn || !menu) return;

    // 读取初始主题（仅设缓存；data-theme 已由 head-assets.njk 内联脚本在 CSS 前设置，无需再应用）
    let saved = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) { }
    cachedTheme = saved;
    console.debug('[theme] 读取初始主题:', saved);

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const willOpen = !menu.classList.contains('open');
        setMenuOpen(menu, btn, willOpen);
    });

    menu.querySelectorAll('[data-theme-value]').forEach(function (el) {
        el.addEventListener('click', function () {
            applyTheme(el.dataset.themeValue);
            setMenuOpen(menu, btn, false);
        });
    });

    // 桌面端：点击遮罩关闭菜单
    const overlay = dom.overlay;
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            // 只处理主题菜单场景（避免误关 nav-drawer/nav-popup）
            if (document.body.classList.contains(OPEN_CLASS)) {
                e.stopPropagation();
                setMenuOpen(menu, btn, false);
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            setMenuOpen(menu, btn, false);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            setMenuOpen(menu, btn, false);
            btn.focus();
        }
    });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function () {
        console.debug('[theme] 从缓存读取主题:', cachedTheme);
        const shouldRespond = !cachedTheme || cachedTheme === 'auto';
        console.debug('[theme] 系统主题变化，当前设置:', cachedTheme, '，是否响应:', shouldRespond ? '是' : '否');
        // 仅在「自动」或「未设置」时跟随系统主题
        // （用户已显式选择 dark/light 时不响应系统切换，保持用户偏好）
        if (shouldRespond) {
            if (mq.matches) {
                document.documentElement.dataset.theme = 'dark';
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }
    });
}
