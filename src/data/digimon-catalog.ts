import dimSpriteMapData from '@/data/dim-sprites.json';
import dimAnimationsData from '@/data/dim-animations.json';
import type { DigimonElement, EvolutionStage, MascotFamily } from '@/types';

const DIM_SPRITE_MAP: Record<string, string> = dimSpriteMapData as Record<string, string>;

interface DigimonAnimationInfo {
  slug: string;
  name: string;
  stage: number;
  idle: string;
  walk: string;
  attack: string;
  happy: string;
  sleep: string;
  frameCount: number;
  frames: string[];
}

const DIM_ANIMATIONS_MAP: Record<string, DigimonAnimationInfo> = dimAnimationsData as Record<string, DigimonAnimationInfo>;

export const ELEMENT_CONFIG: Record<DigimonElement, { label: string; icon: string; color: string; bg: string }> = {
  fire: { label: 'Fire', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
  ice: { label: 'Ice', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
  machine: { label: 'Machine', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
  electric: { label: 'Electric', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
  holy: { label: 'Holy', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
  nature: { label: 'Nature', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
  warrior: { label: 'Warrior', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
  dark: { label: 'Dark', icon: '', color: 'var(--text-main)', bg: 'rgba(255, 255, 255, 0.06)' },
};

export function getLocalDigimonSprite(name: string): string {
  if (!name) return '/assets/digimon/sprites/agumon.png';
  const clean = name.trim();
  const slug = clean
    .toLowerCase()
    .replace(/[():]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (slug === 'plotmon' || slug === 'salamon') {
    return '/assets/digimon/sprites/tailmon-child.png';
  }
  if (slug === 'betelgammamon' || slug === 'betel-gammamon') {
    return '/assets/digimon/animations/betel-gammamon/idle.png';
  }
  if (slug === 'megakabuterimon' || slug === 'atlurkabuterimon') {
    return '/assets/digimon/animations/atlur-kabuterimon-red/idle.png';
  }
  if (slug === 'blackagumon') {
    return DIM_SPRITE_MAP['agumon-black'] || '/assets/digimon/animations/agumon-black/idle.png';
  }
  if (slug === 'blackgabumon') {
    return DIM_SPRITE_MAP['gabumon-black'] || '/assets/digimon/animations/gabumon-black/idle.png';
  }
  if (slug === 'shinegreymon') {
    return DIM_SPRITE_MAP['shine-greymon'] || '/assets/digimon/animations/shine-greymon/idle.png';
  }
  if (slug === 'vdramon') {
    return DIM_SPRITE_MAP['v-dramon'] || '/assets/digimon/animations/v-dramon/idle.png';
  }
  if (slug === 'belialvamdemon') {
    return DIM_SPRITE_MAP['belial-vamdemon'] || '/assets/digimon/animations/belial-vamdemon/idle.png';
  }
  if (slug === 'falcomon') return DIM_SPRITE_MAP['falcomon-2006'] || '/assets/digimon/animations/falcomon-2006/idle.png';
  if (slug === 'armadillomon') return DIM_SPRITE_MAP['armadimon'] || '/assets/digimon/animations/armadimon/idle.png';
  if (slug === 'snowgoblimon') return DIM_SPRITE_MAP['snow-goblimon'] || '/assets/digimon/animations/snow-goblimon/idle.png';
  if (slug === 'gomamon') return '/assets/digimon/sprites/gomamon.png';
  if (slug === 'elecmon') return '/assets/digimon/sprites/elecmon.png';
  if (slug === 'kotemon') return '/assets/digimon/sprites/kotemon.png';
  if (slug === 'candlemon') return '/assets/digimon/sprites/candlemon.png';
  if (slug === 'labramon') return '/assets/digimon/sprites/labramon.png';
  if (slug === 'bakemon') return '/assets/digimon/sprites/bakemon.png';
  if (slug === 'hanumon') return '/assets/digimon/sprites/hanumon.png';

  if (slug === 'digitama' || slug === 'egg' || slug === 'trung' || slug === 'trung-digitama') {
    return '/assets/digimon/sprites/digitama.png';
  }

  if (DIM_SPRITE_MAP[slug]) return DIM_SPRITE_MAP[slug];

  const flat = slug.replace(/-/g, '');
  if (DIM_SPRITE_MAP[flat]) return DIM_SPRITE_MAP[flat];

  const lower = clean.toLowerCase();
  if (DIM_SPRITE_MAP[lower]) return DIM_SPRITE_MAP[lower];

  return `/assets/digimon/sprites/${slug}.png`;
}

export function getDigimonAnimation(
  name: string,
  action: 'idle' | 'attack' | 'happy' | 'walk' | 'sleep' = 'idle'
): string {
  if (!name) return '/assets/digimon/sprites/agumon.png';
  let clean = name.trim();
  const lower = clean.toLowerCase();
  if (lower === 'digitama' || lower === 'egg' || lower === 'trung' || lower === 'trung-digitama') {
    return '/assets/digimon/sprites/digitama.png';
  }
  if (lower === 'megakabuterimon') clean = 'atlur-kabuterimon-red';
  else if (lower === 'plotmon') clean = 'tailmon-child';
  else if (lower === 'betelgammamon') clean = 'betel-gammamon';
  else if (lower === 'blackagumon') clean = 'agumon-black';
  else if (lower === 'blackgabumon') clean = 'gabumon-black';
  else if (lower === 'shinegreymon') clean = 'shine-greymon';
  else if (lower === 'vdramon') clean = 'v-dramon';
  else if (lower === 'belialvamdemon') clean = 'belial-vamdemon';
  else if (lower === 'falcomon') clean = 'falcomon-2006';
  else if (lower === 'armadillomon') clean = 'armadimon';
  else if (lower === 'snowgoblimon') clean = 'snow-goblimon';

  const slug = clean
    .toLowerCase()
    .replace(/[():]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const anim =
    DIM_ANIMATIONS_MAP[slug] ||
    DIM_ANIMATIONS_MAP[slug.replace(/-/g, '')] ||
    DIM_ANIMATIONS_MAP[clean.toLowerCase()];

  if (anim && anim[action]) {
    return anim[action];
  }
  if (anim && anim.idle) {
    return anim.idle;
  }
  return getLocalDigimonSprite(name);
}

export function buildDigimonArtwork(name: string): string {
  return getLocalDigimonSprite(name);
}

export function buildDigimonAnimated(name: string): string {
  return getDigimonAnimation(name, 'idle');
}

export const DIGITAMA_STAGE: EvolutionStage = {
  id: 0,
  name: 'Digitama',
  stageName: 'Egg',
  artworkPath: '/assets/digimon/sprites/digitama.png',
  animatedPath: '/assets/digimon/sprites/digitama.png',
  summary: 'Digitama đang chờ năng lượng tích cực để nở thành Digimon.',
};

export function getFullEvolutionChain(family: MascotFamily): EvolutionStage[] {
  if (!family) return [];
  const stages: EvolutionStage[] = [];
  if (family.babyStage) {
    stages.push(family.babyStage);
  }
  if (family.evolutionChain && family.evolutionChain.length > 0) {
    stages.push(...family.evolutionChain);
  }
  if (family.megaForms && family.megaForms.length > 0) {
    stages.push(...family.megaForms);
  }
  if (family.ultraStage) {
    stages.push(family.ultraStage);
  }
  return stages;
}

export function getEvolutionMilestones(stagesCount: number, maxTarget: number = 20): number[] {
  if (stagesCount <= 1) return [0];
  const milestones: number[] = [0];
  for (let k = 1; k < stagesCount; k++) {
    const target = Math.round((k / (stagesCount - 1)) * maxTarget);
    milestones.push(target);
  }
  return milestones;
}

export function getStageForScore(
  family: MascotFamily,
  score: number,
  isEgg: boolean = false,
  maxTarget: number = 20
): {
  stage: EvolutionStage;
  level: number;
  nextStage: EvolutionStage | null;
  nextMilestone: number | null;
  milestones: number[];
  stages: EvolutionStage[];
} {
  const stages = getFullEvolutionChain(family);
  const milestones = getEvolutionMilestones(stages.length, maxTarget);

  if (isEgg || score < 0) {
    return {
      stage: DIGITAMA_STAGE,
      level: 0,
      nextStage: stages[0] || null,
      nextMilestone: milestones[1] || 1,
      milestones,
      stages,
    };
  }

  let activeIndex = 0;
  for (let i = 0; i < milestones.length; i++) {
    if (score >= milestones[i]) {
      activeIndex = i;
    } else {
      break;
    }
  }

  const nextIndex = activeIndex < stages.length - 1 ? activeIndex + 1 : null;

  return {
    stage: stages[activeIndex] || stages[0] || DIGITAMA_STAGE,
    level: activeIndex + 1,
    nextStage: nextIndex !== null ? stages[nextIndex] : null,
    nextMilestone: nextIndex !== null ? milestones[nextIndex] : null,
    milestones,
    stages,
  };
}

function makeStage(
  id: number,
  name: string,
  stageName: 'Egg' | 'Baby' | 'Rookie' | 'Champion' | 'Ultimate' | 'Mega' | 'Ultra',
  summary: string,
  variant?: 'x' | 'y' | null,
): EvolutionStage {
  return {
    id,
    name,
    stageName,
    artworkPath: buildDigimonArtwork(name),
    animatedPath: buildDigimonAnimated(name),
    summary,
    variant: variant ?? null,
  };
}

export const DIGIMON_FAMILIES: MascotFamily[] = [
  // 1. Agumon Line
  {
    id: 'digimon-agumon',
    name: 'Agumon',
    element: 'fire',
    elementLabel: 'Lửa & Rồng Chiến',
    accent: '#E31F26',
    secondary: '#ffe4e6',
    description: 'Agumon -> Greymon -> MetalGreymon -> WarGreymon -> Omegamon.',
    babyStage: makeStage(1, 'Koromon', 'Baby', 'Koromon bóng hồng tai dài tinh nghịch bắn bong bóng bọt khí.'),
    evolutionChain: [
      makeStage(2, 'Agumon', 'Rookie', 'Agumon mầm non dũng cảm với tuyệt chiêu Pepper Breath rực lửa.'),
      makeStage(3, 'Greymon', 'Champion', 'Greymon khủng long bọc sọ xương phun Mega Flame thiêu đốt mục tiêu.'),
      makeStage(4, 'MetalGreymon', 'Ultimate', 'MetalGreymon nửa cơ khí nửa sinh học với cánh laser và tên lửa Giga.'),
    ],
    megaForms: [
      makeStage(5, 'WarGreymon', 'Mega', 'WarGreymon Hiệp Sĩ Rồng Hoàng Gia tối thượng giáp Chrome Digizoid và Dramon Killer.', 'x'),
    ],
    ultraStage: makeStage(6, 'Omegamon', 'Ultra', 'Omegamon Kỵ Sĩ Hoàng Gia Tối Thượng kết hợp Grey Sword và Garuru Cannon.', 'x'),
  },

  // 2. Gabumon Line
  {
    id: 'digimon-gabumon',
    name: 'Gabumon',
    element: 'ice',
    elementLabel: 'Băng & Dã Thú',
    accent: '#38bdf8',
    secondary: '#e0f2fe',
    description: 'Gabumon -> Garurumon -> WereGarurumon -> MetalGarurumon -> Omegamon.',
    babyStage: makeStage(7, 'Tsunomon', 'Baby', 'Tsunomon bóng cam có sừng nhút nhát và trung thành tuyệt đối.'),
    evolutionChain: [
      makeStage(8, 'Gabumon', 'Rookie', 'Gabumon nhút nhát khoác áo da sói Garurumon với đòn Petit Fire xanh lam.'),
      makeStage(9, 'Garurumon', 'Champion', 'Garurumon mãnh thú tuyết trắng bờm xanh lao nhanh như bão tuyết Fox Fire.'),
      makeStage(10, 'WereGarurumon', 'Ultimate', 'WereGarurumon sói đứng chiến binh cước đá Wolf Claw xé toạc không gian.'),
    ],
    megaForms: [
      makeStage(11, 'MetalGarurumon', 'Mega', 'MetalGarurumon sói thép vũ trang toàn diện laser đóng băng Cocytus Breath.', 'x'),
    ],
    ultraStage: makeStage(12, 'Omegamon', 'Ultra', 'Omegamon Kỵ Sĩ Hoàng Gia Tối Thượng bảo vệ trật tự hòa bình thế giới số.', 'x'),
  },

  // 3. Guilmon Line
  {
    id: 'digimon-guilmon',
    name: 'Guilmon',
    element: 'fire',
    elementLabel: 'Lửa & Rồng Chiến',
    accent: '#ef4444',
    secondary: '#fee2e2',
    description: 'Guilmon -> Growlmon -> WarGrowlmon -> Gallantmon -> Crimson Mode.',
    babyStage: makeStage(13, 'Gigimon', 'Baby', 'Gigimon rồng đỏ ấu thơ tinh nghịch với đôi tai dài và răng nanh nhỏ.'),
    evolutionChain: [
      makeStage(14, 'Guilmon', 'Rookie', 'Guilmon rồng con đỏ tinh nghịch mang ký hiệu Digital Hazard trên ngực.'),
      makeStage(15, 'Growlmon', 'Champion', 'Growlmon rồng trưởng thành móng vuốt Plasma cất tiếng gầm xé rách màn đêm.'),
      makeStage(16, 'WarGrowlmon', 'Ultimate', 'WarGrowlmon nửa cơ giới trang bị đại bác nguyên tử Atomic Blaster cực mạnh.'),
    ],
    megaForms: [
      makeStage(17, 'Gallantmon', 'Mega', 'Gallantmon Thánh Hiệp Sĩ giáp bạc khiên Aegis và trường thương Gram cứu rỗi thế giới.', 'x'),
    ],
    ultraStage: makeStage(18, 'Dukemon-Crimson-Mode', 'Ultra', 'Gallantmon Crimson Mode thức tỉnh giáp đỏ cánh sáng vung gậy thần Gungnir vô song.', 'x'),
  },

  // 4. Veemon Line
  {
    id: 'digimon-veemon',
    name: 'Veemon',
    element: 'warrior',
    elementLabel: 'Hiệp Sĩ & Kiếm Đạo',
    accent: '#2563eb',
    secondary: '#dbeafe',
    description: 'Veemon -> ExVeemon -> Paildramon -> Imperialdramon -> Paladin Mode.',
    babyStage: makeStage(19, 'Chibimon', 'Baby', 'Chibimon rồng xanh nhỏ nhảy nhót vui tươi với lòng dũng cảm cổ đại.'),
    evolutionChain: [
      makeStage(20, 'V-mon', 'Rookie', 'Veemon rồng xanh năng động với cú húc đầu V-mon Headbutt làm choáng kẻ thù.'),
      makeStage(21, 'XV-mon', 'Champion', 'ExVeemon rồng cơ bắp có chữ X rực sáng trên ngực, vỗ cánh phóng laser X-Laser.'),
      makeStage(22, 'Paildramon', 'Ultimate', 'Paildramon hợp thể long nhân súng máy đôi hông nã liên hồi Desperado Blaster.'),
    ],
    megaForms: [
      makeStage(23, 'Imperialdramon', 'Mega', 'Imperialdramon Hoàng Đế Rồng Cổ Đại chuyển dịch sang chế độ Chiến Binh Paladin Mode vĩ đại.', 'x'),
    ],
    ultraStage: makeStage(24, 'Imperialdramon-Paladin-Mode', 'Ultra', 'Imperialdramon Paladin Mode Kỵ Sĩ Sáng Lập vung thánh kiếm Omni Sword tráng lệ.', 'x'),
  },

  // 5. Patamon Line
  {
    id: 'digimon-patamon',
    name: 'Patamon',
    element: 'holy',
    elementLabel: 'Thiên Thần & Thánh',
    accent: '#ec4899',
    secondary: '#fce7f3',
    description: 'Patamon -> Angemon -> MagnaAngemon -> Seraphimon.',
    babyStage: makeStage(25, 'Tokomon', 'Baby', 'Tokomon sinh vật thiên thần ấu thơ đáng yêu với hàm răng sắc bén.'),
    evolutionChain: [
      makeStage(26, 'Patamon', 'Rookie', 'Patamon sinh vật cánh tai dễ thương bắn bong bóng khí Air Shot bảo vệ bạn bè.'),
      makeStage(27, 'Angemon', 'Champion', 'Angemon thiên thần sáu cánh thuần khiết vung trượng vàng thánh kiếm Heavens Knuckle.'),
      makeStage(28, 'HolyAngemon', 'Ultimate', 'MagnaAngemon Đại Thiên Thần tám cánh kiếm laser Excalibur mở Cổng Thiên Đàng.'),
    ],
    megaForms: [
      makeStage(29, 'Seraphimon', 'Mega', 'Seraphimon Thiên Thần Tối Cao thống lĩnh mười cánh vàng rực rỡ trừng phạt tà ma.', 'x'),
    ],
  },

  // 6. Gatomon Line
  {
    id: 'digimon-gatomon',
    name: 'Plotmon (Gatomon)',
    element: 'holy',
    elementLabel: 'Thiên Thần & Thánh',
    accent: '#f43f5e',
    secondary: '#ffe4e6',
    description: 'Salamon -> Gatomon -> Angewomon -> Ophanimon.',
    babyStage: makeStage(30, 'Nyaromon', 'Baby', 'Nyaromon mèo con đuôi sọc nhỏ nhắn mang năng lượng thánh thiện bình an.'),
    evolutionChain: [
      makeStage(31, 'Plotmon', 'Rookie', 'Salamon cún con thánh thiện tai rủ với tiếng sủa Puppy Howling cảm hóa lòng người.'),
      makeStage(32, 'Tailmon', 'Champion', 'Gatomon mèo mang găng móng vuốt SaberLeomon và chiếc nhẫn thánh Holy Ring linh thiêng.'),
      makeStage(33, 'Angewomon', 'Ultimate', 'Angewomon Nữ Thần Ánh Sáng tám cánh giương cung ánh sáng Holy Arrow thanh tẩy bóng tối.'),
    ],
    megaForms: [
      makeStage(34, 'Ophanimon', 'Mega', 'Ophanimon Nữ Thánh Đại Thiên Thần bảo vệ trật tự Digital World với ngọn giáo Sefirot Crystal.', 'x'),
    ],
  },

  // 7. Tentomon Line
  {
    id: 'digimon-tentomon',
    name: 'Tentomon',
    element: 'electric',
    elementLabel: 'Côn Trùng & Sấm',
    accent: '#eab308',
    secondary: '#fef9c3',
    description: 'Tentomon -> Kabuterimon -> MegaKabuterimon -> HerakleKabuterimon -> TyrantKabuterimon.',
    evolutionChain: [
      makeStage(35, 'Tentomon', 'Rookie', 'Tentomon bọ đỏ thông thái bắn tia điện tích Petit Thunder từ đôi cánh sau.'),
      makeStage(36, 'Kabuterimon', 'Champion', 'Kabuterimon bọ hung khổng lồ phóng cầu sét hủy diệt Mega Blaster từ đôi sừng kiên cố.'),
      makeStage(37, 'MegaKabuterimon', 'Ultimate', 'MegaKabuterimon bọ sừng đỏ giáp titan giáng sấm sét Horn Buster nghiền nát vật cản.'),
    ],
    megaForms: [
      makeStage(38, 'HerakleKabuterimon', 'Mega', 'HerculesKabuterimon Hoàng Đế Côn Trùng bọc giáp hoàng kim kết hợp sức mạnh tối thượng.', 'x'),
    ],
    ultraStage: makeStage(39, 'Tyrant-Kabuterimon', 'Ultra', 'TyrantKabuterimon Bọ Hung Chúa Tể Thép Đen thống trị toàn bộ quân đoàn côn trùng.', 'x'),
  },

  // 8. Palmon Line
  {
    id: 'digimon-palmon',
    name: 'Palmon',
    element: 'nature',
    elementLabel: 'Tự Nhiên & Rừng',
    accent: '#22c55e',
    secondary: '#dcfce7',
    description: 'Palmon -> Togemon -> Lillymon -> Rosemon.',
    babyStage: makeStage(40, 'Tanemon', 'Baby', 'Tanemon mầm cây xanh nở nụ xinh xắn hấp thụ ánh sáng mặt trời.'),
    evolutionChain: [
      makeStage(41, 'Palmon', 'Rookie', 'Palmon đóa hoa nở trên đầu phóng dây gai Poison Ivy quấn chặt kẻ xấu.'),
      makeStage(42, 'Togemon', 'Champion', 'Togemon xương rồng đeo găng đấm bốc tung cú đấm ngàn gai Needle Spray liên thanh.'),
      makeStage(43, 'Lilimon', 'Ultimate', 'Lillymon Tinh Linh Hoa Cỏ nhỏ nhắn bắn pháo hoa đại bác cánh hoa Flower Cannon lộng lẫy.'),
    ],
    megaForms: [
      makeStage(44, 'Rosemon', 'Mega', 'Rosemon Nữ Hoàng Các Loài Hoa kiêu sa roi gai hoa hồng Thorn Whipping quyến rũ vương giả.', 'x'),
    ],
  },

  // 9. Betamon Line
  {
    id: 'digimon-betamon',
    name: 'Betamon',
    element: 'ice',
    elementLabel: 'Băng & Biển Cả',
    accent: '#06b6d4',
    secondary: '#cffafe',
    description: 'Puyomon -> Betamon -> Seadramon -> MegaSeadramon -> MetalSeadramon -> RustTyranomon.',
    babyStage: makeStage(441, 'Puyomon', 'Baby', 'Puyomon giọt nước ấu thơ bơi lội mềm mại mang mầm sống biển sâu.'),
    evolutionChain: [
      makeStage(45, 'Betamon', 'Rookie', 'Betamon thủy quái vây đỏ hiền hòa với đòn phóng điện tích Dengeki Biri Biri.'),
      makeStage(46, 'Seadramon', 'Champion', 'Seadramon rồng biển băng giá uốn lượn phóng tên băng Ice Arrow xuyên thủng phòng tuyến.'),
      makeStage(47, 'MegaSeadramon', 'Ultimate', 'MegaSeadramon long vương mang sừng sấm sét giáng cuồng phong sấm sét Mailstrom.'),
    ],
    megaForms: [
      makeStage(48, 'MetalSeadramon', 'Mega', 'MetalSeadramon Rồng Biển Thép Tối Thượng bọc giáp vàng phóng chùm tia Ultimate Stream.', 'x'),
    ],
    ultraStage: makeStage(49, 'RustTyranomon', 'Ultra', 'RustTyranomon Khủng Long Thép Hủy Diệt sở hữu đại bác hạt nhân Terrors Cluster hủy diệt.', 'x'),
  },

  // 10. Hagurumon Line
  {
    id: 'digimon-hagurumon',
    name: 'Hagurumon',
    element: 'machine',
    elementLabel: 'Robot & Cơ Khí',
    accent: '#64748b',
    secondary: '#f1f5f9',
    description: 'Hagurumon -> Machmon -> Andromon -> HiAndromon -> Mugendramon.',
    evolutionChain: [
      makeStage(50, 'Hagurumon', 'Rookie', 'Hagurumon bánh răng đồng hồ xoay tít phóng răng cưa Darkness Gear điều khiển thiết bị.'),
      makeStage(51, 'Machmon', 'Champion', 'Machmon chiến xa bánh xích bọc thép động cơ phản lực lao điên cuồng phá vỡ chướng ngại.'),
      makeStage(52, 'Andromon', 'Ultimate', 'Andromon Chiến Binh Cyborg hoàn hảo kiếm xoay tay phải Spiral Sword cắt vụn kim loại.'),
    ],
    megaForms: [
      makeStage(53, 'HiAndromon', 'Mega', 'HiAndromon Robot Cải Tiến Tối Hậu bọc thép mạ cờ-rôm tia chớp hạt nhân Atomic Ray.', 'x'),
    ],
    ultraStage: makeStage(54, 'Mugendramon', 'Ultra', 'Mugendramon Cỗ Máy Hủy Diệt 100% cơ khí hóa với song pháo Mugen Cannon tàn phá.', 'x'),
  },

  // 11. Terriermon Line
  {
    id: 'digimon-terriermon',
    name: 'Terriermon',
    element: 'electric',
    elementLabel: 'Côn Trùng & Sấm',
    accent: '#10b981',
    secondary: '#d1fae5',
    description: 'Terriermon -> Gargomon -> Rapidmon -> MegaGargomon.',
    babyStage: makeStage(55, 'Gummymon', 'Baby', 'Gummymon thỏ kẹo ngọt dẻo dai một sừng vui tươi lạc quan.'),
    evolutionChain: [
      makeStage(56, 'Terriermon', 'Rookie', 'Terriermon thỏ trắng tai dài xoay tròn bay lượn tạo lốc xoáy Terrier Tornado đáng yêu.'),
      makeStage(57, 'Galgomon', 'Champion', 'Gargomon thợ săn quần jean xanh hai tay trang bị súng máy liên thanh DumDum Upper.'),
      makeStage(58, 'Rapidmon', 'Ultimate', 'Rapidmon Kỵ Sĩ Bọc Giáp Tốc Độ Ánh Sáng lao vun vút phóng tên lửa Rapid Fire chính xác.'),
    ],
    megaForms: [
      makeStage(59, 'SaintGalgomon', 'Mega', 'MegaGargomon Pháo Đài Thép Khổng Lồ kho vũ khí di động Giant Missile chấn động địa cầu.', 'x'),
    ],
  },

  // 12. Renamon Line
  {
    id: 'digimon-renamon',
    name: 'Renamon',
    element: 'dark',
    elementLabel: 'Bóng Tối & Virus',
    accent: '#a855f7',
    secondary: '#f3e8ff',
    description: 'Renamon -> Kyubimon -> Taomon -> Sakuyamon -> Kuzuhamon.',
    babyStage: makeStage(60, 'Pokomon', 'Baby', 'Pokomon tiểu hồ ly ấu thơ lông vàng mang linh khí âm dương thanh tịnh.'),
    evolutionChain: [
      makeStage(61, 'Renamon', 'Rookie', 'Renamon hồ ly vàng thoắt ẩn thoắt hiện phóng ngàn phi tiêu lá cây Koyousetsu.'),
      makeStage(62, 'Kyubimon', 'Champion', 'Kyubimon cửu vĩ hồ thần thông chín đuôi bốc ngọn lửa xanh ma trắc Koenra.'),
      makeStage(63, 'Taomon', 'Ultimate', 'Taomon đạo sĩ âm dương vung bút lông vẽ phù chú phong ấn Bonhitsusen trấn áp tà khí.'),
    ],
    megaForms: [
      makeStage(64, 'Sakuyamon', 'Mega', 'Sakuyamon Nữ Phù Thủy Đền Thờ gậy thần Kim Cang Kongo Shakujo triệu hồi bốn linh thú hộ mệnh.', 'x'),
    ],
    ultraStage: makeStage(65, 'Kuzuhamon', 'Ultra', 'Kuzuhamon Thần Nữ Âm Dương Phù Thủy tối thượng điều khiển ma pháp cấm thuật huyền bí.', 'x'),
  },

  // 13. Piyomon Line
  {
    id: 'digimon-piyomon',
    name: 'Piyomon',
    element: 'fire',
    elementLabel: 'Lửa & Phi Điểu',
    accent: '#f97316',
    secondary: '#ffedd5',
    description: 'Piyomon -> Birdramon -> Garudamon -> Hououmon.',
    babyStage: makeStage(66, 'Pyocomon', 'Baby', 'Pyocomon mầm hoa cánh hồng nhảy nhót linh hoạt trên thảo nguyên.'),
    evolutionChain: [
      makeStage(67, 'Piyomon', 'Rookie', 'Piyomon chim con cánh hồng với chiêu thức Magical Fire sưởi ấm và bảo vệ đồng đội.'),
      makeStage(68, 'Birdramon', 'Champion', 'Birdramon phượng hoàng lửa sải cánh rực rỡ gầm vang đòn Meteor Wing rực cháy.'),
      makeStage(69, 'Garudamon', 'Ultimate', 'Garudamon điểu nhân chiến binh sải cánh bóng đêm giáng đòn Shadow Wing xé toạc bầu trời.'),
    ],
    megaForms: [
      makeStage(70, 'Hououmon', 'Mega', 'Hououmon Phượng Hoàng Hoàng Kim thần thánh bốn cánh dát vàng Starlight Explosion.', 'x'),
    ],
  },

  // 14. Sangomon Line
  {
    id: 'digimon-sangomon',
    name: 'Sangomon',
    element: 'ice',
    elementLabel: 'Băng & Biển Sâu',
    accent: '#0284c7',
    secondary: '#e0f2fe',
    description: 'Sangomon -> Tobiumon -> Gusokumon -> Regalecusmon.',
    babyStage: makeStage(71, 'Puyoyomon', 'Baby', 'Puyoyomon giọt nước biển trong suốt lơ lửng khám phá đáy đại dương sâu thẳm.'),
    evolutionChain: [
      makeStage(72, 'Sangomon', 'Rookie', 'Sangomon san hô biển đáng yêu phun bong bóng nước Coral Bubble xua tan hiểm nguy.'),
      makeStage(73, 'Tobiumon', 'Champion', 'Tobiumon cá chuồn rẽ sóng lướt nhanh như bay phóng vây nước Flying Fin.'),
      makeStage(74, 'Gusokumon', 'Ultimate', 'Gusokumon giáp xác cổ đại bọc vỏ thép siêu cứng phản kích sấm sét đáy biển.'),
    ],
    megaForms: [
      makeStage(75, 'Regalecusmon', 'Mega', 'Regalecusmon Hoàng Đế Cá Rồng biển sâu vung kiếm đinh ba Brionic Burst trảm sóng.', 'x'),
    ],
  },

  // 15. Wormmon Line
  {
    id: 'digimon-wormmon',
    name: 'Wormmon',
    element: 'nature',
    elementLabel: 'Tự Nhiên & Côn Trùng',
    accent: '#16a34a',
    secondary: '#dcfce7',
    description: 'Wormmon -> Stingmon -> Jewelbeemon -> BanchoStingmon.',
    babyStage: makeStage(76, 'Minomon', 'Baby', 'Minomon sâu bọc kén đu đưa theo gió kiên nhẫn tích tụ sức sống dồi dào.'),
    evolutionChain: [
      makeStage(77, 'Wormmon', 'Rookie', 'Wormmon sâu xanh tình cảm và kiên trì phun tơ Sticky Net khống chế mục tiêu.'),
      makeStage(78, 'Stingmon', 'Champion', 'Stingmon sát thủ côn trùng bay lượn chớp nhoáng với mũi kim nhọn Spiking Finish.'),
      makeStage(79, 'Jewelbeemon', 'Ultimate', 'Jewelbeemon dũng sĩ bọ ngọc cánh lấp lánh như ngọc quý vung trượng Shot Claw.'),
    ],
    megaForms: [
      makeStage(80, 'BanchoStingmon', 'Mega', 'BanchoStingmon Đại Ca Côn Trùng kiêu hãnh với đôi kiếm gai nhọn Bloody Finish.', 'x'),
    ],
  },

  // 16. Pulsemon Line
  {
    id: 'digimon-pulsemon',
    name: 'Pulsemon',
    element: 'electric',
    elementLabel: 'Sấm Sét & Năng Động',
    accent: '#eab308',
    secondary: '#fef9c3',
    description: 'Pulsemon -> Bulkmon -> Boutmon -> Kazuchimon -> Achillesmon.',
    babyStage: makeStage(81, 'Bibimon', 'Baby', 'Bibimon xung điện nhỏ bé tràn đầy năng lượng nhảy nhót không ngừng.'),
    evolutionChain: [
      makeStage(82, 'Pulsemon', 'Rookie', 'Pulsemon tia chớp năng động sạc đầy xung nhịp Electro Rush bứt tốc.'),
      makeStage(83, 'Bulkmon', 'Champion', 'Bulkmon đô vật thể lực phi thường tung cú đấm sấm sét Thunder Fist chấn động.'),
      makeStage(84, 'Boutmon', 'Ultimate', 'Boutmon võ sĩ đai đen cước pháp sấm rền Raikousen vô ảnh cước.'),
    ],
    megaForms: [
      makeStage(85, 'Kazuchimon', 'Mega', 'Kazuchimon Lôi Thần Kiếm Khách song kiếm sấm sét Shiden Kousen trảm phá không gian.', 'x'),
    ],
    ultraStage: makeStage(86, 'Achillesmon', 'Ultra', 'Achillesmon Chiến Thần Tốc Độ Bất Tử với cước bộ xé toạc âm thanh bão táp.', 'x'),
  },

  // 17. Gammamon Line
  {
    id: 'digimon-gammamon',
    name: 'Gammamon',
    element: 'fire',
    elementLabel: 'Lửa & Bạch Long',
    accent: '#ef4444',
    secondary: '#fee2e2',
    description: 'Gammamon -> BetelGammamon -> Canoweissmon -> Siriusmon -> Proximamon.',
    babyStage: makeStage(87, 'Gurimon', 'Baby', 'Gurimon tiểu long thú ba sừng nhỏ thích ăn kẹo ngọt và sưởi nắng.'),
    evolutionChain: [
      makeStage(88, 'Gammamon', 'Rookie', 'Gammamon rồng trắng nhỏ ba sừng đáng yêu bắn cầu lửa Horn Attack bùng nổ.'),
      makeStage(89, 'BetelGammamon', 'Champion', 'BetelGammamon dạng rồng lửa đỏ quyền cước Sol Blow uy lực cuộn trào.'),
      makeStage(90, 'Canoweissmon', 'Ultimate', 'Canoweissmon bạch long bốn cánh uy nghi phóng đại bác rồng lửa Gallia Fissure.'),
    ],
    megaForms: [
      makeStage(91, 'Siriusmon', 'Mega', 'Siriusmon Thiên Lang Kỵ Sĩ song thương photon vạch sáng bầu trời sao.', 'x'),
    ],
    ultraStage: makeStage(92, 'Proximamon', 'Ultra', 'Proximamon Thần Tinh Tú Hủy Diệt Và Sáng Tạo nắm giữ quyền năng vũ trụ tối thượng.', 'x'),
  },

  // 18. Hackmon Line
  {
    id: 'digimon-hackmon',
    name: 'Hackmon',
    element: 'warrior',
    elementLabel: 'Hiệp Sĩ Hoàng Gia',
    accent: '#f59e0b',
    secondary: '#fef3c7',
    description: 'Hackmon -> BaoHackmon -> SaviorHackmon -> Jesmon.',
    evolutionChain: [
      makeStage(93, 'Hackmon', 'Rookie', 'Hackmon rồng nhỏ mang áo choàng đỏ rèn luyện gian khổ cùng tuyệt kỹ Fif Slash.'),
      makeStage(94, 'BaoHackmon', 'Champion', 'BaoHackmon kiếm sĩ rồng tôi luyện ý chí vững chãi với chiêu Teen Ram.'),
      makeStage(95, 'SaviorHackmon', 'Ultimate', 'SaviorHackmon rồng cứu thế lưỡi đao chân sắc bén xoay vòng Rage Stern.'),
    ],
    megaForms: [
      makeStage(96, 'Jesmon', 'Mega', 'Jesmon Hoàng Gia Kỵ Sĩ triệu hồi ba linh thần At, Rene, Pol vung kiếm Unison thanh trừng.', 'x'),
    ],
  },

  // 19. Ryudamon Line
  {
    id: 'digimon-ryudamon',
    name: 'Ryudamon',
    element: 'warrior',
    elementLabel: 'Hiệp Sĩ & Kiếm Đạo',
    accent: '#6366f1',
    secondary: '#e0e7ff',
    description: 'Ryudamon -> Ginryumon -> Hisyaryumon -> Ouryumon -> Alphamon Ouryuken.',
    babyStage: makeStage(97, 'Kyokyomon', 'Baby', 'Kyokyomon samurai nhỏ đội mũ giáp sắt nỗ lực rèn dũa kiếm tâm.'),
    evolutionChain: [
      makeStage(98, 'Ryudamon', 'Rookie', 'Ryudamon rồng samurai đội mũ giáp sắt nỗ lực rèn dũa kiếm thuật Iai Kyu.'),
      makeStage(99, 'Ginryumon', 'Champion', 'Ginryumon thiết long bọc vảy bạc phòng thủ kiên cố phản kích Sakugougeki.'),
      makeStage(100, 'Hisyaryumon', 'Ultimate', 'Hisyaryumon long vương giáp trụ uy nghiêm lượn quanh mây gió Seiryusen.'),
    ],
    megaForms: [
      makeStage(101, 'Ouryumon', 'Mega', 'Ouryumon Hoàng Long Thần Kiếm hóa thân thành thanh kiếm huyền thoại Ouryuken chấn thế.', 'x'),
    ],
    ultraStage: makeStage(102, 'Alphamon-Ouryuken', 'Ultra', 'Alphamon Ouryuken Thánh Hiệp Sĩ Hoàng Gia vung thần kiếm Hoàng Long Ouryuken chém tan thời không.', 'x'),
  },

  // 20. Coronamon Line
  {
    id: 'digimon-coronamon',
    name: 'Coronamon',
    element: 'fire',
    elementLabel: 'Lửa & Thái Dương',
    accent: '#ea580c',
    secondary: '#ffedd5',
    description: 'Coronamon -> Firamon -> Flaremon -> Apollomon -> GraceNovamon.',
    evolutionChain: [
      makeStage(103, 'Coronamon', 'Rookie', 'Coronamon sư tử lửa rực sáng mang năng lượng mặt trời Corona Flame.'),
      makeStage(104, 'Firamon', 'Champion', 'Firamon bạch mã sư tử lửa sải cánh bốc cháy giáng móng Flame Dive.'),
      makeStage(105, 'Flaremon', 'Ultimate', 'Flaremon chiến thần sư tử rực lửa quyền cước bùng cháy Sea Animal Wave.'),
    ],
    megaForms: [
      makeStage(106, 'Apollomon', 'Mega', 'Apollomon Thái Dương Thần Tối Cao giáng ngọn lửa quang minh Sol Blaster cứu rỗi muôn loài.', 'x'),
    ],
    ultraStage: makeStage(107, 'GraceNovamon', 'Ultra', 'Grace Novamon Thiên Hà Thần Ngân Tinh kết hợp Thái Dương và Nguyệt Quang chiếu rọi vạn dặm.', 'x'),
  },

  // 21. Lunamon Line
  {
    id: 'digimon-lunamon',
    name: 'Lunamon',
    element: 'ice',
    elementLabel: 'Băng & Nguyệt Quang',
    accent: '#818cf8',
    secondary: '#ede9fe',
    description: 'Lunamon -> Lekismon -> Crescemon -> Dianamon -> GraceNovamon.',
    evolutionChain: [
      makeStage(108, 'Lunamon', 'Rookie', 'Lunamon thỏ trăng hiền dịu mang giọt nước nguyệt quang Luna Tear chữa lành.'),
      makeStage(109, 'Lekismon', 'Champion', 'Lekismon võ sĩ thỏ trăng quyền cước uyển chuyển đòn Moon Night Bomb.'),
      makeStage(110, 'Crescemon', 'Ultimate', 'Crescemon vũ nữ lưỡi liềm trăng vung song đao Lunatic Dance trác tuyệt.'),
    ],
    megaForms: [
      makeStage(111, 'Dianamon', 'Mega', 'Dianamon Nguyệt Thần Tối Cao mang cung trăng Goodnight Moon ru ngủ và đông kết vạn vật.', 'x'),
    ],
    ultraStage: makeStage(112, 'GraceNovamon', 'Ultra', 'Grace Novamon Thiên Hà Thần Ngân Tinh kết hợp Thái Dương và Nguyệt Quang chiếu rọi vạn dặm.', 'x'),
  },

  // 22. Hawkmon Line
  {
    id: 'digimon-hawkmon',
    name: 'Hawkmon',
    element: 'nature',
    elementLabel: 'Tự Nhiên & Chiến Binh Gió',
    accent: '#b45309',
    secondary: '#fef3c7',
    description: 'Poromon -> Hawkmon -> Aquilamon -> Silphymon -> Valkyrimon.',
    babyStage: makeStage(1121, 'Poromon', 'Baby', 'Poromon chim non lông vũ bay lượn líu lo mang gió xuân thanh bình.'),
    evolutionChain: [
      makeStage(113, 'Hawkmon', 'Rookie', 'Hawkmon chim ưng lịch thiệp phóng lông vũ Feather Slash chính xác tuyệt đối.'),
      makeStage(114, 'Aquilamon', 'Champion', 'Aquilamon đại bàng khổng lồ bổ nhào từ không trung phóng sóng siêu âm Glide Horn.'),
      makeStage(115, 'Silphymon', 'Ultimate', 'Silphymon chiến binh gió lướt gió tung đòn Top Gun phá vỡ rào chắn không khí.'),
    ],
    megaForms: [
      makeStage(116, 'Valkyrimon', 'Mega', 'Valkyrimon Nữ Thần Chiến Binh xứ Valhalla giương nỏ thần Fenrir Sword tiễn đưa linh hồn.', 'x'),
    ],
  },

  // 23. Jellymon Line
  {
    id: 'digimon-jellymon',
    name: 'Jellymon',
    element: 'electric',
    elementLabel: 'Sấm Sét & Biển Sâu',
    accent: '#0ea5e9',
    secondary: '#e0f2fe',
    description: 'Jellymon -> TeslaJellymon -> Thetismon -> Amphimon.',
    babyStage: makeStage(117, 'Puyoyomon', 'Baby', 'Puyoyomon sứa nước trong veo lấp lánh phát quang dưới đáy đại dương.'),
    evolutionChain: [
      makeStage(118, 'Jellymon', 'Rookie', 'Jellymon sứa biển tinh nghịch phóng tia điện tích Volt Knuckle làm tê liệt đối thủ.'),
      makeStage(119, 'TeslaJellymon', 'Champion', 'TeslaJellymon võ sĩ sứa điện quyền cước linh hoạt với chiêu Fizzy Shock.'),
      makeStage(120, 'Thetismon', 'Ultimate', 'Thetismon y sĩ đại dương bào chế độc dược và thuốc giải hồi sinh Dokuteki.'),
    ],
    megaForms: [
      makeStage(121, 'Amphimon', 'Mega', 'Amphimon Nữ Chúa Đại Dương bọc giáp công nghệ lướt sóng sấm sét Crystal Wave.', 'x'),
    ],
  },

  // 24. Dorumon Line
  {
    id: 'digimon-dorumon',
    name: 'Dorumon',
    element: 'warrior',
    elementLabel: 'Hiệp Sĩ & Kháng Sinh X',
    accent: '#7c3aed',
    secondary: '#f3e8ff',
    description: 'Dorumon -> Dorugamon -> Doruguremon -> Alphamon -> Ouryuken.',
    babyStage: makeStage(122, 'Dorimon', 'Baby', 'Dorimon tiểu thú vảy tím mang tiềm năng nhân tố X nguyên thủy dũng cảm.'),
    evolutionChain: [
      makeStage(123, 'Dorumon', 'Rookie', 'Dorumon thú nguyên thủy mang nhân tố X bắn đạn sắt Metal Cannon kiên cường.'),
      makeStage(124, 'Dorugamon', 'Champion', 'Dorugamon thú rồng dũng mãnh gầm vang phóng sóng năng lượng Power Metal.'),
      makeStage(125, 'Doruguremon', 'Ultimate', 'Doruguremon long thú bọc giáp titan sải cánh phóng mưa thiên thạch Meteor Fall.'),
    ],
    megaForms: [
      makeStage(126, 'Alphamon', 'Mega', 'Alphamon Thủ Lĩnh Kỵ Sĩ Hoàng Gia nắm giữ sức mạnh Alpha InForce xoay chuyển thời gian.', 'x'),
    ],
    ultraStage: makeStage(127, 'Alphamon-Ouryuken', 'Ultra', 'Alphamon Ouryuken Thánh Hiệp Sĩ Hoàng Gia vung thần kiếm Hoàng Long Ouryuken chém tan thời không.', 'x'),
  },

  // 25. Impmon Line
  {
    id: 'digimon-impmon',
    name: 'Impmon',
    element: 'dark',
    elementLabel: 'Bóng Tối & Quỷ Vương',
    accent: '#9333ea',
    secondary: '#f3e8ff',
    description: 'Impmon -> Wizarmon -> Baalmon -> Beelzebumon -> Blast Mode.',
    babyStage: makeStage(128, 'Yaamon', 'Baby', 'Yaamon tiểu quỷ bóng tối nhỏ nghịch ngợm phun bong bóng khói tím châm chọc.'),
    evolutionChain: [
      makeStage(129, 'Impmon', 'Rookie', 'Impmon tiểu quỷ tinh quái vờn ngọn lửa tím Bada Boom châm chọc đối phương.'),
      makeStage(130, 'Wizarmon', 'Champion', 'Wizarmon pháp sư áo choàng trung thành vung quyền trượng sấm Thunder Cloud bí ẩn.'),
      makeStage(131, 'Baalmon', 'Ultimate', 'Baalmon chiến binh học giả mang cổ thư phép thuật thần bí Guiltish xua tan tà niệm.'),
    ],
    megaForms: [
      makeStage(132, 'Beelzebumon', 'Mega', 'Beelzebumon Quỷ Vương Kiêu Hùng cưỡi siêu xe Behemoth xả song súng Double Impact rền vang.', 'x'),
    ],
    ultraStage: makeStage(133, 'Beelzebumon-Blast-Mode', 'Ultra', 'Beelzemon Blast Mode Ma Vương bốn cánh dang rộng súng thần Blaster hủy diệt ma trắc.', 'x'),
  },

  // 26. Dracomon Line
  {
    id: 'digimon-dracomon',
    name: 'Dracomon',
    element: 'warrior',
    elementLabel: 'Long Tộc Cổ Đại',
    accent: '#059669',
    secondary: '#d1fae5',
    description: 'Dracomon -> Coredramon (Blue) -> Wingdramon -> Slayerdramon -> Examon.',
    babyStage: makeStage(134, 'Babydmon', 'Baby', 'Babydmon rồng con mới nở mang hơi thở nhiệt huyết vảy rồng tổ tiên.'),
    evolutionChain: [
      makeStage(135, 'Dracomon', 'Rookie', 'Dracomon tổ tiên loài rồng nhỏ bé mang vảy rồng quý phóng hơi thở Baby Breath rực sáng.'),
      makeStage(136, 'Coredramon-Blue', 'Champion', 'Coredramon rồng xanh lam sải cánh lượn gió phun lửa Blue Flare thiêu rụi chướng ngại.'),
      makeStage(137, 'Wingdramon', 'Ultimate', 'Wingdramon rồng bạc siêu thanh lướt với tốc độ Mach lao đâm Sonic Lance xuyên phá.'),
    ],
    megaForms: [
      makeStage(138, 'Slayerdramon', 'Mega', 'Slayerdramon Long Trảm Dũng Sĩ vung trường kiếm rồng Fragarach trảm phong trảm sát.', 'x'),
    ],
    ultraStage: makeStage(139, 'Examon', 'Ultra', 'Examon Long Đế Hoàng Gia tối cao kích thước vĩ đại thống lĩnh vạn long vũ trụ.', 'x'),
  },

  // 27. BlackAgumon Line
  {
    id: 'digimon-black-agumon',
    name: 'BlackAgumon',
    element: 'dark',
    elementLabel: 'Hắc Long & Rồng Đen',
    accent: '#334155',
    secondary: '#f1f5f9',
    description: 'Agumon (Black) -> Greymon (Blue) -> MetalGreymon (Virus) -> BlackWarGreymon -> Omegamon Zwart.',
    babyStage: makeStage(140, 'Koromon', 'Baby', 'Koromon bóng hồng tai dài tinh nghịch bắn bong bóng bọt khí.'),
    evolutionChain: [
      makeStage(141, 'Agumon-Black', 'Rookie', 'Agumon Black khủng long nhỏ da đen phóng cầu lửa hắc ám Baby Burner cực mạnh.'),
      makeStage(142, 'Greymon-Blue', 'Champion', 'Greymon Blue khủng long bọc xương xanh thẫm hung bạo gầm vang đòn Mega Flame.'),
      makeStage(143, 'MetalGreymon-Virus', 'Ultimate', 'MetalGreymon Virus bọc giáp titan xanh bóng phóng tên lửa hủy diệt Giga Destroyer.'),
    ],
    megaForms: [
      makeStage(144, 'BlackWarGreymon', 'Mega', 'BlackWarGreymon Chiến Binh Rồng Đen cô độc vung Dramon Killer xé toạc không gian.', 'x'),
    ],
    ultraStage: makeStage(145, 'Omegamon-Zwart', 'Ultra', 'Omegamon Zwart Hiệp Sĩ Hắc Ám Hoàng Gia khoác áo choàng đen nắm giữ song thần khí.', 'x'),
  },

  // 28. BlackGabumon Line
  {
    id: 'digimon-black-gabumon',
    name: 'BlackGabumon',
    element: 'dark',
    elementLabel: 'Hắc Thú & Băng Đen',
    accent: '#475569',
    secondary: '#f8fafc',
    description: 'Gabumon (Black) -> Garurumon (Black) -> WereGarurumon (Black) -> MetalGarurumon (Black) -> Omegamon Zwart.',
    babyStage: makeStage(146, 'Tsunomon', 'Baby', 'Tsunomon bóng cam có sừng nhút nhát và trung thành tuyệt đối.'),
    evolutionChain: [
      makeStage(147, 'Gabumon-Black', 'Rookie', 'Gabumon Black nhút nhát khoác áo da sói đen phóng ngọn lửa lạnh Black Fire.'),
      makeStage(148, 'Garurumon-Black', 'Champion', 'Garurumon Black sói bóng đêm tuyết đen lao nhanh như cơn bão tuyết Fox Fire.'),
      makeStage(149, 'WereGarurumon-Black', 'Ultimate', 'WereGarurumon Black sói đứng chiến binh hắc ám cước đá Shadow Claw sắc nhọn.'),
    ],
    megaForms: [
      makeStage(150, 'MetalGarurumon-Black', 'Mega', 'MetalGarurumon Black sói thép giáp đen vũ trang toàn diện laser Cocytus Breath.', 'x'),
    ],
    ultraStage: makeStage(151, 'Omegamon-Zwart', 'Ultra', 'Omegamon Zwart Hiệp Sĩ Hắc Ám Hoàng Gia khoác áo choàng đen nắm giữ song thần khí.', 'x'),
  },

  // 29. Vdramon Line
  {
    id: 'digimon-vdramon',
    name: 'V-mon (V-dramon)',
    element: 'warrior',
    elementLabel: 'Hiệp Sĩ Hoàng Gia Thần Tốc',
    accent: '#1d4ed8',
    secondary: '#eff6ff',
    description: 'V-mon -> V-dramon -> Aero-V-dramon -> UlforceV-dramon.',
    babyStage: makeStage(152, 'Chibimon', 'Baby', 'Chibimon rồng xanh nhỏ nhảy nhót vui tươi với lòng dũng cảm cổ đại.'),
    evolutionChain: [
      makeStage(153, 'V-mon', 'Rookie', 'Veemon rồng xanh năng động với cú húc đầu V-mon Headbutt làm choáng kẻ thù.'),
      makeStage(154, 'V-dramon', 'Champion', 'V-dramon rồng cổ đại huyền thoại phóng luồng sóng xung kích chữ V rực lửa.'),
      makeStage(155, 'Aero-V-dramon', 'Ultimate', 'Aero-V-dramon long tướng có cánh bay lượn trên tầng bình lưu vung vuốt gió V-Wing Blade.'),
    ],
    megaForms: [
      makeStage(156, 'UlforceV-dramon', 'Mega', 'UlforceV-dramon Hiệp Sĩ Hoàng Gia Tốc Độ Ánh Sáng hồi phục bất tận với kiếm laser Ray of Victory.', 'x'),
    ],
  },

  // 30. ShineGreymon Line
  {
    id: 'digimon-shine-greymon',
    name: 'Agumon 2006 (ShineGreymon)',
    element: 'fire',
    elementLabel: 'Quang Minh & Thái Dương Long',
    accent: '#ea580c',
    secondary: '#fff7ed',
    description: 'Agumon -> GeoGreymon -> RizeGreymon -> ShineGreymon -> Burst Mode.',
    babyStage: makeStage(157, 'Koromon', 'Baby', 'Koromon bóng hồng tai dài tinh nghịch bắn bong bóng bọt khí.'),
    evolutionChain: [
      makeStage(158, 'Agumon', 'Rookie', 'Agumon mầm non dũng cảm với tuyệt chiêu Pepper Breath rực lửa.'),
      makeStage(159, 'GeoGreymon', 'Champion', 'GeoGreymon long vương dũng mãnh phóng cầu lửa rực sáng Mega Flame.'),
      makeStage(160, 'RizeGreymon', 'Ultimate', 'RizeGreymon rồng súng đại bác cánh cơ khí nã đạn thần tốc Trident Revolver.'),
    ],
    megaForms: [
      makeStage(161, 'ShineGreymon', 'Mega', 'ShineGreymon Kỵ Sĩ Mặt Trời vung thanh cự kiếm quang minh GeoGrey Sword chém tan tà ma.', 'x'),
    ],
    ultraStage: makeStage(162, 'ShineGreymon-Burst-Mode', 'Ultra', 'ShineGreymon Burst Mode bùng cháy ngọn lửa mặt trời tối thượng xé rách không gian.', 'x'),
  },

  // 31. Gaomon Line
  {
    id: 'digimon-gaomon',
    name: 'Gaomon',
    element: 'ice',
    elementLabel: 'Khuyển Tướng & Ảo Ảnh Băng',
    accent: '#0284c7',
    secondary: '#f0f9ff',
    description: 'Gaomon -> Gaogamon -> MachGaogamon -> MirageGaogamon -> Burst Mode.',
    babyStage: makeStage(163, 'Wanyamon', 'Baby', 'Wanyamon tiểu thú lông xanh tai dài nhanh nhẹn và tràn đầy hiếu kỳ.'),
    evolutionChain: [
      makeStage(164, 'Gaomon', 'Rookie', 'Gaomon cún xanh đeo găng tay quyền anh tung cú đấm chớp nhoáng Double Upper.'),
      makeStage(165, 'Gaogamon', 'Champion', 'Gaogamon sói xanh chiến binh lao vun vút phóng lưỡi đao xoáy Spiral Blow.'),
      makeStage(166, 'MachGaogamon', 'Ultimate', 'MachGaogamon khuyển tướng trang bị động cơ phản lực tung ngàn cú đấm liên thanh.'),
    ],
    megaForms: [
      makeStage(167, 'MirageGaogamon', 'Mega', 'MirageGaogamon Kỵ Sĩ Sói Ảo Ảnh mang khiên trăng lưỡi đao ánh trăng Full Moon Blaster.', 'x'),
    ],
    ultraStage: makeStage(168, 'MirageGaogamon-Burst-Mode', 'Ultra', 'MirageGaogamon Burst Mode khai mở toàn bộ năng lượng ánh trăng cực hạn.', 'x'),
  },

  // 32. Angoramon Line
  {
    id: 'digimon-angoramon',
    name: 'Angoramon',
    element: 'nature',
    elementLabel: 'Tự Nhiên & Kiếm Sĩ Phong Ba',
    accent: '#84cc16',
    secondary: '#f7fee7',
    description: 'Angoramon -> SymbareAngoramon -> Lamortmon -> Diarbbitmon.',
    evolutionChain: [
      makeStage(169, 'Angoramon', 'Rookie', 'Angoramon thỏ khổng lồ lông mịn bay lượn êm đềm với đôi tai rộng Double Hurrican.'),
      makeStage(170, 'SymbareAngoramon', 'Champion', 'SymbareAngoramon kiếm sĩ phong độ uyển chuyển với đôi chân phong vũ xé gió.'),
      makeStage(171, 'Lamortmon', 'Ultimate', 'Lamortmon quái thú cuồng bạo vung song kiếm khổng lồ xẻ nát chướng ngại vật.'),
    ],
    megaForms: [
      makeStage(172, 'Diarbbitmon', 'Mega', 'Diarbbitmon Kiếm Sĩ Quý Tộc thanh lịch vung đôi trường kiếm bạc lấp lánh như sương mai.', 'x'),
    ],
  },

  // 33. Blucomon Line
  {
    id: 'digimon-blucomon',
    name: 'Blucomon',
    element: 'ice',
    elementLabel: 'Băng Tuyết & Ma Pháp Rồng',
    accent: '#38bdf8',
    secondary: '#f0f9ff',
    description: 'Blucomon -> Paledramon -> CrysPaledramon -> Hexeblaumon.',
    evolutionChain: [
      makeStage(173, 'Blucomon', 'Rookie', 'Blucomon rồng con băng tuyết thở ra luồng hơi lạnh Baby Hail đóng băng mặt đất.'),
      makeStage(174, 'Paledramon', 'Champion', 'Paledramon long thú tuyết sải cánh băng giá tạo bão tuyết Ice Age cuộn trào.'),
      makeStage(175, 'CrysPaledramon', 'Ultimate', 'CrysPaledramon rồng tinh thể băng vũ trang nỏ băng đông kết vạn vật.'),
    ],
    megaForms: [
      makeStage(176, 'Hexeblaumon', 'Mega', 'Hexeblaumon Pháp Sư Rồng Băng Tối Cao thi triển cấm thuật băng vực Hocytus Breath.', 'x'),
    ],
  },

  // 34. Vorvomon Line
  {
    id: 'digimon-vorvomon',
    name: 'Vorvomon',
    element: 'fire',
    elementLabel: 'Nham Thạch & Hỏa Diệm Long',
    accent: '#dc2626',
    secondary: '#fef2f2',
    description: 'Mokumon -> Vorvomon -> Lavorvomon -> Lavogaritamon -> Volcanicdramon.',
    babyStage: makeStage(1761, 'Mokumon', 'Baby', 'Mokumon khói lửa ấu thơ bồng bềnh mang ngọn lửa âm ỉ.'),
    evolutionChain: [
      makeStage(177, 'Vorvomon', 'Rookie', 'Vorvomon rồng đá lửa mang magma nóng chảy trong cơ thể phun lửa Petit Flame.'),
      makeStage(178, 'Lavorvomon', 'Champion', 'Lavorvomon rồng nham thạch bọc giáp đá quặng lao húc với uy lực nghiền nát.'),
      makeStage(179, 'Lavogaritamon', 'Ultimate', 'Lavogaritamon quái long núi lửa phun trào dung nham đỏ rực thiêu rụi trời đất.'),
    ],
    megaForms: [
      makeStage(180, 'Volcanicdramon', 'Mega', 'Volcanicdramon Long Chúa Núi Lửa cổ đại thức tỉnh hơi thở địa ngục Volcanic Ash.', 'x'),
    ],
  },

  // 35. Commandramon Line
  {
    id: 'digimon-commandramon',
    name: 'Commandramon',
    element: 'machine',
    elementLabel: 'Quân Sự & Hắc Long Cơ Giới',
    accent: '#475569',
    secondary: '#f8fafc',
    description: 'Commandramon -> Sealsdramon -> Tankdramon -> Darkdramon.',
    evolutionChain: [
      makeStage(181, 'Commandramon', 'Rookie', 'Commandramon lính đặc nhiệm rồng ngụy trang súng trường nã liên hồi M16 Assassin.'),
      makeStage(182, 'Sealsdramon', 'Champion', 'Sealsdramon sát thủ đặc nhiệm dao găm di chuyển với tốc độ âm thanh Death Behind.'),
      makeStage(183, 'Tankdramon', 'Ultimate', 'Tankdramon chiến xa pháo kích bọc thép trang bị đại bác nòng đôi liên thanh.'),
    ],
    megaForms: [
      makeStage(184, 'Darkdramon', 'Mega', 'Darkdramon Long Nhân Cơ Khí Bất Khuất vung thần thương Gigastick Lance rền vang sấm sét.', 'x'),
    ],
  },

  // 36. Liollmon Line
  {
    id: 'digimon-liollmon',
    name: 'Liollmon',
    element: 'machine',
    elementLabel: 'Cơ Giáp & Sư Tử Hạng Nặng',
    accent: '#b45309',
    secondary: '#fffbeb',
    description: 'Liollmon -> Liamon -> LoaderLeomon -> HeavyLeomon.',
    babyStage: makeStage(185, 'Wanyamon', 'Baby', 'Wanyamon tiểu thú lông xanh tai dài nhanh nhẹn và tràn đầy hiếu kỳ.'),
    evolutionChain: [
      makeStage(186, 'Liollmon', 'Rookie', 'Liollmon sư tử vàng ấu thơ tinh nghịch với bộ bờm điện tích Leo Claw.'),
      makeStage(187, 'Liamon', 'Champion', 'Liamon mãnh sư dũng cảm lao vun vút phóng sấm sét Thunder Ridge.'),
      makeStage(188, 'LoaderLeomon', 'Ultimate', 'LoaderLeomon sư tử máy công trình khoan đá hạng nặng nghiền nát vật cản.'),
    ],
    megaForms: [
      makeStage(189, 'HeavyLeomon', 'Mega', 'HeavyLeomon Thiết Giáp Hạng Nặng mang pháo hủy diệt Barrage Sweeper bất khả xâm phạm.', 'x'),
    ],
  },

  // 37. Loogamon Line
  {
    id: 'digimon-loogamon',
    name: 'Loogamon',
    element: 'dark',
    elementLabel: 'Ma Lang & Cổ Ma Pháp',
    accent: '#7c3aed',
    secondary: '#f5f3ff',
    description: 'Loogamon -> Loogarmon -> Helloogarmon -> Fenriloogamon -> Takemikazuchi.',
    babyStage: makeStage(190, 'Bowmon', 'Baby', 'Bowmon tiểu lang ma pháp mang đôi tai dài và ngọn lửa tím ấu thơ.'),
    evolutionChain: [
      makeStage(191, 'Loogamon', 'Rookie', 'Loogamon ma lang có viên ngọc ma thuật trên trán cắn xé đối thủ bằng Howling Burn.'),
      makeStage(192, 'Loogarmon', 'Champion', 'Loogarmon lang vương rực lửa ma trắc lao vun vút phóng song trảo xé toạc màn đêm.'),
      makeStage(193, 'Helloogarmon', 'Ultimate', 'Helloogarmon ma lang tử thần bốn mắt gầm vang tiếng tru địa ngục xua tan sinh khí.'),
    ],
    megaForms: [
      makeStage(194, 'Fenriloogamon', 'Mega', 'Fenriloogamon Thần Ma Lang Cổ Tộc vung ma kiếm bóng đêm trảm diệt vạn vật.', 'x'),
    ],
    ultraStage: makeStage(195, 'Fenriloogamon-Takemikazuchi', 'Ultra', 'Fenriloogamon Takemikazuchi hợp thể Lôi Thần Kiếm Khách ánh chớp tím chấn động trời đất.', 'x'),
  },

  // 38. Zubamon Line
  {
    id: 'digimon-zubamon',
    name: 'Zubamon',
    element: 'warrior',
    elementLabel: 'Thần Binh Hoàng Kim Kiếm',
    accent: '#ca8a04',
    secondary: '#fefce8',
    description: 'Zubamon -> Zubaeagermon -> Duramon -> Durandamon.',
    babyStage: makeStage(196, 'Sakumon', 'Baby', 'Sakumon kiếm nhỏ sơ sinh ngậm mũi kiếm thép kiên cường.'),
    evolutionChain: [
      makeStage(197, 'Zubamon', 'Rookie', 'Zubamon kiếm sĩ hoàng kim với khẩu hiệu Tôi là thanh kiếm mạnh nhất.'),
      makeStage(198, 'Zubaeagermon', 'Champion', 'Zubaeagermon ưng kiếm sắc bén liệng cánh trảm phong xé tan rào chắn.'),
      makeStage(199, 'Duramon', 'Ultimate', 'Duramon dũng sĩ long kiếm song kiếm rực sáng thi triển kiếm vũ trảm sát.'),
    ],
    megaForms: [
      makeStage(200, 'Durandamon', 'Mega', 'Durandamon Hoàng Kim Thần Kiếm hóa thân thành thanh kiếm sắc bén nhất vũ trụ.', 'x'),
    ],
  },

  // 39. Monodramon Line
  {
    id: 'digimon-monodramon',
    name: 'Monodramon',
    element: 'warrior',
    elementLabel: 'Rồng Chiến & Lôi Thần',
    accent: '#4f46e5',
    secondary: '#eef2ff',
    description: 'Monodramon -> Strikedramon -> Cyberdramon -> Raijinmon.',
    babyStage: makeStage(201, 'Hopmon', 'Baby', 'Hopmon bóng nhảy tinh nghịch mang sừng nhỏ và đôi mắt quyết tâm.'),
    evolutionChain: [
      makeStage(202, 'Monodramon', 'Rookie', 'Monodramon rồng nhỏ hiếu chiến tung cú húc đầu sừng cứng Crack Bite.'),
      makeStage(203, 'Strikedramon', 'Champion', 'Strikedramon quyền vương rồng giáp sắt quyền cước rực lửa Strike Claw.'),
      makeStage(204, 'Cyberdramon', 'Ultimate', 'Cyberdramon thợ săn virus bọc giáp cao su đen vung trảo Erase Claw xé nát không gian.'),
    ],
    megaForms: [
      makeStage(205, 'Raijinmon', 'Mega', 'Raijinmon Lôi Thần Chiến Binh mang đại pháo sấm sét nã sấm rền trời đất.', 'x'),
    ],
  },

  // 40. Bearmon Line
  {
    id: 'digimon-bearmon',
    name: 'Bearmon',
    element: 'warrior',
    elementLabel: 'Võ Thần & Chiến Tranh',
    accent: '#c2410c',
    secondary: '#fff7ed',
    description: 'Bearmon -> Gryzmon -> GrappuLeomon -> Marsmon.',
    babyStage: makeStage(206, 'Wanyamon', 'Baby', 'Wanyamon tiểu thú lông xanh tai dài nhanh nhẹn và tràn đầy hiếu kỳ.'),
    evolutionChain: [
      makeStage(207, 'Bearmon', 'Rookie', 'Bearmon gấu nhỏ đội mũ lưỡi trai ngược chăm chỉ luyện tập đòn Seiken Tsuki.'),
      makeStage(208, 'Gryzmon', 'Champion', 'Gryzmon gấu xám lực lưỡng vung móng vuốt Crescent Dawn chém toạc sắt thép.'),
      makeStage(209, 'GrappuLeomon', 'Ultimate', 'GrappuLeomon sư tử võ thuật trang bị turbine cước lốc xoáy Vortex Kick.'),
    ],
    megaForms: [
      makeStage(210, 'Marsmon', 'Mega', 'Marsmon Chiến Thần Chiến Tranh Tối Cao tinh thông vạn môn võ thuật đấm lửa Sanction Fang.', 'x'),
    ],
  },

  // 41. Groundramon Line
  {
    id: 'digimon-groundramon',
    name: 'Dracomon (Breakdramon)',
    element: 'nature',
    elementLabel: 'Địa Long & Khổng Long Vương',
    accent: '#166534',
    secondary: '#f0fdf4',
    description: 'Dracomon -> Coredramon (Green) -> Groundramon -> Breakdramon -> Examon.',
    babyStage: makeStage(211, 'Babydmon', 'Baby', 'Babydmon rồng con mới nở mang hơi thở nhiệt huyết vảy rồng tổ tiên.'),
    evolutionChain: [
      makeStage(212, 'Dracomon', 'Rookie', 'Dracomon tổ tiên loài rồng nhỏ bé mang vảy rồng quý phóng hơi thở Baby Breath rực sáng.'),
      makeStage(213, 'Coredramon-Green', 'Champion', 'Coredramon Green rồng xanh lá sải bước uy mãnh trên cạn phun ngọn lửa Green Flare.'),
      makeStage(214, 'Groundramon', 'Ultimate', 'Groundramon địa long bốn chân khổng lồ nghiền nát mặt đất với đôi càng Scrapless Claw.'),
    ],
    megaForms: [
      makeStage(215, 'Breakdramon', 'Mega', 'Breakdramon Siêu Chiến Xa Phá Hủy bọc thép khoan xuyên lòng đất tàn phá mọi pháo đài.', 'x'),
    ],
    ultraStage: makeStage(216, 'Examon', 'Ultra', 'Examon Long Đế Hoàng Gia tối cao kích thước vĩ đại thống lĩnh vạn long vũ trụ.', 'x'),
  },

  // 42. BelialVamdemon Line
  {
    id: 'digimon-belial-vamdemon',
    name: 'Gazimon (BelialVamdemon)',
    element: 'dark',
    elementLabel: 'Chúa Quỷ & Ma Vương Hắc Ám',
    accent: '#581c87',
    secondary: '#faf5ff',
    description: 'Pagumon -> Gazimon -> Devimon -> Vamdemon -> BelialVamdemon.',
    babyStage: makeStage(2161, 'Pagumon', 'Baby', 'Pagumon tiểu quỷ ấu thơ tinh quái với đôi tai dài thắt nơ.'),
    evolutionChain: [
      makeStage(217, 'Gazimon', 'Rookie', 'Gazimon tiểu quỷ tai dài răng nhọn phóng vuốt độc Paralyze Breath gây tê liệt.'),
      makeStage(218, 'Devimon', 'Champion', 'Devimon ác ma cánh dơi vung móng vuốt bóng đêm Death Claw cướp đi sinh lực.'),
      makeStage(219, 'Vamdemon', 'Ultimate', 'Myotismon Chúa Tể Ma Cà Rồng áo choàng đen triệu hồi đàn dơi đêm Night Raid rùng rợn.'),
    ],
    megaForms: [
      makeStage(220, 'BelialVamdemon', 'Mega', 'MaloMyotismon Chúa Quỷ Tối Thượng hai họng pháo sọ người bắn chùm tia Pandemonium Flame.', 'x'),
    ],
  },


  // 43. Gomamon Line
  {
    id: 'digimon-gomamon',
    name: 'Gomamon',
    element: 'ice',
    elementLabel: 'Băng & Hải Thú',
    accent: '#06b6d4',
    secondary: '#cffafe',
    description: 'Gomamon -> Ikkakumon -> Zudomon -> Vikemon -> Plesiomon.',
    babyStage: makeStage(221, 'Poyomon', 'Baby', 'Poyomon sinh vật sứa nước biển nhỏ bé trôi dạt mang bong bóng khí.'),
    evolutionChain: [
      makeStage(222, 'Gomamon', 'Rookie', 'Gomamon hải cẩu lông ấm điều khiển đàn cá Marching Fishes tinh nghịch.'),
      makeStage(223, 'Ikkakumon', 'Champion', 'Ikkakumon hải mã băng tuyết vạm vỡ bắn tên lửa sừng Harpoon Vulcan.'),
      makeStage(224, 'Zudomon', 'Ultimate', 'Zudomon thợ rèn biển bắc vung búa sét Thor Hammer rền vang mặt đất.'),
    ],
    megaForms: [
      makeStage(225, 'Vikemon', 'Mega', 'Vikemon Chiến Binh Băng Bắc Cực thống lĩnh hải đoàn với chùy gai Mjolnir.', 'x'),
    ],
    ultraStage: makeStage(226, 'Plesiomon', 'Ultra', 'Plesiomon Rồng Nước Cổ Đại huyền thoại cất tiếng hát Sorrow Blue thanh tẩy tà ma.', 'x'),
  },

  // 44. Elecmon Line
  {
    id: 'digimon-elecmon',
    name: 'Elecmon',
    element: 'electric',
    elementLabel: 'Sét & Mãnh Sư',
    accent: '#eab308',
    secondary: '#fef9c3',
    description: 'Elecmon -> Leomon -> GrappuLeomon -> BanchoLeomon -> HeavyLeomon.',
    babyStage: makeStage(227, 'Punimon', 'Baby', 'Punimon bóng đỏ ba sừng mềm mại nhún nhảy phát điện li ti.'),
    evolutionChain: [
      makeStage(228, 'Elecmon', 'Rookie', 'Elecmon thú nhỏ phóng đuôi sét Spark Luser lấp lánh hiếu chiến.'),
      makeStage(229, 'Leomon', 'Champion', 'Leomon Dũng Sĩ Rừng Xanh chính nghĩa vung Shishioumaru và quyền Juuouken.'),
      makeStage(230, 'Grappu-Leomon', 'Ultimate', 'GrappuLeomon võ sĩ quyền cước cơ khí tung đòn xoáy bão tố The Grap.'),
    ],
    megaForms: [
      makeStage(231, 'Bancho-Leomon', 'Mega', 'BanchoLeomon Đại Ca Sư Tử khoác áo Gakuran chém kiếm Shishioumaru bất khuất.', 'x'),
    ],
    ultraStage: makeStage(232, 'Heavy-Leomon', 'Ultra', 'HeavyLeomon Pháo Đài Sư Tử Thép bọc giáp siêu trọng cơ giới nã pháo Barrage.', 'x'),
  },

  // 45. Kotemon Line
  {
    id: 'digimon-kotemon',
    name: 'Kotemon',
    element: 'warrior',
    elementLabel: 'Kiếm Đạo & Kỵ Sĩ',
    accent: '#ca8a04',
    secondary: '#fef08a',
    description: 'Kotemon -> Musyamon -> Knightmon -> LordKnightmon -> Alphamon.',
    babyStage: makeStage(233, 'Cotsucomon', 'Baby', 'Cotsucomon giáp nhỏ mang tinh thần võ sĩ đạo tí hon kiên định.'),
    evolutionChain: [
      makeStage(234, 'Kotemon', 'Rookie', 'Kotemon bò sát nhỏ đeo mặt nạ Kendo vung kiếm tre Hotaru Bi kiên định.'),
      makeStage(235, 'Musyamon', 'Champion', 'Musyamon lãng khách Samurai tay cầm ma kiếm Shiratori chém ngắt lá bay.'),
      makeStage(236, 'Knightmon', 'Ultimate', 'Knightmon Đại Kỵ Sĩ giáp sắt Chrome Digizoid vung trọng kiếm Berserk Sword.'),
    ],
    megaForms: [
      makeStage(237, 'Lord-Knightmon', 'Mega', 'LordKnightmon Kỵ Sĩ Hoàng Gia hoa hồng quý phái Spiral Masquerade trảm sát.', 'x'),
    ],
    ultraStage: makeStage(238, 'Alphamon', 'Ultra', 'Alphamon Thánh Kỵ Sĩ Thủ Lĩnh nắm giữ sức mạnh Alpha InForce xoay chuyển vũ trụ.', 'x'),
  },

  // 46. Candlemon Line
  {
    id: 'digimon-candlemon',
    name: 'Candlemon',
    element: 'fire',
    elementLabel: 'Hỏa Diệm Linh',
    accent: '#f97316',
    secondary: '#ffedd5',
    description: 'Candlemon -> Meramon -> DeathMeramon -> Boltmon -> AncientVolcamon.',
    babyStage: makeStage(239, 'Mokumon', 'Baby', 'Mokumon đốm khói đen tí hon bay bổng mang tàn tro ấm áp.'),
    evolutionChain: [
      makeStage(240, 'Candlemon', 'Rookie', 'Candlemon linh hồn nến cháy ngọn lửa Bonfire soi sáng màn đêm số.'),
      makeStage(241, 'Meramon', 'Champion', 'Meramon người lửa bùng cháy dữ dội đấm quyền lửa Burning Fist.'),
      makeStage(242, 'Death-Meramon', 'Ultimate', 'DeathMeramon quái kiệt xích sắt Heavy Metal phóng lửa xanh ngút ngàn.'),
    ],
    megaForms: [
      makeStage(243, 'Boltmon', 'Mega', 'Boltmon Người Khổng Lồ Máy phát điện năng vung rìu sét Tomahawk cuồng phong.', 'x'),
    ],
    ultraStage: makeStage(244, 'Ancient-Volcamon', 'Ultra', 'AncientVolcamon Hỏa Thần Núi Lửa Thập Đấu Sĩ phát nổ Supernova địa chấn.', 'x'),
  },

  // 47. Labramon Line
  {
    id: 'digimon-labramon',
    name: 'Labramon',
    element: 'holy',
    elementLabel: 'Thánh Khuyển & Minh Giới',
    accent: '#8b5cf6',
    secondary: '#ede9fe',
    description: 'Labramon -> Dobermon -> Cerberumon -> Anubimon -> Plutomon.',
    babyStage: makeStage(245, 'Paomon', 'Baby', 'Paomon cún con bông trắng ngây thơ sủa tiếng nhỏ vui tươi.'),
    evolutionChain: [
      makeStage(246, 'Labramon', 'Rookie', 'Labramon chú chó trung thành chữa lành vết thương bằng đòn Barking Slander.'),
      makeStage(247, 'Dobermon', 'Champion', 'Dobermon khuyển săn bóng đêm mang nanh xám cất tiếng hú Grau Larm.'),
      makeStage(248, 'Cerberumon', 'Ultimate', 'Cerberumon Chó Ba Đầu gác cổng địa ngục khạc lửa Inferno Gate thiêu tà.'),
    ],
    megaForms: [
      makeStage(249, 'Anubimon', 'Mega', 'Anubimon Phán Quan Kim Tự Tháp ban phán quyết luân hồi Ammit.', 'x'),
    ],
    ultraStage: makeStage(250, 'Plutomon', 'Ultra', 'Plutomon Minh Vương Tối Cao thống lãnh thế giới ngục tù bóng tối Hades.', 'x'),
  },

  // 48. Flamon Line
  {
    id: 'digimon-flamon',
    name: 'Flamon',
    element: 'fire',
    elementLabel: 'Linh Hồn Hỏa Diệm',
    accent: '#dc2626',
    secondary: '#fee2e2',
    description: 'Flamon -> Agnimon -> Vritramon -> Aldamon -> KaiserGreymon.',
    babyStage: makeStage(251, 'Mokumon', 'Baby', 'Mokumon đốm khói đen tí hon bay bổng mang tàn tro ấm áp.'),
    evolutionChain: [
      makeStage(252, 'Flamon', 'Rookie', 'Flamon yêu tinh lửa nhanh nhẹn nhảy múa trong biển lửa Flame Tail.'),
      makeStage(253, 'Agnimon', 'Champion', 'Agnimon Chiến Binh Lửa Thần tung quyền cước Hỏa Diệm Long rực rỡ.'),
      makeStage(254, 'Vritramon', 'Ultimate', 'Vritramon Dã Thú Hỏa Long dang rộng đôi cánh lửa nã pháo Pyro Blaster.'),
    ],
    megaForms: [
      makeStage(255, 'Aldamon', 'Mega', 'Aldamon Chiến Thần Hợp Thể dung hợp linh hồn lửa tung quả cầu năng lượng Brahma Shil.', 'x'),
    ],
    ultraStage: makeStage(256, 'Kaiser-Greymon', 'Ultra', 'KaiserGreymon Hoàng Đế Rồng Thần mang Long Kiếm Ryugonken trảm phá nhật nguyệt.', 'x'),
  },

  // 49. Strabimon Line
  {
    id: 'digimon-strabimon',
    name: 'Strabimon',
    element: 'holy',
    elementLabel: 'Linh Hồn Quang Minh',
    accent: '#0284c7',
    secondary: '#e0f2fe',
    description: 'Strabimon -> Wolfmon -> Beowolfmon -> MagnaGarurumon -> Susanoomon.',
    babyStage: makeStage(257, 'Botamon', 'Baby', 'Botamon đốm đen mắt tròn xoe sinh vật khởi nguyên số.'),
    evolutionChain: [
      makeStage(258, 'Strabimon', 'Rookie', 'Strabimon sói con ánh sáng móng vuốt Licht Nagel xé toạc màn sương.'),
      makeStage(259, 'Wolfmon', 'Champion', 'Wolfmon Chiến Binh Ánh Sáng vung song kiếm laser Licht Schwert bảo vệ công lý.'),
      makeStage(260, 'Beowolfmon', 'Ultimate', 'Beowolfmon Thần Sói Lai Rồng vung Tranz Saber chém ánh sáng thần tốc.'),
    ],
    megaForms: [
      makeStage(261, 'Magna-Garurumon', 'Mega', 'MagnaGarurumon Chiến Hạm Sói Bạc cất cánh phóng toàn bộ vũ khí Starlight Velocity.', 'x'),
    ],
    ultraStage: makeStage(262, 'Susanoomon', 'Ultra', 'Susanoomon Thần Phá Hủy Và Sáng Tạo Tối Thượng vung thần kiếm Zero Arms Orochi.', 'x'),
  },

  // 50. Armadimon Line
  {
    id: 'digimon-armadimon',
    name: 'Armadimon',
    element: 'nature',
    elementLabel: 'Thiết Giáp & Đất Mẹ',
    accent: '#d97706',
    secondary: '#fef3c7',
    description: 'Armadimon -> Ankylomon -> Shakkoumon -> SlashAngemon -> Vikemon.',
    babyStage: makeStage(263, 'Upamon', 'Baby', 'Upamon kỳ nhông nước vui tính vẫy mang bơi lội.'),
    evolutionChain: [
      makeStage(264, 'Armadimon', 'Rookie', 'Armadimon tê tê bọc giáp cuộn tròn lăn xả Rolling Stone húc đổ rào chắn.'),
      makeStage(265, 'Ankylomon', 'Champion', 'Ankylomon khủng long bọc thép đuôi chùy sắt Megaton Press giáng búa.'),
      makeStage(266, 'Shakkoumon', 'Ultimate', 'Shakkoumon Đất Nung Thần Cổ phóng chùm tia Aramitama đẩy lùi ma chướng.'),
    ],
    megaForms: [
      makeStage(267, 'Slash-Angemon', 'Mega', 'SlashAngemon Thiên Sứ Lưỡi Kiếm biến cả cơ thể thành mũi giáo trừng phạt tà ác.', 'x'),
    ],
    ultraStage: makeStage(268, 'Vikemon', 'Ultra', 'Vikemon Chiến Vương Băng Tuyết nắm giữ uy quyền thống nhất các bộ tộc số.', 'x'),
  },

  // 51. Lalamon Line
  {
    id: 'digimon-lalamon',
    name: 'Lalamon',
    element: 'nature',
    elementLabel: 'Hoa Cỏ & Thảo Mộc',
    accent: '#16a34a',
    secondary: '#dcfce7',
    description: 'Lalamon -> Sunflowmon -> Lilamon -> Rosemon -> Burst Mode.',
    babyStage: makeStage(269, 'Tanemon', 'Baby', 'Tanemon mầm cây nhỏ xinh xắn lắc lư hai chiếc lá non chào ngày mới.'),
    evolutionChain: [
      makeStage(270, 'Lalamon', 'Rookie', 'Lalamon búp hạt giống bay xoay tít hoa trên đầu hát ru Sing a Song.'),
      makeStage(271, 'Sunflowmon', 'Champion', 'Sunflowmon hoa hướng dương mặt trời bắn tia mặt trời Sunshine Beam.'),
      makeStage(272, 'Lilamon', 'Ultimate', 'Lilamon tiên hoa tử đinh hương tỏa hương Beauty Slap quyến rũ kẻ thù.'),
    ],
    megaForms: [
      makeStage(273, 'Rosemon', 'Mega', 'Rosemon Nữ Hoàng Hoa Hồng kiêu kỳ vung roi gai Thorn Whip uyển chuyển sắc lẹm.', 'x'),
    ],
    ultraStage: makeStage(274, 'Rosemon-Burst-Mode', 'Ultra', 'Rosemon Burst Mode thức tỉnh ngọc hồng rực sáng cánh hoa ánh sáng vô hạn.', 'x'),
  },

  // 52. Falcomon Line
  {
    id: 'digimon-falcomon',
    name: 'Falcomon',
    element: 'nature',
    elementLabel: 'Liệp Ưng & Phong Lôi',
    accent: '#0284c7',
    secondary: '#e0f2fe',
    description: 'Falcomon -> Peckmon -> Yatagaramon -> Valkyrimon -> Hououmon.',
    babyStage: makeStage(275, 'Poromon', 'Baby', 'Poromon bóng chim xám có lông đuôi nhảy nhót tinh nghịch.'),
    evolutionChain: [
      makeStage(276, 'Falcomon-2006', 'Rookie', 'Falcomon chim ưng Ninja lướt gió phóng phi tiêu Shuriken cước nhanh như chớp.'),
      makeStage(277, 'Peckmon', 'Champion', 'Peckmon đà điểu kiếm khách cước đá xoáy ngàn cánh Thousand Beak.'),
      makeStage(278, 'Yatagaramon-2006', 'Ultimate', 'Yatagaramon Quạ Thần Ba Chân ánh kim phun tia Dokkoisho chấn động.'),
    ],
    megaForms: [
      makeStage(279, 'Valkyrimon', 'Mega', 'Valkyrimon Chiến Thần Cánh Vàng dẫn lối các linh hồn dũng cảm Fenrir Sword.', 'x'),
    ],
    ultraStage: makeStage(280, 'Hououmon', 'Ultra', 'Hououmon Phượng Hoàng Thần Thánh bốn cánh vàng thanh tẩy thế giới.', 'x'),
  },

  // 53. Kudamon Line
  {
    id: 'digimon-kudamon',
    name: 'Kudamon',
    element: 'holy',
    elementLabel: 'Linh Hồ & Thần Thú',
    accent: '#eab308',
    secondary: '#fef9c3',
    description: 'Kudamon -> Reppamon -> Tyilinmon -> Mitamamon -> Dominimon.',
    babyStage: makeStage(281, 'Tokomon', 'Baby', 'Tokomon bóng trắng tai dài đáng yêu nhưng há miệng răng nanh dọa địch.'),
    evolutionChain: [
      makeStage(282, 'Kudamon', 'Rookie', 'Kudamon chồn thần thánh quấn ống trúc vàng tỏa hào quang Dangan Senpuu.'),
      makeStage(283, 'Reppamon', 'Champion', 'Reppamon chồn đuôi lưỡi hái sắc bén lướt qua để lại vệt chém Kuudaiten.'),
      makeStage(284, 'Tyilinmon', 'Ultimate', 'Tyilinmon Kỳ Lân Thần Thoại bay trên mây lành vung sừng Shippuu Tenshouha.'),
    ],
    megaForms: [
      makeStage(285, 'Mitamamon', 'Mega', 'Mitamamon Thần Thú Rực Sáng thanh tẩy vạn vật bằng làn gió Goufuku.', 'x'),
    ],
    ultraStage: makeStage(286, 'Dominimon', 'Ultra', 'Dominimon Thống Lĩnh Thiên Sứ áo giáp pha lê mang quyền uy thần thánh tối cao.', 'x'),
  },

  // 54. Herissmon Line
  {
    id: 'digimon-herissmon',
    name: 'Herissmon',
    element: 'electric',
    elementLabel: 'Nhím Sét & Cuồng Lôi',
    accent: '#eab308',
    secondary: '#fef9c3',
    description: 'Herissmon -> Filmon -> Stefilmon -> Rasenmon -> Fury Mode.',
    babyStage: makeStage(287, 'Pusumon', 'Baby', 'Pusumon nhím con gai mềm màu kem tò mò khám phá thế giới số.'),
    evolutionChain: [
      makeStage(288, 'Herissmon', 'Rookie', 'Herissmon chú nhím điện phóng gai sấm sét Lightning Quills dũng cảm.'),
      makeStage(289, 'Filmon', 'Champion', 'Filmon nhím chiến binh móng vuốt đỏ xoay người giáng đòn Crimson Slash.'),
      makeStage(290, 'Stefilmon', 'Ultimate', 'Stefilmon nhím thiết giáp cuộn mình thành cơn lốc đinh nhọn bão táp.'),
    ],
    megaForms: [
      makeStage(291, 'Rasenmon', 'Mega', 'Rasenmon Hiệp Sĩ Xoáy Năng Lượng vung móng xoắn ốc Spiral Vanish xuyên thủng phòng ngự.', 'x'),
    ],
    ultraStage: makeStage(292, 'Rasenmon-Fury-Mode', 'Ultra', 'Rasenmon Fury Mode thức tỉnh sức mạnh cuồng phong bảo vệ bạn bè đến cùng.', 'x'),
  },

  // 55. Ludomon Line
  {
    id: 'digimon-ludomon',
    name: 'Ludomon',
    element: 'machine',
    elementLabel: 'Thần Khiên & Vũ Khí Cổ',
    accent: '#0284c7',
    secondary: '#e0f2fe',
    description: 'Ludomon -> TiaLudomon -> RaijiLudomon -> BryweLudramon -> RagnaLordmon.',
    babyStage: makeStage(293, 'Cotsucomon', 'Baby', 'Cotsucomon mũ giáp tí hon bọc giáp sắt kiên cố.'),
    evolutionChain: [
      makeStage(294, 'Ludomon', 'Rookie', 'Ludomon khiên sống Legend-Arms biến thân bảo vệ đồng đội bằng Iron Wall.'),
      makeStage(295, 'Tia-Ludomon', 'Champion', 'TiaLudomon chiến binh song khiên vững chãi phản đòn sấm sét.'),
      makeStage(296, 'Raiji-Ludomon', 'Ultimate', 'RaijiLudomon cỗ xe bọc thép phòng ngự tuyệt đối sấm sét nổ vang.'),
    ],
    megaForms: [
      makeStage(297, 'BryweLudramon', 'Mega', 'BryweLudramon Rồng Khiên Tối Cao phòng tuyến bất khả xâm phạm.', 'x'),
    ],
    ultraStage: makeStage(298, 'RagnaLordmon', 'Ultra', 'RagnaLordmon Tuyệt Kỹ Hợp Thể Thần Kiếm và Thần Khiên thống trị chiến trường.', 'x'),
  },

  // 56. Jazamon Line
  {
    id: 'digimon-jazamon',
    name: 'Jazamon',
    element: 'machine',
    elementLabel: 'Cơ Giới Thần Long',
    accent: '#64748b',
    secondary: '#f1f5f9',
    description: 'Jazamon -> Raptordramon -> Jazarichmon -> Metallicdramon -> Examon.',
    babyStage: makeStage(299, 'Jyarimon', 'Baby', 'Jyarimon rồng con đỏ miệng đầy răng nhọn tinh nghịch.'),
    evolutionChain: [
      makeStage(300, 'Jazamon', 'Rookie', 'Jazamon rồng cơ giới nhỏ phủ lông thép cất cánh lượn lách Tap-tap Flap.'),
      makeStage(301, 'Raptordramon', 'Champion', 'Raptordramon rồng săn mồi bọc giáp titan Chrome Digizoid cắn nát sắt thép.'),
      makeStage(302, 'Jazarichmon', 'Ultimate', 'Jazarichmon long thú phản lực siêu thanh phóng loạt pháo laser hủy diệt.'),
    ],
    megaForms: [
      makeStage(303, 'Metallicdramon', 'Mega', 'Metallicdramon Rồng Kim Loại Cổ Đại sải cánh che rợp bầu trời nã chùm tia chói lòa.', 'x'),
    ],
    ultraStage: makeStage(304, 'Examon', 'Ultra', 'Examon Long Đế Hoàng Gia tối cao kích thước vĩ đại thống lĩnh vạn long vũ trụ.', 'x'),
  },

  // 57. Gumdramon Line
  {
    id: 'digimon-gumdramon',
    name: 'Gumdramon',
    element: 'warrior',
    elementLabel: 'Liệp Long & Chùy Đuôi',
    accent: '#a855f7',
    secondary: '#f3e8ff',
    description: 'Gumdramon -> Arresterdramon -> Superior Mode -> Slayerdramon -> Examon.',
    babyStage: makeStage(305, 'Chibimon', 'Baby', 'Chibimon rồng xanh nhỏ nhảy nhót vui tươi với lòng dũng cảm cổ đại.'),
    evolutionChain: [
      makeStage(306, 'Gumdramon', 'Rookie', 'Gumdramon rồng nhỏ đuôi chùy cao su phóng bay lượn Ran-gum Break.'),
      makeStage(307, 'Arresterdramon', 'Champion', 'Arresterdramon rồng thợ săn tốc độ Mach vung đuôi móc Mach Flickier.'),
      makeStage(308, 'Arresterdramon-Superior-Mode', 'Ultimate', 'Arresterdramon Superior Mode tiến hóa giáp vàng đuôi rồng thần trảm ma.'),
    ],
    megaForms: [
      makeStage(309, 'Slayerdramon', 'Mega', 'Slayerdramon Long Trảm Dũng Sĩ vung trường kiếm rồng Fragarach trảm phong trảm sát.', 'x'),
    ],
    ultraStage: makeStage(310, 'Examon', 'Ultra', 'Examon Long Đế Hoàng Gia tối cao kích thước vĩ đại thống lĩnh vạn long vũ trụ.', 'x'),
  },

  // 58. Shoutmon Line
  {
    id: 'digimon-shoutmon',
    name: 'Shoutmon',
    element: 'warrior',
    elementLabel: 'Vua Thế Giới Số',
    accent: '#ef4444',
    secondary: '#fee2e2',
    description: 'Shoutmon -> Shoutmon X4 -> OmegaShoutmon -> Shoutmon DX -> Shoutmon X7.',
    babyStage: makeStage(311, 'Koromon', 'Baby', 'Koromon bóng hồng tai dài tinh nghịch bắn bong bóng bọt khí.'),
    evolutionChain: [
      makeStage(312, 'Shoutmon', 'Rookie', 'Shoutmon nhiệt huyết cầm micro thét vang Soul Crusher ước mơ thành vua Digimon.'),
      makeStage(313, 'Shoutmon-X4', 'Champion', 'Shoutmon X4 liên kết sức mạnh 4 Digimon vung thanh kiếm Great Sword trảm ác.'),
      makeStage(314, 'Omega-Shoutmon', 'Ultimate', 'OmegaShoutmon thức tỉnh sức mạnh Omegamon bọc giáp vàng rực cháy Heavy Metal Vulcan.'),
    ],
    megaForms: [
      makeStage(315, 'Shoutmon-DX', 'Mega', 'Shoutmon DX hợp thể song long siêu cấp vung song kiếm Victorize Banking.', 'x'),
    ],
    ultraStage: makeStage(316, 'Shoutmon-X7', 'Ultra', 'Shoutmon X7 Vua Digimon Tối Thượng kết tinh niềm tin vạn vật toàn cõi thế giới số.', 'x'),
  },

  // 59. Funbeemon Line
  {
    id: 'digimon-funbeemon',
    name: 'Funbeemon',
    element: 'nature',
    elementLabel: 'Hoàng Gia Côn Trùng',
    accent: '#eab308',
    secondary: '#fef9c3',
    description: 'Funbeemon -> Waspmon -> CannonBeemon -> TigerVespamon -> BanchoStingmon.',
    babyStage: makeStage(317, 'Minomon', 'Baby', 'Minomon nhộng lá đu đưa trên cành kiên nhẫn tích lũy năng lượng.'),
    evolutionChain: [
      makeStage(318, 'Funbeemon', 'Rookie', 'Funbeemon chú ong thợ chăm chỉ phóng kim nhọn Gear Stinger bảo vệ vương quốc.'),
      makeStage(319, 'Waspmon', 'Champion', 'Waspmon ong hộ vệ cơ giới trang bị súng máy Turbo Stinger bay tuần tra.'),
      makeStage(320, 'CannonBeemon', 'Ultimate', 'CannonBeemon pháo đài ong bay khổng lồ phóng loạt tên lửa Sky Rocket.'),
    ],
    megaForms: [
      makeStage(321, 'Tiger-Vespamon', 'Mega', 'TigerVespamon Đội Trưởng Hoàng Gia vung song kiếm Mach Stinger sắc lẹm.', 'x'),
    ],
    ultraStage: makeStage(322, 'Bancho-Stingmon', 'Ultra', 'BanchoStingmon Đại Ca Bọ Ngựa đâm kim nhọn độc môn bất khả chiến bại.', 'x'),
  },

  // 60. Dracumon Line
  {
    id: 'digimon-dracumon',
    name: 'Dracumon',
    element: 'dark',
    elementLabel: 'Huyết Tộc Ma Vương',
    accent: '#7c3aed',
    secondary: '#ede9fe',
    description: 'Dracumon -> Sangloupmon -> Matadrmon -> GrandDracumon -> BelialVamdemon.',
    babyStage: makeStage(323, 'Zurumon', 'Baby', 'Zurumon đốm bùn đen nhầy nhụa độc tố trườn bò trong bóng đêm.'),
    evolutionChain: [
      makeStage(324, 'Dracumon', 'Rookie', 'Dracumon tiểu ma cà rồng tinh ranh phóng mắt tà thuật Eye of Nightmare.'),
      makeStage(325, 'Sangloupmon', 'Champion', 'Sangloupmon huyết lang ngàn năm hóa thành vệt máu đỏ lao vút xé toạc con mồi.'),
      makeStage(326, 'Matadrmon', 'Ultimate', 'Matadrmon đấu sĩ khiêu vũ với lưỡi kiếm nhọn Thousand Arrow hút máu lạnh lùng.'),
    ],
    megaForms: [
      makeStage(327, 'Grand-Dracumon', 'Mega', 'GrandDracumon Chúa Tể Ma Cà Rồng Cổ Tộc Crystal Revolution đóng băng linh hồn.', 'x'),
    ],
    ultraStage: makeStage(328, 'Belial-Vamdemon', 'Ultra', 'BelialVamdemon Quỷ Vương Bạo Ngược vác hai khẩu pháo Sodom và Gomorrah hủy diệt.', 'x'),
  },

  // 61. Gazimon Line
  {
    id: 'digimon-gazimon',
    name: 'Gazimon',
    element: 'dark',
    elementLabel: 'Minh Giới Săn Mồi',
    accent: '#475569',
    secondary: '#f8fafc',
    description: 'Gazimon -> Dobermon -> Cerberumon -> Plutomon -> Anubimon.',
    babyStage: makeStage(329, 'Pagumon', 'Baby', 'Pagumon bóng tím hai tai dài hay cắn chọc ngoáy châm chọc đối thủ.'),
    evolutionChain: [
      makeStage(330, 'Gazimon', 'Rookie', 'Gazimon thú săn bóng tối móng vuốt độc Paralyze Breath giảo hoạt.'),
      makeStage(331, 'Dobermon', 'Champion', 'Dobermon khuyển săn bóng đêm mang nanh xám cất tiếng hú Grau Larm.'),
      makeStage(332, 'Cerberumon', 'Ultimate', 'Cerberumon Chó Ba Đầu gác cổng địa ngục khạc lửa Inferno Gate thiêu tà.'),
    ],
    megaForms: [
      makeStage(333, 'Plutomon', 'Mega', 'Plutomon Minh Vương Tối Cao thống lãnh thế giới ngục tù bóng tối Hades.', 'x'),
    ],
    ultraStage: makeStage(334, 'Anubimon', 'Ultra', 'Anubimon Phán Quan Kim Tự Tháp ban phán quyết luân hồi Ammit.', 'x'),
  },

  // 62. Gizamon Line
  {
    id: 'digimon-gizamon',
    name: 'Gizamon',
    element: 'dark',
    elementLabel: 'Hắc Hải Thủy Quái',
    accent: '#0891b2',
    secondary: '#cffafe',
    description: 'Gizamon -> Gesomon -> Dagomon -> Leviamon -> Neptunemon.',
    babyStage: makeStage(335, 'Upamon', 'Baby', 'Upamon kỳ nhông nước vui tính vẫy mang bơi lội.'),
    evolutionChain: [
      makeStage(336, 'Gizamon', 'Rookie', 'Gizamon thú vây lưng sắc nhọn bơi lội xoay người cắn xoáy Spiral Saw.'),
      makeStage(337, 'Gesomon', 'Champion', 'Gesomon bạch tuộc trắng hắc ám phun mực đen Deadly Shade nuốt chửng ánh sáng.'),
      makeStage(338, 'Dagomon', 'Ultimate', 'Dagomon Tà Thần Biển Sâu cầm trượng bùa chú triệu hồi bão tố Forbidden Sanction.'),
    ],
    megaForms: [
      makeStage(339, 'Leviamon', 'Mega', 'Leviamon Thủy Quái Đố Kỵ khổng lồ há hàm Rostrum nuốt chửng đại dương.', 'x'),
    ],
    ultraStage: makeStage(340, 'Neptunemon', 'Ultra', 'Neptunemon Vua Biển Thần Thoại vung đinh ba King\'s Bite cai quản vạn trùng khơi.', 'x'),
  },

  // 63. Ghostmon Line
  {
    id: 'digimon-ghostmon',
    name: 'Ghostmon',
    element: 'dark',
    elementLabel: 'U Linh & Ma Thần',
    accent: '#6b21a8',
    secondary: '#f3e8ff',
    description: 'Ghostmon -> Bakemon -> SkullMammon -> Beelzebumon -> Blast Mode.',
    babyStage: makeStage(341, 'Zurumon', 'Baby', 'Zurumon đốm bùn đen nhầy nhụa độc tố trườn bò trong bóng đêm.'),
    evolutionChain: [
      makeStage(342, 'Ghostmon', 'Rookie', 'Ghostmon hồn ma đội mũ phù thủy nhỏ thắp nến u linh Little Spook.'),
      makeStage(343, 'Bakemon', 'Champion', 'Bakemon bóng ma khăn trắng lơ lửng tung chưởng ma quái Hell\'s Hand.'),
      makeStage(344, 'Skull-Mammon', 'Ultimate', 'SkullMammon Voi Ma Mút Xương cổ đại giẫm nát mặt đất bằng Spiral Bone.'),
    ],
    megaForms: [
      makeStage(345, 'Beelzebumon', 'Mega', 'Beelzebumon Quỷ Vương Kiêu Hùng cưỡi siêu xe Behemoth xả song súng Double Impact rền vang.', 'x'),
    ],
    ultraStage: makeStage(346, 'Beelzebumon-Blast-Mode', 'Ultra', 'Beelzemon Blast Mode Ma Vương bốn cánh dang rộng súng thần Blaster hủy diệt ma trắc.', 'x'),
  },

  // 64. Gottsumon Line
  {
    id: 'digimon-gottsumon',
    name: 'Gottsumon',
    element: 'nature',
    elementLabel: 'Nham Thạch Địa Chấn',
    accent: '#78716c',
    secondary: '#f5f5f4',
    description: 'Gottsumon -> Golemon -> Gogmamon -> AncientVolcamon -> Blastmon.',
    babyStage: makeStage(347, 'Sunamon', 'Baby', 'Sunamon hạt cát sa mạc nhỏ bé kết tụ thành mầm đá.'),
    evolutionChain: [
      makeStage(348, 'Gottsumon', 'Rookie', 'Gottsumon người đá quặng khoáng cứng cáp ném đá tảng Angry Rock.'),
      makeStage(349, 'Golemon', 'Champion', 'Golemon người đất sét khổng lồ vung nắm đấm nặng ngàn cân Golem Punch.'),
      makeStage(350, 'Gogmamon', 'Ultimate', 'Gogmamon cự thạch quái vật kết tinh đá quý phóng gai Giant Grinder.'),
    ],
    megaForms: [
      makeStage(351, 'Ancient-Volcamon', 'Mega', 'AncientVolcamon Hỏa Thần Núi Lửa Thập Đấu Sĩ phát nổ Supernova địa chấn.', 'x'),
    ],
    ultraStage: makeStage(352, 'Blastmon', 'Ultra', 'Blastmon Ma Thần Kim Cương lấp lánh tung nắm đấm phá hủy Diamond Machine Gun.', 'x'),
  },

  // 65. Sunarizamon Line
  {
    id: 'digimon-sunarizamon',
    name: 'Sunarizamon',
    element: 'nature',
    elementLabel: 'Sa Mạc & Long Tích',
    accent: '#ca8a04',
    secondary: '#fef08a',
    description: 'Sunarizamon -> Tortamon -> Gogmamon -> Spinomon -> AncientVolcamon.',
    babyStage: makeStage(353, 'Sunamon', 'Baby', 'Sunamon hạt cát sa mạc nhỏ bé kết tụ thành mầm đá.'),
    evolutionChain: [
      makeStage(354, 'Sunarizamon', 'Rookie', 'Sunarizamon thằn lằn cát sa mạc ẩn mình phóng bão cát Sand Blast.'),
      makeStage(355, 'Tortamon', 'Champion', 'Tortamon rùa gai đá mai nhọn xoay tít đâm xuyên chướng ngại Shell Phalanx.'),
      makeStage(356, 'Gogmamon', 'Ultimate', 'Gogmamon cự thạch quái vật kết tinh đá quý phóng gai Giant Grinder.'),
    ],
    megaForms: [
      makeStage(357, 'Spinomon', 'Mega', 'Spinomon khủng long gai lưng sắc lẹm phóng ngàn lưỡi dao Sonic Slash Caber.', 'x'),
    ],
    ultraStage: makeStage(358, 'Ancient-Volcamon', 'Ultra', 'AncientVolcamon Hỏa Thần Núi Lửa Thập Đấu Sĩ phát nổ Supernova địa chấn.', 'x'),
  },

  // 66. Kokabuterimon Line
  {
    id: 'digimon-kokabuterimon',
    name: 'Kokabuterimon',
    element: 'nature',
    elementLabel: 'Hắc Giáp Bọ Kìm',
    accent: '#15803d',
    secondary: '#dcfce7',
    description: 'Kokabuterimon -> Kuwagamon -> Okuwamon -> GranKuwagamon -> Grandis.',
    babyStage: makeStage(359, 'Minomon', 'Baby', 'Minomon nhộng lá đu đưa trên cành kiên nhẫn tích lũy năng lượng.'),
    evolutionChain: [
      makeStage(360, 'Kokabuterimon', 'Rookie', 'Kokabuterimon bọ cánh cứng nhỏ đôi kìm chắc khỏe húc bật đối thủ.'),
      makeStage(361, 'Kuwagamon', 'Champion', 'Kuwagamon bọ kìm hung hãn bay rít kẹp đôi kéo sắc bén Scissor Arms.'),
      makeStage(362, 'Okuwamon', 'Ultimate', 'Okuwamon bọ kìm bóng đêm bọc giáp gai kẹp đôi gọng sắt Double Scissor Claw.'),
    ],
    megaForms: [
      makeStage(363, 'Gran-Kuwagamon', 'Mega', 'GranKuwagamon Chúa Tể Rừng Rậm móng vuốt Dimension Scissor xé toạc không gian.', 'x'),
    ],
    ultraStage: makeStage(364, 'Grandis-Kuwagamon', 'Ultra', 'GrandisKuwagamon Hoàng Đế Bọ Kìm Thép sải cánh xé toạc màn đêm vũ trụ.', 'x'),
  },

  // 67. Kokuwamon Line
  {
    id: 'digimon-kokuwamon',
    name: 'Kokuwamon',
    element: 'machine',
    elementLabel: 'Lôi Điện Cơ Giới Bọ',
    accent: '#0284c7',
    secondary: '#e0f2fe',
    description: 'Kokuwamon -> BladeKuwagamon -> MetallifeKuwagamon -> TyrantKabuterimon -> Grandis.',
    babyStage: makeStage(365, 'Cotsucomon', 'Baby', 'Cotsucomon mũ giáp tí hon bọc giáp sắt kiên cố.'),
    evolutionChain: [
      makeStage(366, 'Kokuwamon', 'Rookie', 'Kokuwamon bọ kìm cơ điện phóng dòng điện 1 triệu volt Scissor Arms.'),
      makeStage(367, 'Blade-Kuwagamon', 'Champion', 'BladeKuwagamon kiếm bay kim loại lao vút như phi đao Spark Blade.'),
      makeStage(368, 'Metallife-Kuwagamon', 'Ultimate', 'MetallifeKuwagamon xạ thủ súng máy đôi tay nã đạn Homing Laser.'),
    ],
    megaForms: [
      makeStage(369, 'Tyrant-Kabuterimon', 'Mega', 'TyrantKabuterimon Bạo Chúa Côn Trùng bọc giáp tím phóng hào quang Shine of Bee.', 'x'),
    ],
    ultraStage: makeStage(370, 'Grandis-Kuwagamon', 'Ultra', 'GrandisKuwagamon Hoàng Đế Bọ Kìm Thép sải cánh xé toạc màn đêm vũ trụ.', 'x'),
  },

  // 68. Pomumon Line
  {
    id: 'digimon-pomumon',
    name: 'Pomumon',
    element: 'nature',
    elementLabel: 'Nhiệt Đới Thảo Mộc',
    accent: '#84cc16',
    secondary: '#ecfccb',
    description: 'Pomumon -> Parasaurmon -> Toropiamon -> Hydramon -> BloomLordmon.',
    babyStage: makeStage(371, 'Tanemon', 'Baby', 'Tanemon mầm cây nhỏ xinh xắn lắc lư hai chiếc lá non chào ngày mới.'),
    evolutionChain: [
      makeStage(372, 'Pomumon', 'Rookie', 'Pomumon quả mọng nhiệt đới lông xù đáng yêu phun hạt Rapid Seed.'),
      makeStage(373, 'Parasaurmon', 'Champion', 'Parasaurmon khủng long hoa cỏ bờm lá phát sáng ngạt ngào Parasaura Rush.'),
      makeStage(374, 'Toropiamon', 'Ultimate', 'Toropiamon rồng thực vật bốn cánh hoa phun sương độc Tropical Hazard.'),
    ],
    megaForms: [
      makeStage(375, 'Hydramon', 'Mega', 'Hydramon Rồng Hoa Nhiều Đầu rễ cây khổng lồ trói chặt đối thủ Gran Chariot.', 'x'),
    ],
    ultraStage: makeStage(376, 'Bloom-Lordmon', 'Ultra', 'BloomLordmon Thánh Kiếm Hoa Tối Cao vung kiếm bách hoa thanh tẩy ô trọc.', 'x'),
  },

  // 69. Morphomon Line
  {
    id: 'digimon-morphomon',
    name: 'Morphomon',
    element: 'nature',
    elementLabel: 'Điệp Vũ Tiên Nữ',
    accent: '#38bdf8',
    secondary: '#e0f2fe',
    description: 'Morphomon -> Hudiemon -> Lilimon -> Rosemon -> BanchoLilimon.',
    babyStage: makeStage(377, 'Minomon', 'Baby', 'Minomon nhộng lá đu đưa trên cành kiên nhẫn tích lũy năng lượng.'),
    evolutionChain: [
      makeStage(378, 'Morphomon', 'Rookie', 'Morphomon bướm ngọc nhỏ bé vẫy cánh phấn lấp lánh chữa lành Rinpyou.'),
      makeStage(379, 'Hudiemon', 'Champion', 'Hudiemon thiếu nữ cánh bướm ký ức lượn bay uyển chuyển Flying Kick.'),
      makeStage(380, 'Lilimon', 'Ultimate', 'Lilimon tiên nữ hoa nhỏ nhắn nở từ búp hoa sen hồng thơm ngát Flow\' Cannon.'),
    ],
    megaForms: [
      makeStage(381, 'Rosemon', 'Mega', 'Rosemon Nữ Hoàng Hoa Hồng kiêu kỳ vung roi gai Thorn Whip uyển chuyển sắc lẹm.', 'x'),
    ],
    ultraStage: makeStage(382, 'Bancho-Lilimon', 'Ultra', 'BanchoLilimon Nữ Quái Học Đường bọc xích sắt Yo-Yo giáng đòn công lý.', 'x'),
  },

  // 70. Espimon Line
  {
    id: 'digimon-espimon',
    name: 'Espimon',
    element: 'machine',
    elementLabel: 'Thiết Kỷ Trinh Sát',
    accent: '#0284c7',
    secondary: '#e0f2fe',
    description: 'Espimon -> HoverEspimon -> Giromon -> HiAndromon -> HeavyLeomon.',
    babyStage: makeStage(383, 'Cotsucomon', 'Baby', 'Cotsucomon mũ giáp tí hon bọc giáp sắt kiên cố.'),
    evolutionChain: [
      makeStage(384, 'Espimon', 'Rookie', 'Espimon robot trinh sát bay lượn tìm kiếm thông tin với dù xoay Mot-Spindle.'),
      makeStage(385, 'Hover-Espimon', 'Champion', 'HoverEspimon phi thuyền chiến đấu bay lượn phóng tên lửa chính xác cao.'),
      makeStage(386, 'Giromon', 'Ultimate', 'Giromon thủy lôi bay cơ giới trang bị cưa xích tử thần Deadly Bomb.'),
    ],
    megaForms: [
      makeStage(387, 'Hi-Andromon', 'Mega', 'HiAndromon Người Máy Tối Thượng bọc hợp kim Chrome Digizoid phóng tia Atomic Ray.', 'x'),
    ],
    ultraStage: makeStage(388, 'Heavy-Leomon', 'Ultra', 'HeavyLeomon Pháo Đài Sư Tử Thép bọc giáp siêu trọng cơ giới nã pháo Barrage.', 'x'),
  },

  // 71. Phascomon Line
  {
    id: 'digimon-phascomon',
    name: 'Phascomon',
    element: 'dark',
    elementLabel: 'Lãn Đọa Ma Vương',
    accent: '#581c87',
    secondary: '#f3e8ff',
    description: 'Phascomon -> Porcupamon -> Astamon -> Belphemon -> Lucemon.',
    babyStage: makeStage(389, 'Pagumon', 'Baby', 'Pagumon bóng tím hai tai dài hay cắn chọc ngoáy châm chọc đối thủ.'),
    evolutionChain: [
      makeStage(390, 'Phascomon', 'Rookie', 'Phascomon gấu lười bóng đêm mắt thâm ngái ngủ ru kẻ địch ngủ Evil Pollen.'),
      makeStage(391, 'Porcupamon', 'Champion', 'Porcupamon thú gai nhím nhồi bông quái đản phóng gai độc châm chọc.'),
      makeStage(392, 'Astamon', 'Ultimate', 'Astamon Hoàng Tử Quỷ Tộc khoác áo măng tô vung súng tiểu liên Oro Salmón.'),
    ],
    megaForms: [
      makeStage(393, 'Belphemon-Rage-Mode', 'Mega', 'Belphemon Rage Mode Ma Vương Thức Tỉnh gầm rền vang ngàn xiềng xích Lampranthus.', 'x'),
    ],
    ultraStage: makeStage(394, 'Lucemon-Falldown-Mode', 'Ultra', 'Lucemon Sa Ngã nửa thiên thần nửa ác quỷ nắm giữ sinh tử Paradise Lost.', 'x'),
  },

  // 72. Bemmon Line
  {
    id: 'digimon-bemmon',
    name: 'Bemmon',
    element: 'dark',
    elementLabel: 'Ngoại Tinh Xâm Lăng',
    accent: '#3b82f6',
    secondary: '#dbeafe',
    description: 'Bemmon -> Snatchmon -> Destromon -> Ragnamon -> Armagemon.',
    babyStage: makeStage(395, 'Zurumon', 'Baby', 'Zurumon đốm bùn đen nhầy nhụa độc tố trườn bò trong bóng đêm.'),
    evolutionChain: [
      makeStage(396, 'Bemmon', 'Rookie', 'Bemmon sinh vật ngoài hành tinh đầu ngón tay hấp thụ dữ liệu số hút cạn kẻ thù.'),
      makeStage(397, 'Snatchmon', 'Champion', 'Snatchmon kẻ săn linh hồn hợp nhất dữ liệu di chuyển bằng tốc độ ánh sáng.'),
      makeStage(398, 'Destromon', 'Ultimate', 'Destromon cỗ máy hủy diệt cơ khí pháo hạm nổi xóa sổ toàn bộ dữ liệu.'),
    ],
    megaForms: [
      makeStage(399, 'Ragnamon', 'Mega', 'Ragnamon Quái Vật Không Gian Tối Cổ hòa làm một với vệ tinh quỹ đạo.', 'x'),
    ],
    ultraStage: makeStage(400, 'Armagemon', 'Ultra', 'Armagemon Tà Ma Tận Thế nuốt chửng toàn bộ thế giới số vào cõi hư vô.', 'x'),
  },

  // 73. Koemon Line
  {
    id: 'digimon-koemon',
    name: 'Koemon',
    element: 'warrior',
    elementLabel: 'Linh Hầu & Ca Vương',
    accent: '#eab308',
    secondary: '#fef9c3',
    description: 'Koemon -> Hanumon -> Etemon -> MetalEtemon -> KingEtemon.',
    babyStage: makeStage(401, 'Pagumon', 'Baby', 'Pagumon bóng tím hai tai dài hay cắn chọc ngoáy châm chọc đối thủ.'),
    evolutionChain: [
      makeStage(402, 'Koemon', 'Rookie', 'Koemon khỉ con nghịch ngợm cầm súng cao su bắn hạt dẻ Baby Sling.'),
      makeStage(403, 'Hanumon', 'Champion', 'Hanumon Khỉ Vàng Cổ Tộc vung gậy bổng mạ vàng giáng bão táp gầm thét.'),
      makeStage(404, 'Etemon', 'Ultimate', 'Etemon vua khỉ gấu bông cầm micro gầm hát Love Serenade làm tê liệt kẻ thù.'),
    ],
    megaForms: [
      makeStage(405, 'Metal-Etemon', 'Mega', 'MetalEtemon Khỉ Thép mạ Chrome Digizoid tung cú đấm chuối thép cứng cáp.', 'x'),
    ],
    ultraStage: makeStage(406, 'King-Etemon', 'Ultra', 'KingEtemon Hoàng Đế Khỉ Vàng vương miện rực rỡ phong danh Vua của các vị Vua.', 'x'),
  },

  // 74. Luxmon Line
  {
    id: 'digimon-luxmon',
    name: 'Luxmon',
    element: 'holy',
    elementLabel: 'Quang Minh Thánh Vực',
    accent: '#f59e0b',
    secondary: '#fef3c7',
    description: 'Luxmon -> Angemon -> HolyAngemon -> Seraphimon -> Dominimon.',
    babyStage: makeStage(407, 'Poyomon', 'Baby', 'Poyomon sinh vật sứa nước biển nhỏ bé trôi dạt mang bong bóng khí.'),
    evolutionChain: [
      makeStage(408, 'Luxmon', 'Rookie', 'Luxmon thiên sứ hài đồng mang đôi cánh ánh sáng ban phước lành thanh khiết.'),
      makeStage(409, 'Angemon', 'Champion', 'Angemon Thiên Sứ Sáu Cánh vung gậy thánh Holy Rod tung cú đấm quyền năng Heaven\'s Knuckle.'),
      makeStage(410, 'Holy-Angemon', 'Ultimate', 'HolyAngemon Đại Thiên Thần mở Cổng Thiên Đàng Heaven\'s Gate phong ấn ma vương.'),
    ],
    megaForms: [
      makeStage(411, 'Seraphimon', 'Mega', 'Seraphimon Thống Lĩnh Ba Đại Thiên Thần giáp vàng rực rỡ phóng thiên thạch Seven Heavens.', 'x'),
    ],
    ultraStage: makeStage(412, 'Dominimon', 'Ultra', 'Dominimon Thống Lĩnh Thiên Sứ áo giáp pha lê mang quyền uy thần thánh tối cao.', 'x'),
  },

  // 75. Tinkermon Line
  {
    id: 'digimon-tinkermon',
    name: 'Tinkermon',
    element: 'nature',
    elementLabel: 'Tố Nữ & Cuồng Phong',
    accent: '#06b6d4',
    secondary: '#cffafe',
    description: 'Tinkermon -> Fairimon -> Shutumon -> AncientIrismon -> JetSilphymon.',
    babyStage: makeStage(413, 'Tanemon', 'Baby', 'Tanemon mầm cây nhỏ xinh xắn lắc lư hai chiếc lá non chào ngày mới.'),
    evolutionChain: [
      makeStage(414, 'Tinkermon', 'Rookie', 'Tinkermon tiên nữ tí hon bay lượn rắc phấn tiên Speed Nightmare.'),
      makeStage(415, 'Fairimon', 'Champion', 'Fairimon Chiến Binh Gió uyển chuyển tung cước vũ điệu bão táp Tornado Gamba.'),
      makeStage(416, 'Shutumon', 'Ultimate', 'Shutumon Thần Điểu Tố Nữ sải cánh lượn gió chém gió sắc Gilgamesh Slicer.'),
    ],
    megaForms: [
      makeStage(417, 'Ancient-Irismon', 'Mega', 'AncientIrismon Nữ Thần Cầu Vồng Thập Đấu Sĩ vũ điệu vạn sắc vòm trời.', 'x'),
    ],
    ultraStage: makeStage(418, 'Jet-Silphymon', 'Ultra', 'JetSilphymon Thần Phong Phản Lực xoay vòng xoáy lốc Jet Bester siêu thanh.', 'x'),
  },

  // 76. Ukkomon Line
  {
    id: 'digimon-ukkomon',
    name: 'Ukkomon',
    element: 'holy',
    elementLabel: 'Ước Nguyện Thần Linh',
    accent: '#ec4899',
    secondary: '#fce7f3',
    description: 'Ukkomon -> BigUkkomon -> MarinAngemon -> Cherubimon -> Ophanimon.',
    babyStage: makeStage(419, 'Poyomon', 'Baby', 'Poyomon sinh vật sứa nước biển nhỏ bé trôi dạt mang bong bóng khí.'),
    evolutionChain: [
      makeStage(420, 'Ukkomon', 'Rookie', 'Ukkomon sinh vật ước nguyện ban điều ước cho những tâm hồn cô đơn.'),
      makeStage(421, 'Big-Ukkomon', 'Champion', 'BigUkkomon dạng biến hình khổng lồ che chở chúng sinh bằng vòng tay ấm áp.'),
      makeStage(422, 'Marin-Angemon', 'Ultimate', 'MarinAngemon Thiên Thần Biển Nhỏ bé phóng trái tim Ocean Love chữa lành vạn vật.'),
    ],
    megaForms: [
      makeStage(423, 'Cherubimon-Virtue', 'Mega', 'Cherubimon Đại Thiên Thần Trí Tuệ phóng sấm sét phán xét Lightning Spear.', 'x'),
    ],
    ultraStage: makeStage(424, 'Ophanimon', 'Ultra', 'Ophanimon Thánh Mẫu Tình Yêu mang lao ánh sáng Eden\'s Javelin thanh tẩy tà niệm.', 'x'),
  },

  // 77. SnowGoblimon Line
  {
    id: 'digimon-snow-goblimon',
    name: 'SnowGoblimon',
    element: 'ice',
    elementLabel: 'Băng Nguyên Dã Thú',
    accent: '#38bdf8',
    secondary: '#e0f2fe',
    description: 'SnowGoblimon -> Mojyamon -> Panjyamon -> SaberLeomon -> Vikemon.',
    babyStage: makeStage(425, 'Pagumon', 'Baby', 'Pagumon bóng tím hai tai dài hay cắn chọc ngoáy châm chọc đối thủ.'),
    evolutionChain: [
      makeStage(426, 'Snow-Goblimon', 'Rookie', 'SnowGoblimon yêu tinh tuyết ném cầu tuyết băng giá Snow Ball lém lỉnh.'),
      makeStage(427, 'Mojyamon', 'Champion', 'Mojyamon người tuyết lông trắng bờm dày ném xương băng Bone Boomerang.'),
      makeStage(428, 'Panjyamon', 'Ultimate', 'Panjyamon Bạch Sư Dũng Sĩ băng giá vung quyền Hyoujiken đóng băng đối thủ.'),
    ],
    megaForms: [
      makeStage(429, 'Saber-Leomon', 'Mega', 'SaberLeomon Sư Tử Nanh Kiếm tốc độ Mach lao cắn xé Infinity Dart.', 'x'),
    ],
    ultraStage: makeStage(430, 'Vikemon', 'Ultra', 'Vikemon Chiến Vương Băng Tuyết nắm giữ uy quyền thống nhất các bộ tộc số.', 'x'),
  },
];

export function getDigimonFamilyById(id: string): MascotFamily {
  return DIGIMON_FAMILIES.find((item) => item.id === id) ?? DIGIMON_FAMILIES[0];
}

export const EVOLUTION_THRESHOLDS = [0, 10, 20]; // 0: Level 1, 10: Level 2, 20: Level 3
