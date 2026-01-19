#!/usr/bin/env node

/**
 * 生成图像脚本
 *
 * 使用方法：
 * node scripts/generate-image.js [输出目录]
 *
 * 输出目录结构：
 * images/                # 生成的图像 (默认)
 * prompts/               # 提示词文件
 * analysis/              # 图像风格分析
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import fetch from 'node-fetch';

// 创建 readline 接口用于用户交互
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 读取配置（支持默认配置）
function loadConfig() {
  const projectConfigPath = path.join(process.cwd(), 'config', 'secrets.md');
  const globalConfigPath = path.join(process.env.HOME, '.claude', 'skills', 'pw-image-generation', 'config', 'secrets.md');

  const defaultConfig = {
    API_BASE_URL: 'https://ai-router.plugins-world.cn',
    ANALYSIS_MODEL_ID: 'gemini-2.0-flash-exp',
    GENERATION_MODEL_ID: 'gemini-3-pro-image-preview',
    ANALYSIS_ENDPOINT: '/v1beta/models/{model}:generateContent',
    GENERATION_ENDPOINT: '/v1beta/models/{model}:generateContent',
    API_KEY: '',
    IMAGE_UPLOAD_ENDPOINT: ''
  };

  // 优先使用项目配置,其次全局配置,最后默认配置
  let configPath = null;
  if (fs.existsSync(projectConfigPath)) {
    configPath = projectConfigPath;
    console.log('使用项目配置:', projectConfigPath);
  } else if (fs.existsSync(globalConfigPath)) {
    configPath = globalConfigPath;
    console.log('使用全局配置:', globalConfigPath);
  } else {
    console.warn('警告: 未找到配置文件，使用默认配置');
    console.warn('提示: 可以创建以下任一配置文件:');
    console.warn('  项目配置: config/secrets.md');
    console.warn('  全局配置:', globalConfigPath);
    console.warn('');
    return defaultConfig;
  }

  // 读取配置
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

// 用户确认
function askUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

// 调用 API 生成图像
async function generateImage(prompt, referenceImagePath, config) {
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: []
      }
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  };

  // 添加参考图片
  if (referenceImagePath && fs.existsSync(referenceImagePath)) {
    const imageBuffer = fs.readFileSync(referenceImagePath);
    const base64Image = imageBuffer.toString('base64');

    requestBody.contents[0].parts.push({
      inlineData: {
        mime_type: "image/png",
        data: base64Image
      }
    });
  }

  // 添加提示词
  requestBody.contents[0].parts.push({
    text: prompt
  });

  console.log('  调用 API...');
  const apiUrl = buildApiUrl(config, config.GENERATION_ENDPOINT, config.GENERATION_MODEL_ID);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  // 调试：打印响应数据
  console.log('  API 响应状态:', response.status);
  if (!response.ok) {
    console.log('  错误响应:', JSON.stringify(data, null, 2).substring(0, 500));
    throw new Error(`API 请求失败: ${response.status}`);
  }

  // 提取图像数据
  if (data.candidates && data.candidates.length > 0) {
    const parts = data.candidates[0].content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
  }

  // 调试：打印响应结构
  console.log('  响应结构:', JSON.stringify(data, null, 2).substring(0, 500));
  throw new Error('无法获取图像数据');
}

// 读取风格分析文件
function readStyleAnalysis(outputDir) {
  const analysisDir = path.join(outputDir, 'analysis');
  if (!fs.existsSync(analysisDir)) {
    return null;
  }

  const files = fs.readdirSync(analysisDir);
  const styleFile = files.find(f => f.startsWith('01_图像风格分析'));

  if (!styleFile) {
    return null;
  }

  const content = fs.readFileSync(path.join(analysisDir, styleFile), 'utf8');
  return content;
}

// 读取提示词文件
function readPromptFiles(outputDir) {
  // 优先从当前目录的 prompts/ 查找
  let promptsDir = path.join(process.cwd(), 'prompts');

  // 如果不存在，尝试从 outputDir 的父目录查找
  if (!fs.existsSync(promptsDir) && outputDir) {
    const parentDir = path.dirname(outputDir);
    promptsDir = path.join(parentDir, 'prompts');
  }

  if (!fs.existsSync(promptsDir)) {
    return [];
  }

  const files = fs.readdirSync(promptsDir);
  const promptFiles = files.filter(f => f.endsWith('.md'));

  return promptFiles.map(file => {
    const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');

    // 尝试匹配多种格式:
    // 1. ## 提示词 或 ## 完整提示词 后跟代码块
    const codeBlockMatch = content.match(/##\s*(?:完整)?提示词\s*\n\s*```[^\n]*\n([\s\S]+?)```/);
    if (codeBlockMatch) {
      return {
        file,
        prompt: codeBlockMatch[1].trim(),
        content
      };
    }

    // 2. ## 提示词 后直接跟文本
    const directMatch = content.match(/##\s*提示词\s*\n\s*(.+?)(?:\n\n|$)/s);
    if (directMatch) {
      return {
        file,
        prompt: directMatch[1].trim(),
        content
      };
    }

    // 3. 兜底: 使用整个文件内容
    return {
      file,
      prompt: content,
      content
    };
  });
}

// 主函数
async function main() {
  const outputDir = process.argv[2] || path.join(process.cwd(), 'images');

  if (!fs.existsSync(outputDir)) {
    console.warn('警告: 输出目录不存在，将创建:', outputDir);
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 加载配置
    console.log('加载配置...');
    const config = loadConfig();

    // 图片直接保存在输出目录
    const imagesDir = outputDir;

    // 读取风格分析
    console.log('\n读取风格分析...');
    const styleAnalysis = readStyleAnalysis(outputDir);
    if (styleAnalysis) {
      console.log('  找到风格分析文件');
    } else {
      console.log('  未找到风格分析文件');
    }

    // 读取提示词文件
    console.log('\n读取提示词文件...');
    const prompts = readPromptFiles(outputDir);

    if (prompts.length === 0) {
      console.error('错误: 未找到提示词文件');
      console.error('');
      console.error('请先创建提示词文件，参考:');
      console.error('  ~/.claude/skills/pw-image-generation/config.example/prompt-templates/提示词模板.md');
      console.error('');
      console.error('提示词文件格式:');
      console.error('  ## 提示词');
      console.error('  ');
      console.error('  一只可爱的柴犬在樱花树下睡觉，水彩风格');
      process.exit(1);
    }

    console.log(`  找到 ${prompts.length} 个提示词文件\n`);

    // 生成每张图像
    for (let i = 0; i < prompts.length; i++) {
      const { file, prompt, content } = prompts[i];

      console.log('='.repeat(60));
      console.log(`任务 ${i + 1}/${prompts.length}: ${file}`);
      console.log('='.repeat(60));
      console.log('\n提示词:');
      console.log(prompt);
      console.log('');

      // 检查是否已生成
      const imageFileName = file.replace('.md', '.png');
      const imagePath = path.join(imagesDir, imageFileName);

      if (fs.existsSync(imagePath)) {
        console.log(`图像已存在: ${imageFileName}`);
        const skip = await askUser('是否跳过已生成的图像? (y/n, 默认: y): ');
        if (skip !== 'n') {
          console.log('跳过\n');
          continue;
        }
      }

      // 用户确认（重点：避免额度浪费）
      console.log('【重要提示】生成将消耗 API 额度');
      const confirm = await askUser('是否生成此图像? (y/n, 默认: y): ');
      if (confirm === 'n') {
        console.log('跳过\n');
        continue;
      }

      // 检查是否有参考图像
      let referenceImagePath = null;
      const refMatch = content.match(/参考图像:\s*\[!\[.*?\]\((.+?)\)\]/);
      if (refMatch) {
        const relativeRefPath = refMatch[1];
        referenceImagePath = path.resolve(path.join(outputDir, 'analysis', relativeRefPath));
        if (fs.existsSync(referenceImagePath)) {
          console.log('\n使用参考图像:', path.basename(referenceImagePath));
        } else {
          referenceImagePath = null;
        }
      }

      // 生成图像
      console.log('\n开始生成图像...');
      const startTime = Date.now();

      try {
        const imageData = await generateImage(prompt, referenceImagePath, config);

        // 保存图像
        fs.writeFileSync(imagePath, imageData);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`\n✓ 图像生成成功! (${elapsed}秒)`);
        console.log(`  保存到: ${imagePath}\n`);

      } catch (error) {
        console.error('\n✗ 图像生成失败:', error.message);
        const retry = await askUser('是否重试? (y/n, 默认: n): ');
        if (retry === 'y') {
          i--; // 重试当前任务
        }
        console.log('');
      }
    }

    console.log('='.repeat(60));
    console.log('所有任务完成!');
    console.log('='.repeat(60));
    console.log(`\n生成的图像保存在: ${imagesDir}\n`);

  } catch (error) {
    console.error('\n错误:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
