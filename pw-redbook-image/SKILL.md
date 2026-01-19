---
name: pw-redbook-image
description: RedBook-Image - 小红书风格提示词模板。配合 Image-Generation skill 使用，支持文章拆解和单图生成。
---

# RedBook-Image - 小红书图生成

> **定位**: 提示词模板扩展
> **依赖**: Image-Generation skill
> **核心**: 提供小红书风格的提示词模板（文章拆解/封面图/内容图/结尾图）

## 什么时候用

- 需要将文章/笔记拆解为小红书系列图（推荐使用文章拆解模板）
- 制作小红书风格的信息图
- 生成单张封面图、内容图、结尾图

---

## 使用方式

### 方式 1: 使用文章拆解模板（推荐）

适合将完整文章拆解为系列图：

#### Step 1: 准备项目目录

```bash
# 创建项目目录
mkdir my-redbook-project && cd my-redbook-project

# 创建提示词目录
mkdir -p prompts
```

**注意**: RedBook-Image 不需要安装依赖，所有脚本依赖已在 Image-Generation skill 中全局安装。

#### Step 2: 使用文章拆解模板

将文章 URL 或内容提供给 `/pw-redbook-image` skill：

```bash
# 在 Claude Code 中执行
/pw-redbook-image https://example.com/article
# 或
/pw-redbook-image "文章内容..."
```

skill 会自动：
1. 分析文章内容
2. 拆解为系列图方案
3. **直接创建提示词文件**到当前目录的 `prompts/` 下
4. 文件按序号命名：`01_封面图.md`, `02_内容图_xxx.md`, ...

**提示**: 建议从 Image-Generation 复制 .gitignore 模板到项目目录：
```bash
cp ~/.claude/skills/Image-Generation/config.example/.gitignore ./.gitignore
```

#### Step 3: 生成图像

```bash
# 使用 Image-Generation 的脚本生成图像
node ~/.claude/skills/Image-Generation/scripts/generate-image.js
```

生成的图片会按文件名排序，发布时按顺序上传即可。

---

### 方式 2: 手动使用单个模板

适合单张图片或手动控制每张图的内容：

#### Step 1: 准备项目目录

```bash
mkdir my-redbook-project && cd my-redbook-project
mkdir -p prompts
```

#### Step 2: 使用单个提示词模板

```bash
# 将小红书提示词模板复制到项目的 prompts 目录
# 注意文件命名包含序号，确保顺序正确
cp ~/.claude/skills/pw-RedBook-Image/references/封面图模板.md ./prompts/01_封面图.md
cp ~/.claude/skills/pw-RedBook-Image/references/内容图模板.md ./prompts/02_内容图_观点1.md
cp ~/.claude/skills/pw-RedBook-Image/references/结尾图模板.md ./prompts/09_结尾图.md

# 编辑提示词
vim ./prompts/01_封面图.md
```

#### Step 3: 生成图像

```bash
node ~/.claude/skills/Image-Generation/scripts/generate-image.js
```

---

## 小红书风格特征

**比例**: 竖版（3:4 或 9:16）
**风格**: 卡通风格、手绘风格
**配色**: 莫兰迪色系、奶油色、米白色、浅粉、薄荷绿
**文字**: 手绘风格文字，大标题突出，荧光笔划线强调
**装饰**: 卡通元素、emoji 图标、手绘贴纸、对话气泡
**排版**: 信息精简，多留白，要点分条呈现

---

## 内容拆解原则

### 图片类型

1. **封面图**: 强烈视觉冲击力，包含核心标题
2. **内容图**: 每张聚焦 1 个核心观点
3. **结尾图**: 总结/行动号召/金句

### 图片数量

- 简单观点: 2-3 张
- 中等复杂度: 4-6 张
- 深度干货: 7-10 张

### 文件命名规范

使用序号前缀确保图片顺序，格式：`[序号]_[类型]_[描述].md`

示例：
```
01_封面图.md
02_内容图_时间管理技巧.md
03_内容图_优先级排序.md
04_内容图_避免拖延.md
05_结尾图.md
```

这样生成的图片会按文件名自动排序，发布时按顺序上传即可。

---

## 提示词模板

提供四种小红书风格提示词模板：

- **文章拆解模板**: 将文章内容拆解为系列图，输出完整的图片序列和每张图的提示词（推荐）
- **封面图模板**: 强烈视觉冲击力 + 核心标题
- **内容图模板**: 每张聚焦 1 个核心观点 + 要点分条
- **结尾图模板**: 总结/行动号召/金句（含 3 个示例）

所有模板都包含小红书风格约束（竖版、卡通手绘、莫兰迪色系）、详细示例、编写技巧和作者信息（@牟勇）。

---

## 最佳实践

1. 先拆解内容，确定图片数量和每张的核心观点
2. 使用统一的配色方案（莫兰迪色系）
3. 保持手绘/卡通风格一致性
4. 文字精简，突出关键词
5. 多留白，避免信息过载
6. 所有图片右下角包含作者信息 "@牟勇"（已内置在模板中）

---

## 工具脚本

所有工具脚本已集成到 Image-Generation skill 中，使用前请确保已安装依赖：

```bash
cd ~/.claude/skills/Image-Generation && npm install
```

### 合并长图

将系列图片合并为一张长图（垂直拼接）：

```bash
node ~/.claude/skills/Image-Generation/scripts/merge-images.js <图片目录> <输出文件>

# 示例
node ~/.claude/skills/Image-Generation/scripts/merge-images.js ./images 长图.png
```

**要求**: 需要安装 ImageMagick
```bash
brew install imagemagick
```

### 合并为 PPT

将系列图片打包为 PPT 文件（每张图片一页）：

```bash
node ~/.claude/skills/Image-Generation/scripts/images2pptx.js <图片目录> <输出文件>

# 示例
node ~/.claude/skills/Image-Generation/scripts/images2pptx.js ./images 小红书配图.pptx
```

**功能**：
- 自动识别 jpg/png/gif/webp 格式
- 按文件名数字排序
- 每张图片占一页，16:9 比例
- 自动适应页面大小

**要求**：需要安装 pptxgenjs（首次使用）
```bash
cd ~/.claude/skills/AIPPT-Enterprise && npm install pptxgenjs
```
