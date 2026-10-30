import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const ANIMATIONS_DIR = path.join(projectRoot, 'public', 'assets', 'digimon', 'animations');
const ANIMATIONS_JSON = path.join(projectRoot, 'src', 'data', 'dim-animations.json');
const BASE_URL = 'https://dim.digitallink.games';

function slugify(name) {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/[():']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// CRC32 table for PNG & APNG
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function encodePNG(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const rowBytes = width * 4;
  const rawScanlines = Buffer.alloc((rowBytes + 1) * height);
  for (let y = 0; y < height; y++) {
    rawScanlines[y * (rowBytes + 1)] = 0;
    rgbaBuffer.copy(rawScanlines, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes);
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(rawScanlines));
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

function encodeAPNG(width, height, framesRgba, delayMs = 430) {
  if (framesRgba.length <= 1) {
    return encodePNG(width, height, framesRgba[0]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  const ihdr = makeChunk('IHDR', ihdrData);

  const actlData = Buffer.alloc(8);
  actlData.writeUInt32BE(framesRgba.length, 0);
  actlData.writeUInt32BE(0, 4); // 0 = infinite loop
  const actl = makeChunk('acTL', actlData);

  let seq = 0;
  const chunks = [sig, ihdr, actl];

  for (let i = 0; i < framesRgba.length; i++) {
    const fctlData = Buffer.alloc(26);
    fctlData.writeUInt32BE(seq++, 0);
    fctlData.writeUInt32BE(width, 4);
    fctlData.writeUInt32BE(height, 8);
    fctlData.writeUInt32BE(0, 12);
    fctlData.writeUInt32BE(0, 16);
    fctlData.writeUInt16BE(Math.round(delayMs / 10), 20);
    fctlData.writeUInt16BE(100, 22);
    fctlData[24] = 1; // dispose_op: clear to background
    fctlData[25] = 0; // blend_op: overwrite
    chunks.push(makeChunk('fcTL', fctlData));

    const rowBytes = width * 4;
    const rawScanlines = Buffer.alloc((rowBytes + 1) * height);
    const rgba = framesRgba[i];
    for (let y = 0; y < height; y++) {
      rawScanlines[y * (rowBytes + 1)] = 0;
      rgba.copy(rawScanlines, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes);
    }
    const deflated = zlib.deflateSync(rawScanlines);

    if (i === 0) {
      chunks.push(makeChunk('IDAT', deflated));
    } else {
      const fdatData = Buffer.alloc(4 + deflated.length);
      fdatData.writeUInt32BE(seq++, 0);
      deflated.copy(fdatData, 4);
      chunks.push(makeChunk('fdAT', fdatData));
    }
  }

  chunks.push(makeChunk('IEND', Buffer.alloc(0)));
  return Buffer.concat(chunks);
}

function decodeRGB565toRGBA(slice, width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let r = 0; r < width * height; r++) {
    const low = slice[r * 2];
    const high = slice[r * 2 + 1];
    const red = (high & 248) >>> 3;
    const greenCh = (high & 7) << 3 | (low & 224) >>> 5;
    const blue = low & 31;
    const isTransparent = (red === 0 && greenCh === 63 && blue === 0);
    const u = r * 4;
    rgba[u] = Math.floor(red * 255 / 31);
    rgba[u + 1] = Math.floor(greenCh * 255 / 63);
    rgba[u + 2] = Math.floor(blue * 255 / 31);
    rgba[u + 3] = isTransparent ? 0 : 255;
  }
  return rgba;
}

async function run() {
  console.log('=== BẮT ĐẦU TẢI VÀ BÓC TÁCH TOÀN BỘ ANIMATION DIGIMON TỪ DIM.DIGITALLINK.GAMES ===\n');

  if (!fs.existsSync(ANIMATIONS_DIR)) {
    fs.mkdirSync(ANIMATIONS_DIR, { recursive: true });
  }

  // 1. Tải danh mục thẻ card-catalog.json
  const catalogUrl = `${BASE_URL}/catalog/card-catalog.json`;
  console.log(`[Catalog] Đang tải danh mục thẻ từ ${catalogUrl}...`);
  const catalogRes = await fetch(catalogUrl);
  if (!catalogRes.ok) throw new Error(`Lỗi tải catalog: ${catalogRes.status}`);
  const catalog = await catalogRes.json();

  console.log(`[Catalog] Tìm thấy ${catalog.cards?.length || 0} thẻ DIM / BEM.`);

  const processedSlugs = new Set();
  const animationMap = {};

  const CONCURRENCY = 8;
  const cards = (catalog.cards || []).sort((a, b) =>
    a.id === '843b04f90bb09dbd' ? 1 : b.id === '843b04f90bb09dbd' ? -1 : 0
  );

  let completedCards = 0;
  let totalCharactersProcessed = 0;

  async function processCard(card) {
    if (!card.templateUrl) return;

    try {
      const tUrl = `${BASE_URL}${card.templateUrl}`;
      const res = await fetch(tUrl);
      if (!res.ok) return;

      const buf = Buffer.from(await res.arrayBuffer());
      const data = JSON.parse(zlib.gunzipSync(buf).toString('utf-8'));
      if (!data.sprites?.packedPixels || !data.sprites?.entries) return;

      const rawBytes = Buffer.from(data.sprites.packedPixels, 'base64');
      const isBem = data.type === 'BEM';
      const entries = data.sprites.entries;

      let dimPointer = 10;

      for (let chIdx = 0; chIdx < card.characters.length; chIdx++) {
        const ch = card.characters[chIdx];
        if (!ch?.name) continue;

        const slug = slugify(ch.name);
        if (!slug) continue;

        let charEntries = [];
        if (isBem) {
          const start = 54 + chIdx * 14;
          charEntries = entries.slice(start, start + 14);
        } else {
          const count = ch.stage === 0 ? 6 : ch.stage === 1 ? 7 : 14;
          charEntries = entries.slice(dimPointer, dimPointer + count);
          dimPointer += count;
        }

        // Bỏ qua nếu nhân vật này đã được trích xuất animation từ card trước
        if (processedSlugs.has(slug)) continue;

        // Bỏ qua logo (entry 0) và splash art (entry cuối), lấy danh sách animation frames
        const frameEntries = charEntries.slice(1, charEntries.length > 2 ? -1 : undefined)
          .filter(e => e && e.width === 64 && e.height === 56);

        if (frameEntries.length === 0) continue;

        processedSlugs.add(slug);

        const charDir = path.join(ANIMATIONS_DIR, slug);
        if (!fs.existsSync(charDir)) {
          fs.mkdirSync(charDir, { recursive: true });
        }

        // Decode tất cả các frames thành RGBA Buffer
        const decodedFrames = [];
        for (let fIdx = 0; fIdx < frameEntries.length; fIdx++) {
          const fe = frameEntries[fIdx];
          const slice = rawBytes.subarray(fe.byteOffset, fe.byteOffset + fe.byteLength);
          const rgba = decodeRGB565toRGBA(slice, fe.width, fe.height);
          decodedFrames.push(rgba);

          // Lưu frame đơn lẻ
          const framePng = encodePNG(fe.width, fe.height, rgba);
          fs.writeFileSync(path.join(charDir, `frame-${String(fIdx).padStart(2, '0')}.png`), framePng);
        }

        const isBaby = ch.stage < 2;

        // 1. Idle animation (Frame 0 ↔ Frame 1)
        const idleFrames = decodedFrames.length >= 2 ? [decodedFrames[0], decodedFrames[1]] : [decodedFrames[0]];
        const idleApng = encodeAPNG(64, 56, idleFrames, 430);
        fs.writeFileSync(path.join(charDir, 'idle.png'), idleApng);

        // 2. Walk animation
        let walkFrames = [decodedFrames[0]];
        if (isBaby && decodedFrames.length >= 3) {
          walkFrames = [decodedFrames[0], decodedFrames[2]];
        } else if (!isBaby && decodedFrames.length >= 4) {
          walkFrames = [decodedFrames[2], decodedFrames[3]];
        }
        const walkApng = encodeAPNG(64, 56, walkFrames, 430);
        fs.writeFileSync(path.join(charDir, 'walk.png'), walkApng);

        // 3. Attack animation
        let attackFrames = [decodedFrames[0]];
        if (!isBaby && decodedFrames.length >= 11) {
          attackFrames = [decodedFrames[0], decodedFrames[10]];
          if (decodedFrames.length >= 12) attackFrames.push(decodedFrames[11]);
        }
        const attackApng = encodeAPNG(64, 56, attackFrames, 320);
        fs.writeFileSync(path.join(charDir, 'attack.png'), attackApng);

        // 4. Happy / Victory animation
        let happyFrames = [decodedFrames[0]];
        if (isBaby && decodedFrames.length >= 4) {
          happyFrames = [decodedFrames[0], decodedFrames[3]];
        } else if (!isBaby && decodedFrames.length >= 9) {
          happyFrames = [decodedFrames[0], decodedFrames[8]];
        }
        const happyApng = encodeAPNG(64, 56, happyFrames, 430);
        fs.writeFileSync(path.join(charDir, 'happy.png'), happyApng);

        // 5. Sleep frame
        let sleepFrame = decodedFrames[0];
        if (isBaby && decodedFrames.length >= 5) {
          sleepFrame = decodedFrames[4];
        } else if (!isBaby && decodedFrames.length >= 10) {
          sleepFrame = decodedFrames[9];
        }
        const sleepPng = encodePNG(64, 56, sleepFrame);
        fs.writeFileSync(path.join(charDir, 'sleep.png'), sleepPng);

        // Ghi nhận vào bản đồ animation
        const relDir = `/assets/digimon/animations/${slug}`;
        const animEntry = {
          slug,
          name: ch.name,
          stage: ch.stage,
          idle: `${relDir}/idle.png`,
          walk: `${relDir}/walk.png`,
          attack: `${relDir}/attack.png`,
          happy: `${relDir}/happy.png`,
          sleep: `${relDir}/sleep.png`,
          frameCount: decodedFrames.length,
          frames: decodedFrames.map((_, idx) => `${relDir}/frame-${String(idx).padStart(2, '0')}.png`),
        };

        animationMap[slug] = animEntry;
        const flat = slug.replace(/-/g, '');
        if (flat) animationMap[flat] = animEntry;
        animationMap[ch.name.toLowerCase()] = animEntry;

        totalCharactersProcessed++;
      }
    } catch (err) {
      console.warn(`\n  [Cảnh báo] Lỗi khi xử lý thẻ ${card.id}:`, err.message);
    } finally {
      completedCards++;
      process.stdout.write(`  Thẻ đã duyệt: ${completedCards}/${cards.length} | Tổng linh vật đã bóc tách animation: ${totalCharactersProcessed}\r`);
    }
  }

  for (let i = 0; i < cards.length; i += CONCURRENCY) {
    const chunk = cards.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(processCard));
  }

  console.log(`\n\n[Hoàn tất trích xuất] Đã bóc tách thành công animation cho ${processedSlugs.size} linh vật duy nhất!`);

  // Bổ sung các alias tiếng Anh phổ biến
  const ALIASES = {
    wargreymon: 'war-greymon',
    metalgreymon: 'metal-greymon-vaccine',
    weregarurumon: 'were-garurumon',
    metalgarurumon: 'metal-garurumon',
    growlmon: 'growmon',
    wargrowlmon: 'megalo-growmon',
    gallantmon: 'dukemon',
    dukemon: 'dukemon',
    veemon: 'v-mon',
    'v-mon': 'v-mon',
    exveemon: 'xv-mon',
    'xv-mon': 'xv-mon',
    imperialdramon: 'imperialdramon-dragon-mode',
    holyangemon: 'holy-angemon',
    magnaangemon: 'holy-angemon',
    salamon: 'tailmon-child',
    plotmon: 'tailmon-child',
    ophanimon: 'holydramon',
    ofanimon: 'holydramon',
    gatomon: 'tailmon',
    tailmon: 'tailmon',
    heraklekabuterimon: 'herakle-kabuterimon',
    herculeskabuterimon: 'herakle-kabuterimon',
    lillymon: 'lilimon',
    lilimon: 'lilimon',
    megaseadramon: 'mega-seadramon',
    metalseadramon: 'metal-seadramon',
    hiandromon: 'hi-andromon',
    gargomon: 'galgomon',
    galgomon: 'galgomon',
    saintgalgomon: 'saint-galgomon',
    megagargomon: 'saint-galgomon',
  };

  for (const [alias, target] of Object.entries(ALIASES)) {
    if (animationMap[target]) {
      animationMap[alias] = animationMap[target];
      animationMap[alias.replace(/-/g, '')] = animationMap[target];
    }
  }

  fs.writeFileSync(ANIMATIONS_JSON, JSON.stringify(animationMap, null, 2), 'utf-8');
  console.log(`[Save] Đã lưu ${Object.keys(animationMap).length} mục ánh xạ animation vào ${ANIMATIONS_JSON}`);

  // Dọn dẹp file test tạm
  const testFiles = ['public/test-agumon-idle.png', 'public/test-agumon-idle-real.png', 'public/test-agumon-color.png', 'public/test-agumon-truecolor.png'];
  for (const tf of testFiles) {
    if (fs.existsSync(path.join(projectRoot, tf))) {
      fs.unlinkSync(path.join(projectRoot, tf));
    }
  }

  console.log('\n=== HOÀN TẤT THÀNH CÔNG ĐỒNG BỘ ANIMATION DIGIMON ===');
}

run().catch(err => {
  console.error('[Error] Lỗi quá trình bóc tách animation:', err);
  process.exit(1);
});
