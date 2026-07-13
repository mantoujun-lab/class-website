# Security Policy

> 📌 **Authoritative source**: This file is kept in sync with [`.github/SECURITY.md`](.github/SECURITY.md) and the Chinese master copy [`docs/SECURITY_zh-cn.md`](docs/SECURITY_zh-cn.md). If the three ever disagree, **the Chinese master copy is authoritative**.
>
> 🌐 [简体中文](docs/SECURITY_zh-cn.md)

We take any security vulnerability that could affect the users of this site very seriously and encourage responsible disclosure. 🤝

---

## 📌 Supported Versions

This repository uses a "rolling release" model: whatever has been published to the `main` branch is what runs in production. We only ship security fixes for the currently deployed version.

| Branch  | Status                    |
| ------- | ------------------------- |
| `main`  | ✅ Actively supported     |
| Others  | ❌ No longer maintained   |

> Please always submit fixes against `main` (or a fork based on it).

---

## 🛡️ Vulnerabilities We Care About

The following classes of issues are considered in scope for this repository and should be reported in priority order:

1. **Build / deployment pipeline**
   - Script injection or privilege escalation in `.github/workflows/**`
   - Command-execution flaws in `package.json` / `.eleventy.js` / `scripts/**`
   - Hijack of Dependabot or the lockfile
2. **Template injection (XSS)**
   - Stored XSS introduced through Markdown / Nunjucks templates under `src/**` or `docs/**`
3. **Supply chain**
   - Known CVEs in `node_modules` that affect the built site
4. **Sensitive data exposure**
   - Accidental commits of `.env` files, secrets, tokens, or classmates' private information into the repository history

---

## 📣 How to Report

Please **do not** report security issues through public Issues, Discussions, or Pull Requests.

Use one of the private channels below instead.

### 📧 Email

Send an email to **3881679030@qq.com** or **2064074143@qq.com**.

> These personal mailboxes are only a fallback when the GitHub private advisory channel is unavailable. Prefer the GitHub channel below.

Please include the following in your email:

- A summary of the vulnerability and its impact
- Reproduction steps / PoC (screenshots, code snippets, `curl` commands, etc.)
- The affected version or commit
- A possible fix suggestion (if you have one)
- Your contact information (so we can follow up)

### 🔒 GitHub Private Vulnerability Reporting (Recommended)

1. Go to the repository's **Security** tab → **Report a vulnerability** → choose "Private vulnerability reporting"
2. Direct link: <https://github.com/hjx-25pc1/hjx-25pc1.github.io/security/advisories/new>
3. Fill in the details and submit

---

## ⏱️ Response Time

Our commitments:

| Stage                | Target                                                |
| -------------------- | ----------------------------------------------------- |
| Acknowledgement      | Within **3 business days** of receiving the report    |
| Assessment & plan    | Within **7 business days** of acknowledgement         |
| Fix & public credit  | Within **30 days**, depending on severity             |

> Real-world progress may shift based on complexity. We'll keep you in the loop as we go.
>
> **Special note**: if you find a **particularly severe** vulnerability (one that could directly compromise the live service or leak user data), we will **act on it immediately**, regardless of the timeline above.

---

## 🏆 Bug Bounty

As a class project, we **do not offer cash rewards**, but we will:

- Credit you in the fix announcement
- Add your contribution to `CONTRIBUTORS.md`
- Record your GitHub handle in the "Security Hall of Fame" below (with your consent)

---

## 🔐 Security Practices

This project follows these security practices:

- ✅ All external resources are served over HTTPS
- ✅ No inline scripts are used to handle user input (XSS mitigation)
- ✅ Dependencies are updated automatically via Dependabot
- ✅ Critical changes must be reviewed through a Pull Request
- ✅ GitHub Actions automatically runs CodeQL security scanning
- ✅ CODEOWNERS forces maintainer review on build, configuration, and documentation changes

---

## 🙌 Security Hall of Fame

We will list reporters here after their fix has shipped (with their consent).

- _No entries yet_

---

## 🔗 Related Resources

- GitHub Security Lab: <https://securitylab.github.com/>
- OWASP Top 10: <https://owasp.org/www-project-top-ten/>
- Eleventy security advisories: <https://github.com/11ty/eleventy/security/advisories>
- GitHub docs on private vulnerability reporting: <https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability>

> Security is everyone's responsibility — thanks for helping us make this project better ✨
