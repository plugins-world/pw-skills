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

// 上传到 freeimage.host
console.log(`正在上传: ${imagePath}`);

try {
  const cmd = `curl -s -X POST -F "source=@${imagePath}" "https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5"`;
  const result = execSync(cmd, { encoding: 'utf-8' });

  const json = JSON.parse(result);

  if (json.status_code === 200 && json.image && json.image.url) {
    const url = json.image.url;
    const deleteUrl = json.image.delete_url || null;

    console.log(`\n✅ 上传成功: ${url}`);
    console.log(`\n可以在提示词中使用:\n${url} 参考这张图片...`);

    // 保存到历史记录
    const history = loadHistory();
    history.push({
      timestamp: new Date().toISOString(),
      file: path.basename(imagePath),
      url: url,
      deleteUrl: deleteUrl
    });
    saveHistory(history);

    console.log(`\n📝 删除链接已保存到: ${historyFile}`);
    if (deleteUrl) {
      console.log(`   删除链接: ${deleteUrl}`);
    }
    console.log(`\n💡 提示: 使用 delete-image.js 可以批量删除图片`);
  } else {
    console.error('上传失败:', json);
    process.exit(1);
  }
} catch (err) {
  console.error('上传失败:', err.message);
  process.exit(1);
}
