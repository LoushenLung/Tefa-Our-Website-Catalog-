const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'generated', 'prisma');
const targetDir = path.join(__dirname, '..', 'dist', 'generated', 'prisma');

function copyRecursive(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Source folder not found: ${source}`);
  }

  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

copyRecursive(sourceDir, targetDir);
console.log(`Copied Prisma generated client to ${targetDir}`);