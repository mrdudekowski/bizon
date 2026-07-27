import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve("public");
const source = await readFile(path.join(publicDir, "favicon.svg"));

const faviconSizes = [16, 32, 48];
const faviconPngs = await Promise.all(
  faviconSizes.map(async (size) => {
    const png = await sharp(source)
      .resize(size, size, { fit: "contain" })
      .png()
      .toBuffer();

    await writeFile(path.join(publicDir, `favicon-${size}x${size}.png`), png);
    return { size, png };
  }),
);

async function createAppIcon(filename, size, markScale) {
  const markSize = Math.round(size * markScale);
  const mark = await sharp(source)
    .resize(markSize, markSize, { fit: "contain" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, filename));
}

await Promise.all([
  createAppIcon("apple-touch-icon.png", 180, 0.76),
  createAppIcon("icon-192x192.png", 192, 0.76),
  createAppIcon("icon-512x512.png", 512, 0.76),
  createAppIcon("icon-maskable-192x192.png", 192, 0.6),
  createAppIcon("icon-maskable-512x512.png", 512, 0.6),
]);

const headerSize = 6 + faviconPngs.length * 16;
let dataOffset = headerSize;
const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(faviconPngs.length, 4);

faviconPngs.forEach(({ size, png }, index) => {
  const offset = 6 + index * 16;
  header.writeUInt8(size === 256 ? 0 : size, offset);
  header.writeUInt8(size === 256 ? 0 : size, offset + 1);
  header.writeUInt8(0, offset + 2);
  header.writeUInt8(0, offset + 3);
  header.writeUInt16LE(1, offset + 4);
  header.writeUInt16LE(32, offset + 6);
  header.writeUInt32LE(png.length, offset + 8);
  header.writeUInt32LE(dataOffset, offset + 12);
  dataOffset += png.length;
});

await writeFile(
  path.join(publicDir, "favicon.ico"),
  Buffer.concat([header, ...faviconPngs.map(({ png }) => png)]),
);

console.log("Generated browser, Apple touch, and PWA favicon assets.");
