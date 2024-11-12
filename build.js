const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // 编译 TypeScript 文件并捕获错误
  execSync("tsc", { stdio: 'inherit' });
} catch (error) {
  console.error("TypeScript 编译过程中发生错误:", error.message);
  process.exit(1); // 编译失败时退出程序
}

// 删除 .map 文件的函数
function deleteMapFiles(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      deleteMapFiles(filePath); // 递归删除子目录中的 .map 文件
    } else if (file.endsWith('.map')) {
      fs.unlinkSync(filePath);
      console.log(`已删除: ${filePath}`);
    }
  }
}

// 删除编译输出目录中的 .map 文件
deleteMapFiles(path.join(__dirname, 'dist'));

// 定义源目录和目标目录
const sourceDir = path.join(__dirname, 'resources');
const targetDir = path.join(__dirname, 'dist', 'resources');

// 递归复制目录函数
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath); // 递归复制子目录
    } else {
      fs.copyFileSync(srcPath, destPath); // 复制文件
    }
  }
}

// 执行复制
copyDir(sourceDir, targetDir);

// 复制 config 文件夹到 dist
const configSourceDir = path.join(__dirname, 'config');
const configTargetDir = path.join(__dirname, 'dist', 'config');

// 执行 config 文件夹复制
copyDir(configSourceDir, configTargetDir);

// 定义 src 目录和 dist 目录
const srcDir = path.join(__dirname, 'dist', 'src');  // 编译后的 src 目录
const distDir = path.join(__dirname, 'dist');  // 目标目录是 dist 根目录

// 递归复制 dist/src 目录下的所有文件到 dist 根目录下
function copySrcToDist(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 如果是目录，递归处理，确保目标目录存在
      fs.mkdirSync(destPath, { recursive: true });
      copySrcToDist(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
      console.log(`已复制: ${srcPath} -> ${destPath}`);
    }
  }
}

// 执行复制 src 目录下的所有内容到 dist 根目录下
copySrcToDist(srcDir, distDir);

// 删除 dist/src 目录
function deleteDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      deleteDir(fullPath);  // 递归删除子目录
    } else {
      fs.unlinkSync(fullPath);  // 删除文件
    }
  }
  fs.rmdirSync(dir);  // 删除空目录
  console.log(`已删除目录: ${dir}`);
}

// 删除 dist/src 目录
deleteDir(srcDir);
