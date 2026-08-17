const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const sourceRoot = path.resolve(process.argv[2]);
const outputRoot = path.resolve(__dirname, '../assets/images/work/projects');

const projects = [
  { slug: 'within-the-light', source: '3 Within The Light' },
  { slug: 'the-white-chapter', source: '1 The White Chapter' },
  { slug: 'between-us', source: '2 Between Us' },
  { slug: 'parisian-silence', source: '4 Parisian Silence' },
  { slug: 'red-study', source: '6 Rouge' },
  { slug: 'between-dreams', source: '5 Becoming' },
];

function imageFiles(directory) {
  return fs.readdirSync(directory)
    .filter((name) => /\.(jpe?g|png)$/i.test(name));
}

function galleryNumber(name) {
  const match = name.match(/_(\d{1,2})_?\.(?:jpe?g|png)$/i)
    || name.match(/(\d{1,2})\.(?:jpe?g|png)$/i);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

async function writeVariant(source, destination, width, quality) {
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(destination);
}

async function processImage(source, outputDirectory, baseName) {
  await Promise.all([
    writeVariant(source, path.join(outputDirectory, `${baseName}-900.webp`), 900, 82),
    writeVariant(source, path.join(outputDirectory, `${baseName}-1800.webp`), 1800, 88),
  ]);
}

async function main() {
  if (!sourceRoot || !fs.existsSync(sourceRoot)) {
    throw new Error(`Source archive directory does not exist: ${sourceRoot}`);
  }

  for (const project of projects) {
    const sourceDirectory = path.join(sourceRoot, project.source);
    const files = imageFiles(sourceDirectory);
    const cover = files.find((name) => /cover/i.test(name));
    const gallery = files
      .filter((name) => !/cover/i.test(name))
      .sort((a, b) => galleryNumber(a) - galleryNumber(b));

    if (!cover) throw new Error(`No cover found in ${sourceDirectory}`);
    if (!gallery.length || gallery.some((name) => !Number.isFinite(galleryNumber(name)))) {
      throw new Error(`Invalid gallery sequence in ${sourceDirectory}`);
    }

    const outputDirectory = path.join(outputRoot, project.slug);
    fs.mkdirSync(outputDirectory, { recursive: true });

    await processImage(path.join(sourceDirectory, cover), outputDirectory, 'cover');
    for (let index = 0; index < gallery.length; index += 1) {
      const baseName = String(index + 1).padStart(2, '0');
      await processImage(path.join(sourceDirectory, gallery[index]), outputDirectory, baseName);
    }

    process.stdout.write(`${project.slug}: cover + ${gallery.length} images\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
