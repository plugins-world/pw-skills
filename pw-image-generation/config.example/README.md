# 配置模板

这个目录包含 API 配置模板。**配置是可选的**，只有需要自定义 API 设置时才需要。

## 使用方法

### 复制到项目中

```bash
# 在项目根目录执行
cp ~/.claude/skills/pw-image-generation/config.example/secrets.md ./config/secrets.md
```

### 配置 API 密钥

编辑 `config/secrets.md`，将 `your-api-key-here` 替换为实际的 API Key。

## 默认配置

如果不需要自定义配置，可以直接使用默认配置：

```bash
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js
```

脚本会使用内置的默认配置。

## 参考文档

- `references/style-library.md` - 9 种预设图像风格
- `references/prompt-templates/` - 提示词模板
- `references/图床上传.md` - 图床上传指南
- `references/.gitignore.template` - Git 忽略文件模板
