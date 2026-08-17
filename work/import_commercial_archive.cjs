const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const sourceRoot = path.resolve(process.argv[2] || '/private/tmp/leona-commercial.qDeFB8');
const outputRoot = path.resolve(__dirname, '../assets/images/work/projects');

const projectSources = [
  {
    slug: 'summer-narrative',
    directory: ['part1', '1 Brand Campaign', '1 Summer Narrative'],
    cover: 'Hero 13.jpg',
    gallery: ['1.jpg', '3 2.jpg', '4.JPG', '5.jpg'],
  },
  {
    slug: 'inside-brand-visual-story',
    directory: ['part1', '1 Brand Campaign', '2 Inside Brand Visual Story'],
    cover: '01.jpg',
    gallery: ['01.jpg', '02.jpg', '03 拷贝.jpg', '06 拷贝 2.jpg', '7-1.jpg', '7-2.jpg'],
  },
  {
    slug: 'black-attitude',
    directory: ['part1', '1 Brand Campaign', '3 Black Attitude Fashion Campaign'],
    cover: '4-10 final.jpg',
    gallery: ['4-10 final.jpg', '4-11 final.jpg'],
  },
  {
    slug: 'runway-stories',
    directory: ['part1', '1 Brand Campaign', '4 Runway Stories'],
    cover: '3N4A4855.jpg',
    gallery: ['3N4A4855.jpg', '3N4A4870.jpg', '3N4A4882.jpg', '3N4A4885.jpg', '3N4A4903.jpg', '开运01.jpg'],
  },
  {
    slug: 'calling-for-love',
    directory: ['part2', '4 Editorial', '1 Calling for Love'],
    cover: 'Hero 03.jpg',
    gallery: ['IMG_8276.jpg', 'IMG_8432 copy.jpg', 'IMG_8434 copy.jpg', 'IMG_8439 copy.jpg', 'IMG_8502 copy.jpg'],
  },
  {
    slug: 'questions-of-existence',
    directory: ['part2', '4 Editorial', '2 Questions of Existence'],
    cover: '1 拷贝.jpg',
    gallery: ['1 拷贝.jpg', 'DSCF4439.jpg', 'DSCF4448 拷贝.jpg', 'DSCF4463_副本.jpg', 'DSCF4471 拷贝.jpg', 'DSCF4476 1 1.jpg', 'DSCF4488 拷贝.jpg', 'DSCF4498_副本.jpg'],
  },
  {
    slug: 'in-a',
    directory: ['part2', '4 Editorial', '3 In a __'],
    cover: 'Final 89完整版.jpg',
    gallery: ['Final 1.jpg', 'Final 2 2.jpg', 'Final 4.jpg', 'Final 5.jpg', 'Final 6.jpg', 'Final 7.jpg', 'Final 89完整版.jpg'],
  },
  {
    slug: 'time',
    directory: ['part2', '4 Editorial', '4 Time'],
    cover: 'Hero 01.JPG',
    gallery: ['IMG_0653.JPG', 'IMG_0690.JPG', 'IMG_8851 copy.jpg', 'IMG_8909 copy.jpg'],
  },
  {
    slug: 'time-traveller',
    directory: ['part2', '4 Editorial', '5 Time Traveller'],
    cover: '3_N4A9406 拷贝.jpg',
    gallery: ['3_N4A9406 拷贝.jpg', '5_N4A9418.jpg', '7_N4A9441.jpg'],
  },
  {
    slug: 'calling-for-spring',
    directory: ['part2', '4 Editorial', '6 Calling for Spring'],
    cover: 'DSCF4607.jpg',
    gallery: ['DSCF4607.jpg', 'DSCF4618.jpg', 'DSCF4622.jpg'],
  },
];

const archiveSources = [
  {
    slug: 'selected-commercial-images',
    directory: ['part1', 'Selected Commercial Images'],
    images: ['Select_01.jpg', 'Select_02.jpg', 'Select_03.jpg', 'Select_04.JPG', 'Select_05.jpg', 'Select 06.jpg', 'Select_07.jpg', 'Select_08.jpg'],
  },
  {
    slug: 'product-studies',
    directory: ['part1', '3 Product & Still Life', 'Product Studies'],
    images: ['Project 5.jpg', '7.7 test7969.jpg', '7.7 test7974.jpg', 'DSCF6048 拷贝.jpg', 'WechatIMG1652.jpg', 'WechatIMG1654.jpg', '珍珠首饰样片0637.jpg'],
  },
  {
    slug: 'beauty-objects',
    directory: ['part1', '3 Product & Still Life', 'Beauty Objects'],
    images: ['Beauty Objects 1.png', 'Beauty Objects 2.jpg'],
  },
];

async function writeVariant(source, destination, width, quality) {
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(destination);
}

async function processImage(source, outputDirectory, baseName) {
  if (!fs.existsSync(source)) throw new Error(`Missing source image: ${source}`);

  const variants = [
    { suffix: '900', width: 900, quality: 82 },
    { suffix: '1800', width: 1800, quality: 88 },
  ];

  await Promise.all(variants.map(({ suffix, width, quality }) => (
    writeVariant(source, path.join(outputDirectory, `${baseName}-${suffix}.webp`), width, quality)
  )));
}

async function processProject(project) {
  const sourceDirectory = path.join(sourceRoot, ...project.directory);
  const outputDirectory = path.join(outputRoot, project.slug);
  fs.mkdirSync(outputDirectory, { recursive: true });

  await processImage(path.join(sourceDirectory, project.cover), outputDirectory, 'cover');
  for (let index = 0; index < project.gallery.length; index += 1) {
    await processImage(
      path.join(sourceDirectory, project.gallery[index]),
      outputDirectory,
      String(index + 1).padStart(2, '0'),
    );
  }

  return { slug: project.slug, cover: project.cover, images: project.gallery.length };
}

async function processArchive(collection) {
  const sourceDirectory = path.join(sourceRoot, ...collection.directory);
  const outputDirectory = path.join(outputRoot, collection.slug);
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (let index = 0; index < collection.images.length; index += 1) {
    await processImage(
      path.join(sourceDirectory, collection.images[index]),
      outputDirectory,
      String(index + 1).padStart(2, '0'),
    );
  }

  return { slug: collection.slug, images: collection.images.length };
}

async function main() {
  if (!fs.existsSync(sourceRoot)) throw new Error(`Source archive directory does not exist: ${sourceRoot}`);
  fs.mkdirSync(outputRoot, { recursive: true });

  const projects = [];
  for (const project of projectSources) projects.push(await processProject(project));

  const archives = [];
  for (const collection of archiveSources) archives.push(await processArchive(collection));

  process.stdout.write(`${JSON.stringify({ projects, archives }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
