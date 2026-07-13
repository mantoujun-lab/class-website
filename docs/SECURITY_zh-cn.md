# 安全政策（Security Policy）

> 📌 **说明**：本文档与 GitHub Security Advisories 引用的 [`.github/SECURITY.md`](../.github/SECURITY.md)、根目录 [SECURITY.md](../SECURITY.md) 共同维护。如三处内容存在出入，**以本文档（`docs/SECURITY_zh-cn.md`）为准**。
>
> 🌐 [English Version](../SECURITY.md)

我们高度重视任何可能影响站点用户的安全漏洞，并鼓励负责任的披露 🤝

---

## 📌 支持的版本

本仓库采用「滚动部署」模式：每次发布到 `main` 分支的内容即为线上版本。我们只为当前线上版本提供安全修复。

| 版本分支    | 支持状态            |
| --------- | ----------------- |
| `main`    | ✅ 积极支持 / 接收安全修复 |
| 其他旧分支  | ❌ 已停止维护          |

> 建议始终在 `main` 分支（或基于其拉取的 fork）上提交修复。

---

## 🛡️ 我们关注的安全问题

以下漏洞类型在本仓库范围内被视为有效，请优先披露：

1. **构建 / 部署链路**
   - `.github/workflows/**` 中的脚本注入、权限提升
   - `package.json` / `.eleventy.js` / `scripts/**` 中的命令执行漏洞
   - Dependabot / 锁定文件被劫持
2. **站点模板注入（XSS）**
   - `src/**`、`docs/**` 中的 Markdown / Nunjucks 模板可能引入存储型 XSS
3. **供应链**
   - 依赖（`node_modules`）中的已知 CVE 影响站点构建产物
4. **敏感信息泄露**
   - 误提交 `.env`、密钥、Token、班级同学隐私信息到仓库历史

---

## 📣 如何报告

请**不要**通过公开 Issue、Discussion 或 Pull Request 报告安全问题。

请通过以下私密渠道提交：

### 📧 邮件上报

发送邮件至 **3881679030@qq.com** 或 **2064074143@qq.com**。

> 上述邮箱仅在 GitHub 私有漏洞报告不可用时使用；推荐优先使用下方 GitHub 通道。

邮件中请包含：

- 漏洞概述与影响范围
- 复现步骤 / PoC（截图、代码片段、`curl` 命令均可）
- 受影响版本 / commit
- 可能的修复建议（如果你有的话）
- 你的联系信息（方便我们回信确认）

### 🔒 GitHub 私有漏洞报告（推荐）

1. 进入本仓库 → `Security` 标签页 → `Report a vulnerability` → 选择「私有漏洞报告」
2. 链接：<https://github.com/hjx-25pc1/hjx-25pc1.github.io/security/advisories/new>
3. 填写漏洞详情并提交

---

## ⏱️ 响应预期

我们承诺：

| 阶段              | 承诺时限             |
| --------------- | ---------------- |
| 首次确认（Received） | 收到报告后 **3 个工作日** 内 |
| 评估并给出处置方案      | 首次确认后 **7 个工作日** 内 |
| 修复并发布 / 公开致谢    | 视严重程度，**30 天内**完成 |

> 实际处理进度可能因复杂度有所调整，我们会在回复中持续同步状态。
>
> **特别说明**：如果发现的是**特别严重**的漏洞（如可直接导致线上服务失陷、用户数据泄露），我们会**立即处理**，不受上述时间表约束。

---

## 🏆 漏洞奖励

作为班级项目，我们**不提供现金奖励**，但会：

- 在修复公告中署名致谢
- 在 `CONTRIBUTORS.md` 中添加你的贡献
- 在本文档下方的「安全致谢名单」中记录你的 GitHub 用户名（征得本人同意后）

---

## 🔐 安全实践

本项目采取了以下安全措施：

- ✅ 所有外部资源统一使用 HTTPS
- ✅ 不使用内联脚本处理用户输入，规避 XSS
- ✅ 依赖通过 Dependabot 自动更新
- ✅ 关键变更必须通过 Pull Request 审核
- ✅ GitHub Actions 自动运行 CodeQL 安全扫描
- ✅ 维护者通过 CODEOWNERS 强制审查构建 / 配置 / 文档改动

---

## 🙌 安全致谢名单

我们将在修复发布后，于此处记录报告者（征得本人同意后）。

- _暂无记录_

---

## 🔗 相关资源

- GitHub Security Lab：<https://securitylab.github.com/>
- OWASP Top 10：<https://owasp.org/www-project-top-ten/>
- Eleventy 安全公告：<https://github.com/11ty/eleventy/security/advisories>
- GitHub 私有漏洞报告说明：<https://docs.github.com/zh/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability>

> 安全是每个人的事，感谢你让这个项目变得更好 ✨
