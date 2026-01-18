# RedBook-Image - 小红书图生成

小红书风格提示词模板，配合 Image-Generation skill 使用。

## 核心功能

提供四种小红书风格提示词模板：
- **文章拆解模板**: 将文章内容拆解为系列图，输出完整的图片序列和提示词（推荐）
- 封面图模板: 强烈视觉冲击力 + 核心标题
- 内容图模板: 每张聚焦 1 个核心观点
- 结尾图模板: 总结/行动号召/金句

## 使用方式

### 方式 1: 使用文章拆解模板（推荐）

```bash
# 1. 使用文章拆解模板，skill 会自动创建提示词文件
/pw-redbook-image https://example.com/article

# skill 会自动：
# - 分析文章内容并拆解为系列图
# - 创建 prompts/ 目录和提示词文件
# - 文件命名：01_封面图.md, 02_内容图_xxx.md, ...

# 2. 复制 .gitignore 模板（可选）
cp ~/.claude/skills/Image-Generation/config.example/.gitignore ./.gitignore

# 3. 生成图像
node ~/.claude/skills/Image-Generation/scripts/generate-image.js
```

### 方式 2: 手动使用单个模板

```bash
# 1. 准备项目
mkdir my-redbook-project && cd my-redbook-project
mkdir -p prompts

# 2. 复制模板并编辑
cp ~/.claude/skills/RedBook-Image/prompt-templates/封面图模板.md ./prompts/01_封面图.md
vim ./prompts/01_封面图.md

# 3. 生成图像
node ~/.claude/skills/Image-Generation/scripts/generate-image.js
```

**注意**: RedBook-Image 不需要安装依赖，所有脚本依赖已在 Image-Generation skill 中全局安装。

## 文档

查看 [SKILL.md](./SKILL.md) 了解小红书风格特征、内容拆解原则和提示词编写技巧。

## 工具脚本

所有工具脚本已集成到 Image-Generation skill 中，使用前请确保已安装依赖：

```bash
cd ~/.claude/skills/Image-Generation && npm install
```

### 合并长图

```bash
# 将系列图片合并为一张长图
node ~/.claude/skills/Image-Generation/scripts/merge-images.js ./images 长图.png
```

### 合并为 PPT

```bash
# 将系列图片打包为 PPT（每张图片一页）
node ~/.claude/skills/Image-Generation/scripts/images2pptx.js ./images 小红书配图.pptx
```

## 作者

牟勇

官网: https://ai-router.plugins-world.cn

微信: 1254074921 (添加请注明来意)
