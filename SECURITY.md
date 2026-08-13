# 安全策略

我们非常重视任何可能影响本网站用户的安全漏洞，并鼓励负责任的披露。🤝

---

## 📌 支持的版本

本仓库采用“滚动发布”模式：推送到 `main` 分支的内容即为生产环境运行版本。我们仅为当前已部署的版本提供安全修复。

| 分支      | 状态                   |
| ------- | -------------------- |
| `main`  | ✅ 正在积极维护          |
| 其他分支   | ❌ 不再维护             |

> 请始终针对 `main` 分支（或基于它的 Fork）提交修复。

---

## 🛡️ 我们关注的安全问题

以下类别的问题属于本仓库的受理范围，请按优先级上报：

1. **构建 / 部署流水线**
   - `.github/workflows/**` 中的脚本注入或权限提升问题
   - `package.json` / `.eleventy.js` / `scripts/**` 中的命令执行缺陷
   - Dependabot 或 lockfile 被劫持
2. **模板注入（XSS）**
   - 通过 `src/**` 或 `docs/**` 下的 Markdown / Nunjucks 模板引入的存储型 XSS
3. **供应链**
   - `node_modules` 中影响已构建站点的已知 CVE
4. **敏感数据泄露**
   - `.env` 文件、密钥、令牌或同学隐私信息被意外提交到仓库历史中

---

## 📣 如何上报

请**不要**通过公开的 Issue、Discussion 或 Pull Request 上报安全问题。

请改用以下私密渠道之一。

### 📧 电子邮件

发送邮件至 <contact@mantoujun-lab.com>

请在邮件中包含以下内容：

- 漏洞的简要描述及其影响
- 复现步骤 / PoC（截图、代码片段、`curl` 命令等）
- 受影响的版本或提交
- 可能的修复建议（如果有）
- 你的联系方式（方便我们跟进）

### 🔒 GitHub 私密漏洞上报（推荐）

1. 进入仓库的 **Security** 选项卡 → **Report a vulnerability** → 选择 “Private vulnerability reporting”
2. 直达链接：<https://github.com/mantoujun-lab/class-website/security/advisories/new>
3. 填写详细信息并提交

---

## ⏱️ 响应时间

我们的承诺如下：

| 阶段       | 目标                                          |
| -------- | ------------------------------------------- |
| 确认收到     | 收到报告后 **3 个工作日** 内                      |
| 评估与方案    | 确认收到后 **7 个工作日** 内                       |
| 修复与公开致谢  | **30 天**内完成，视严重程度而定                       |

> 实际进度可能会因问题复杂度而有所调整。我们会在过程中持续与你保持沟通。
>
> **特别说明**：如果你发现**特别严重**的漏洞（可能直接危及线上服务或泄露用户数据），我们将**立即处理**，不受上述时间表的限制。

---

## 🏆 漏洞奖励

作为一个班级项目，我们**不提供现金奖励**，但我们会：

- 在修复公告中为你署名
- 将你的贡献添加到 `CONTRIBUTORS.md`

---

## 🔐 安全实践

本项目遵循以下安全实践：

- ✅ 所有外部资源均通过 HTTPS 提供
- ✅ 不使用内联脚本处理用户输入（XSS 缓解）
- ✅ 依赖项通过 Dependabot 自动更新
- ✅ 关键变更必须通过 Pull Request 进行审查
- ✅ GitHub Actions 自动运行 CodeQL 安全扫描

---

## 🔗 相关资源

- GitHub Security Lab：<https://securitylab.github.com/>
- OWASP Top 10：<https://owasp.org/www-project-top-ten/>
- Eleventy 安全公告：<https://github.com/11ty/eleventy/security/advisories>
- GitHub 私密漏洞上报文档：<https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability>

> 安全是每个人的责任 —— 感谢你帮助我们把这个项目做得更好 ✨
