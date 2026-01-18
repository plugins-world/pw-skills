#!/usr/bin/env node

/**
 * 提示词辅助生成脚本
 * 用于帮助用户生成高质量的图像生成提示词
 *
 * 使用方法：
 * node scripts/generate-prompt.js [--interactive | --generate]
 *
 * --interactive 或无参数：交互式模式
 * --generate：自动生成（需要额外的配置）
 *
 * 依赖：node-fetch
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 读取配置
function loadConfig() {
  const configPath = path.join(process.cwd(), 'config', 'secrets.md');
  if (!fs.existsSync(configPath)) {
    return null; // 配置可选
  }

  const configContent = fs.readFileSync(configPath, 'utf8');
  const config = {};

  configContent.split('\n').forEach(line => {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      config[match[1]] = match[2];
    }
  });

  return config;
}

// 询问问题
function ask(question, defaultAnswer = '') {
  return new Promise((resolve) => {
    const prompt = defaultAnswer ? `${question} [${defaultAnswer}]: ` : `${question}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultAnswer);
    });
  });
}

// 交互式模式
async function interactiveMode() {
  console.log('=== 提示词辅助生成工具 ===');
  console.log('回答以下问题，我会帮您生成高质量的图像生成提示词');
  console.log('');

  // 基础信息
  const subject = await ask('1. 图像的主体是什么？（如：一只可爱的柴犬，一座雪山）');
  const action = await ask('2. 主体在做什么？（如：睡觉，奔跑）');
  const scene = await ask('3. 场景是什么？（如：樱花树下，咖啡馆内）');
  const style = await ask('4. 艺术风格是什么？（如水彩风格，油画风格，动漫风格，3D渲染）', '水彩风格');
  const colors = await ask('5. 主要颜色和氛围？（如：柔和的粉色调，明亮的蓝色，温暖的黄色光）');
  const details = await ask('6. 详细描述（如：毛发蓬松，细节丰富，水面波纹，金属质感）');
  const resolution = await ask('7. 分辨率要求？（如：4K，高清）', '4K');

  // 生成提示词
  const prompt = [];
  prompt.push(subject);

  if (action) {
    prompt.push(`在${scene}${action}`);
  } else if (scene) {
    prompt.push(`在${scene}`);
  }

  if (style) prompt.push(`，${style}`);
  if (colors) prompt.push(`，${colors}`);
  if (details) prompt.push(`，${details}`);
  if (resolution) prompt.push(`，${resolution}分辨率`);

  const finalPrompt = prompt.join('').trim();

  console.log('');
  console.log('=== 生成的提示词 ===');
  console.log(finalPrompt);
  console.log('');

  // 保存到文件
  const save = await ask('是否保存到文件？', 'y');
  if (save.toLowerCase() === 'y' || save.toLowerCase() === 'yes') {
    const outputDir = path.join(process.cwd(), 'output', 'prompts');
    fs.mkdirSync(outputDir, { recursive: true });

    const filename = `提示词_${subject.replace(/\s+/g, '_') || '未命名'}_${Date.now()}.md`;
    const outputPath = path.join(outputDir, filename);

    fs.writeFileSync(outputPath, `# 图像生成提示词

## 基本信息

- 主体：${subject}
- 动作：${action || '无'}
- 场景：${scene || '无'}
- 风格：${style}
- 颜色：${colors}
- 细节：${details}
- 分辨率：${resolution}

## 提示词

${finalPrompt}

## 生成时间

${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
`);

    console.log(`保存成功：${outputPath}`);
  }

  rl.close();
}

// 自动生成模式（需要额外配置）
async function autoMode() {
  console.log('自动生成模式需要额外的配置，暂时不支持');
  rl.close();
  process.exit(1);
}

// 主函数
async function main() {
  const config = loadConfig();

  if (process.argv.includes('--generate')) {
    await autoMode();
  } else {
    await interactiveMode();
  }
}

main().catch(err => {
  console.error('错误:', err);
  rl.close();
  process.exit(1);
});
