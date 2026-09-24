import { readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'public/assets/projects';

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('_result.webp'));
  const thumbWidth = 720;

  for (const file of files) {
    const fullPath = path.join(DIR, file);
    const meta = await sharp(fullPath).metadata();
    console.log(`${file.padEnd(58)} ${meta.width}x${meta.height}`);

    const thumbName = file.replace('_result.webp', '-thumb.webp');
    const thumbPath = path.join(DIR, thumbName);
    await sharp(fullPath)
      .resize({ width: thumbWidth, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbPath);
    console.log(`  -> ${thumbName}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});