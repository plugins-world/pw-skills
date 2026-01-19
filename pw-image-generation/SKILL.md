---
name: pw-image-gen
description: AI 图像生成工作流。支持文生图、图生图、批量生成、图床上传/删除、合并长图、生成 PPT。
---

# Image-Generation - AI 图像生成工作流

> **核心理念**：分析风格 → 设计提示词 → 用户确认 → 生成图像，避免额度浪费

## 什么时候用

**图像生成**：
- 需要根据文本描述生成图像
- 有参考图片，需要生成类似风格的图像
- 需要批量生成多张图像
- 希望保持图像风格一致但内容不同

**图像处理**：
- 将系列图片合并为一张长图（垂直拼接）
- 将系列图片打包为 PPT 文件（每张图片一页）

---

## 工作流程

```
分析风格 → 设计提示词 → 安装依赖 → 配置API → 确认生成 → 保存图像
    ↓          ↓           ↓         ↓         ↓         ↓
  风格文件    提示词文件   node-fetch  secrets.md  逐张确认  images/
```

---

## 快速开始

### Step 1: 安装 Skill 依赖

```bash
cd ~/.claude/skills/pw-image-generation && npm install
```

### Step 2: 创建项目目录

```bash
mkdir my-image-project && cd my-image-project
```

### Step 3: 复制配置模板（可选）

```bash
cp -r ~/.claude/skills/pw-image-generation/config.example ./config
cp ~/.claude/skills/pw-image-generation/references/.gitignore.template ./.gitignore
# 编辑 config/secrets.md 自定义 API 密钥（可选）
```

### Step 4: 创建提示词

```bash
mkdir -p article-images/prompts
cp ~/.claude/skills/pw-image-generation/references/prompt-templates/提示词模板.md ./article-images/prompts/我的提示词.md
vim ./article-images/prompts/我的提示词.md
```

参考 `references/style-library.md` 选择合适的风格。

### Step 5: 生成图像

```bash
node ~/.claude/skills/Image-Generation/scripts/generate-image.js
```

脚本会逐张询问确认，避免浪费额度。

---

## 工具脚本

### 生成图像

```bash
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js [输出目录]
```

### 上传图片到图床

将本地图片上传到图床获取 URL（用于图生图）：

```bash
node ~/.claude/skills/pw-image-generation/scripts/upload-image.js <图片路径>

# 示例
node ~/.claude/skills/pw-image-generation/scripts/upload-image.js ./template/图.001.png
```

**功能**:
- 自动上传到 freeimage.host（永久存储）
- 返回可用的图片 URL
- 自动保存删除链接到 `.upload-history.json`
- 用于图生图的垫图上传

### 管理图床图片

查看和删除已上传的图片：

```bash
# 列出所有上传的图片
node ~/.claude/skills/pw-image-generation/scripts/delete-image.js list

# 删除指定索引的图片
node ~/.claude/skills/pw-image-generation/scripts/delete-image.js delete 0

# 删除所有图片
node ~/.claude/skills/pw-image-generation/scripts/delete-image.js delete-all
```

**功能**:
- 查看上传历史和删除链接
- 单个或批量删除图片
- 自动更新历史记录

详细说明见 `references/图床上传.md`

### 合并长图

将系列图片合并为一张长图（垂直拼接）：

```bash
node ~/.claude/skills/pw-image-generation/scripts/merge-to-long-image.js <图片目录> <输出文件>

# 示例
node ~/.claude/skills/pw-image-generation/scripts/merge-to-long-image.js ./images 长图.png
```

**要求**: 需要安装 ImageMagick
```bash
brew install imagemagick
```

### 合并为 PPT

将系列图片打包为 PPT 文件（每张图片一页）：

```bash
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js <图片目录> <输出文件>

# 示例
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js ./images 配图.pptx
```

**功能**:
- 自动识别 jpg/png/gif/webp 格式
- 按文件名数字排序
- 每张图片占一页，16:9 比例
- 自动适应页面大小

---

## 文件结构

### 项目目录结构

```
my-image-project/
├── config/
│   └── secrets.md           # API 配置（可选）
├── article-images/
│   ├── analysis/            # 风格分析（可选）
│   ├── prompts/             # 提示词文件
│   ├── config.example/          # 参考图像
│   └── images/              # 生成的图像
└── .gitignore
```

### Skill 目录结构

```
pw-image-generation/
├── SKILL.md                  # 本文件（核心文档）
├── config.example/           # 配置模板
│   ├── README.md             # 配置说明
│   └── secrets.md            # API 配置模板
├── references/               # 参考文档
│   ├── .gitignore.template   # Git 忽略文件模板
│   ├── 图床上传.md           # 图床上传指南
│   ├── style-library.md      # 风格库（9种预设风格）
│   └── prompt-templates/
│       └── 提示词模板.md     # 提示词模板
├── scripts/
│   ├── analyze-image.js      # 分析图像风格
│   ├── generate-image.js     # 生成图像（支持确认和跳过）
│   ├── upload-image.js       # 上传图片到图床
│   ├── delete-image.js       # 管理和删除图床图片
│   ├── merge-to-long-image.js       # 合并长图
│   └── merge-to-pptx.js        # 打包为 PPT
├── node_modules/
├── package.json
└── package-lock.json
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

依赖安装在 skill 目录，不是项目目录：

```bash
cd ~/.claude/skills/pw-image-generation && npm install
```

---

## 命令参考

### 分析图像风格（可选）

```bash
# 从 URL 分析
node ~/.claude/skills/pw-image-generation/scripts/analyze-image.js <图像URL>

# 从本地文件分析
node ~/.claude/skills/pw-image-generation/scripts/analyze-image.js <本地路径>
```

### 生成图像

```bash
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js [输出目录]
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

查看 `references/style-library.md` 了解每种风格的详细说明和使用场景。

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
