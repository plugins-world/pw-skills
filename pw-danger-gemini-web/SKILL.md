---
name: pw-danger-gemini-web
description: 使用 Gemini Web 的图像生成技能。通过 Google Gemini 从文本提示生成图像。也支持文本生成。可作为其他技能（如封面图、小红书图片、文章配图）的图像生成后端。
---

# Gemini Web 客户端

支持功能:
- 文本生成
- 图像生成（下载 + 保存）
- 参考图像用于视觉输入（附加本地图像）
- 通过持久化 `--sessionId` 进行多轮对话

## 脚本目录

**重要**: 所有脚本位于此技能的 `scripts/` 子目录中。

**Agent 执行说明**:
1. 确定此 SKILL.md 文件的目录路径为 `SKILL_DIR`
2. 脚本路径 = `${SKILL_DIR}/scripts/<script-name>.ts`
3. 将本文档中的所有 `${SKILL_DIR}` 替换为实际路径

**脚本参考**:
| 脚本 | 用途 |
|------|------|
| `scripts/main.ts` | 文本/图像生成的 CLI 入口点 |
| `scripts/gemini-webapi/*` | `gemini_webapi` 的 TypeScript 移植版（GeminiClient、类型、工具） |

## ⚠️ 免责声明（必需）

**使用此技能前**，必须执行同意检查。

### 同意检查流程

**步骤 1**: 检查同意文件

```bash
# macOS
cat ~/Library/Application\ Support/pw-skills/gemini-web/consent.json 2>/dev/null

# Linux
cat ~/.local/share/pw-skills/gemini-web/consent.json 2>/dev/null

# Windows (PowerShell)
Get-Content "$env:APPDATA\pw-skills\gemini-web\consent.json" 2>$null
```

**步骤 2**: 如果同意文件存在且 `accepted: true` 并匹配 `disclaimerVersion: "1.0"`:

打印警告并继续:
```
⚠️  警告: 使用逆向工程的 Gemini Web API（非官方）。接受时间: <acceptedAt 日期>
```

**步骤 3**: 如果同意文件不存在或 `disclaimerVersion` 不匹配:

显示免责声明并询问用户:

```
⚠️  免责声明

此工具使用逆向工程的 Gemini Web API，而非官方 Google API。

风险:
- 如果 Google 更改其 API，可能会在没有通知的情况下失效
- 没有官方支持或保证
- 使用风险自负

您是否接受这些条款并希望继续？
```

使用 `AskUserQuestion` 工具，选项为:
- **是，我接受** - 继续并保存同意
- **否，我拒绝** - 立即退出

**步骤 4**: 接受后，创建同意文件:

```bash
# macOS
mkdir -p ~/Library/Application\ Support/pw-skills/gemini-web
cat > ~/Library/Application\ Support/pw-skills/gemini-web/consent.json << 'EOF'
{
  "version": 1,
  "accepted": true,
  "acceptedAt": "<ISO 时间戳>",
  "disclaimerVersion": "1.0"
}
EOF

# Linux
mkdir -p ~/.local/share/pw-skills/gemini-web
cat > ~/.local/share/pw-skills/gemini-web/consent.json << 'EOF'
{
  "version": 1,
  "accepted": true,
  "acceptedAt": "<ISO 时间戳>",
  "disclaimerVersion": "1.0"
}
EOF
```

**步骤 5**: 拒绝后，输出消息并停止:
```
用户拒绝了免责声明。退出。
```

---

## 快速开始

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts "你好，Gemini"
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "解释量子计算"
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "一只可爱的猫" --image cat.png
npx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image out.png

# 多轮对话（agent 生成唯一的 sessionId）
npx -y bun ${SKILL_DIR}/scripts/main.ts "记住这个: 42" --sessionId my-unique-id-123
npx -y bun ${SKILL_DIR}/scripts/main.ts "什么数字?" --sessionId my-unique-id-123
```

## 命令

### 文本生成

```bash
# 简单提示（位置参数）
npx -y bun ${SKILL_DIR}/scripts/main.ts "你的提示内容"

# 显式提示标志
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "你的提示内容"
npx -y bun ${SKILL_DIR}/scripts/main.ts -p "你的提示内容"

# 选择模型
npx -y bun ${SKILL_DIR}/scripts/main.ts -p "你好" -m gemini-2.5-pro

# 从标准输入管道
echo "总结这个" | npx -y bun ${SKILL_DIR}/scripts/main.ts
```

### 图像生成

```bash
# 使用默认路径生成图像（./generated.png）
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "山上的日落" --image

# 使用自定义路径生成图像
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "一个可爱的机器人" --image robot.png

# 简写形式
npx -y bun ${SKILL_DIR}/scripts/main.ts "一条龙" --image=dragon.png
```

### 视觉输入（参考图像）

```bash
# 文本 + 图像 -> 文本
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "描述这张图片" --reference a.png

# 文本 + 图像 -> 图像
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "生成一个变体" --reference a.png --image out.png
```

### 输出格式

```bash
# 纯文本（默认）
npx -y bun ${SKILL_DIR}/scripts/main.ts "你好"

# JSON 输出
npx -y bun ${SKILL_DIR}/scripts/main.ts "你好" --json
```

## 选项

| 选项 | 说明 |
|------|------|
| `--prompt <text>`, `-p` | 提示文本 |
| `--promptfiles <files...>` | 从文件读取提示（按顺序连接） |
| `--model <id>`, `-m` | 模型: gemini-3-pro（默认）、gemini-2.5-pro、gemini-2.5-flash |
| `--image [path]` | 生成图像，保存到路径（默认: generated.png） |
| `--reference <files...>`, `--ref <files...>` | 用于视觉输入的参考图像 |
| `--sessionId <id>` | 多轮对话的会话 ID（agent 生成唯一 ID） |
| `--list-sessions` | 列出已保存的会话（最多 100 个，按更新时间排序） |
| `--json` | 输出为 JSON |
| `--login` | 仅刷新 cookies，然后退出 |
| `--cookie-path <path>` | 自定义 cookie 文件路径 |
| `--profile-dir <path>` | Chrome 配置文件目录 |
| `--help`, `-h` | 显示帮助 |

CLI 说明: `scripts/main.ts` 支持文本生成、图像生成、参考图像（`--reference/--ref`）和通过 `--sessionId` 进行多轮对话。

## 模型

- `gemini-3-pro` - 默认，最新模型
- `gemini-2.5-pro` - 上一代 pro 版本
- `gemini-2.5-flash` - 快速、轻量级

## 认证

首次运行会打开浏览器进行 Google 认证。Cookies 会被缓存以供后续运行使用。

**支持的浏览器**（按顺序自动检测）:
- Google Chrome
- Google Chrome Canary / Beta
- Chromium
- Microsoft Edge

如需要，可使用 `GEMINI_WEB_CHROME_PATH` 环境变量覆盖。

```bash
# 强制刷新 cookie
npx -y bun ${SKILL_DIR}/scripts/main.ts --login
```

**登录说明**:
- 浏览器打开后会一直等待，直到你完成登录
- 没有超时限制，你可以慢慢处理多因素认证等步骤
- 登录成功后，浏览器会在 3 秒后自动关闭

## 环境变量

| 变量 | 说明 |
|------|------|
| `GEMINI_WEB_DATA_DIR` | 数据目录 |
| `GEMINI_WEB_COOKIE_PATH` | Cookie 文件路径 |
| `GEMINI_WEB_CHROME_PROFILE_DIR` | Chrome 配置文件目录 |
| `GEMINI_WEB_CHROME_PATH` | Chrome 可执行文件路径 |

## 代理配置

如果需要代理访问 Google 服务（例如在中国），请在运行前设置 `HTTP_PROXY` 和 `HTTPS_PROXY` 环境变量:

```bash
# 使用本地代理的示例
HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts "你好"

# 使用代理生成图像
HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "一只猫" --image cat.png

# 使用代理刷新 cookie
HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts --login
```

**注意**: 环境变量必须与命令内联设置。Shell 配置文件设置（如 `.bashrc`）可能不会被子进程继承。

## 示例

### 生成文本响应
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts "法国的首都是什么?"
```

### 生成图像
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts "一张金毛猎犬幼犬的逼真照片" --image puppy.png
```

### 获取 JSON 输出用于解析
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts "你好" --json | jq '.text'
```

### 从提示文件生成图像
```bash
# 将 system.md + content.md 连接作为提示
npx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image output.png
```

### 多轮对话
```bash
# 使用唯一 ID 开始会话（agent 生成此 ID）
npx -y bun ${SKILL_DIR}/scripts/main.ts "你是一个有帮助的数学导师。" --sessionId task-abc123

# 继续对话（记住上下文）
npx -y bun ${SKILL_DIR}/scripts/main.ts "2+2 等于多少?" --sessionId task-abc123
npx -y bun ${SKILL_DIR}/scripts/main.ts "现在乘以 10" --sessionId task-abc123

# 列出最近的会话（最多 100 个，按更新时间排序）
npx -y bun ${SKILL_DIR}/scripts/main.ts --list-sessions
```

**批量处理最佳实践**:
- 当处理一个目录下的多个文件时，建议使用同一个 session ID
- 这样可以保持对话连续性，Gemini 能记住之前的上下文
- 示例：为目录生成固定的 session ID

```bash
# 为目录生成固定的 session ID（使用目录路径的 hash）
DIR_PATH="/path/to/project"
SESSION_ID=$(echo -n "$DIR_PATH" | md5sum | cut -d' ' -f1)

# 批量处理该目录下的文件，使用同一个 session ID
npx -y bun ${SKILL_DIR}/scripts/main.ts "生成第一张图" --sessionId "$SESSION_ID" --image img1.png
npx -y bun ${SKILL_DIR}/scripts/main.ts "生成第二张图" --sessionId "$SESSION_ID" --image img2.png
npx -y bun ${SKILL_DIR}/scripts/main.ts "生成第三张图" --sessionId "$SESSION_ID" --image img3.png
```

会话文件存储在 `~/Library/Application Support/pw-skills/gemini-web/sessions/<id>.json` 中，包含:
- `id`: 会话 ID
- `metadata`: 用于继续的 Gemini 聊天元数据
- `messages`: `{role, content, timestamp, error?}` 数组
- `createdAt`, `updatedAt`: 时间戳

## 扩展支持

通过 EXTEND.md 进行自定义配置。

**检查路径**（优先级顺序）:
1. `.pw-skills/pw-danger-gemini-web/EXTEND.md`（项目级）
2. `~/.pw-skills/pw-danger-gemini-web/EXTEND.md`（用户级）

如果找到，在工作流之前加载。扩展内容会覆盖默认值。
