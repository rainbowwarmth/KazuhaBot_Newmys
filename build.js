import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';


// 编译 TypeScript 文件
execSync("tsc");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义源目录和目标目录
const sourceDir = path.join(__dirname, "resources");
const targetDir = path.join(__dirname, "dist", "resources");

// 递归复制目录函数
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// 执行复制
copyDir(sourceDir, targetDir)
