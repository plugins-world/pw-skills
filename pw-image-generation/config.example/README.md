# 配置和模板文件

这些文件是 pw-image-generation skill 的配置和模板文件。**配置文件是可选的**，只有需要自定义配置时才需要。

## 目录结构

```
config.example/
├── README.md                 # 本说明文件
├── secrets.md                # API 配置模板
├── .gitignore                # 项目 gitignore 模板
├── style-library.md          # 风格库
└── prompt-templates/
    └── 提示词模板.md          # 提示词模板
```

## 使用方法

### 复制到项目中（需要自定义配置时）

```bash
# 在项目根目录执行
cp -r ~/.claude/skills/pw-image-generation/config.example ./config
cp ~/.claude/skills/pw-image-generation/config.example/.gitignore ./.gitignore
```

### 配置 API 密钥

编辑 `config/secrets.md` 文件，将 `your-api-key-here` 替换为实际的 API Key。

## 文件说明

- **secrets.md**: API 和模型配置（可选）
- **.gitignore**: 项目 Git 忽略文件模板
- **style-library.md**: 9 种预设图像风格
- **prompt-templates/**: 提示词模板和示例

## 快速开始（使用默认配置）

如果不需要自定义配置，可以直接使用默认配置：

```bash
# 创建项目目录
mkdir my-image-project && cd my-image-project

# 生成图像（逐张确认）
node ~/.claude/skills/pw-image-generation/scripts/generate-image.js
```

脚本会使用内置的默认配置。
