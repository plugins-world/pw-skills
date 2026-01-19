#!/usr/bin/env node
/**
 * upload-image.js - 上传图片到图床获取 URL
 *
 * 用法: node upload-image.js <图片路径>
 * 示例: node upload-image.js ./template/图.001.png
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 参数解析
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('用法: node upload-image.js <图片路径>');
  console.log('示例: node upload-image.js ./template/图.001.png');
  process.exit(1);
}

const imagePath = path.resolve(args[0]);
const historyFile = path.join(process.cwd(), '.upload-history.json');

// 检查文件
if (!fs.existsSync(imagePath)) {
  console.error(`错误: 文件不存在 - ${imagePath}`);
  process.exit(1);
}

// 读取上传历史
function loadHistory() {
  if (fs.existsSync(historyFile)) {
    try {
      return JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
    } catch (err) {
      return [];
    }
  }
  return [];
}

// 保存上传历史
function saveHistory(history) {
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf-8');
}

// 上传到 sm.ms
function uploadToSmMs(imagePath) {
  console.log('尝试上传到 sm.ms...');
  try {
    const cmd = `curl -s -X POST -F "smfile=@${imagePath}" https://sm.ms/api/v2/upload`;
    const result = execSync(cmd, { encoding: 'utf-8' });
    const json = JSON.parse(result);

    if (json.success && json.data && json.data.url) {
      return {
        success: true,
        url: json.data.url,
        deleteHash: json.data.hash || null,
        deleteUrl: json.data.delete ? `https://sm.ms/delete/${json.data.hash}` : null,
        provider: 'sm.ms'
      };
    } else if (json.code === 'image_repeated' && json.images) {
      // 图片已存在，返回已有的 URL
      return {
        success: true,
        url: json.images,
        deleteHash: null,
        deleteUrl: null,
        provider: 'sm.ms',
        note: '图片已存在'
      };
    } else {
      return { success: false, error: json.message || '未知错误' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 上传到 freeimage.host
function uploadToFreeimage(imagePath) {
  console.log('尝试上传到 freeimage.host...');
  try {
    const cmd = `curl -s -X POST -F "source=@${imagePath}" "https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5"`;
    const result = execSync(cmd, { encoding: 'utf-8' });
    const json = JSON.parse(result);

    if (json.status_code === 200 && json.image && json.image.url) {
      return {
        success: true,
        url: json.image.url,
        deleteUrl: json.image.url_viewer || null,
        provider: 'freeimage.host'
      };
    } else {
      return { success: false, error: json.error || '未知错误' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 主逻辑：优先 sm.ms，失败则尝试 freeimage.host
console.log(`正在上传: ${imagePath}`);

let result = uploadToSmMs(imagePath);

if (!result.success) {
  console.log(`sm.ms 上传失败: ${result.error}`);
  result = uploadToFreeimage(imagePath);
}

if (result.success) {
  console.log(`\n✅ 上传成功 (${result.provider}): ${result.url}`);
  if (result.note) {
    console.log(`   注意: ${result.note}`);
  }
  console.log(`\n可以在提示词中使用:\n${result.url} 参考这张图片...`);

  // 保存到历史记录
  const history = loadHistory();
  history.push({
    timestamp: new Date().toISOString(),
    file: path.basename(imagePath),
    url: result.url,
    deleteUrl: result.deleteUrl || null,
    deleteHash: result.deleteHash || null,
    provider: result.provider
  });
  saveHistory(history);

  console.log(`\n📝 删除链接已保存到: ${historyFile}`);
  if (result.deleteUrl) {
    console.log(`   删除链接: ${result.deleteUrl}`);
  }
  if (result.deleteHash) {
    console.log(`   删除 Hash: ${result.deleteHash}`);
  }
  console.log(`\n💡 提示: 使用 delete-image.js 可以批量删除图片`);
} else {
  console.error(`\n❌ 所有图床上传失败`);
  console.error(`   最后错误: ${result.error}`);
  process.exit(1);
}
