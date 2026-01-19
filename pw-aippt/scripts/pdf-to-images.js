#!/usr/bin/env node
/**
 * pdf-to-images.js - 将 PDF 转换为图片
 *
 * 用法: node pdf-to-images.js <PDF文件> [输出目录] [DPI]
 * 示例: node pdf-to-images.js template.pdf ./template 150
 *
 * 依赖: poppler (Mac: brew install poppler, Ubuntu: apt install poppler-utils)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 参数解析
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('用法: node pdf-to-images.js <PDF文件> [输出目录] [DPI]');
  console.log('示例: node pdf-to-images.js template.pdf ./template 150');
  console.log('\n参数说明:');
  console.log('  PDF文件: 要转换的 PDF 文件路径');
  console.log('  输出目录: 图片输出目录 (默认: ./template)');
  console.log('  DPI: 图片分辨率 (默认: 150, 推荐: 150-300)');
  console.log('\n依赖: poppler');
  console.log('  Mac: brew install poppler');
  console.log('  Ubuntu: apt install poppler-utils');
  process.exit(1);
}

const pdfFile = path.resolve(args[0]);
const outputDir = args[1] ? path.resolve(args[1]) : path.join(process.cwd(), 'template');
const dpi = args[2] || '150';

// 检查 PDF 文件
if (!fs.existsSync(pdfFile)) {
  console.error(`错误: PDF 文件不存在 - ${pdfFile}`);
  process.exit(1);
}

// 检查 poppler 是否安装
try {
  execSync('which pdftoppm', { stdio: 'ignore' });
} catch (err) {
  console.error('错误: 未安装 poppler');
  console.error('\n安装方法:');
  console.error('  Mac: brew install poppler');
  console.error('  Ubuntu: apt install poppler-utils');
  process.exit(1);
}

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`创建输出目录: ${outputDir}`);
}

// 转换 PDF 为图片
console.log(`\n正在转换 PDF 为图片...`);
console.log(`  PDF 文件: ${pdfFile}`);
console.log(`  输出目录: ${outputDir}`);
console.log(`  分辨率: ${dpi} DPI`);

try {
  const outputPrefix = path.join(outputDir, '图');
  const cmd = `pdftoppm -png -r ${dpi} "${pdfFile}" "${outputPrefix}"`;

  console.log(`\n执行命令: ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit' });

  console.log('\n✅ PDF 转换完成');
} catch (err) {
  console.error('\n❌ 转换失败:', err.message);
  console.error('\n常见问题:');
  console.error('  - exit code 137: 内存不足，降低 DPI (如 -r 100)');
  console.error('  - 中文路径: 使用绝对路径');
  process.exit(1);
}

// 重命名文件
console.log('\n正在重命名文件...');

try {
  const files = fs.readdirSync(outputDir)
    .filter(f => f.startsWith('图-') && f.endsWith('.png'))
    .sort();

  if (files.length === 0) {
    console.log('⚠️  没有找到需要重命名的文件');
    process.exit(0);
  }

  files.forEach(file => {
    const oldPath = path.join(outputDir, file);
    // 图-01.png -> 图.001.png
    const newName = file.replace(/图-(\d+)\.png/, (match, num) => {
      return `图.${num.padStart(3, '0')}.png`;
    });
    const newPath = path.join(outputDir, newName);

    fs.renameSync(oldPath, newPath);
    console.log(`  ${file} -> ${newName}`);
  });

  console.log(`\n✅ 重命名完成，共 ${files.length} 个文件`);
  console.log(`\n输出目录: ${outputDir}`);
} catch (err) {
  console.error('❌ 重命名失败:', err.message);
  process.exit(1);
}
