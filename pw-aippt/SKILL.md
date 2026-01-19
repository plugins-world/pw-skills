---
name: pw-aippt
description: 基于 PPT 模板生成新内容。PDF 自动转图片 → 分析模板风格 → 拆分文章内容 → 生成提示词 → AI 生图 → 打包 PPTX。
---

# AIPPT - AI PPT 生成工作流

> **定位**: 完全自动化 PPT 生成工作流
> **依赖**: pw-image-generation skill
> **核心**: 垫图约束风格 + 提示词替换内容 + AI 生图 + 打包 PPTX

## 什么时候用

- 有现成 PPT 模板，想快速生成新内容
- 需要批量生成多页 PPT
- 希望每页风格一致但内容不同

---

## 使用方式

### Step 1: 准备项目目录

```bash
# 创建项目目录
mkdir my-ppt-project && cd my-ppt-project

# 创建必要的子目录
mkdir -p template prompts images
```

**目录说明**:
- `template/`: 存放 PPT 模板导出的图片（垫图）
- `prompts/`: 存放生成的提示词文件
- `images/`: 存放生成的 PPT 页面图片

### Step 2: 准备 PPT 模板

将现有 PPT 模板导出为图片（垫图）到 `template/` 目录：

**方法 1: 自动转换（推荐）**

如果模板是 PDF 格式，使用脚本自动转换：

```bash
node ~/.claude/skills/pw-aippt/scripts/pdf-to-images.js <PDF文件> [输出目录] [DPI]

# 示例
node ~/.claude/skills/pw-aippt/scripts/pdf-to-images.js template.pdf ./template 150
```

**依赖**: 需要安装 poppler
```bash
# Mac
brew install poppler

# Ubuntu
apt install poppler-utils
```

**方法 2: PowerPoint 导出**
1. 打开 PPT 模板
2. 文件 → 导出 → 更改文件类型 → PNG
3. 选择"每张幻灯片"
4. 保存到 `template/` 目录

**方法 3: Keynote 导出**
1. 打开 PPT 模板
2. 文件 → 导出到 → 图像
3. 格式选择 PNG，分辨率选择"最佳"
4. 保存到 `template/` 目录

详细说明见 `references/01_导出方法.md`

### Step 3: 使用 skill 生成提示词

在项目目录下，在 Claude Code 中执行：

```bash
# 在 Claude Code 中执行
/pw-aippt https://example.com/article
# 或
/pw-aippt "文章内容..."
```

skill 会自动：
1. 分析 `template/` 目录的 PPT 模板（布局、风格、可改/不可改区域）
2. 拆解文章内容为多个观点/页面
3. 将观点映射到合适的布局
4. **直接创建提示词文件**到当前目录的 `prompts/` 下
5. 文件按序号命名：`01_封面页.md`, `02_内容页_xxx观点.md`, ...

**提示**: 建议从 pw-image-generation 复制 .gitignore 模板到项目目录：
```bash
cp ~/.claude/skills/pw-image-generation/config.example/.gitignore ./.gitignore
```

### Step 4: 生成图片

```bash
# 使用 pw-image-generation 的脚本生成图片
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js
```

生成的图片会保存到 `images/` 目录，按文件名排序。

### Step 5: 打包 PPTX

```bash
# 使用已有的 merge ppt 脚本打包
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js ./images output.pptx
```

---

## 工作流程

```
导出图片 → 分析模板 → 内容分段 → 表达形式设计 → 内容映射 → 生成提示词 → 调用API → 下载保存 → 打包PPTX
    ↓          ↓          ↓            ↓            ↓            ↓         ↓          ↓          ↓
  垫图      布局库      页面规划    最佳表达形式    提示词文件    prompts/  生成图片    PNG文件    .pptx
```

---

## 核心方法论

### 1. PPT 模板分析

分析模板，输出可复用的布局库（含提示词模板）。

**分析流程**:
1. 导出模板图片
2. 逐页浏览分类（固定页面/内容页面/创意页面）
3. 分析页面构造（LOGO、页码、标题、内容区、装饰元素）
4. 定义可改/不可改区域
5. 编写提示词模板

详细说明见 `references/02_PPT模板分析方法.md`

### 2. 内容分段

将文章内容拆分为页面。

**分段原则**:
- 封面页：标题 + 副标题
- 目录页：章节列表
- 内容页：每页 1 个核心观点
- 过渡页：章节标题
- 结束页：总结/感谢

详细说明见 `references/03_内容分段方法.md`

### 3. 表达形式设计（关键）

对每页内容问：**最佳表达形式是什么？**

- 模板有合适布局 → 用模板
- 模板没有 → 用创意页面（风格不变，表达自由）

**常见创意形态**:
- 步骤/流程 → 流程图、时间轴、箭头连接
- 对比/优劣 → 天平图、表格、左右对照
- 核心金句 → 大字居中、引用框、背景装饰
- 数据/统计 → 图表、数字高亮、信息图
- 层级关系 → 金字塔、树状图、环形图

详细说明见 `references/04_内容映射方法.md`

### 4. 内容映射

将观点映射到合适的布局，生成提示词。

**提示词结构**:
```
{垫图URL} 参考这张PPT模板，生成新页面。
【不可改区域】（严格保持原样）
- {列出所有不能改的元素}
【可改区域】
- {列出要替换的内容}

【生成指令】
absolutely no watermark, clean output only
```

详细说明见 `references/04_内容映射方法.md`

---

## 内容拆解原则

### 页面类型

1. **封面页**: 主标题 + 副标题，强烈视觉冲击力
2. **目录页**: 章节列表，清晰的导航
3. **章节过渡页**: 章节标题，承上启下
4. **内容页**: 每页聚焦 1 个核心观点
5. **结束页**: 总结/感谢/联系方式

### 页面数量

- 简单内容（<1500字）: 10-15 页，2-3 章
- 中等复杂度（1500-3000字）: 15-20 页，3-4 章
- 深度内容（>3000字）: 25-30 页，4-6 章

### 文件命名规范

使用序号前缀确保页面顺序，格式：`[序号]_[类型]_[描述].md`

示例：
```
01_封面页.md
02_目录页.md
03_过渡页_第一章.md
04_内容页_核心观点1.md
05_内容页_核心观点2.md
06_内容页_核心观点3.md
07_过渡页_第二章.md
08_内容页_核心观点4.md
09_结束页.md
```

这样生成的图片会按文件名自动排序，打包时按顺序组装即可。

---

## ⚠️ 视觉一致性（重要）

**问题**：系列图最常见的问题是风格不一致，每张图看起来像不同的作品。

**必须保持一致的要素**：
1. **视觉风格**：配色、装饰、字体、背景与模板一致
2. **布局比例**：保持相似的留白比例和元素位置
3. **装饰元素**：使用相同类型的装饰
4. **LOGO/页码**：所有图片都要包含（如果模板有）

**实现方法**：
- 使用垫图约束风格（图生图）
- 提示词中明确不可改区域
- 后续图片明确要求"保持与模板相同的风格"

---

## 最佳实践

1. **第一步：分析模板**
   - 导出模板图片到 `template/` 目录
   - 分析每页的布局、风格、可改/不可改区域
   - 输出布局库

2. **第二步：规划内容**
   - 确定 PPT 页数和每页的核心观点
   - 规划每页的信息密度
   - 选择最佳表达形式

3. **第三步：生成提示词**
   - 使用 `/pw-aippt` skill 自动生成提示词文件
   - 检查提示词是否准确描述了可改/不可改区域
   - 必要时手动调整提示词

4. **第四步：生成和检查**
   - 使用 pw-image-generation 生成图片
   - 检查第一张图的风格是否符合预期
   - 如不满意，调整提示词重新生成
   - 后续图片生成时，对比第一张图检查一致性

5. **第五步：打包 PPTX**
   - 使用 merge-to-pptx.js 打包成 PPTX
   - 检查页面顺序和内容

---

## 参考文档

| 文件 | 功能 |
|------|------|
| `references/01_导出方法.md` | PPT 导出为图片（垫图） |
| `references/02_PPT模板分析方法.md` | 分析模板，输出布局库 |
| `references/03_内容分段方法.md` | 内容拆分为页面 |
| `references/04_内容映射方法.md` | 内容匹配布局，生成提示词 |
| `~/.claude/skills/pw-image-generation/references/图床上传.md` | 图床上传获取 URL |

---

## 工具脚本

所有工具脚本已集成到 pw-image-generation skill 中，使用前请确保已安装依赖：

```bash
cd ~/.claude/skills/pw-image-generation && npm install
```

### PDF 转图片

将 PDF 格式的 PPT 模板自动转换为图片（垫图）：

```bash
node ~/.claude/skills/pw-aippt/scripts/pdf-to-images.js <PDF文件> [输出目录] [DPI]

# 示例
node ~/.claude/skills/pw-aippt/scripts/pdf-to-images.js template.pdf ./template 150
```

**功能**：
- 自动转换 PDF 为 PNG 图片
- 自动重命名为 图.001.png, 图.002.png 格式
- 可配置 DPI（默认 150，推荐 150-300）
- 依赖 poppler（Mac: brew install poppler, Ubuntu: apt install poppler-utils）

### 生成图片

```bash
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js
```

### 打包 PPTX

```bash
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js <图片目录> <输出文件>

# 示例
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js ./images output.pptx
```

**功能**：
- 自动识别 jpg/png/gif/webp 格式
- 按文件名数字排序
- 每张图片占一页，16:9 比例
- 自动适应页面大小

---

## 注意事项

1. **垫图质量**：导出的模板图片分辨率要高（建议 1920x1080 或更高）
2. **提示词准确性**：明确描述可改/不可改区域，避免 AI 随意修改
3. **视觉一致性**：使用垫图约束风格，确保所有页面风格一致
4. **文件命名**：使用序号前缀，确保页面顺序正确
5. **内容密度**：每页不要放太多内容，保持简洁

---

## 常见问题

### Q: 生成的图片风格不一致怎么办？

A: 检查提示词中的"不可改区域"是否明确描述了视觉风格。确保每个提示词都包含：
- 配色方案
- 装饰元素
- 字体样式
- 布局比例

### Q: 模板没有合适的布局怎么办？

A: 使用创意页面。选择风格最接近的模板页作为垫图，提示词中明确：
- 视觉风格不可改（配色、装饰、字体、背景）
- 表达形式可改（流程图/时间轴/对比表/金句/...）

### Q: 如何调整页面顺序？

A: 修改提示词文件的序号前缀，重新生成图片即可。

### Q: 如何删除某一页？

A: 删除对应的提示词文件，重新生成图片即可。

---

## 项目目录结构

```
my-ppt-project/
├── template/              # PPT 模板导出的图片（垫图）
│   ├── 图.001.png
│   ├── 图.002.png
│   └── ...
├── prompts/               # 生成的提示词文件
│   ├── 01_封面页.md
│   ├── 02_目录页.md
│   ├── 03_内容页_观点1.md
│   └── ...
├── images/                # 生成的 PPT 页面图片
│   ├── 01_封面页.png
│   ├── 02_目录页.png
│   ├── 03_内容页_观点1.png
│   └── ...
└── output.pptx            # 最终生成的 PPTX 文件
```
