<template>
  <div :class="$style.battleArena">
    <!-- Compact Battle Layout -->
    <div :class="$style.battleLayout">
      <!-- Monster Section -->
      <div :class="[$style.fighterSection, $style.monsterSection, { [$style.isHit]: isMonsterHit, [$style.isActive]: isMonsterTurn, [$style.isCritical]: isMonsterCritical }]">
        <div :class="$style.fighterInfo">
          <h3 :class="$style.fighterName">{{ currentMonster?.name[lang] || 'Monster' }}</h3>
          <div :class="$style.healthInfo">
            <span :class="$style.healthLabel">{{ t('monsterHealth') }}</span>
            <BaseProgressBar
              :value="monsterHealth"
              :max="getMonsterMaxHealth(currentLevel)"
              :class="$style.healthBar"
              type="health"
            />
          </div>
          <div :class="$style.staminaInfo">
            <span :class="$style.staminaLabel">{{ lang === 'es' ? 'CARGA' : 'CHARGE' }}</span>
            <BaseProgressBar
              :value="monsterStamina"
              :max="maxStamina"
              :class="$style.staminaBar"
              type="stamina"
            />
          </div>
        </div>
        <div :class="$style.fighterAvatar">
          <BaseAvatar
            :src="monsterImg"
            :alt="currentMonster?.name[lang] || 'Monster'"
            :size="120"
            :class="$style.monsterAvatar"
          />
          <div v-if="slashMonster" :class="$style.slashEffect"></div>
          <div v-if="burstMonsterSpecial" :class="$style.burstEffect"></div>
        </div>
      </div>

      <!-- VS Indicator -->
      <div :class="$style.vsIndicator">
        <span :class="$style.vsText">VS</span>
        <div :class="$style.turnIndicator">
          {{ isMonsterTurn ? t('turnMonster') : t('turnPlayer') }}
        </div>
      </div>

      <!-- Player Section -->
      <div :class="[$style.fighterSection, $style.playerSection, { [$style.isHit]: isPlayerHit, [$style.isDefending]: isPlayerDefending, [$style.isHealing]: isHealing, [$style.isActive]: !isMonsterTurn, [$style.isCritical]: isPlayerCritical }]">
        <div :class="$style.fighterAvatar">
          <BaseAvatar
            :src="playerImg"
            :alt="selectedCharacter?.name[lang] || 'Player'"
            :size="120"
            :class="$style.playerAvatar"
          />
          <div v-if="slashPlayer" :class="$style.slashEffect"></div>
          <div v-if="isHealing" :class="$style.healEffect"></div>
        </div>
        <div :class="$style.fighterInfo">
          <h3 :class="$style.fighterName">{{ selectedCharacter?.name[lang] || 'Player' }}</h3>
          <div :class="$style.healthInfo">
            <span :class="$style.healthLabel">{{ t('yourHealth') }}</span>
            <BaseProgressBar
              :value="playerHealth"
              :max="getPlayerMaxHealth(currentLevel)"
              :class="$style.healthBar"
              type="health"
            />
          </div>
          <div :class="[$style.staminaInfo, { [$style.staminaFull]: canUseSuperSpecial }]">
            <span :class="$style.staminaLabel">{{ canUseSuperSpecial ? (lang === 'es' ? 'SUPER!' : 'SUPER!') : (lang === 'es' ? 'CARGA' : 'CHARGE') }}</span>
            <BaseProgressBar
              :value="playerStamina"
              :max="maxStamina"
              :class="$style.staminaBar"
              type="stamina"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.battleArena {
  padding: 0.5rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.battleLayout {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  gap: 1rem;
  padding: 1rem;
}

.fighterSection {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  padding: 1rem;
  border-radius: 16px;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.monsterSection {
  flex-direction: row;
  background: linear-gradient(135deg, rgba(220, 38, 127, 0.1), rgba(139, 69, 19, 0.1));
  border-color: var(--monster-color, #dc267f);
}

.playerSection {
  flex-direction: row-reverse;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border-color: var(--player-color, #3b82f6);
}

.fighterInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fighterName {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

.healthInfo,
.staminaInfo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.healthLabel,
.staminaLabel {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  text-align: center;
}

.healthBar,
.staminaBar {
  height: 8px;
  border-radius: 4px;
}

.fighterAvatar {
  position: relative;
  flex-shrink: 0;
}

.monsterAvatar,
.playerAvatar {
  border-radius: 50%;
  border: 3px solid var(--border-color);
  transition: all 0.3s ease;
}

.vsIndicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 1rem 0.5rem;
}

.vsText {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--accent-color);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.turnIndicator {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  padding: 0.25rem 0.5rem;
  background: var(--surface-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

/* States */
.isActive {
  border-color: var(--accent-color);
  box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.3);
  transform: scale(1.02);
}

.isHit {
  animation: hitFlash 0.5s ease-out;
}

.isCritical {
  border-color: var(--danger-color);
  animation: criticalPulse 1s ease-in-out infinite;
}

.isDefending .playerAvatar {
  border-color: var(--warning-color);
  box-shadow: 0 0 15px rgba(var(--warning-rgb), 0.5);
}

.isHealing .playerAvatar {
  border-color: var(--success-color);
  box-shadow: 0 0 15px rgba(var(--success-rgb), 0.5);
}

.staminaFull .staminaLabel {
  color: var(--accent-color);
  animation: glow 1s ease-in-out infinite alternate;
}

/* Effects */
.slashEffect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%);
  animation: slash 0.5s ease-out;
  pointer-events: none;
}

.burstEffect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: burst 0.6s ease-out;
  pointer-events: none;
}

.healEffect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: heal 1s ease-out;
  pointer-events: none;
}

/* Animations */
@keyframes hitFlash {
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(220, 38, 127, 0.2); }
}

@keyframes criticalPulse {
  0%, 100% { border-color: var(--danger-color); }
  50% { border-color: rgba(239, 68, 68, 0.5); }
}

@keyframes glow {
  from { text-shadow: 0 0 5px var(--accent-color); }
  to { text-shadow: 0 0 15px var(--accent-color), 0 0 25px var(--accent-color); }
}

@keyframes slash {
  from { transform: translateX(-100%) rotate(45deg); }
  to { transform: translateX(100%) rotate(45deg); }
}

@keyframes burst {
  from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

@keyframes heal {
  from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .battleLayout {
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .fighterSection {
    flex-direction: column;
    text-align: center;
    padding: 0.75rem;
  }
  
  .playerSection {
    flex-direction: column;
  }
  
  .fighterInfo {
    order: 2;
  }
  
  .fighterAvatar {
    order: 1;
  }
  
  .vsIndicator {
    order: 0;
    padding: 0.5rem;
  }
  
  .vsText {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .battleArena {
    padding: 0.25rem;
  }
  
  .fighterSection {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .fighterName {
    font-size: 1rem;
  }
  
  .healthLabel,
  .staminaLabel {
    font-size: 0.7rem;
  }
}
</style>