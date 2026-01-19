<!--
input: 无
output: API 配置供脚本读取
pos: 配置文件模板

使用方法:
1. 复制 config.example 目录到项目的 config 目录
2. 修改 config/secrets.md 中的配置项
-->

# API 配置

## API 基础配置

# API 基础 URL（包含域名和路径前缀）
API_BASE_URL=https://ai-router.plugins-world.cn

## 模型配置

# 图像分析模型（用于分析图像风格）
ANALYSIS_MODEL_ID=gemini-2.0-flash-exp

# 图像生成模型（用于生成图像）
GENERATION_MODEL_ID=gemini-3-pro-image-preview

## API 端点配置

# 分析端点路径（会拼接在 API_BASE_URL 后面）
ANALYSIS_ENDPOINT=/v1beta/models/{model}:generateContent

# 生成端点路径（会拼接在 API_BASE_URL 后面）
GENERATION_ENDPOINT=/v1beta/models/{model}:generateContent

## 认证配置

# AI Router API 密钥（支持多种模型，不局限于特定平台）
# 获取地址：https://ai-router.plugins-world.cn/console/token
API_KEY=your-ai-router-api-key-here

## 图床配置（可选）

# 图床上传端点（如果不配置，则使用 BASE64 内嵌）
IMAGE_UPLOAD_ENDPOINT=
