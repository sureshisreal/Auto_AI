const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const args = process.argv.slice(2);
const baselinePath = args[0];
const currentPath = args[1];
const diffPath = args[2];
const threshold = parseFloat(
  args.find((arg) => arg.startsWith('--threshold='))?.split('=')[1] || '0.03'
);

if (!baselinePath || !currentPath || !diffPath) {
  console.error(
    'Usage: node compare.js <baseline.png> <current.png> <diff.png> [--threshold=0.03]'
  );
  process.exit(1);
}

const dir = path.dirname(diffPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(baselinePath)) {
  console.log('Baseline not found, creating baseline...');
  fs.copyFileSync(currentPath, baselinePath);
  console.log(`Baseline created at ${baselinePath}`);
  process.exit(0);
}

const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
const img2 = PNG.sync.read(fs.readFileSync(currentPath));
const { width, height } = img1;
const diff = new PNG({ width, height });

const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
  threshold: 0.1,
});

const percentDiff = (numDiffPixels / (width * height)) * 100;

fs.writeFileSync(diffPath, PNG.sync.write(diff));

console.log(`Pixel difference: ${numDiffPixels} pixels (${percentDiff.toFixed(2)}%)`);

if (percentDiff > threshold * 100) {
  console.error(
    `Threshold exceeded! Allowed: ${threshold * 100}%, Actual: ${percentDiff.toFixed(2)}%`
  );
  process.exit(1);
} else {
  console.log('Comparison passed!');
  process.exit(0);
}
