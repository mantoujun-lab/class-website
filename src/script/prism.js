// ============================================================
// prism.js — 代码高亮（动态 import 串行加载）
// ------------------------------------------------------------
// 历史问题：之前用 <script defer> 加载 Prism 插件，但主程序跑起来时
// 插件脚本还没注册（line-numbers-rows / toolbar 都是 false）。
//
// 解决：把脚本加载逻辑搬到 ES Module 里，用 Promise 链按顺序
// 串行加载，确保 Prism 核心就绪后再加载插件，插件就绪后再高亮。
//
// 关于 toolbar 插件：
//   Prism 的 toolbar 插件需要 <pre> 上有 data-toolbar-order 属性才会
//   注入按钮（除非全局声明）。这里在 initPrism 里给所有 pre 注入属性。
// ============================================================

const PRISM_BASE = 'https://cdn.bootcdn.net/ajax/libs/prism/1.29.0';

/**
 * 顺序加载一组脚本：上一个完成后才开始下一个。
 * @param {string[]} urls
 */
function loadScriptsSequentially(urls) {
    return urls.reduce(function (promise, url) {
        return promise.then(function () {
            return new Promise(function (resolve, reject) {
                if (document.querySelector('script[data-prism="' + url + '"]')) {
                    return resolve();
                }
                var s = document.createElement('script');
                s.src = url;
                s.async = false;
                s.dataset.prism = url;
                s.onload = function () { resolve(); };
                s.onerror = function () { reject(new Error('加载失败: ' + url)); };
                document.head.appendChild(s);
            });
        });
    }, Promise.resolve());
}

export async function initPrism() {
    if (!document.querySelector('pre code')) {
        console.debug('[Prism] 无代码块，跳过');
        return;
    }

    console.debug('[Prism] 开始加载脚本链');

    try {
        await loadScriptsSequentially([
            PRISM_BASE + '/prism.min.js',
            PRISM_BASE + '/plugins/line-numbers/prism-line-numbers.min.js',
            PRISM_BASE + '/plugins/toolbar/prism-toolbar.min.js',
            PRISM_BASE + '/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js',
        ]);

        if (!window.Prism || typeof window.Prism.highlightAll !== 'function') {
            console.warn('[Prism] window.Prism 不可用');
            return;
        }

        // ===== 关键步骤：给所有 <pre> 注入 toolbar 触发属性 =====
        // Prism toolbar 插件要求 <pre> 上有 data-toolbar-order 才会渲染按钮。
        // 在 body 上声明一次，pre 会继承这个属性（Prism 文档说的）。
        if (!document.body.hasAttribute('data-toolbar-order')) {
            document.body.setAttribute('data-toolbar-order', 'copy-to-clipboard');
        }

        // 显式注册 copy-to-clipboard 按钮（双保险）
        // copy-to-clipboard 插件会自动注册，但保险起见手动注册一次
        if (window.Prism.plugins.toolbar && window.Prism.plugins['copy-to-clipboard']) {
            // copy-to-clipboard 插件加载时会自动调用 registerButton
            // 如果没有自动注册，这里手动注册
            try {
                window.Prism.plugins.toolbar.registerButton('copy-to-clipboard', {
                    text: 'Copy',
                });
            } catch (e) {
                // 可能已注册过，忽略
            }
        }

        window.Prism.highlightAll();
    } catch (err) {
        console.error('[Prism] 加载链失败:', err);
    }
}