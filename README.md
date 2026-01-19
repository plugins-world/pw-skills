# Claude Code Skills

个人 Claude Code 技能扩展。

## 技能列表

- **pw-image-generation**: AI 图像生成工作流（文生图、图生图、批量生成）
- **pw-redbook-image**: 小红书风格提示词模板

查看各技能的 SKILL.md 了解详细使用方法。

## 安装

```bash
# 克隆仓库
git clone https://github.com/plugins-world/pw-skills ~/.claude/skills

# 安装 pw-image-generation 依赖
cd ~/.claude/skills/pw-image-generation && npm install
```

## 让 AI 帮你安装

你可以让 Claude 帮助你安装和配置技能：

```
请帮我安装 pw-image-generation skill：

1. 进入 skill 目录并安装依赖
2. 配置 ai-router 的 API Key：[你的 API Key]
3. 创建测试项目并生成一张测试图片
```

**获取 API Key**：https://ai-router.plugins-world.cn/console/token

**注意**：
- API Key 是 ai-router 的密钥，支持多种模型
- 需要 GitHub 登录，请确保 GitHub 账号已开放邮箱展示

## 支持的模型

- gemini-3-pro-image-preview: Google Gemini 3 Pro 图像预览模型（生成）
- gemini-2.0-flash-exp: Google Gemini 2.0 Flash 实验模型（分析）
- 其他支持图像生成的模型

## 作者

牟勇 | https://ai-router.plugins-world.cn | 微信: 1254074921
