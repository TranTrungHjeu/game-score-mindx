import React, { useState, useEffect } from 'react';
import type { DigimonAction, Team } from '@/types';
import { MascotAvatar } from './MascotAvatar';
import { getStageForScore } from '@/data/digimon-catalog';
import { Zap, RotateCcw, Crown } from 'lucide-react';

interface TeamLaneProps {
  team: Team;
  rank: number;
  isLeader?: boolean;
  onScore: (teamId: string, delta: number) => void;
  onMegaEvolve?: (teamId: string) => void;
  onReplayEvolution?: (teamId: string) => void;
  onTriggerAction?: (teamId: string, action: DigimonAction) => void;
  isTeacherView?: boolean;
}

export const TeamLane: React.FC<TeamLaneProps> = ({
  team,
  rank,
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
      className={`arena-lane ${!isTeacherView ? 'is-projector' : ''} ${isEgg ? 'is-egg-mode' : ''} ${rank === 1 ? 'lane-rank-1' : rank === 2 ? 'lane-rank-2' : rank === 3 ? 'lane-rank-3' : ''}`}
      style={{
        borderLeft: isEgg
          ? '5px solid #ef4444'
          : rank === 1
          ? '4px solid var(--primary)'
          : '4px solid rgba(203, 213, 225, 0.4)',
      }}
    >
      {/* 1. Rank Indicator */}
      <div className={`lane-rank-badge ${rank <= 3 ? `rank-${rank}` : ''}`} title={`Hạng ${rank}`}>
        {rank === 1 && <Crown size={15} style={{ color: '#ffffff', marginBottom: 2 }} />}
        <span>#{rank}</span>
      </div>

      {/* 2. Quái thú Digimon To Lớn & Bắt Mắt (Size 110px) */}
      <div
        className="lane-avatar-container"
        onClick={handleCycleAction}
        style={{ cursor: 'pointer' }}
        title={isEgg ? 'Digitama' : 'Nhấn vào linh vật để đổi hiệu ứng chuyển động'}
      >
        <MascotAvatar
          family={team.family}
          level={currentLevel}
          stage={currentStage}
          size={110}
          action={activeAction}
          glow={!isEgg && (isLeader || currentLevel === stages.length)}
        />
      </div>

      {/* 3. Thông Tin Đội & Trạng Thái Linh Vật */}
      <div className="lane-info">
        <h3 className="lane-team-name" title={team.name}>
          {team.name}
        </h3>
        <div className="lane-mascot-status">
          <span style={{ color: isEgg ? '#dc2626' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
            {isEgg ? 'Digitama' : currentStage.name}
          </span>
        </div>
      </div>

      {/* 4. Khối Năng Lượng Tiến Hóa */}
      <div className="lane-target-container">
        <div className="lane-target-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {isEgg ? (
              <span style={{ color: '#dc2626' }}>Cần gỡ điểm để nở trứng!</span>
            ) : nextStage && nextMilestone !== null ? (
              <span>Mục tiêu tiếp theo: <strong style={{ color: 'var(--primary)' }}>{nextStage.name}</strong> ({nextMilestone} PTS)</span>
            ) : (
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Đạt cấp tối thượng</span>
            )}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: team.score < 0 ? '#dc2626' : 'var(--text-dim)', flexShrink: 0 }}>
            {team.score >= 20 ? `${team.score} PTS (MAX)` : `${team.score}/20 PTS`}
          </div>
        </div>

        {/* Thanh Năng Lượng Tiến Hóa */}
        <div className="lane-energy-track">
          {/* Milestone markers along the track */}
          {milestones.slice(1, -1).map((m, idx) => {
            const stg = stages[idx + 1];
            return (
              <div
                key={`ms-${m}-${idx}`}
                style={{
                  position: 'absolute',
                  left: `${(m / 20) * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: 'rgba(255, 255, 255, 0.75)',
                  zIndex: 3,
                }}
                title={`Mốc tiến hóa: ${stg?.name} (${m} điểm)`}
              />
            );
          })}

          <div
            className="lane-energy-fill"
            style={{
              width: `${Math.max(0, Math.min(100, (team.score / 20) * 100))}%`,
              background: isEgg ? '#ef4444' : 'linear-gradient(90deg, var(--primary) 0%, #ff4d4f 100%)',
              boxShadow: rank === 1 ? '0 0 10px rgba(227, 31, 38, 0.35)' : 'none',
            }}
          />
        </div>
      </div>

      {/* 5. Khối Hiển Thị Điểm Số To Rõ */}
      <div className="lane-score-box">
        <div
          className={`lane-score-number ${team.score < 0 ? 'is-negative' : isLeader ? 'is-leader' : ''}`}
          title={`${team.score} điểm`}
        >
          {team.score}
        </div>
        <div style={{ fontSize: '0.72rem', color: team.score < 0 ? '#dc2626' : 'var(--text-dim)', fontWeight: 800, letterSpacing: '0.04em' }}>
          PTS
        </div>
      </div>

      {/* 6. Quick Scoring Action Buttons (Teacher Mode Only - Tinh gọn, 1 hàng duy nhất) */}
      {isTeacherView && (
        <div className="lane-actions-grid">
          <button
            type="button"
            className="btn-score btn-score-1"
            onClick={() => onScore(team.id, 1)}
            title="Cộng 1 điểm: Phát biểu, tương tác"
            style={{ padding: '8px 13px', fontSize: '1.05rem', minWidth: 42 }}
          >
            +1
          </button>

          <button
            type="button"
            className="btn-score btn-score-3"
            onClick={() => onScore(team.id, 3)}
            title="Cộng 3 điểm: Hoàn thành bài tập tốt"
            style={{ padding: '8px 13px', fontSize: '1.05rem', minWidth: 42 }}
          >
            +3
          </button>

          <button
            type="button"
            className="btn-score btn-score-5"
            onClick={() => onScore(team.id, 5)}
            title="Cộng 5 điểm: Sáng tạo Robotics xuất sắc"
            style={{ padding: '8px 14px', fontSize: '1.05rem', minWidth: 46 }}
          >
            +5
          </button>

          <button
            type="button"
            className="btn-score btn-score-minus"
            onClick={() => onScore(team.id, -1)}
            title="Trừ 1 điểm: Nhắc nhở kỷ luật"
            style={{ padding: '8px 11px', fontSize: '1.05rem', minWidth: 38 }}
          >
            -1
          </button>

          {/* Mega Evolution Button */}
          {canMega && onMegaEvolve && (
            <button
              type="button"
              className="btn-action btn-primary"
              onClick={() => onMegaEvolve(team.id)}
              style={{
                padding: '8px 12px',
                fontSize: '0.82rem',
                fontWeight: 800,
              }}
              title="Kích hoạt Tiến hóa Mega đặc biệt"
            >
              <Zap size={14} /> MEGA
            </button>
          )}

          {/* Replay Evolution animation */}
          {onReplayEvolution && (
            <button
              type="button"
              className="btn-action btn-secondary"
              onClick={() => onReplayEvolution(team.id)}
              style={{ padding: '8px 10px' }}
              title="Xem lại hiệu ứng tiến hóa"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
