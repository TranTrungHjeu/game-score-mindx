import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SPRITES_DIR = path.join(projectRoot, 'public', 'assets', 'digimon', 'sprites');
const DIM_SPRITES_JSON = path.join(projectRoot, 'src', 'data', 'dim-sprites.json');

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

async function fetchJSON(url, description) {
  console.log(`[Fetch] Đang tải ${description} từ ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Lỗi tải ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function run() {
  console.log('=== BẮT ĐẦU ĐỒNG BỘ TÀI NGUYÊN TỪ DIM.DIGITALLINK.GAMES ===\n');

  // 1. Tải danh mục từ 3 nguồn của dim.digitallink.games/resources?category=digimon
  const [catalog, aderek, community] = await Promise.all([
    fetchJSON(`${BASE_URL}/catalog/card-catalog.json`, 'Official Card Catalog'),
    fetchJSON(`${BASE_URL}/catalog/aderek/manifest.json`, 'Aderek Sprite Manifest'),
    fetchJSON(`${BASE_URL}/api/sprites/catalog`, 'Community Sprite Catalog'),
  ]);

  const uniqueSprites = new Map();

  // Nguồn 1: Thẻ chính thức (card-catalog.json)
  for (const card of catalog.cards || []) {
    for (const ch of card.characters || []) {
      if (ch.name && ch.previewUrl) {
        const slug = slugify(ch.name);
        if (!uniqueSprites.has(slug)) {
          uniqueSprites.set(slug, {
            name: ch.name,
            slug,
            stage: ch.stage,
            remotePath: ch.previewUrl,
            source: 'official-card',
          });
        }
      }
    }
  }

  // Nguồn 2: Aderek manifest
  for (const ch of aderek.characters || []) {
    if (ch.name && ch.previewUrl) {
      const slug = slugify(ch.name);
      if (!uniqueSprites.has(slug)) {
        uniqueSprites.set(slug, {
          name: ch.name,
          slug,
          stage: ch.stage,
          remotePath: ch.previewUrl,
          source: 'aderek-manifest',
        });
      }
    }
  }

  // Nguồn 3: Community sprite catalog
  for (const ch of community.library?.characters || []) {
    if (ch.name && ch.previewUrl) {
      const slug = slugify(ch.name);
      if (!uniqueSprites.has(slug)) {
        uniqueSprites.set(slug, {
          name: ch.name,
          slug,
          stage: ch.stage,
          remotePath: ch.previewUrl,
          source: 'community-gallery',
        });
      }
    }
  }

  console.log(`\n-> Tổng số Digimon sprite duy nhất tìm thấy: ${uniqueSprites.size}`);

  // 2. Xóa sạch thư mục sprite cũ
  console.log(`\n[Clean] Đang làm sạch thư mục sprite cũ: ${SPRITES_DIR}`);
  if (fs.existsSync(SPRITES_DIR)) {
    fs.rmSync(SPRITES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(SPRITES_DIR, { recursive: true });

  // 3. Tải các sprite ảnh PNG về thư mục local với batch concurrency
  console.log(`[Download] Bắt đầu tải ${uniqueSprites.size} ảnh PNG từ dim.digitallink.games...`);

  const spriteList = Array.from(uniqueSprites.values());
  const CONCURRENCY = 25;
  let downloadedCount = 0;
  let failedCount = 0;

  async function downloadSprite(item) {
    const fileUrl = item.remotePath.startsWith('http')
      ? item.remotePath
      : `${BASE_URL}${item.remotePath}`;
    const targetFile = path.join(SPRITES_DIR, `${item.slug}.png`);

    try {
      const res = await fetch(fileUrl);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(targetFile, buffer);
      downloadedCount++;
      if (downloadedCount % 100 === 0 || downloadedCount === spriteList.length) {
        process.stdout.write(`  Đã tải: ${downloadedCount}/${spriteList.length} (${Math.round((downloadedCount / spriteList.length) * 100)}%)\r`);
      }
    } catch (err) {
      console.warn(`\n  [Cảnh báo] Lỗi khi tải ${item.name} (${fileUrl}): ${err.message}`);
      failedCount++;
    }
  }

  for (let i = 0; i < spriteList.length; i += CONCURRENCY) {
    const chunk = spriteList.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(downloadSprite));
  }

  console.log(`\n[Hoàn tất tải ảnh] Thành công: ${downloadedCount}, Lỗi: ${failedCount}`);

  // 4. Sinh file dim-sprites.json mới
  console.log('\n[Map] Đang xây dựng từ điển mapping dim-sprites.json...');
  const mapData = {};

  for (const item of spriteList) {
    const localRelPath = `/assets/digimon/sprites/${item.slug}.png`;
    // Chỉ map nếu file đã được tải thành công
    const filePath = path.join(SPRITES_DIR, `${item.slug}.png`);
    if (fs.existsSync(filePath)) {
      mapData[item.slug] = localRelPath;
      const flat = item.slug.replace(/-/g, '');
      if (flat) mapData[flat] = localRelPath;
      mapData[item.name.toLowerCase()] = localRelPath;
    }
  }

  // Bổ sung các alias tiếng Anh phổ biến (English dub / Anime names) để tương thích 100% với digimon-catalog.ts
  const ALIASES = {
    // Agumon Line
    wargreymon: 'war-greymon',
    metalgreymon: 'metal-greymon-vaccine',
    // Gabumon Line
    weregarurumon: 'were-garurumon',
    metalgarurumon: 'metal-garurumon',
    // Guilmon Line
    growlmon: 'growmon',
    wargrowlmon: 'megalo-growmon',
    gallantmon: 'dukemon',
    dukemon: 'dukemon',
    // Veemon Line
    veemon: 'v-mon',
    'v-mon': 'v-mon',
    exveemon: 'xv-mon',
    'xv-mon': 'xv-mon',
    imperialdramon: 'imperialdramon-dragon-mode',
    'imperialdramon-fighter': 'imperialdramon-fighter-mode',
    'imperialdramon-paladin': 'imperialdramon-paladin-mode',
    // Patamon Line
    holyangemon: 'holy-angemon',
    magnaangemon: 'holy-angemon',
    // Gatomon Line
    salamon: 'plotmon',
    plotmon: 'plotmon',
    gatomon: 'tailmon',
    tailmon: 'tailmon',
    // Tentomon Line
    'atlur-kabuterimon-red': 'atlur-kabuterimon-red',
    heraklekabuterimon: 'herakle-kabuterimon',
    herculeskabuterimon: 'herakle-kabuterimon',
    // Palmon Line
    lillymon: 'lilimon',
    lilimon: 'lilimon',
    // Betamon Line
    megaseadramon: 'mega-seadramon',
    metalseadramon: 'metal-seadramon',
    // Hagurumon Line
    hiandromon: 'hi-andromon',
    // Terriermon Line
    gargomon: 'galgomon',
    galgomon: 'galgomon',
    saintgalgomon: 'saint-galgomon',
    megagargomon: 'saint-galgomon',
  };

  for (const [alias, targetSlug] of Object.entries(ALIASES)) {
    const targetFile = path.join(SPRITES_DIR, `${targetSlug}.png`);
    if (fs.existsSync(targetFile)) {
      mapData[alias] = `/assets/digimon/sprites/${targetSlug}.png`;
      mapData[alias.replace(/-/g, '')] = `/assets/digimon/sprites/${targetSlug}.png`;
    }
  }

  fs.writeFileSync(DIM_SPRITES_JSON, JSON.stringify(mapData, null, 2), 'utf-8');
  console.log(`[Save] Đã lưu ${Object.keys(mapData).length} mục ánh xạ vào ${DIM_SPRITES_JSON}`);

  // 5. Kiểm tra tính toàn vẹn của 12 dòng linh vật trong digimon-catalog
  console.log('\n[Verify] Kiểm tra 12 dòng linh vật cơ bản:');
  const testStages = [
    'Agumon', 'Greymon', 'MetalGreymon', 'WarGreymon',
    'Gabumon', 'Garurumon', 'WereGarurumon', 'MetalGarurumon',
    'Guilmon', 'Growlmon', 'WarGrowlmon', 'Gallantmon',
    'V-mon', 'XV-mon', 'Paildramon', 'Imperialdramon',
    'Patamon', 'Angemon', 'HolyAngemon', 'Seraphimon',
    'Plotmon', 'Tailmon', 'Angewomon', 'Ophanimon',
    'Tentomon', 'Kabuterimon', 'Atlur Kabuterimon (Red)', 'HerakleKabuterimon',
    'Palmon', 'Togemon', 'Lilimon', 'Rosemon',
    'Betamon', 'Seadramon', 'MegaSeadramon', 'MetalSeadramon',
    'Hagurumon', 'Machmon', 'Andromon', 'HiAndromon',
    'Terriermon', 'Galgomon', 'Rapidmon', 'SaintGalgomon',
    'Renamon', 'Kyubimon', 'Taomon', 'Sakuyamon'
  ];

  let missingCount = 0;
  for (const stageName of testStages) {
    const slug = slugify(stageName);
    const flat = slug.replace(/-/g, '');
    const foundPath = mapData[slug] || mapData[flat] || mapData[stageName.toLowerCase()];
    if (foundPath && fs.existsSync(path.join(projectRoot, 'public', foundPath))) {
      // Ok
    } else {
      console.log(`  [!] Chưa tìm thấy sprite cho: ${stageName}`);
      missingCount++;
    }
  }

  if (missingCount === 0) {
    console.log('-> Toàn bộ 48/48 linh vật cốt lõi đều đã có ảnh sprite 100% từ dim.digitallink.games!');
  } else {
    console.log(`-> Còn ${missingCount} linh vật cần bổ sung alias.`);
  }

  console.log('\n=== HOÀN TẤT THÀNH CÔNG ĐỒNG BỘ TÀI NGUYÊN ===');
}

run().catch((err) => {
  console.error('[Error] Lỗi quá trình đồng bộ:', err);
  process.exit(1);
});
