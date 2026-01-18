# 配置示例文件说明

这些文件是 Image-Generation skill 的配置和模板文件，用于自定义配置。**注意：配置文件是可选的，只有在需要自定义配置时才需要**。

## 使用场景

- 默认配置已内置在脚本中
- 只有需要自定义 API 密钥、域名或模型时才需要创建配置文件
- 如果没有创建 config/secrets.md，脚本会使用默认配置并显示警告

## 目录结构

```
config.example/
├── README.md                 # 本说明文件
├── secrets.md                # API 配置模板
├── .gitignore                # 项目 gitignore 模板
└── prompt-templates/
    └── 提示词模板.md          # 提示词模板
```

## 使用方法（需要自定义配置时）

### 1. 复制到您的项目中

```bash
# 在您的项目根目录执行（仅在需要自定义配置时）
cp -r /path/to/Image-Generation/config.example ./config
cp /path/to/Image-Generation/config.example/.gitignore ./.gitignore
```

### 2. 配置 API 密钥

编辑 `config/secrets.md` 文件：

```bash
# 打开配置文件
vim config/secrets.md

# 修改以下配置（将 your-api-key-here 替换为实际的 API Key）
API_KEY=your-api-key-here
```

### 3. 配置其他参数（可选）

```bash
# API 基础 URL（根据您的服务调整）
API_BASE_URL=https://ai-router.plugins-world.cn

# 分析模型和生成模型
ANALYSIS_MODEL_ID=gemini-2.0-flash-exp
GENERATION_MODEL_ID=gemini-3-pro-image-preview

# API 端点（支持自定义路径）
ANALYSIS_ENDPOINT=/v1beta/models/{model}:generateContent
GENERATION_ENDPOINT=/v1beta/models/{model}:generateContent

# 图床上传端点（可选，留空则使用 BASE64 编码）
IMAGE_UPLOAD_ENDPOINT=
```

### 4. 准备项目依赖

```bash
npm init -y
npm install node-fetch
```

## 文件说明

### secrets.md

API 和模型配置文件（**可选**）：

- `API_BASE_URL`：API 服务的基础 URL，包含域名和路径前缀（默认：https://ai-router.plugins-world.cn）
- `ANALYSIS_MODEL_ID`：用于图像风格分析的模型 ID（默认：gemini-2.0-flash-exp）
- `GENERATION_MODEL_ID`：用于图像生成的模型 ID（默认：gemini-3-pro-image-preview）
- `API_KEY`：API 访问密钥（必填，如果使用默认配置则需要设置）
- `IMAGE_UPLOAD_ENDPOINT`：可选的图床上传端点（留空则使用 BASE64 编码）

### .gitignore

项目的 Git 忽略文件，包括：

- `node_modules/`：依赖包
- `package-lock.json`：依赖锁定文件
- `config/secrets.md`：API 配置文件
- `output/`：输出目录
- 编辑器和系统文件

### prompt-templates/提示词模板.md

提示词模板文件，包含：

- 提示词编写规范
- 不同场景的示例提示词
- 提示词格式要求

## 快速开始（使用默认配置）

如果不需要自定义配置，可以直接使用默认配置：

```bash
# 1. 创建项目目录
mkdir my-image-project && cd my-image-project
npm init -y && npm install node-fetch

# 2. 分析图像风格（可选）
node /path/to/Image-Generation/scripts/analyze-image.js https://example.com/reference.png

# 3. 生成提示词（可选）
node /path/to/Image-Generation/scripts/generate-prompt.js

# 4. 生成图像（逐张确认）
node /path/to/Image-Generation/scripts/generate-image.js
```

## 常见问题

### 配置文件不生效

如果项目下没有 config/secrets.md 文件，脚本会使用默认配置并显示警告。

### API 调用失败

检查以下内容：
1. 是否设置了有效的 API_KEY？
2. 如果使用默认配置，API_KEY 是否为必填项？
3. 网络连接是否正常？
