# Image-Generation - AI 图像生成

基于 AI Router API 的图像生成工具，支持文生图、图生图和批量生成。

## 特性

- 文生图：使用文本描述生成图像
- 图生图：使用参考图片生成类似风格图像
- 批量生成：一次生成多张图像（逐张确认，避免额度浪费）
- 风格库：9 种预设风格（水彩/扁平化/3D/油画/赛博朋克/像素/手绘/写实/抽象）
- 智能跳过：自动检测已生成的图像
- 逐张确认：生成前需要用户确认，避免大量消耗额度

## 快速开始

```bash
# 1. 创建项目目录
mkdir my-image-project && cd my-image-project

# 2. 安装依赖
npm init -y && npm install node-fetch

# 3. 复制配置模板（可选）
cp -r /path/to/Image-Generation/config.example ./config
cp /path/to/Image-Generation/config.example/.gitignore ./.gitignore

# 4. 创建提示词
mkdir -p output/prompts
cp /path/to/Image-Generation/config.example/prompt-templates/提示词模板.md ./output/prompts/我的提示词.md
vim ./output/prompts/我的提示词.md

# 5. 生成图像
node /path/to/Image-Generation/scripts/generate-image.js
```

## 文档

查看 [SKILL.md](./SKILL.md) 了解完整的使用说明，包括：

- 工作流程
- 命令参考
- 常见场景
- 风格库使用
- 配置说明
- 错误处理

## 目录结构

```
Image-Generation/
├── SKILL.md                  # 核心文档（完整使用说明）
├── README.md                 # 本文件
├── config.example/           # 配置模板
│   ├── secrets.md            # API 配置模板
│   ├── style-library.md      # 风格库（9种预设风格）
│   └── prompt-templates/
│       └── 提示词模板.md      # 提示词模板
└── scripts/
    ├── analyze-image.js      # 分析图像风格
    └── generate-image.js     # 生成图像
```

## 让 AI 帮你安装

您可以让 AI 帮助您安装 Image-Generation skill：

```
我需要安装 Image-Generation skill，请：

1. 克隆仓库到 ~/.claude/skills/image-gen
2. 配置 ai-router 的 API Key：[您的 API Key]
3. 创建项目目录并初始化
4. 测试技能是否正常工作

注意：API Key 是 ai-router 的密钥，支持多种模型。
```

## 支持的模型

- gemini-3-pro-image-preview：Google 的 Gemini 3 Pro 图像预览模型（生成）
- gemini-2.0-flash-exp：Google 的 Gemini 2.0 Flash 实验模型（分析）
- 其他支持图像生成的模型

## 许可证

MIT License
