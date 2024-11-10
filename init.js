const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取当前工作目录
const currentDir = process.cwd();

// 定义源目录（node_modules/kazuha-bot/list）和目标目录（当前工作目录）
const sourceDir = path.join(currentDir, 'node_modules', 'kazuha-bot', 'list');
const targetDir = currentDir; // 目标目录为当前工作目录

// 递归复制目录函数
function copyDir(src, dest) {
  // 创建目标目录
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // 遍历源目录的所有文件和文件夹
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 如果是目录，递归调用复制函数
      copyDir(srcPath, destPath);
    } else {
      // 如果是文件，直接复制
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 在当前工作目录下运行 pnpm install
function installDependencies() {
  try {
    console.log('Running pnpm install...');
    execSync('pnpm install --registry=https://registry.npmmirror.com', { stdio: 'inherit' });
    console.log('Dependencies installed successfully!');
  } catch (error) {
    console.error('Error during pnpm install:', error);
  }
}

// 执行安装依赖
installDependencies();

// 执行复制
copyDir(sourceDir, targetDir);

console.log('The contents of the "list" directory have been copied to the project root!');
