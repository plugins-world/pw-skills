# Image-Generation - AI 图像生成

基于 AI Router API 的图像生成工具，支持文生图、图生图和批量生成。

## 特性

- 文生图：使用文本描述生成图像
- 图生图：使用参考图片生成类似风格图像
- 批量生成：一次生成多张图像（逐张确认，避免额度浪费）
- 风格迁移：将一张图片的风格应用到另一张图片
- 智能跳过：自动检测已生成的图像，支持跳过
- 逐张确认：生成前需要用户确认，避免大量消耗额度

## 工作流程

```
分析风格 → 设计提示词 → 安装依赖 → 配置API → 确认生成 → 保存图像
    ↓          ↓           ↓         ↓         ↓         ↓
  风格文件    提示词文件   node-fetch  secrets.md  逐张确认  images/
```

## 让 AI 帮你安装

您可以让 AI 帮助您安装 Image-Generation skill。

### 使用方法

在您的终端中执行：

```bash
# 让 AI 帮您安装 Image-Generation skill
# 注意：您需要拥有访问 GitHub 和 ai-router 的权限

让我安装 Image-Generation skill：
- 地址：https://github.com/[用户名]/Image-Generation（如果您的代码库在 GitHub 上）
- 存放路径：~/.claude/skills/image-gen
- API Key：[您的 ai-router API Key]

注意：API Key 是 ai-router 的密钥，支持多种模型，不局限于特定平台。
```

### 支持的模型

Image-Generation skill 支持多种图像生成模型，包括但不限于：
- **gemini-3-pro-image-preview**：Google 的 Gemini 3 Pro 图像预览模型
- **gemini-2.0-flash-exp**：Google 的 Gemini 2.0 Flash 实验模型
- **claude-4-sonnet-20251101**：Claude 4 Sonnet 模型
- 其他支持图像生成的模型

### 提示词优化

如果您让 AI 帮助您安装，可以使用以下提示词：

```
我需要安装 Image-Generation skill，请：

1. 克隆仓库到 ~/.claude/skills/image-gen
2. 配置 ai-router 的 API Key：[您的 API Key]
3. 创建项目目录并初始化
4. 测试技能是否正常工作
5. 需要支持多种模型，不局限于特定平台

技能特点：
- 分析图像风格，生成风格分析报告
- 交互式提示词生成
- 逐张确认，避免额度浪费
- 支持图床上传
- 智能跳过已生成图像
- 配置文件可选，支持默认配置
```

### 手动安装（备用方法）

如果 AI 安装遇到问题，您可以手动安装：

```bash
# 1. 克隆仓库（如果您有仓库）
mkdir -p ~/.claude/skills/image-gen
git clone https://github.com/[用户名]/Image-Generation ~/.claude/skills/image-gen

# 2. 创建项目目录
mkdir my-image-project && cd my-image-project
npm init -y && npm install node-fetch
cp ~/.claude/skills/image-gen/config.example/.gitignore ./.gitignore

# 3. 配置（可选）
cp -r ~/.claude/skills/image-gen/config.example ./config
# 编辑 config/secrets.md，填入您的 API Key
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

```bash
node /path/to/Image-Generation/scripts/analyze-image.js https://example.com/reference.png
```

### Step 5: 编写提示词（使用辅助工具）

```bash
node /path/to/Image-Generation/scripts/generate-prompt.js
```

### Step 6: 生成图像（逐张确认）

```bash
node /path/to/Image-Generation/scripts/generate-image.js
```

## 重要功能说明

### 逐张确认机制（避免额度浪费）

```bash
任务 1/3: 02_提示词_柴犬.md
提示词: 一只可爱的柴犬在樱花树下睡觉

【重要提示】生成将消耗 API 额度
是否生成此图像? (y/n, 默认: y):
```

### 跳过已生成图像

```bash
任务 1/3: 02_提示词_柴犬.md
图像已存在: 03_生成图像_柴犬.png
是否跳过已生成的图像? (y/n, 默认: y):
```

## 文档

| 文档 | 说明 |
|-----|------|
| [SKILL.md](./SKILL.md) | 核心 skill 文档（含详细工作流程） |
| [docs/01_提示词设计.md](./docs/01_提示词设计.md) | 如何撰写高质量提示词 |
| [docs/02_垫图准备.md](./docs/02_垫图准备.md) | 垫图选择和优化技巧 |
| [docs/03_API使用.md](./docs/03_API使用.md) | API 调用详细说明 |

## 目录结构

### Skill 目录结构

```
Image-Generation/
├── SKILL.md                  # 核心 skill 文档
├── README.md                 # 本文件
├── docs/
│   ├── 01_提示词设计.md
│   ├── 02_垫图准备.md
│   └── 03_API使用.md
├── config.example/           # 配置模板
│   ├── README.md
│   ├── secrets.md            # API 配置模板
│   ├── style-library.md      # 风格库（9种预设风格）
│   ├── .gitignore            # 项目 gitignore 模板
│   └── prompt-templates/
│       └── 提示词模板.md      # 提示词模板
├── scripts/
│   ├── analyze-image.js      # 分析图像风格
│   ├── generate-prompt.js    # 提示词辅助生成
│   ├── generate-image.js     # 生成图像（支持确认和跳过）
│   └── upload-to-cdn.js      # 图床上传功能
├── package.json              # 依赖配置
└── .gitignore
```

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

## 命令参考

### 分析图像风格

```bash
# 从 URL 分析
node /path/to/Image-Generation/scripts/analyze-image.js <图像URL> [输出目录]

# 从本地文件分析
node /path/to/Image-Generation/scripts/analyze-image.js <本地路径> [输出目录]
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
```

### 图床上传（可选）

```bash
node /path/to/Image-Generation/scripts/upload-to-cdn.js <图片路径>
```

## 配置文件

### config/secrets.md

```bash
# API 基础 URL（包含域名和路径前缀）
API_BASE_URL=https://ai-router.plugins-world.cn

# 图像分析模型（用于分析图像风格）
ANALYSIS_MODEL_ID=gemini-2.0-flash-exp

# 图像生成模型（用于生成图像）
GENERATION_MODEL_ID=gemini-3-pro-image-preview

# 分析端点路��（会拼接在 API_BASE_URL 后面）
ANALYSIS_ENDPOINT=/v1beta/models/{model}:generateContent

# 生成端点路径（会拼接在 API_BASE_URL 后面）
GENERATION_ENDPOINT=/v1beta/models/{model}:generateContent

# AI Router API 密钥（支持多种模型，不局限于特定平台）
API_KEY=your-ai-router-api-key-here

# 图床上传端点（如果不配置，则使用 BASE64 内嵌）
IMAGE_UPLOAD_ENDPOINT=
```

### API Key 说明

- **API Key**：使用 ai-router 的 API 密钥
- **支持的模型**：不仅限于特定平台，支持多种图像生成模型
- **获取方式**：访问 https://ai-router.plugins-world.cn 获取 API Key

## 依赖

```bash
npm install node-fetch
```

## 最佳实践

1. **先测试单个图像**：确认提示词效果后再批量生成
2. **使用确认机制**：不要跳过确认步骤，避免浪费额度
3. **保存好的提示词**：将成功的提示词保存为模板
4. **定期备份生成的图像**：避免意外丢失
5. **监控额度使用**：注意 API 调用次数和费用

## 高级功能

### 风格库

Skill 提供 9 种预设风格，保证图像风格一致性：

- 水彩风格 (watercolor) - 柔和温馨，适合儿童插画
- 扁平化设计 (flat-design) - 现代简洁，适合商业演示
- 3D 渲染 (3d-render) - 立体真实，适合产品展示
- 油画风格 (oil-painting) - 艺术经典，适合风景肖像
- 赛博朋克 (cyberpunk) - 科幻未来，适合游戏场景
- 像素艺术 (pixel-art) - 复古怀旧，适合复古游戏
- 手绘插画 (hand-drawn) - 温暖个性，适合创意表达
- 照片写实 (photorealistic) - 高度真实，适合产品摄影
- 抽象艺术 (abstract) - 情感表达，适合装饰画

查看 `config.example/style-library.md` 了解每种风格的详细说明、适用场景和自动选择规则。

### 风格迁移

```markdown
## 提示词

参考 01_图像风格分析_xxx.md 中描述的水彩风格，绘制一座雪山
```

### 自定义输出文件名

提示词文件名会直接映射到生成的图像文件名：

- `提示词_柴犬.md` → `提示词_柴犬.png`
- `风景_v1.md` → `风景_v1.png`

## 常见问题

### API 调用失败

```bash
✗ 图像生成失败: API key 无效
是否重试? (y/n, 默认: n):
```

### 配置文件不存在

```bash
错误: 找不到配置文件 config/secrets.md
```

### 依赖未安装

```bash
Error: Cannot find module 'node-fetch'
```

## 许可证

MIT License