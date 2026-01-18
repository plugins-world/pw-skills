---
name: image-gen
description: Image-Generation - 基于垫图和提示词的 AI 图像生成工作流。支持文生图、图生图、批量生成。
---

<!--
input: 垫图（可选） + 提示词
output: 生成的图像文件（PNG/JPG/WebP）
pos: 核心 skill，AI 图像生成

架构守护者：一旦我被修改，请同步更新：
1. 本文件的头部注释
2. README.md 索引表
-->

# Image-Generation - AI 图像生成工作流

> **核心理念**：分析风格 → 设计提示词 → 用户确认 → 生成图像，避免额度浪费

## 什么时候用

- 需要根据文本描述生成图像
- 有参考图片，需要生成类似风格的图像
- 需要批量生成多张图像
- 希望保持图像风格一致但内容不同

---

## 工作流程

```
分析风格 → 设计提示词 → 安装依赖 → 配置API → 确认生成 → 保存图像
    ↓          ↓           ↓         ↓         ↓         ↓
  风格文件    提示词文件   node-fetch  secrets.md  逐张确认  images/
```

---

## 快速开始

### Step 1: 创建项目目录

```bash
mkdir my-image-project
cd my-image-project
```

### Step 2: 初始化技能（可选，但推荐）

```bash
# 复制配置模板（自定义配置时需要）
cp -r /path/to/Image-Generation/config.example ./config

# 复制 .gitignore（推荐）
cp /path/to/Image-Generation/config.example/.gitignore ./.gitignore

# 编辑配置文件（可选，如需要自定义 API 密钥或域名）
# vim config/secrets.md
```

### Step 3: 安装依赖

```bash
npm init -y
npm install node-fetch
```

### Step 4: 分析图像风格（可选）

如果有参考图片，先分析其风格：

```bash
node /path/to/Image-Generation/scripts/analyze-image.js https://example.com/reference.png
```

这会生成 `output/analysis/01_图像风格分析_xxx.md` 文件。

### Step 5: 编写提示词（使用辅助工具）

使用提示词辅助生成工具（推荐）：

```bash
node /path/to/Image-Generation/scripts/generate-prompt.js
```

或者手动创建提示词文件：

```bash
mkdir -p output/prompts
cp /path/to/Image-Generation/config.example/prompt-templates/提示词模板.md ./output/prompts/
vim ./output/prompts/提示词_我的图像.md
```

### Step 6: 生成图像（逐张确认）

```bash
node /path/to/Image-Generation/scripts/generate-image.js
```

脚本会：
1. 显示每个提示词
2. **询问你是否确认生成**（重要：避免浪费额度）
3. 检查图像是否已存在，支持跳过
4. 一张一张生成图像
5. 保存到 `output/images/` 目录

---

## 文件结构

### 项目目录结构

```
my-image-project/
├── config/
│   └── secrets.md           # API 配置（不提交到版本控制）
├── output/
│   ├── analysis/            # 风格分析（可选）
│   ├── prompts/             # 提示词文件
│   ├── references/          # 参考图像
│   └── images/              # 生成的图像
├── node_modules/            # 依赖包（不提交）
├── package.json
├── package-lock.json
└── .gitignore
```

### Skill 目录结构

```
Image-Generation/
├── SKILL.md                  # 本文件
├── README.md                 # 总览文档
├── docs/
│   ├── 01_提示词设计.md
│   ├── 02_垫图准备.md
│   └── 03_API使用.md
├── config.example/           # 配置模板
│   ├── README.md
│   ├── secrets.md            # API 配置模板
│   ├── .gitignore            # 项目 gitignore 模板
│   └── prompt-templates/
│       └── 提示词模板.md      # 提示词模板
├── scripts/
│   ├── analyze-image.js      # 分析图像风格
│   ├── generate-prompt.js    # 提示词辅助生成
│   ├── generate-image.js     # 生成图像（支持确认和跳过）
│   └── upload-to-cdn.js      # 图床上传功能
└── package.json              # 依赖配置
```

---

## 重要提示

### 避免额度浪费

本技能采用 **逐张确认** 机制：

1. 每次生成前都会询问你确认
2. 支持跳过已生成的图像
3. 一张一张生成，避免批量消耗额度

示例交互：

```
任务 1/3: 02_提示词_柴犬.md
提示词: 一只可爱的柴犬在樱花树下睡觉

【重要提示】生成将消耗 API 额度
是否生成此图像? (y/n, 默认: y):
```

### 配置管理

- 所有配置文件都在 `config/secrets.md` 中
- 支持配置 API 域名和密钥
- 配置文件不会提交到版本控制（已在 .gitignore 中）

### 依赖安装

依赖安装在 **项目目录**，不是 skill 目录：

```bash
# 在项目目录中安装
npm install node-fetch
```

---

## 命令参考

### 分析图像风格

```bash
# 从 URL 分析
node /path/to/Image-Generation/scripts/analyze-image.js <图像URL> [输出目录]

# 从本地文件分析
node /path/to/Image-Generation/scripts/analyze-image.js <本地路径> [输出目录]

# 示例
node /path/to/Image-Generation/scripts/analyze-image.js https://example.com/ref.png
node /path/to/Image-Generation/scripts/analyze-image.js ./local-image.png ./output
```

### 提示词辅助生成

```bash
# 交互式模式（推荐）
node /path/to/Image-Generation/scripts/generate-prompt.js

# 自动生成模式（需要额外配置）
node /path/to/Image-Generation/scripts/generate-prompt.js --generate
```

### 生成图像

```bash
# 基本用法
node /path/to/Image-Generation/scripts/generate-image.js [输出目录]

# 示例
node /path/to/Image-Generation/scripts/generate-image.js
node /path/to/Image-Generation/scripts/generate-image.js ./custom-output
```

### 图床上传（可选）

```bash
node /path/to/Image-Generation/scripts/upload-to-cdn.js <图片路径>
```

---

## 常见场景

### 场景 1：根据文本生成图像

```bash
# 1. 使用提示词辅助工具
node /path/to/Image-Generation/scripts/generate-prompt.js

# 2. 生成图像（会询问确认）
node /path/to/Image-Generation/scripts/generate-image.js
```

### 场景 2：参考图片生成类似风格

```bash
# 1. 分析参考图片风格
node /path/to/Image-Generation/scripts/analyze-image.js https://example.com/ref.png

# 2. 使用提示词辅助工具创建提示词
node /path/to/Image-Generation/scripts/generate-prompt.js

# 3. 生成图像（会询问确认）
node /path/to/Image-Generation/scripts/generate-image.js
```

### 场景 3：批量生成多张图像

```bash
# 1. 使用提示词辅助工具创建多个提示词
node /path/to/Image-Generation/scripts/generate-prompt.js
node /path/to/Image-Generation/scripts/generate-prompt.js

# 2. 生成图像（会逐张询问确认，支持跳过）
node /path/to/Image-Generation/scripts/generate-image.js
```

---

## 跳过已生成的图像

如果图像已存在，脚本会自动检测：

```
任务 1/3: 02_提示词_柴犬.md
图像已存在: 03_生成图像_柴犬.png
是否跳过已生成的图像? (y/n, 默认: y):
```

输入 `y` 或直接回车跳过，输入 `n` 重新生成。

---

## 配置文件说明

### config/secrets.md

```bash
# API 基础 URL（包含域名和路径前缀）
API_BASE_URL=https://ai-router.plugins-world.cn

# 图像分析模型（用于分析图像风格）
ANALYSIS_MODEL_ID=gemini-2.0-flash-exp

# 图像生成模型（用于生成图像）
GENERATION_MODEL_ID=gemini-3-pro-image-preview

# 分析端点路径（会拼接在 API_BASE_URL 后面）
ANALYSIS_ENDPOINT=/v1beta/models/{model}:generateContent

# 生成端点路径（会拼接在 API_BASE_URL 后面）
GENERATION_ENDPOINT=/v1beta/models/{model}:generateContent

# API 密钥
API_KEY=your-api-key-here

# 图床上传端点（如果不配置，则使用 BASE64 内嵌）
IMAGE_UPLOAD_ENDPOINT=
```

### output/prompts/你的提示词.md

```markdown
## 提示词

你的提示词内容...

## 备注（可选）

其他说明...
```

---

## 错误处理

### API 调用失败

```
✗ 图像生成失败: API key 无效
是否重试? (y/n, 默认: n):
```

输入 `y` 重试，输入 `n` 跳过当前图像。

### 配置文件不存在

```
错误: 找不到配置文件 config/secrets.md
请先创建配置文件:
  mkdir -p config
  cp /path/to/skill/Image-Generation/config.example/secrets.md config/secrets.md
  cp /path/to/skill/Image-Generation/config.example/.gitignore .gitignore
```

### 依赖未安装

```
Error: Cannot find module 'node-fetch'
```

解决方法：

```bash
npm install node-fetch
```

---

## 最佳实践

1. **先测试单个图像**：确认提示词效果后再批量生成
2. **使用确认机制**：不要跳过确认步骤，避免浪费额度
3. **保存好的提示词**：将成功的提示词保存为模板
4. **定期备份生成的图像**：避免意外丢失
5. **监控额度使用**：注意 API 调用次数和费用

---

## 高级功能

### 风格迁移

创建提示词时，可以参考风格分析文件的内容：

```markdown
## 提示词

参考 01_图像风格分析_xxx.md 中描述的水彩风格，绘制一座雪山
```

### 批量跳过

如果已生成部分图像，再次运行脚本时会自动检测并询问是否跳过：

```bash
node /path/to/Image-Generation/scripts/generate-image.js
```

### 自定义输出文件名

提示词文件名会直接映射到生成的图像文件名：

- `提示词_柴犬.md` → `提示词_柴犬.png`
- `风景_v1.md` → `风景_v1.png`
