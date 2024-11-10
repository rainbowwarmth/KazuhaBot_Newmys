const fs = require('fs'); 
const path = require('path');

// 获取当前工作目录（即 D:\Desktop\kazuhabot）
const currentDir = process.cwd();

// 定义源目录（dist）和目标目录（当前工作目录）
const sourceDir = path.join(currentDir, 'dist');
const targetDir = currentDir; // 目标目录为当前工作目录

// 递归复制目录函数
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true }); // 创建目标目录
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 只复制 "config" 和 "resources" 文件夹
      if (entry.name === 'config' || entry.name === 'resources') {
        copyDir(srcPath, destPath); // 如果是目录，递归调用
      }
    } else {
      // 如果是文件，复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 调用复制函数，将 dist 目录中的 "config" 和 "resources" 文件夹复制到当前工作目录
copyDir(sourceDir, targetDir);

console.log('The "config" and "resources" folders have been copied to the project root directory!');
