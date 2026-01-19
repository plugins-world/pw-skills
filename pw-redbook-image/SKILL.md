---
name: pw-redbook-image
description: 小红书风格图片生成。将文章拆解为系列配图，支持封面图、内容图、结尾图。
---

# RedBook-Image - 小红书图生成

> **定位**: 提示词模板扩展
> **依赖**: pw-image-generation skill
> **核心**: 提供小红书风格的提示词模板（文章拆解/封面图/内容图/结尾图）

## 快速开始

### 1. 准备项目

```bash
mkdir my-redbook-project && cd my-redbook-project
mkdir -p prompts
```

### 2. 生成提示词

```bash
# 在 Claude Code 中执行
/pw-redbook-image https://example.com/article
# 或
/pw-redbook-image "文章内容..."
```

skill 会自动拆解文章，生成提示词文件到 `prompts/` 目录。

### 3. 生成图片

```bash
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js
```

生成的图片保存到 `images/` 目录，按文件名排序。

---

## 小红书风格特征

- **比例**: 竖版（3:4 或 9:16）
- **风格**: 卡通风格、手绘风格
- **配色**: 莫兰迪色系、奶油色、米白色、浅粉、薄荷绿
- **文字**: 手绘风格文字，大标题突出，荧光笔划线强调
- **装饰**: 卡通元素、emoji 图标、手绘贴纸、对话气泡
- **排版**: 信息精简，多留白，要点分条呈现

---

## 核心原则

### 视觉一致性（重要）

系列图最常见的问题是风格不一致。必须保持一致的要素：

1. **插画风格**: 所有图片使用相同的插画风格（扁平化/手绘/卡通）
2. **配色方案**: 使用相同的 3-5 种主色调
3. **装饰元素**: 使用相同类型的装饰
4. **字体样式**: 标题和正文字体保持一致
5. **作者信息**: 所有图片右下角统一格式（位置、大小、颜色）

**实现方法**:
- 在第一张图的提示词中详细描述风格
- 后续图片明确要求"保持与第一张图相同的风格"
- 使用相同的风格关键词

### 内容拆解

- **封面图**: 强烈视觉冲击力，包含核心标题
- **内容图**: 每张聚焦 1 个核心观点
- **结尾图**: 总结/行动号召/金句

**图片数量**:
- 简单观点: 2-3 张
- 中等复杂度: 4-6 张
- 深度干货: 7-10 张

**文件命名**: 使用序号前缀，如 `01_封面图.md`, `02_内容图_xxx.md`

---

## 工具脚本

### 合并长图

```bash
node ~/.claude/skills/pw-image-generation/scripts/merge-to-long-image.js ./images 长图.png
```

需要安装 ImageMagick: `brew install imagemagick`

### 合并为 PPT

```bash
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js ./images 小红书配图.pptx
```

---

## 参考文档

| 文件 | 说明 |
|------|------|
| `references/文章拆解模板.md` | 将文章拆解为系列图的模板 |
| `references/封面图模板.md` | 封面图提示词模板 |
| `references/内容图模板.md` | 内容图提示词模板 |
| `references/结尾图模板.md` | 结尾图提示词模板 |

---

## 注意事项

1. **第一张图很重要**: 确定风格后再批量生成
2. **作者信息统一**: 所有图片右下角 "@用户名"，小号字体，浅灰色
3. **避免 Markdown 格式**: 提示词中不要使用 `**加粗**` 等格式标记
4. **保持简洁**: 每张图不要放太多内容，多留白
