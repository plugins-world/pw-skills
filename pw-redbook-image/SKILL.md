---
name: pw-redbook-image
description: 小红书风格图片生成。将文章拆解为系列配图，支持封面图、内容图、结尾图。
---

# 小红书图片生成

将文章拆解为小红书风格的系列配图。

## 使用方法

```bash
# 从 URL 生成
/pw-redbook-image https://example.com/article

# 从文本内容生成
/pw-redbook-image "文章内容..."

# 从 markdown 文件生成
/pw-redbook-image path/to/article.md
```

## 小红书风格特征

- **比例**: 竖版（3:4 或 9:16）
- **风格**: 卡通风格、手绘风格
- **配色**: 莫兰迪色系、奶油色、米白色、浅粉、薄荷绿
- **文字**: 手绘风格文字，大标题突出，荧光笔划线强调
- **装饰**: 卡通元素、emoji 图标、手绘贴纸、对话气泡
- **排版**: 信息精简，多留白，要点分条呈现

## 内容拆解原则

- **封面图**: 强烈视觉冲击力，包含核心标题
- **内容图**: 每张聚焦 1 个核心观点
- **结尾图**: 总结/行动号召/金句

**图片数量**:
- 简单观点: 2-3 张
- 中等复杂度: 4-6 张
- 深度干货: 7-10 张

## 文件管理

### 输出目录

每个会话创建一个以主题命名的独立目录:

```
redbook-{topic-slug}/
├── source.md              # 源文章
├── prompts/               # 提示词文件
│   ├── 01_封面图.md
│   ├── 02_内容图_核心观点1.md
│   ├── 03_内容图_核心观点2.md
│   └── 04_结尾图.md
└── images/                # 生成的图片
    ├── 01_封面图.png
    ├── 02_内容图_核心观点1.png
    ├── 03_内容图_核心观点2.png
    └── 04_结尾图.png
```

**主题命名规则**:
1. 从文章标题/内容中提取主题（2-4 个词，kebab-case）
2. 示例: "如何提升工作效率" → `improve-work-efficiency`

### 冲突解决

如果 `redbook-{topic-slug}/` 已存在:
- 追加时间戳: `{topic-slug}-YYYYMMDD-HHMMSS`
- 示例: `improve-work-efficiency` 已存在 → `improve-work-efficiency-20260123-143052`

### 源文件

使用 `source.md` 或 `source-{原文件名}` 保存源文章。

## 工作流程

### 步骤 1: 获取文章内容

1. **处理输入**:
   - 如果是 URL: 抓取网页内容
   - 如果是文件路径: 读取文件内容
   - 如果是文本: 直接使用

2. **保存源内容**:
   - 创建工作目录: `redbook-{topic-slug}/`
   - 保存源文件到 `source.md` 或 `source-{原文件名}`

### 步骤 2: 分析和拆解文章

1. **使用模板**: 读取 `${SKILL_DIR}/references/文章拆解模板.md`
2. **分析内容**: 确定主题、核心观点、图片数量
3. **生成拆解方案**: 输出图片序列和每张图的核心内容

### 步骤 3: 生成提示词文件

1. **创建提示词目录**: `redbook-{topic-slug}/prompts/`
2. **根据图片类型选择模板**:
   - 封面图: 使用 `${SKILL_DIR}/references/封面图模板.md`
   - 内容图: 使用 `${SKILL_DIR}/references/内容图模板.md`
   - 结尾图: 使用 `${SKILL_DIR}/references/结尾图模板.md`
3. **生成提示词**: 为每张图生成独立的提示词文件
   - 文件命名: `01_封面图.md`, `02_内容图_关键词.md`, `03_结尾图.md`

### 步骤 4: 生成图片

**图片生成技能选择**:
1. 检查可用的图片生成技能
2. 如果有多个技能可用，询问用户选择

**生成**:
使用提示词文件、输出路径调用选定的图片生成技能。

- 输出目录: `redbook-{topic-slug}/images/`
- 逐张生成，显示进度
- 图片按序号排序

### 步骤 5: 后处理（可选）

**合并长图** (需要 ImageMagick):
```bash
brew install imagemagick
node ~/.claude/skills/pw-image-generation/scripts/merge-to-long-image.js \
  redbook-{topic-slug}/images \
  redbook-{topic-slug}/长图.png
```

**合并为 PPT**:
```bash
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pptx.js \
  redbook-{topic-slug}/images \
  redbook-{topic-slug}/配图.pptx
```

**合并为 PDF**:
```bash
node ~/.claude/skills/pw-image-generation/scripts/merge-to-pdf.js \
  redbook-{topic-slug}/images \
  redbook-{topic-slug}/配图.pdf
```

### 步骤 6: 输出摘要

```
小红书系列图已生成!

主题: [主题]
图片数量: [数量] 张
工作目录: redbook-{topic-slug}/

后续步骤:
- 预览所有图片确认风格一致性
- 如需要可使用合并工具生成长图、PPT 或 PDF
```

## 注意事项

- 第一张图很重要 - 确定风格后再批量生成
- 作者信息统一 - 所有图片右下角统一格式
- 风格一致性 - 所有图片使用相同的风格关键词和配色方案
- 保持简洁 - 每张图不要放太多内容，多留白
- 提示词质量 - 避免 Markdown 格式，使用英文提示词效果更好

## 模板参考

| 模板文件 | 用途 |
|------|------|
| `references/文章拆解模板.md` | 将文章拆解为系列图的模板 |
| `references/封面图模板.md` | 封面图提示词模板 |
| `references/内容图模板.md` | 内容图提示词模板 |
| `references/结尾图模板.md` | 结尾图提示词模板 |

## 扩展支持

通过 EXTEND.md 支持自定义配置。

**检查路径**（优先级顺序）:
1. `.pw-skills/pw-redbook-image/EXTEND.md`（项目级）
2. `~/.pw-skills/pw-redbook-image/EXTEND.md`（用户级）

如果找到，在工作流程之前加载。扩展内容会覆盖默认值。
