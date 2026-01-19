#!/usr/bin/env node
/**
 * delete-image.js - 删除图床上的图片
 *
 * 用法:
 *   node delete-image.js list              # 列出所有上传的图片
 *   node delete-image.js delete <index>    # 删除指定索引的图片
 *   node delete-image.js delete-all        # 删除所有图片
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const historyFile = path.join(process.cwd(), '.upload-history.json');

// 读取上传历史
function loadHistory() {
  if (fs.existsSync(historyFile)) {
    try {
      return JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
    } catch (err) {
      console.error('读取历史记录失败:', err.message);
      return [];
    }
  }
  return [];
}

// 保存上传历史
function saveHistory(history) {
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf-8');
}

// 删除图片
function deleteImage(deleteUrl) {
  try {
    console.log(`正在删除: ${deleteUrl}`);
    execSync(`curl -s "${deleteUrl}"`, { encoding: 'utf-8' });
    console.log('✅ 删除成功');
    return true;
  } catch (err) {
    console.error('❌ 删除失败:', err.message);
    return false;
  }
}

// 列出所有图片
function listImages() {
  const history = loadHistory();

  if (history.length === 0) {
    console.log('没有上传历史记录');
    console.log(`\n历史记录文件: ${historyFile}`);
    return;
  }

  console.log(`\n上传历史 (共 ${history.length} 张):\n`);
  history.forEach((item, index) => {
    const date = new Date(item.timestamp).toLocaleString('zh-CN');
    console.log(`[${index}] ${item.file}`);
    console.log(`    上传时间: ${date}`);
    console.log(`    图片 URL: ${item.url}`);
    console.log(`    删除链接: ${item.deleteUrl || '无'}`);
    console.log('');
  });

  console.log(`历史记录文件: ${historyFile}`);
}

// 删除指定图片
function deleteByIndex(index) {
  const history = loadHistory();

  if (index < 0 || index >= history.length) {
    console.error(`错误: 索引 ${index} 超出范围 (0-${history.length - 1})`);
    process.exit(1);
  }

  const item = history[index];

  if (!item.deleteUrl) {
    console.error('错误: 该图片没有删除链接');
    process.exit(1);
  }

  console.log(`准备删除: ${item.file}`);
  console.log(`图片 URL: ${item.url}`);

  if (deleteImage(item.deleteUrl)) {
    // 从历史记录中移除
    history.splice(index, 1);
    saveHistory(history);
    console.log('已从历史记录中移除');
  }
}

// 删除所有图片
function deleteAll() {
  const history = loadHistory();

  if (history.length === 0) {
    console.log('没有需要删除的图片');
    return;
  }

  console.log(`准备删除 ${history.length} 张图片...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];
    console.log(`[${i}] ${item.file}`);

    if (!item.deleteUrl) {
      console.log('⚠️  跳过: 没有删除链接\n');
      failCount++;
      continue;
    }

    if (deleteImage(item.deleteUrl)) {
      history.splice(i, 1);
      successCount++;
    } else {
      failCount++;
    }
    console.log('');
  }

  saveHistory(history);

  console.log(`\n删除完成:`);
  console.log(`  成功: ${successCount} 张`);
  console.log(`  失败: ${failCount} 张`);
}

// 主函数
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('用法:');
  console.log('  node delete-image.js list              # 列出所有上传的图片');
  console.log('  node delete-image.js delete <index>    # 删除指定索引的图片');
  console.log('  node delete-image.js delete-all        # 删除所有图片');
  process.exit(1);
}

const command = args[0];

switch (command) {
  case 'list':
    listImages();
    break;

  case 'delete':
    if (args.length < 2) {
      console.error('错误: 请指定要删除的图片索引');
      console.log('用法: node delete-image.js delete <index>');
      process.exit(1);
    }
    const index = parseInt(args[1]);
    if (isNaN(index)) {
      console.error('错误: 索引必须是数字');
      process.exit(1);
    }
    deleteByIndex(index);
    break;

  case 'delete-all':
    deleteAll();
    break;

  default:
    console.error(`错误: 未知命令 "${command}"`);
    console.log('支持的命令: list, delete, delete-all');
    process.exit(1);
}
