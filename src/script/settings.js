// ============================================================
// settings.js — 设置面板模块
// ------------------------------------------------------------
// 职责：
//   1. 分类导航切换（左侧分类 → 右侧面板）
//   2. 设置项初始化：从 localStorage 读取并设置初始值
//   3. 设置项变更处理：保存到 localStorage + 执行 action
//   4. 内置 Action：applyTheme（主题切换）、navigate（页面跳转）
//   5. 防抖处理：text/textarea 防抖 300ms，range 实时显示但 change 才执行 action
//   6. 支持注册自定义 action
//
// 设计原则：
//   - 事件委托：document 级别监听 click / change
//   - data-* 驱动：所有设置项通过 data 属性配置，不依赖特定 ID
//   - 独立工作：不依赖特定的设置项结构
// ============================================================

import { dom } from './_dom.js';

// ---- 模块状态 ----
// 自定义 action 处理器注册表
const actionHandlers = new Map();
// 防抖计时器缓存
const debounceTimers = new Map();
// 防抖延迟（毫秒）
const DEBOUNCE_DELAY = 300;

// ============================================================
// 工具函数
// ============================================================

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {string} key - 防抖标识（用于清理缓存）
 * @param {number} delay - 延迟毫秒数
 */
function debounce(fn, key, delay) {
    if (debounceTimers.has(key)) {
        clearTimeout(debounceTimers.get(key));
    }
    const timer = setTimeout(function () {
        debounceTimers.delete(key);
        fn();
    }, delay);
    debounceTimers.set(key, timer);
}

/**
 * 从 localStorage 读取设置值
 * @param {string} storageKey - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的值或默认值
 */
export function getSetting(storageKey, defaultValue) {
    try {
        const value = localStorage.getItem(storageKey);
        if (value === null) return defaultValue;
        // 尝试解析布尔值和数字
        if (value === "true") return true;
        if (value === "false") return false;
        if (!isNaN(Number(value)) && value !== "") return Number(value);
        return value;
    } catch (e) {
        return defaultValue;
    }
}

/**
 * 保存设置值到 localStorage
 * @param {string} storageKey - 存储键名
 * @param {*} value - 要保存的值
 */
export function setSetting(storageKey, value) {
    try {
        if (typeof value === "boolean") {
            localStorage.setItem(storageKey, value ? "true" : "false");
        } else {
            localStorage.setItem(storageKey, String(value));
        }
    } catch (e) {
        console.warn("[settings] 保存设置失败:", e);
    }
}

/**
 * 注册自定义 action 处理器
 * @param {string} actionName - action 名称
 * @param {Function} handler - 处理函数，接收 (value, settingItem) 参数
 */
export function registerAction(actionName, handler) {
    if (typeof handler === "function") {
        actionHandlers.set(actionName, handler);
    }
}

// ============================================================
// 分类导航切换
// ============================================================

/**
 * 切换到指定分类
 * @param {string} categoryId - 分类 ID
 */
function switchCategory(categoryId) {
    const categoryItems = document.querySelectorAll(".settings-category-item");
    const panelItems = document.querySelectorAll(".settings-panel-item");

    categoryItems.forEach(function (item) {
        const isActive = item.dataset.settingsCategory === categoryId;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
    });

    panelItems.forEach(function (panel) {
        const isMatch = panel.dataset.settingsPanel === categoryId;
        panel.hidden = !isMatch;
    });
}

/**
 * 初始化分类导航事件
 */
function initCategoryNav() {
    document.addEventListener("click", function (e) {
        const categoryItem = e.target.closest(".settings-category-item");
        if (!categoryItem) return;

        const categoryId = categoryItem.dataset.settingsCategory;
        if (categoryId) {
            switchCategory(categoryId);
        }
    });
}

// ============================================================
// 设置项：读取值 / 写入值
// ============================================================

/**
 * 获取 setting-item 容器
 * @param {HTMLElement} input - 输入元素
 * @returns {HTMLElement|null} setting-item 元素
 */
function getSettingItem(input) {
    return input.closest(".setting-item");
}

/**
 * 从设置项读取当前值
 * @param {HTMLElement} input - 输入元素
 * @param {string} type - 设置类型
 * @returns {*} 当前值
 */
function getSettingValue(input, type) {
    switch (type) {
        case "select":
            return input.value;
        case "radio":
            const settingItem = getSettingItem(input);
            if (!settingItem) return null;
            const checked = settingItem.querySelector('input[type="radio"]:checked');
            return checked ? checked.value : null;
        case "toggle":
        case "checkbox":
            return input.checked;
        case "text":
        case "textarea":
        case "number":
        case "range":
        case "color":
            return input.value;
        default:
            return input.value;
    }
}

/**
 * 设置设置项的值
 * @param {HTMLElement} input - 输入元素
 * @param {string} type - 设置类型
 * @param {*} value - 要设置的值
 */
function setSettingValue(input, type, value) {
    switch (type) {
        case "select":
            input.value = value;
            break;
        case "radio": {
            const settingItem = getSettingItem(input);
            if (!settingItem) break;
            const radios = settingItem.querySelectorAll('input[type="radio"]');
            radios.forEach(function (radio) {
                const isChecked = radio.value === String(value);
                radio.checked = isChecked;
                const radioItem = radio.closest(".setting-radio-item");
                if (radioItem) {
                    radioItem.classList.toggle("is-selected", isChecked);
                }
            });
            break;
        }
        case "toggle":
        case "checkbox":
            input.checked = value === true || value === "true" || value === 1;
            break;
        case "text":
        case "textarea":
        case "number":
        case "range":
        case "color":
            input.value = value;
            break;
    }
    // 更新 UI 显示
    updateSettingUI(input, type, value);
}

/**
 * 更新设置项的 UI 显示（range 数值、color 预览等）
 * @param {HTMLElement} input - 输入元素
 * @param {string} type - 设置类型
 * @param {*} value - 当前值
 */
function updateSettingUI(input, type, value) {
    const settingItem = getSettingItem(input);
    if (!settingItem) return;

    const settingId = settingItem.dataset.settingId;

    if (type === "range") {
        const valueDisplay = settingItem.querySelector('[data-range-value="' + settingId + '"]');
        if (valueDisplay) {
            valueDisplay.textContent = value;
        }
    } else if (type === "color") {
        const preview = settingItem.querySelector('[data-color-preview="' + settingId + '"]');
        if (preview) {
            preview.style.backgroundColor = value;
        }
    }
}

// ============================================================
// 设置项初始化
// ============================================================

/**
 * 初始化所有设置项的初始值
 */
function initSettingItems() {
    const settingItems = document.querySelectorAll(".setting-item");

    settingItems.forEach(function (settingItem) {
        const storageKey = settingItem.dataset.storageKey;
        const type = settingItem.dataset.settingType;
        if (!storageKey || !type) return;

        // 查找输入元素
        const input = settingItem.querySelector("[data-setting-input]");
        if (!input) return;

        // 获取默认值（从 DOM 的默认状态读取）
        let defaultValue = getSettingValue(input, type);

        // 从 localStorage 读取保存的值
        const savedValue = getSetting(storageKey, null);
        if (savedValue !== null) {
            // 设置保存的值
            setSettingValue(input, type, savedValue);
        } else {
            // 使用默认值，更新 UI 显示
            updateSettingUI(input, type, defaultValue);
        }
    });
}

// ============================================================
// Action 执行
// ============================================================

/**
 * 执行 action
 * @param {string} actionName - action 名称
 * @param {*} value - 当前设置值
 * @param {HTMLElement} settingItem - setting-item 元素
 * @param {HTMLElement} input - 输入元素
 */
function executeAction(actionName, value, settingItem, input) {
    if (!actionName) return;

    console.debug("[settings] 执行 action:", actionName, "值:", value);

    // 先检查自定义 action
    if (actionHandlers.has(actionName)) {
        try {
            actionHandlers.get(actionName)(value, settingItem, input);
        } catch (e) {
            console.error("[settings] 自定义 action 执行失败:", actionName, e);
        }
        return;
    }

    // 内置 action
    switch (actionName) {
        case "applyTheme":
            actionApplyTheme(value);
            break;
        case "navigate":
            actionNavigate(value, settingItem);
            break;
        default:
            console.debug("[settings] 未找到 action:", actionName);
    }
}

/**
 * 内置 Action：应用主题
 * 动态导入 theme 模块并调用 applyTheme
 */
function actionApplyTheme(value) {
    import("./theme.js").then(function (themeModule) {
        if (themeModule && typeof themeModule.applyTheme === "function") {
            themeModule.applyTheme(value);
        } else {
            console.warn("[settings] theme 模块中未找到 applyTheme 函数");
        }
    }).catch(function (e) {
        console.error("[settings] 加载 theme 模块失败:", e);
    });
}

/**
 * 内置 Action：页面跳转
 * 从当前选中的 option 中获取 urlPattern，使用 lang.js 的 navigateToLang 跳转
 *
 * 注意：需要模板中的 option 元素有 data-url-pattern 属性
 *       如果模板中没有该属性，默认使用 "/{lang}/"
 */
function actionNavigate(value, settingItem) {
    let urlPattern = null;

    if (settingItem) {
        const type = settingItem.dataset.settingType;

        if (type === "select") {
            const select = settingItem.querySelector("select");
            if (select && select.selectedOptions.length > 0) {
                const selectedOption = select.selectedOptions[0];
                urlPattern = selectedOption.dataset.urlPattern;
            }
        } else if (type === "radio") {
            const checkedRadio = settingItem.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
                urlPattern = checkedRadio.dataset.urlPattern;
            }
        }
    }

    import("./lang.js").then(function (langModule) {
        if (langModule && typeof langModule.navigateToLang === "function") {
            langModule.navigateToLang(value, urlPattern);
        } else {
            console.warn("[settings] lang 模块中未找到 navigateToLang 函数");
            const pattern = urlPattern || "/{lang}/";
            const url = pattern.replace(/\{lang\}/g, value).replace(/\{value\}/g, value);
            window.location.href = url;
        }
    }).catch(function (e) {
        console.error("[settings] 加载 lang 模块失败:", e);
        const pattern = urlPattern || "/{lang}/";
        const url = pattern.replace(/\{lang\}/g, value).replace(/\{value\}/g, value);
        window.location.href = url;
    });
}

// ============================================================
// 设置项变更处理
// ============================================================

/**
 * 处理设置项变更
 * @param {HTMLElement} input - 输入元素
 */
function handleSettingChange(input) {
    const settingItem = getSettingItem(input);
    if (!settingItem) return;

    const storageKey = settingItem.dataset.storageKey;
    const action = settingItem.dataset.action;
    const type = settingItem.dataset.settingType;

    if (!storageKey || !type) return;

    // 读取当前值
    const value = getSettingValue(input, type);

    // 保存到 localStorage
    setSetting(storageKey, value);

    // 更新 UI 显示
    updateSettingUI(input, type, value);

    // 执行 action
    if (action) {
        executeAction(action, value, settingItem, input);
    }
}

/**
 * 初始化设置项变更事件
 */
function initSettingChange() {
    // 监听 change 事件（大多数类型）
    document.addEventListener("change", function (e) {
        const input = e.target.closest("[data-setting-input]");
        if (!input) return;

        const settingItem = getSettingItem(input);
        if (!settingItem) return;

        const type = settingItem.dataset.settingType;

        // range 类型：change 时才执行 action（input 事件只更新显示）
        if (type === "range") {
            handleSettingChange(input);
            return;
        }

        // text/textarea 类型：change 时立即执行（失焦时触发）
        if (type === "text" || type === "textarea") {
            handleSettingChange(input);
            return;
        }

        // 其他类型（select/radio/toggle/checkbox/number/color）：直接处理
        handleSettingChange(input);
    });

    // 监听 input 事件（用于实时更新显示和防抖）
    document.addEventListener("input", function (e) {
        const input = e.target.closest("[data-setting-input]");
        if (!input) return;

        const settingItem = getSettingItem(input);
        if (!settingItem) return;

        const type = settingItem.dataset.settingType;
        const storageKey = settingItem.dataset.storageKey;
        const action = settingItem.dataset.action;

        // range 类型：实时更新显示值，但不保存和执行 action
        if (type === "range") {
            const value = getSettingValue(input, type);
            updateSettingUI(input, type, value);
            return;
        }

        // text/textarea 类型：防抖保存 + 执行 action
        if (type === "text" || type === "textarea") {
            const debounceKey = "setting-" + storageKey;
            debounce(function () {
                handleSettingChange(input);
            }, debounceKey, DEBOUNCE_DELAY);
            return;
        }

        // color 类型：input 时实时更新预览
        if (type === "color") {
            const value = getSettingValue(input, type);
            updateSettingUI(input, type, value);
            return;
        }
    });
}

// ============================================================
// 初始化入口
// ============================================================

export function initSettings() {
    console.debug("[settings] 初始化");

    // 检查页面是否有设置面板
    const hasSettingsPanel = document.querySelector(".settings-panel") !== null;
    if (!hasSettingsPanel) {
        console.debug("[settings] 页面无设置面板，跳过初始化");
        return;
    }

    // 初始化分类导航
    initCategoryNav();

    // 初始化设置项初始值
    initSettingItems();

    // 初始化设置项变更事件
    initSettingChange();

    console.debug("[settings] 初始化完成 ✓");
}
