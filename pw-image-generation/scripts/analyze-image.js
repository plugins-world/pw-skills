#!/usr/bin/env node

/**
 * 分析图像的风格和特征
 *
 * 使用方法：
 * node scripts/analyze-image.js <图像URL或路径> [输出目录]
 *
 * 示例：
 * node scripts/analyze-image.js https://example.com/image.png
 * node scripts/analyze-image.js ./local-image.png ./output
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import fetch from 'node-fetch';

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

// 构建完整的 API URL
function buildApiUrl(config, endpointTemplate, modelId) {
  const endpoint = endpointTemplate.replace('{model}', modelId);
  return `${config.API_BASE_URL}${endpoint}`;
}

// 下载图像
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(outputPath, buffer);
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

// 调用 API 分析图像
async function analyzeImage(imagePath, config) {

  // 读���图像并转换为 base64
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const apiUrl = buildApiUrl(config, config.ANALYSIS_ENDPOINT, config.ANALYSIS_MODEL_ID);

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mime_type: "image/png",
              data: base64Image
            }
          },
          {
            text: `请详细分析这张图片的艺术风格和特征，包括：
1. 艺术风格（如水彩、油画、动漫等）
2. 色彩方案（主色调、色彩搭配）
3. 构图方式（如三分法、对称构图等）
4. 光照和氛围
5. 笔触和纹理特征
6. 整体感觉和情绪

请用简洁的中文描述，每个要点不超过两句话。`
          }
        ]
      }
    ]
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  if (data.candidates && data.candidates.length > 0) {
    const parts = data.candidates[0].content?.parts || [];
    for (const part of parts) {
      if (part.text) {
        return part.text;
      }
    }
  }

  throw new Error('无法获取分析结果');
}

// 主函数
async function main() {
  const imageUrl = process.argv[2];
  const outputDir = process.argv[3] || path.join(process.cwd(), 'output');

  if (!imageUrl) {
    console.error('使用方法: node scripts/analyze-image.js <图像URL或路径> [输出目录]');
    console.error('');
    console.error('示例:');
    console.error('  node scripts/analyze-image.js https://example.com/image.png');
    console.error('  node scripts/analyze-image.js ./local-image.png ./output');
    process.exit(1);
  }

  try {
    // 加载配置
    console.log('加载配置...');
    const config = loadConfig();

    // 创建输出目录
    fs.mkdirSync(outputDir, { recursive: true });

    // 下载或读取图像
    console.log('读取图像...');
    let localImagePath;
    let isLocal = !imageUrl.startsWith('http');

    if (!isLocal) {
      const filename = path.basename(imageUrl).split('?')[0] || 'image.png';
      localImagePath = path.join(outputDir, 'config.example', '_temp_download.png');
      fs.mkdirSync(path.dirname(localImagePath), { recursive: true });
      console.log('下载图像到:', localImagePath);
      await downloadImage(imageUrl, localImagePath);
    } else {
      localImagePath = imageUrl;
      // 复制到 config.example 目录
      const refPath = path.join(outputDir, 'config.example', path.basename(imageUrl));
      fs.mkdirSync(path.dirname(refPath), { recursive: true });
      fs.copyFileSync(imageUrl, refPath);
      localImagePath = refPath;
    }

    // 分析图像
    console.log('分析图像风格...');
    const analysis = await analyzeImage(localImagePath, config);

    // 保存分析结果
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputFile = path.join(outputDir, 'analysis', `01_图像风格分析_${timestamp}.md`);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    // 计算相对路径
    const relativeImagePath = path.relative(path.dirname(outputFile), localImagePath);

    fs.writeFileSync(outputFile, `# 图像风格分析

生成时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
原始图像: ${isLocal ? path.basename(imageUrl) : imageUrl}

## 风格分析

${analysis}

## 参考图像

![参考图像](${relativeImagePath})
`);

    console.log('分析完成!');
    console.log('结果保存到:', outputFile);
    console.log('参考图像保存在:', path.join(outputDir, 'config.example', path.basename(imageUrl)));

  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

main();
