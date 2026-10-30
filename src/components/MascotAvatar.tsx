import React, { useState } from 'react';
import type { DigimonAction, EvolutionStage, MascotFamily } from '@/types';
import { getDigimonAnimation, DIGITAMA_STAGE, getFullEvolutionChain } from '@/data/digimon-catalog';

interface MascotAvatarProps {
  family: MascotFamily;
  level: number;
  stage?: EvolutionStage;
  size?: number;
  glow?: boolean;
  animate?: boolean;
  action?: DigimonAction;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  family,
  level,
  stage: providedStage,
  size = 140,
  glow = false,
  animate: _animate = true,
  action = 'idle',
  interactive = true,
  className = '',
  onClick,
}) => {
  const [errorMap, setErrorMap] = useState<Record<string, number>>({});
  const [isHovered, setIsHovered] = useState(false);

  // Check if egg stage
  const isEgg = level === 0 || providedStage?.stageName === 'Egg' || providedStage?.name === 'Trứng Digitama' || providedStage?.id === 0;

  // Safe stage lookup across full chain (from lowest stage 1 to final stage N)
  const stages = family ? getFullEvolutionChain(family) : [];
  const safeLevel = Math.max(1, Math.min(stages.length || 1, level));
  const currentStage: EvolutionStage = isEgg
    ? DIGITAMA_STAGE
    : providedStage ||
      stages[safeLevel - 1] ||
      family?.evolutionChain?.[0] ||
      DIGITAMA_STAGE;

  // Resolve current active action (hover triggers walk if idle)
  const activeAction: DigimonAction = action !== 'idle' ? action : isHovered && interactive ? 'walk' : 'idle';
  const imgKey = `${currentStage?.name}-${activeAction}`;
  const errCount = errorMap[imgKey] || 0;

  const animationSrc = currentStage?.name ? getDigimonAnimation(currentStage.name, activeAction) : '';
  const primarySrc = animationSrc || currentStage?.animatedPath || currentStage?.artworkPath;
  const fallbackSrc = currentStage?.artworkPath || currentStage?.animatedPath;
  
  let imageSrc = primarySrc;
  if (errCount === 1) {
    imageSrc = fallbackSrc && fallbackSrc !== primarySrc ? fallbackSrc : (isEgg ? '/assets/digimon/sprites/digitama.png' : '/assets/digimon/sprites/agumon.png');
  } else if (errCount >= 2) {
    imageSrc = isEgg ? '/assets/digimon/sprites/digitama.png' : '/assets/digimon/sprites/agumon.png';
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.25s ease',
      }}
      title={isEgg ? 'Digitama' : `${currentStage.name} - ${family.name}`}
    >
      {/* Sprite Image Container with dynamic action motion & ENLARGED SCALE (Clean, no background circles) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isEgg
            ? isHovered ? 'scale(0.88) rotate(-4deg)' : 'scale(0.8)'
            : activeAction === 'attack'
            ? 'scale(1.48)'
            : activeAction === 'happy'
              ? 'scale(1.42) translateY(-3px)'
              : activeAction === 'sleep'
                ? 'scale(1.24) translateY(2px)'
                : isHovered
                  ? 'scale(1.38)'
                  : 'scale(1.32)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <img
          key={imgKey}
          src={imageSrc}
          alt={currentStage.name}
          className={isEgg ? 'animate-egg-wobble' : ''}
          onError={() => setErrorMap((prev) => ({ ...prev, [imgKey]: (prev[imgKey] || 0) + 1 }))}
          style={{
            width: isEgg ? '80%' : '92%',
            height: isEgg ? '80%' : '92%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            filter: isEgg
              ? 'drop-shadow(0 4px 10px rgba(239, 68, 68, 0.35))'
              : glow || activeAction === 'attack'
              ? 'drop-shadow(0 6px 14px rgba(227, 31, 38, 0.45))'
              : activeAction === 'happy'
                ? 'drop-shadow(0 6px 14px rgba(227, 31, 38, 0.35))'
                : activeAction === 'sleep'
                  ? 'drop-shadow(0 3px 6px rgba(15, 23, 42, 0.12)) opacity(0.85)'
                  : 'drop-shadow(0 4px 10px rgba(15, 23, 42, 0.12))',
            pointerEvents: 'none',
            transition: 'filter 0.3s ease',
          }}
          loading="eager"
        />
      </div>
    </div>
  );
};
