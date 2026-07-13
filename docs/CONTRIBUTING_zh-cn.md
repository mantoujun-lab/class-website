# 贡献指南（Contributing Guide）

首先感谢你有兴趣为本项目做出贡献！无论是提交 Bug 反馈、功能建议、代码改进，还是完善文档与翻译，每一份贡献都让这个班级网站变得更好。 (•̀ᴗ•́)و

本指南会帮助你快速了解如何参与本项目。请在提交任何贡献之前通读一遍。

---

## 目录

- [行为准则](#行为准则)
- [我可以从哪些方面参与？](#我可以从哪些方面参与)
- [提交 Issue](#提交-issue)
    - [Bug 反馈](#bug-反馈)
    - [功能建议](#功能建议)
- [提交 Pull Request](#提交-pull-request)
- [在 GitHub Codespace 中开发](#在-github-codespace-中开发)
- [本地开发环境搭建](#本地开发环境搭建)
- [编码规范](#编码规范)
- [Commit 规范](#commit-规范)
- [部署说明](#部署说明)
- [许可协议](#许可协议)

---

## 行为准则

请所有参与者遵守以下基本准则：

- 友善、包容，尊重每一位贡献者与同学。
- 发表意见时对事不对人，理性讨论。
- 禁止任何形式的歧视、骚扰、攻击性言论。
- 优先以维护者与社区共识为依据，避免反复争论。

违反行为准则的 Issue / PR 可能会被关闭，相关账号可能被限制参与。

---

## 我可以从哪些方面参与？

并不一定需要写代码！你可以：

- 提交 Bug 反馈或功能建议（Issue）
- 改进文案、文档、翻译
- 优化页面排版、样式、交互
- 补充班级资料、照片、活动记录
- 审阅他人的 PR，给出反馈
- 在社区里回答其他人的问题

---

## 提交 Issue

提交 Issue 之前，请先**搜索现有 Issue**，避免重复。

本仓库提供了五种 Issue 模板：

| 模板              | 用途                                                    |
| ----------------- | ------------------------------------------------------- |
| `bug-feedback`    | 报告网站功能异常、显示错乱、链接失效等                   |
| `feature-request` | 提出新功能或内容板块建议                                 |
| `documentation`   | 文档改进建议                                             |
| `performance`     | 性能问题反馈                                             |
| `task`            | 任务跟踪与分配                                           |

请按照对应模板填写，模板内未填写清楚可能会被要求补充信息。

### Bug 反馈

请尽量包含：

- 问题的简要描述
- 复现步骤（如何触发该 Bug）
- 预期行为与实际行为
- 浏览器与操作系统版本
- 截图或录屏（如果有）
- 是否有控制台报错（截图）

### 功能建议

请尽量说明：

- 想解决的问题或场景
- 期望的效果
- 是否可以提供替代方案或参考页面
- 是否愿意自己实现这个功能

---

## 提交 Pull Request

### 基本流程

1. **Fork** 本仓库到你的账号下。
2. 从 `main` 分支拉取新的功能分支：
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feat/your-feature-name
   ```
   分支命名建议：
   - `feat/xxx` — 新功能
   - `fix/xxx` — 修复 Bug
   - `docs/xxx` — 文档修改
   - `style/xxx` — 样式调整
   - `refactor/xxx` — 重构
   - `chore/xxx` — 构建 / 工具链调整
3. 在本地完成修改，并**在本地构建通过**：
   ```bash
   npm run build
   ```
4. 提交代码前先自测：
   - 页面在不同屏幕宽度下显示正常
   - 所有外部资源使用 HTTPS
   - 没有遗留调试代码或 `console.log`
5. 推送到你的 Fork 仓库：
   ```bash
   git push origin feat/your-feature-name
   ```
6. 在 GitHub 上发起 Pull Request，**目标分支选择 `main`**。
7. 等待 CI 检查与维护者 Review。

### PR 注意事项

- 一个 PR 尽量只做一件事，避免巨型 PR。
- 如果你的 PR 解决了某个 Issue，请在描述中使用 `Fixes #123` 或 `Closes #123` 关联。
- 如果是 UI / 样式变更，请附上**修改前 / 修改后**的截图。
- 维护者可能会要求调整，请保持耐心与开放的态度。

---

## 在 GitHub Codespace 中开发

不想在本地装 Node.js 也可以！仓库已经配置好 Codespace 开发容器，在浏览器里就能进入完整环境：

1. 打开 <https://github.com/hjx-25pc1/hjx-25pc1.github.io>，点击绿色的 **Code** 按钮。
2. 切到 **Codespaces** 标签 → 点击 **Create codespace on main**。
3. 首次创建时会自动跑 `npm ci` 安装依赖，并在后台启动 `npm run serve`。
4. 创建完成后右下角会弹出端口转发提示，选择 8080 端口并点击 **Open in Browser**，即可在网页上访问 `http://localhost:8080` 实时预览。
5. 修改 `src/` 下的任意文件，Eleventy 会自动重新构建并刷新浏览器，所见即所得。
6. 改完之后直接通过左侧 Source Control 面板提交、推送、发起 PR，与本地开发完全一致。

> 💡 每个 GitHub 账号每月有免费的 Codespace 额度（2 核机型），普通写稿、改样式完全够用。如果看到「Your codespace exceeds its usage limits」提示，请关闭不用的 Codespace 或等待额度重置。

---

## 本地开发环境搭建

### 环境要求

- Node.js（推荐使用当前 LTS 版本）
- npm（随 Node.js 一起安装）
- Git

### 克隆与安装

```bash
git clone https://github.com/hjx-25pc1/hjx-25pc1.github.io.git
cd hjx-25pc1.github.io
npm install
```

### 常用命令

| 命令              | 说明                                  |
| ----------------- | ------------------------------------- |
| `npm run serve`   | 启动本地开发服务器，支持热重载         |
| `npm run build`   | 构建生产版本，产物输出到 `_site/`     |
| `npm run watch`   | 仅监听文件变化并重新构建，不启动服务器 |
| `npm run sync:wiki` | 把 `src/wiki/` 下的条目同步到 GitHub Wiki 仓库 |
| `npm run release` | 构建并打包 `_site/` 为 zip，输出到 `dist/` |
| `npm run bump`    | 升级 `package.json` / `package-lock.json` 中的 `version` |

启动开发服务器后，默认会在终端输出访问地址（通常是 `http://localhost:8080`），在浏览器打开即可预览。

### 发布版本

仓库内置了发版流程（详见 `.github/workflows/release.yml`）：

1. 把 `package.json` 里的 `version` 改成目标版本（如 `1.2.3`）。
2. 提交并推送 `main`。
3. 打 `v*` 标签并推送：

   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

4. Actions 会自动构建并在 Releases 页面发布 zip 包。

发布前可在本地预演：`npm run release`，会在 `dist/` 下生成同名的 zip 用于核对产物。

### 升级版本号

`npm run bump` 用于改写 `package.json`（以及 `package-lock.json`）中的 `version` 字段。它支持 SemVer 升级类型或显式目标版本：

```bash
npm run bump -- patch          # 1.2.3 → 1.2.4
npm run bump -- minor          # 1.2.3 → 1.3.0
npm run bump -- major          # 1.2.3 → 2.0.0
npm run bump -- 1.3.0          # 显式指定版本号
npm run bump -- 1.3.0-rc.1     # 支持预发行版后缀
```

默认情况下，`npm run bump` 会：

1. 同时改写 `package.json` 和 `package-lock.json` 中的 `version`。
2. 自动 `git add` 并 `git commit`，提交信息为 `chore(release): bump to <new>`。
3. **不**自动 push、**不**自动打 tag —— 这些留给上面的发布流程。

如果想跳过自动 commit（比如嵌到其他脚本里），可以加 `--no-commit`：

```bash
npm run bump -- patch --no-commit
```

一个完整的"发布 → 升级"循环：

```bash
# 1. 发起发版
git tag v1.2.3
git push origin v1.2.3
# → release.yml 自动构建并发布到 GitHub Releases

# 2. 为下一轮迭代做准备
npm run bump -- patch
git push origin main
# → main 上的 version 已更新到 1.2.4
```

### 部署路径前缀

由于本站部署在 GitHub Pages 的根路径下（`/`），请在模板中引用资源时使用 Eleventy 的 `| url` 过滤器：

```njk
<link rel="stylesheet" href="{{ '/style/style.css' | url }}">
<a href="{{ '/about/' | url }}">关于</a>
```

避免直接写死根路径 `/`，否则本地预览时样式和链接会失效。

---

## 编码规范

为保持代码风格统一，请遵守以下规范：

### 样式

- 样式按职责拆分为多个 `.scss` 文件，统一在 `src/style/` 目录中维护。
- 公共变量集中放在 `_variables.scss`，公共 mixin 放在 `_mixins.scss`，新增模块按职责新建对应的 `.scss` 文件。
- 编译入口由 `.eleventy.js` 自动扫描 `src/style/` 下所有非 `_` 前缀的 `.scss` 文件，分别编译为压缩 CSS。
- 避免在模板中写内联样式，除非必要。

### 脚本

- 前端脚本以**原生 ES Modules** 形式组织在 `src/js/` 目录下，按功能域拆分（_dom / focus-trap / history-stack / popup / drawer / main 等），无需打包器。
- 入口 `main.js` 通过 `import` 引入其他模块；HTML 模板中必须以 `<script type="module" src="{{ '/js/main.js' | url }}">` 形式加载，否则模块导入会失败。
- 新增脚本时遵循同一拆分粒度：纯工具函数独立成文件，业务模块封装为 `initXxx(deps)` 形式由 `main.js` 编排入口注入依赖。
- 保持 `var` 而非 `const` / `let`（兼容性考虑），除非确有块级作用域需要。
- 不要使用内联脚本（`onclick="..."` 等），防范 XSS。

### HTML

- 文件必须符合 HTML5 标准，使用 `<!DOCTYPE html>` 声明。
- 必须在 `<html>` 标签上声明 `lang="zh-CN"`。
- 必须包含 `<meta charset="UTF-8">` 和 viewport meta 标签：
  ```html
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- 代码缩进使用 **4 个空格**，不要使用 Tab。

### 中文与英文之间

中文内容与英文内容之间加一个空格，例如：

```markdown
本项目使用 Eleventy 构建，并部署在 GitHub Pages。
```

### 安全

- 不要在仓库中提交任何敏感信息（API Key、密码、Token 等）。
- 不要使用内联脚本处理用户输入，避免 XSS。
- 外部资源统一使用 HTTPS。

---

## Commit 规范

- Commit 信息使用**英文/中文**，简洁描述变更内容。
- 建议使用 Conventional Commits 风格，但不是强制的：

  ```
  feat: add new photo gallery section
  fix: correct broken navigation link on mobile
  docs: update contributing guide
  style: improve header layout on small screens
  refactor: extract card component into partial
  chore: bump eleventy to v3
  ```

- 单个 Commit 尽量只做一件事，方便回溯与 Code Review。

---

## 部署说明

- 仅 `main` 分支的 `push` 会触发部署。
- GitHub Actions 会构建项目并将 `_site/` 目录发布到 GitHub Pages。
- 部署期间不会取消正在进行中的部署，排队中的中间部署会被跳过。
- **不要**直接修改 `_site/` 目录下的任何文件，它会在每次构建时被覆盖。
- 如需修改 CI 流程，请先在 Issue 中与维护者讨论。

部署成功后可通过 [https://hjx-25pc1.github.io](https://hjx-25pc1.github.io) 访问。

---

## 成为贡献者名单成员

如果你的 PR 被合并，欢迎在 `CONTRIBUTORS.md` 中添加自己：

```markdown
## 贡献者

- **你的 GitHub 用户名** — 简短说明你贡献的内容
```

也可以在 PR 中请维护者协助添加。

---

## 联系方式

- 通过 [GitHub Issues](https://github.com/hjx-25pc1/hjx-25pc1.github.io/issues) 提交问题与建议。
- 项目维护者：[mantoujun12](https://github.com/mantoujun12) / [mantoujun6](https://github.com/mantoujun6)。

---

## 文档维护流程

本仓库的文档维护采用"中文优先 → 翻译英文"的流程：

- 本文档 `docs/CONTRIBUTING_zh-cn.md` 为**主要维护源**，所有新增 / 修改先用中文编写。
- 完成后翻译为英文，对应到根目录的 [CONTRIBUTING.md](../CONTRIBUTING.md)。
- 同样的规则也适用于 [README_zh-cn.md](README_zh-cn.md)（中文主要源）与根目录 [README.md](../README.md)（英文翻译版）。
- 提交 PR 时请优先在中文版上改动，再同步翻译，避免两个版本语义漂移。

---

## 许可协议

本项目使用 [MIT 许可证](./LICENSE)。提交贡献即表示你同意以相同协议授权你的代码与文档。