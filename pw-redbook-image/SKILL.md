---
name: pw-redbook-image
description: 小红书风格图片生成。将文章拆解为系列配图，支持封面图、内容图、结尾图。
---

# RedBook-Image - 小红书图生成

> **定位**: 提示词模板扩展
> **依赖**: pw-image-generation skill
> **核心**: 提供小红书风格的提示词模板（文章拆解/封面图/内容图/结尾图）

## 什么时候用

- 将文章/笔记拆解为小红书系列图（2-10 张）
- 制作小红书风格的信息图（竖版、卡通手绘、莫兰迪色系）
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

**注意**: RedBook-Image 不需要安装依赖，所有脚本依赖已在 pw-image-generation skill 中全局安装。

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

**提示**: 建议从 pw-image-generation 复制 .gitignore 模板到项目目录：
```bash
cp ~/.claude/skills/pw-image-generation/config.example/.gitignore ./.gitignore
```

#### Step 3: 生成图像

```bash
# 使用 pw-image-generation 的脚本生成图像
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js
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
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js
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

## ⚠️ 视觉一致性（重要）

**问题**：系列图最常见的问题是风格不一致，每张图看起来像不同的作品。

**必须保持一致的要素**：
1. **插画风格**：所有图片使用相同的插画风格（扁平化/手绘/卡通，选一种）
2. **配色方案**：使用相同的 3-5 种主色调
3. **装饰元素**：使用相同类型的装饰（如都用圆角矩形，或都用手绘线条）
4. **字体样式**：标题和正文字体保持一致
5. **排版布局**：保持相似的留白比例和元素位置
6. **作者信息**：所有图片右下角都要包含 "@牟勇"（不能有的有，有的没有）

**实现方法**：
- 在第一张图的提示词中详细描述风格
- 后续图片的提示词中明确要求"保持与第一张图相同的风格"
- 使用相同的风格关键词（如"莫兰迪色系 + 扁平化插画 + 圆角矩形装饰"）

**常见问题**：
1. **背景颜色不一致**
   - 问题: 每张图的背景颜色不同(如第一张浅粉,第二张浅蓝)
   - 原因: 提示词中没有明确指定背景颜色
   - 解决: 在所有提示词中明确写"浅粉色背景"或"米白色背景"

2. **插画风格漂移**
   - 问题: 第一张是扁平化,后面变成手绘风
   - 原因: 没有在每张图的提示词中重复风格约束
   - 解决: 每张图都要写完整的风格描述,不要省略

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

1. **第一步：确定统一风格**
   - 选择一种插画风格（扁平化/手绘/卡通）
   - 确定 3-5 种主色调
   - 定义装饰元素类型

2. **第二步：拆解内容**
   - 确定图片数量和每张的核心观点
   - 规划每张图的信息密度

3. **第三步：编写提示词**
   - 第一张图：详细描述风格（插画风格 + 配色 + 装饰元素）
   - 后续图片：明确要求"保持与第一张图相同的风格"
   - 使用相同的风格关键词

4. **第四步：生成和检查**
   - 生成第一张图后，检查风格是否符合预期
   - 如不满意，调整提示词重新生成
   - 后续图片生成时，对比第一张图检查一致性

5. **注意事项**
   - 文字精简，突出关键词
   - 多留白，避免信息过载
   - **每张图片右下角都要包含作者信息 "@牟勇"**（检查每张图是否都有）

---

## 工具脚本

所有工具脚本已集成到 pw-image-generation skill 中，使用前请确保已安装依赖：

```bash
cd ~/.claude/skills/pw-image-generation && npm install
```

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
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js ./images 小红书配图.pptx
```

**功能**：
- 自动识别 jpg/png/gif/webp 格式
- 按文件名数字排序
- 每张图片占一页，16:9 比例
- 自动适应页面大小

**要求**：需要安装 pptxgenjs（首次使用）
```bash
cd ~/.claude/skills/pw-image-generation && npm install
```
