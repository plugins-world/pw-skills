#!/usr/bin/env node

/**
 * 图片合并为长图脚本
 *
 * 使用方法：
 * node merge-images.js <图片目录> <输出文件>
 *
 * 示例：
 * node merge-images.js ./images output.png
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 读取目录下的所有图片
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);

  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .sort((a, b) => {
      // 按文件名中的数字排序
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    })
    .map(file => path.join(dir, file));
}

// 使用 ImageMagick 合并图片
async function mergeImagesWithImageMagick(imageFiles, outputFile) {
  const command = `convert ${imageFiles.map(f => `"${f}"`).join(' ')} -append "${outputFile}"`;

  try {
    await execAsync(command);
    return true;
  } catch (error) {
    return false;
  }
}

// 使用 sips (macOS 自带) 合并图片
async function mergeImagesWithSips(imageFiles, outputFile) {
  // sips 不支持直接合并，需要用其他方法
  return false;
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('用法: node merge-images.js <图片目录> <输出文件>');
    console.error('');
    console.error('示例:');
    console.error('  node merge-images.js ./images output.png');
    process.exit(1);
  }

  const [imageDir, outputFile] = args;

  // 检查目录是否存在
  if (!fs.existsSync(imageDir)) {
    console.error(`错误: 目录不存在: ${imageDir}`);
    process.exit(1);
  }

  // 读取图片文件
  const imageFiles = getImageFiles(imageDir);

  if (imageFiles.length === 0) {
    console.error(`错误: 目录中没有找到图片文件: ${imageDir}`);
    process.exit(1);
  }

  console.log(`找到 ${imageFiles.length} 张图片:`);
  imageFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${path.basename(file)}`);
  });
  console.log('');

  // 尝试使用 ImageMagick
  console.log('正在合并图片...');
  const success = await mergeImagesWithImageMagick(imageFiles, outputFile);

  if (success) {
    console.log(`✅ 长图生成成功: ${outputFile}`);
  } else {
    console.error('❌ 合并失败');
    console.error('');
    console.error('请确保已安装 ImageMagick:');
    console.error('  brew install imagemagick');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('错误:', error.message);
  process.exit(1);
});
