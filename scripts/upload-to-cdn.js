#!/usr/bin/env node

/**
 * 图床上传工具脚本
 * 用于上传本地图片到图床，并返回可访问的 URL
 *
 * 使用方法：
 * node scripts/upload-to-cdn.js <图片路径>
 *
 * 依赖：node-fetch
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// 读取配置（支持默认配置）
function loadConfig() {
  const configPath = path.join(process.cwd(), 'config', 'secrets.md');
  const defaultConfig = {
    API_BASE_URL: 'https://ai-router.plugins-world.cn',
    ANALYSIS_MODEL_ID: 'gemini-2.0-flash-exp',
    GENERATION_MODEL_ID: 'gemini-3-pro-image-preview',
    ANALYSIS_ENDPOINT: '/v1beta/models/{model}:generateContent',
    GENERATION_ENDPOINT: '/v1beta/models/{model}:generateContent',
    API_KEY: '',
    IMAGE_UPLOAD_ENDPOINT: ''
  };

  // 如果项目下没有配置文件，返回默认配置
  if (!fs.existsSync(configPath)) {
    console.warn('警告: 未找到配置文件 config/secrets.md，使用默认配置');
    console.warn('提示: 如果需要自定义配置，请创建 config/secrets.md 文件');
    console.warn('');
    return defaultConfig;
  }

  // 读取项目配置
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = Object.assign({}, defaultConfig);

    configContent.split('\n').forEach(line => {
      const match = line.match(/^([A-Z_]+)=(.+)$/);
      if (match) {
        config[match[1]] = match[2];
      }
    });

    return config;

  } catch (error) {
    console.warn('警告: 读取配置文件失败，使用默认配置:', error.message);
    return defaultConfig;
  }
}

// 支持的图像格式
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// 获取图像 MIME 类型
function getImageMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return null;
}

// 上传到默认图床
async function uploadToDefaultCDN(imagePath, config) {
  console.log('使用默认图床上传（会在生成时使用 BASE64 编码）');
  return null;
}

// 上传到自定义图床
async function uploadToCustomCDN(imagePath, config) {
  if (!config.IMAGE_UPLOAD_ENDPOINT) {
    return await uploadToDefaultCDN(imagePath, config);
  }

  const mime = getImageMime(imagePath);
  if (!mime || !SUPPORTED_FORMATS.includes(mime)) {
    console.error('不支持的图像格式');
    process.exit(1);
  }

  const imageBuffer = fs.readFileSync(imagePath);

  try {
    const formData = new FormData();
    formData.append('image', new Blob([imageBuffer], { type: mime }), path.basename(imagePath));

    const response = await fetch(config.IMAGE_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.url) {
      return result.url;
    }

    console.warn('无法从响应中提取 URL，将使用默认方法');
    return null;

  } catch (error) {
    console.warn('上传到自定义图床失败:', error.message, '将使用默认方法');
    return null;
  }
}

// 主函数
async function main() {
  if (process.argv.length < 3) {
    console.error('使用方法: node scripts/upload-to-cdn.js <图片路径>');
    process.exit(1);
  }

  const imagePath = process.argv[2];

  if (!fs.existsSync(imagePath)) {
    console.error('错误: 文件不存在');
    process.exit(1);
  }

  try {
    console.log('上传到图床...');
    const config = loadConfig();
    const imageUrl = await uploadToCustomCDN(imagePath, config);

    if (imageUrl) {
      console.log('上传成功:', imageUrl);
    } else {
      console.log('图像将在生成时使用 BASE64 编码');
    }

  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

main();
