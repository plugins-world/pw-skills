---
name: pw-post-to-wechat
description: 发布内容到微信公众号。支持图文发表 (多图配文) 和文章发表 (完整 Markdown 格式)。使用 Chrome CDP 自动化实现。
---

# 微信公众号发布工具

使用 Chrome CDP 自动化技术将内容发布到微信公众号, 支持图文和文章两种模式。

## 快速使用

### 图文发表 (多图配文)

```bash
# 从 markdown 文件和图片目录生成
npx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --markdown article.md --images ./images/

# 使用明确的参数
npx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --title "标题" --content "内容" --image img1.png --image img2.png --submit
```

### 文章发表 (完整 Markdown)

```bash
# 发布 markdown 文章
npx -y bun ${SKILL_DIR}/scripts/wechat-article.ts --markdown article.md --theme grace
```

> **说明**: `${SKILL_DIR}` 代表本技能的安装目录, Agent 会在运行时替换为实际路径。

## 脚本目录

**重要**: 所有脚本位于本技能的 `scripts/` 子目录中。

**Agent 执行说明**:
1. 确定此 SKILL.md 文件的目录路径为 `SKILL_DIR`
2. 脚本路径 = `${SKILL_DIR}/scripts/<script-name>.ts`
3. 将文档中所有 `${SKILL_DIR}` 替换为实际路径

**脚本参考**:
| 脚本 | 用途 |
|------|------|
| `scripts/wechat-browser.ts` | 图文发表 (多图配文) |
| `scripts/wechat-article.ts` | 文章发表 (完整格式) |
| `scripts/md-to-wechat.ts` | Markdown → 微信 HTML 转换 |
| `scripts/copy-to-clipboard.ts` | 复制内容到剪贴板 |
| `scripts/paste-from-clipboard.ts` | 发送真实粘贴按键 |

## 功能对比

| 功能 | 图文发表 | 文章发表 |
|------|----------|----------|
| 多图支持 | ✓ (最多 9 张) | ✓ (内联图片) |
| Markdown 支持 | 标题/内容提取 | 完整格式化 |
| 自动标题压缩 | ✓ (压缩到 20 字) | ✗ |
| 内容压缩 | ✓ (压缩到 1000 字) | ✗ |
| 主题支持 | ✗ | ✓ (default, grace, simple) |

## 图文发表详解

### 参数说明

| 参数 | 说明 |
|------|------|
| `--markdown <path>` | Markdown 文件, 自动提取标题和内容 |
| `--images <dir>` | 图片目录 (按文件名排序) |
| `--title <text>` | 文章标题 (最多 20 字, 超出自动压缩) |
| `--content <text>` | 文章内容 (最多 1000 字, 超出自动压缩) |
| `--image <path>` | 单个图片文件 (可重复使用) |
| `--submit` | 保存为草稿 (默认仅预览) |
| `--profile <dir>` | Chrome 配置文件目录 |

### Markdown 自动提取

使用 `--markdown` 时, 脚本会:

1. **解析 frontmatter** 获取标题和作者:
   ```yaml
   ---
   title: 文章标题
   author: 作者名
   ---
   ```

2. **回退到 H1** (如果没有 frontmatter 标题):
   ```markdown
   # 这将成为标题
   ```

3. **压缩标题** 到 20 字 (如果过长):
   - 原始: "如何在一天内彻底重塑你的人生"
   - 压缩: "一天彻底重塑你的人生"

4. **提取首段** 作为内容 (最多 1000 字)

### 图片目录模式

使用 `--images <dir>` 时:

- 上传目录中所有 PNG/JPG 文件
- 按文件名字母顺序排序
- 命名建议: `01-cover.png`, `02-content.png` 等

### 字段限制

| 字段 | 最大长度 | 说明 |
|------|----------|------|
| 标题 | 20 字 | 超出自动压缩 |
| 内容 | 1000 字 | 超出自动压缩 |
| 图片 | 最多 9 张 | 微信限制 |

## 文章发表详解

### 参数说明

| 参数 | 说明 |
|------|------|
| `--markdown <path>` | 要转换和发布的 Markdown 文件 |
| `--theme <name>` | 主题: default, grace 或 simple |
| `--title <text>` | 覆盖标题 (自动从 markdown 提取) |
| `--author <name>` | 作者名 (默认: 宝玉) |
| `--summary <text>` | 文章摘要 |
| `--html <path>` | 预渲染的 HTML 文件 (替代 markdown) |
| `--profile <dir>` | Chrome 配置文件目录 |

### Markdown 格式

```markdown
---
title: 文章标题
author: 作者名
---

# 标题 (成为文章标题)

普通段落支持 **粗体** 和 *斜体*。

## 章节标题

![图片描述](./image.png)

- 列表项 1
- 列表项 2

> 引用文本

[链接文本](https://example.com)
```

### 图片处理流程

1. **解析**: Markdown 中的图片替换为 `[[IMAGE_PLACEHOLDER_N]]`
2. **渲染**: 生成带占位符的 HTML
3. **粘贴**: 将 HTML 内容粘贴到微信编辑器
4. **替换**: 对每个占位符:
   - 查找并选中占位符文本
   - 滚动到可见区域
   - 按 Backspace 删除占位符
   - 从剪贴板粘贴图片

## 使用示例

### 示例 1: 图文发表

```bash
# 从 markdown 和图片目录生成
npx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --markdown ./article.md --images ./xhs-images/

执行流程:
1. 解析 markdown 元数据:
   - 标题: "如何在一天内彻底重塑你的人生" → "一天内重塑你的人生"
   - 作者: 从 frontmatter 或使用默认值
2. 从首段提取内容
3. 在 xhs-images/ 中找到 7 张图片
4. 打开 Chrome, 导航到微信"图文"编辑器
5. 上传所有图片
6. 填充标题和内容
7. 报告: "图文已发布, 包含 7 张图片。"
```

### 示例 2: 文章发表

```bash
# 发布 markdown 文章
npx -y bun ${SKILL_DIR}/scripts/wechat-article.ts --markdown ./article.md

执行流程:
1. 解析 markdown, 找到 5 张图片
2. 生成带占位符的 HTML
3. 打开 Chrome, 导航到微信编辑器
4. 粘贴 HTML 内容
5. 对每张图片:
   - 选中 [[IMAGE_PLACEHOLDER_1]]
   - 滚动到可见区域
   - 按 Backspace 删除
   - 粘贴图片
6. 报告: "文章已编排, 包含 5 张图片。"
```

## 前置要求

- 已安装 Google Chrome
- `bun` 运行时 (通过 `npx -y bun` 使用)
- 首次运行: 在打开的浏览器窗口中登录微信公众号

## 故障排除

- **未登录**: 首次运行会打开浏览器 - 扫码登录, 会话会保留
- **找不到 Chrome**: 设置 `WECHAT_BROWSER_CHROME_PATH` 环境变量
- **粘贴失败**: 检查系统剪贴板权限

## 扩展支持

通过 EXTEND.md 自定义配置。

**检查路径** (优先级顺序):
1. `.baoyu-skills/baoyu-post-to-wechat/EXTEND.md` (项目级)
2. `~/.baoyu-skills/baoyu-post-to-wechat/EXTEND.md` (用户级)

如果找到, 在工作流之前加载。扩展内容会覆盖默认值。

## 参考文档

- **图文发表**: 查看 `references/image-text-posting.md` 了解详细的图文发表指南
- **文章发表**: 查看 `references/article-posting.md` 了解详细的文章发表指南
