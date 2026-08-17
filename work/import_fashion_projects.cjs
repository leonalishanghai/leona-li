const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const sourceRoot = path.resolve(process.argv[2] || '/private/tmp/leona-fashion-archive.TfTd2t');
const outputRoot = path.resolve(__dirname, '../assets/images/work/projects');

const projects = [
  { slug: 'between-spaces', source: ['Fashion_Photography_Part2', '1 Between Spaces'] },
  { slug: 'waving', source: ['Fashion_Photography_Part2', '2 Waving'] },
  { slug: 'echo', source: ['Fashion_Photography_Part1', '3 Echo'] },
  { slug: 'traces-of-light', source: ['Fashion_Photography_Part2', '4 Traces of Light'] },
  { slug: 'urban-silence', source: ['Fashion_Photography_Part1', '5 Urban Reverie'] },
  { slug: 'daydream', source: ['Fashion_Photography_Part1', '6 Daydream'] },
];

function imageFiles(directory) {
  return fs.readdirSync(directory)
    .filter((name) => /\.(jpe?g|png)$/i.test(name));
}

function galleryNumber(name) {
  const match = name.match(/(?:_|\b)(\d{2})(?=\.(?:jpe?g|png)$)/i)
    || name.match(/(\d{2})(?=\.(?:jpe?g|png)$)/i);
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
  const inputMetadata = await sharp(source).metadata();
  const variants = [
    { suffix: '900', width: 900, quality: 82 },
    { suffix: '1800', width: 1800, quality: 88 },
  ];

  await Promise.all(variants.map(({ suffix, width, quality }) => (
    writeVariant(source, path.join(outputDirectory, `${baseName}-${suffix}.webp`), width, quality)
  )));

  const largeMetadata = await sharp(path.join(outputDirectory, `${baseName}-1800.webp`)).metadata();
  return {
    source: path.basename(source),
    input: `${inputMetadata.width}x${inputMetadata.height}`,
    output: `${largeMetadata.width}x${largeMetadata.height}`,
  };
}

async function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source archive directory does not exist: ${sourceRoot}`);
  }

  fs.mkdirSync(outputRoot, { recursive: true });
  const report = [];

  for (const project of projects) {
    const sourceDirectory = path.join(sourceRoot, ...project.source);
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

    const coverResult = await processImage(path.join(sourceDirectory, cover), outputDirectory, 'cover');
    const galleryResults = [];
    for (let index = 0; index < gallery.length; index += 1) {
      const baseName = String(index + 1).padStart(2, '0');
      galleryResults.push(await processImage(
        path.join(sourceDirectory, gallery[index]),
        outputDirectory,
        baseName,
      ));
    }

    report.push({
      project: project.slug,
      cover: coverResult,
      gallery: galleryResults,
    });
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
