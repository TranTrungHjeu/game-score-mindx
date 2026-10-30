import React, { useState, useEffect } from 'react';
import type { DigimonAction, Team } from '@/types';
import { MascotAvatar } from './MascotAvatar';
import { getStageForScore } from '@/data/digimon-catalog';
import { Zap, Play, Crown } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  isLeader?: boolean;
  onScore: (teamId: string, delta: number) => void;
  onMegaEvolve?: (teamId: string) => void;
  onReplayEvolution?: (teamId: string) => void;
  onTriggerAction?: (teamId: string, action: DigimonAction) => void;
  isTeacherView?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isLeader = false,
  onScore,
  onMegaEvolve,
  onReplayEvolution,
  onTriggerAction,
  isTeacherView = true,
}) => {
  const [prevTimestamp, setPrevTimestamp] = useState<number | undefined>(team.lastActionTimestamp);
  const [activeAction, setActiveAction] = useState<DigimonAction>(team.lastAction || 'idle');

  if (team.lastActionTimestamp !== prevTimestamp) {
    setPrevTimestamp(team.lastActionTimestamp);
    setActiveAction(team.lastAction || 'idle');
  }

  useEffect(() => {
    if (activeAction !== 'idle') {
      const duration = activeAction === 'attack' ? 2200 : activeAction === 'sleep' ? 2400 : 1800;
      const timer = setTimeout(() => {
        setActiveAction('idle');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [activeAction, prevTimestamp]);

  const handleCycleAction = () => {
    const actions: DigimonAction[] = ['idle', 'walk', 'attack', 'happy', 'sleep'];
    const nextIdx = (actions.indexOf(activeAction) + 1) % actions.length;
    const nextAct = actions[nextIdx];
    if (onTriggerAction) {
      onTriggerAction(team.id, nextAct);
    } else {
      setActiveAction(nextAct);
    }
  };

  const isEgg = Boolean(team.isEgg || team.score < 0 || team.unlockedLevel === 0);
  const stageInfo = getStageForScore(team.family, team.score, isEgg, 20);
  const currentStage = stageInfo.stage;
  const currentLevel = stageInfo.level;
  const nextStage = stageInfo.nextStage;
  const nextMilestone = stageInfo.nextMilestone;
  const milestones = stageInfo.milestones;
  const stages = stageInfo.stages;

  const canMega = !isEgg && !team.megaActive && currentLevel >= stages.length - 1 && stages.length > 3;

  return (
    <div
      className={`glass-panel ${isEgg ? 'is-egg-mode' : ''}`}
      style={{
        padding: '20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 16,
        border: isEgg
          ? '2px solid #ef4444'
          : isLeader
          ? '2px solid var(--primary)'
          : '1px solid var(--border-subtle)',
        boxShadow: isLeader
          ? '0 12px 30px -4px rgba(227, 31, 38, 0.15)'
          : 'var(--shadow-card)',
        background: isEgg ? 'rgba(254, 242, 242, 0.75)' : undefined,
      }}
    >
      {/* Top Header: Name */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h3
          className="font-game"
          style={{
            fontSize: '1.5rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isLeader && (
            <span title="Đang dẫn đầu" style={{ display: 'inline-flex' }}>
              <Crown size={20} style={{ color: 'var(--primary)' }} />
            </span>
          )}
          <span>{team.name}</span>
        </h3>

        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isEgg ? '#dc2626' : 'var(--text-dim)' }}>
          {isEgg ? 'Digitama' : currentStage.name}
        </div>
      </div>

      {/* Center Display: Mascot Avatar To Lớn (150px) & Điểm Số */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '8px 0' }}>
        <div
          onClick={handleCycleAction}
          style={{ cursor: 'pointer', flexShrink: 0 }}
          title={isEgg ? 'Digitama' : 'Nhấn vào linh vật để đổi hiệu ứng'}
        >
          <MascotAvatar
            family={team.family}
            level={currentLevel}
            stage={currentStage}
            size={150}
            action={activeAction}
            glow={!isEgg && (isLeader || currentLevel === stages.length)}
          />
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div
            className="font-game"
            style={{
              fontSize: '3.6rem',
              lineHeight: 1,
              color: team.score < 0 ? '#dc2626' : isLeader ? 'var(--primary)' : 'var(--text-main)',
              textShadow: team.score < 0
                ? '0 2px 12px rgba(220, 38, 38, 0.4)'
                : isLeader
                ? '0 2px 10px rgba(227, 31, 38, 0.2)'
                : 'none',
            }}
          >
            {team.score}
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: team.score < 0 ? '#dc2626' : 'var(--text-dim)', letterSpacing: '0.04em' }}>
            PTS
          </div>
        </div>
      </div>

      {/* Energy Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: 8 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {isEgg ? (
              <span style={{ color: '#dc2626' }}>Cần gỡ điểm để nở trứng!</span>
            ) : nextStage && nextMilestone !== null ? (
              <span>Tiến hóa tiếp: <strong style={{ color: 'var(--primary)' }}>{nextStage.name}</strong> ({nextMilestone} PTS)</span>
            ) : (
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Đạt cấp tối thượng</span>
            )}
          </span>
          <span style={{ fontWeight: 800, color: team.score < 0 ? '#dc2626' : 'var(--text-dim)' }}>
            {team.score >= 20 ? `${team.score} PTS (MAX)` : `${team.score}/20 PTS`}
          </span>
        </div>
        <div className="progress-track" style={{ height: 12, position: 'relative' }}>
          {/* Milestone markers along the track */}
          {milestones.slice(1, -1).map((m, idx) => (
            <div
              key={`ms-card-${m}-${idx}`}
              style={{
                position: 'absolute',
                left: `${(m / 20) * 100}%`,
                top: 0,
                bottom: 0,
                width: 2,
                background: 'rgba(255, 255, 255, 0.75)',
                zIndex: 3,
              }}
              title={`Mốc tiến hóa: ${stages[idx + 1]?.name} (${m} điểm)`}
            />
          ))}

          <div
            className="progress-fill"
            style={{
              width: `${Math.max(0, Math.min(100, (team.score / 20) * 100))}%`,
              background: isEgg ? '#ef4444' : 'linear-gradient(90deg, var(--primary), #ff4d4f)',
            }}
          />
        </div>
      </div>

      {/* Teacher Controls (Only in Teacher View - Tinh gọn, 1 hàng) */}
      {isTeacherView && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {/* Quick Score Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            <button
              type="button"
              className="btn-score btn-score-1"
              onClick={() => onScore(team.id, 1)}
              title="Cộng 1 điểm"
            >
              +1
            </button>
            <button
              type="button"
              className="btn-score btn-score-3"
              onClick={() => onScore(team.id, 3)}
              title="Cộng 3 điểm"
            >
              +3
            </button>
            <button
              type="button"
              className="btn-score btn-score-5"
              onClick={() => onScore(team.id, 5)}
              title="Cộng 5 điểm"
            >
              +5
            </button>
            <button
              type="button"
              className="btn-score btn-score-minus"
              onClick={() => onScore(team.id, -1)}
              title="Trừ 1 điểm"
            >
              -1
            </button>
          </div>

          {/* Action Row: Mega Evolve & Replay */}
          {(canMega || onReplayEvolution) && (
            <div style={{ display: 'flex', gap: 6 }}>
              {canMega && onMegaEvolve && (
                <button
                  type="button"
                  className="btn-action btn-primary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => onMegaEvolve(team.id)}
                >
                  <Zap size={16} />
                  Tiến hóa Mega
                </button>
              )}

              {onReplayEvolution && (
                <button
                  type="button"
                  className="btn-action btn-secondary"
                  style={{ flex: canMega ? undefined : 1, padding: '8px 12px', fontSize: '0.82rem' }}
                  onClick={() => onReplayEvolution(team.id)}
                  title="Chiếu lại hiệu ứng"
                >
                  <Play size={15} />
                  Chiếu lại
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
