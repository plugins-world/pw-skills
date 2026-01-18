---
name: image-gen
description: Image-Generation - 基于垫图和提示词的 AI 图像生成工作流。支持文生图、图生图、批量生成。
---

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
mkdir my-image-project && cd my-image-project
```

### Step 2: 安装依赖

```bash
npm init -y && npm install node-fetch
```

### Step 3: 复制配置模板（可选）

```bash
cp -r /path/to/Image-Generation/config.example ./config
cp /path/to/Image-Generation/config.example/.gitignore ./.gitignore
# 编辑 config/secrets.md 自定义 API 密钥（可选）
```

### Step 4: 创建提示词

```bash
mkdir -p output/prompts
cp /path/to/Image-Generation/config.example/prompt-templates/提示词模板.md ./output/prompts/我的提示词.md
vim ./output/prompts/我的提示词.md
```

参考 `config.example/style-library.md` 选择合适的风格。

### Step 5: 生成图像

```bash
node /path/to/Image-Generation/scripts/generate-image.js
```

脚本会逐张询问确认，避免浪费额度。

---

## 文件结构

### 项目目录结构

```
my-image-project/
├── config/
│   └── secrets.md           # API 配置（可选）
├── output/
│   ├── analysis/            # 风格分析（可选）
│   ├── prompts/             # 提示词文件
│   ├── references/          # 参考图像
│   └── images/              # 生成的图像
├── node_modules/
├── package.json
└── .gitignore
```

### Skill 目录结构

```
Image-Generation/
├── SKILL.md                  # 本文件（核心文档）
├── README.md                 # 简介
├── config.example/           # 配置模板
│   ├── secrets.md            # API 配置模板
│   ├── style-library.md      # 风格库（9种预设风格）
│   └── prompt-templates/
│       └── 提示词模板.md      # 提示词模板
├── scripts/
│   ├── analyze-image.js      # 分析图像风格
│   └── generate-image.js     # 生成图像（支持确认和跳过）
└── package.json
```

---

## 重要提示

### 避免额度浪费

- 每次生成前都会询问确认
- 支持跳过已生成的图像
- 一张一张生成，避免批量消耗额度

### 配置管理

- 配置文件 `config/secrets.md` 是可选的
- 未配置时使用默认配置（需要设置 API_KEY）
- 配置文件不会提交到版本控制

### 依赖安装

依赖安装在项目目录，不是 skill 目录：

```bash
npm install node-fetch
```

---

## 命令参考

### 分析图像风格（可选）

```bash
# 从 URL 分析
node /path/to/Image-Generation/scripts/analyze-image.js <图像URL>

# 从本地文件分析
node /path/to/Image-Generation/scripts/analyze-image.js <本地路径>
```

### 生成图像

```bash
node /path/to/Image-Generation/scripts/generate-image.js [输出目录]
```

---

## 风格库

Skill 提供 9 种预设风格，保证图像风格一致性：

- 水彩风格 (watercolor) - 柔和温馨
- 扁平化设计 (flat-design) - 现代简洁
- 3D 渲染 (3d-render) - 立体真实
- 油画风格 (oil-painting) - 艺术经典
- 赛博朋克 (cyberpunk) - 科幻未来
- 像素艺术 (pixel-art) - 复古怀旧
- 手绘插画 (hand-drawn) - 温暖个性
- 照片写实 (photorealistic) - 高度真实
- 抽象艺术 (abstract) - 情感表达

查看 `config.example/style-library.md` 了解每种风格的详细说明和使用场景。

---

## 配置说明

查看 `config.example/secrets.md` 了解配置选项：

- API_BASE_URL：API 基础 URL
- ANALYSIS_MODEL_ID：图像分析模型
- GENERATION_MODEL_ID：图像生成模型
- API_KEY：API 密钥

---

## 最佳实践

1. 先测试单个图像，确认提示词效果后再批量生成
2. 使用确认机制，不要跳过确认步骤
3. 保存好的提示词作为模板
4. 定期备份生成的图像
