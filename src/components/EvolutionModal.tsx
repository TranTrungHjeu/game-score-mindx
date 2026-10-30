import React, { useEffect, useState } from 'react';
import type { EvolutionEvent } from '@/types';
import { fireConfettiBurst, fireSideCannons } from '@/services/sound';
import { getDigimonAnimation } from '@/data/digimon-catalog';
import { X, ArrowRight } from 'lucide-react';

interface EvolutionModalProps {
  event: EvolutionEvent | null;
  onClose: () => void;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({ event, onClose }) => {
  const [phase, setPhase] = useState<'charging' | 'flash' | 'revealed'>('charging');

  useEffect(() => {
    if (!event) return;

    const timer1 = setTimeout(() => {
      setPhase('flash');
    }, 1100);

    const timer2 = setTimeout(() => {
      setPhase('revealed');
      fireConfettiBurst();
      if (event.isMega) {
        fireSideCannons();
      }
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [event]);

  if (!event) return null;

  const currentStage = phase === 'revealed' ? event.toStage : event.fromStage;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Main Evolution Stage Card - Red & White Sharp Gaming Aesthetic */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 620,
          width: '100%',
          padding: '36px 32px 32px',
          textAlign: 'center',
          border: '2px solid var(--primary)',
          borderRadius: '0px',
          boxShadow: '0 25px 60px -10px rgba(227, 31, 38, 0.3), 0 0 0 1px rgba(227, 31, 38, 0.25)',
          background: '#ffffff',
        }}
      >
        {/* Close Button on Card Corner */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(241, 245, 249, 0.95)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            borderRadius: '0px',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.15s ease',
          }}
          title="Đóng cửa sổ"
        >
          <X size={20} />
        </button>

        {/* Team Name Heading */}
        <h2 className="font-game" style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: 16 }}>
          {event.teamName}
        </h2>

        {/* Big Sprite Presentation Area (Clean, NO background circles, Large Epic Sprite) */}
        <div
          style={{
            position: 'relative',
            height: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0 16px',
          }}
        >
          <img
            src={
              phase === 'revealed' && currentStage?.name
                ? getDigimonAnimation(currentStage.name, 'happy')
                : currentStage.animatedPath || currentStage.artworkPath
            }
            alt={currentStage.name}
            onError={(e) => {
              const currentSrc = e.currentTarget.getAttribute('src');
              if (currentStage?.artworkPath && currentSrc !== currentStage.artworkPath) {
                e.currentTarget.src = currentStage.artworkPath;
              } else if (currentStage?.animatedPath && currentSrc !== currentStage.animatedPath) {
                e.currentTarget.src = currentStage.animatedPath;
              } else {
                e.currentTarget.src = '/assets/digimon/sprites/agumon.png';
              }
            }}
            style={{
              width: 175,
              height: 175,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              filter:
                phase === 'flash'
                  ? 'brightness(3.2) contrast(1.8) drop-shadow(0 0 35px var(--primary))'
                  : phase === 'revealed'
                    ? 'drop-shadow(0 14px 28px rgba(227, 31, 38, 0.45))'
                    : 'drop-shadow(0 6px 14px rgba(15, 23, 42, 0.18))',
              transform: phase === 'revealed' ? 'scale(1.22)' : 'scale(1)',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Stage Name Transition: Old -> New */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            margin: '12px 0 14px',
            fontSize: '1.25rem',
            fontWeight: 800,
          }}
        >
          {event.fromStage.name !== event.toStage.name && (
            <>
              <span
                className="font-game"
                style={{
                  color: 'var(--text-dim)',
                  textDecoration: phase === 'revealed' ? 'line-through' : 'none',
                  fontSize: '1.4rem',
                }}
              >
                {event.fromStage.name}
              </span>
              <ArrowRight size={22} color="var(--primary)" />
            </>
          )}
          <span
            className="font-game"
            style={{
              fontSize: '2.2rem',
              color: 'var(--primary)',
              textShadow: phase === 'revealed' ? '0 2px 12px rgba(227, 31, 38, 0.25)' : 'none',
              letterSpacing: '0.02em',
            }}
          >
            {event.toStage.name}
          </span>
        </div>

        {/* Done / Continue Button */}
        <button
          type="button"
          className="btn-action btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1.1rem', borderRadius: '0px', marginTop: 12 }}
          onClick={onClose}
        >
          <ArrowRight size={20} />
          Tuyệt vời! Tiếp tục bài học
        </button>
      </div>
    </div>
  );
};
