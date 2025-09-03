<template>
  <div :class="$style.postBattleScreen">
    <!-- Battle Result Header -->
    <div :class="$style.battleResult">
      <div :class="[$style.resultIcon, $style[`result--${battleResult}`]]">
        {{ battleResult === 'victory' ? '🏆' : battleResult === 'defeat' ? '💀' : '⚖️' }}
      </div>
      <h2 :class="$style.resultTitle">
        {{ t(battleResult === 'victory' ? 'youWon' : battleResult === 'defeat' ? 'youLost' : 'draw') }}
      </h2>
    </div>

    <!-- Level Progression Section -->
    <div v-if="battleResult === 'victory'" :class="$style.progressionSection">
      <div :class="$style.sectionHeader">
        <h3 :class="$style.sectionTitle">{{ t('levelProgression') }}</h3>
      </div>

      <!-- Current Level Display -->
      <div :class="$style.currentLevel">
        <div :class="$style.levelBadge">
          <span :class="$style.levelNumber">{{ currentLevel + 1 }}</span>
          <span :class="$style.levelLabel">{{ t('level') }}</span>
        </div>
        
        <!-- Experience Gained Animation -->
        <div :class="$style.expGained" v-if="expGained > 0">
          <span :class="$style.expGainedText">+{{ animatedExpGained }} {{ t('exp') }}</span>
          <div :class="$style.expGainedIcon">✨</div>
        </div>
      </div>

      <!-- Experience Progress Bar -->
      <div :class="$style.expProgressContainer">
        <div :class="$style.expProgressInfo">
          <span :class="$style.expCurrent">{{ animatedCurrentExp }}</span>
          <span :class="$style.expSeparator">/</span>
          <span :class="$style.expRequired">{{ expRequiredForNext }}</span>
          <span :class="$style.expLabel">{{ t('exp') }}</span>
        </div>
        <div :class="$style.expProgressBar">
          <div 
            :class="$style.expProgressFill"
            :style="{ width: `${expProgressPercentage}%` }"
          ></div>
          <div 
            :class="$style.expProgressGain"
            :style="{ 
              left: `${Math.max(0, expProgressPercentage - expGainPercentage)}%`,
              width: `${expGainPercentage}%` 
            }"
          ></div>
        </div>
      </div>

      <!-- Monster Progress Tracking -->
      <div :class="$style.monsterProgress">
        <h4 :class="$style.monsterProgressTitle">{{ t('monsterProgress') }}</h4>
        <div :class="$style.monsterList">
          <div 
            v-for="(monster, index) in monsterProgressData" 
            :key="monster.id"
            :class="[$style.monsterItem, { [$style.completed]: monster.defeated >= monster.required }]"
          >
            <div :class="$style.monsterIcon">
              <img :src="monster.image" :alt="monster.name[lang]" />
              <div v-if="monster.defeated >= monster.required" :class="$style.completedBadge">✓</div>
            </div>
            <div :class="$style.monsterInfo">
              <span :class="$style.monsterName">{{ monster.name[lang] }}</span>
              <div :class="$style.monsterProgressBar">
                <div 
                  :class="$style.monsterProgressFill"
                  :style="{ width: `${Math.min(100, (monster.defeated / monster.required) * 100)}%` }"
                ></div>
              </div>
              <span :class="$style.monsterCount">
                {{ monster.defeated }}/{{ monster.required }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Level Up Notification -->
      <div v-if="leveledUp" :class="$style.levelUpNotification">
        <div :class="$style.levelUpIcon">🎉</div>
        <h3 :class="$style.levelUpTitle">{{ t('levelUp') }}!</h3>
        <div :class="$style.statsImprovement">
          <div :class="$style.statBonus" v-for="stat in statBonuses" :key="stat.name">
            <span :class="$style.statName">{{ t(stat.name) }}</span>
            <span :class="$style.statValue">+{{ stat.bonus }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Life System Section -->
    <div :class="$style.lifeSystemSection">
      <div :class="$style.sectionHeader">
        <h3 :class="$style.sectionTitle">{{ t('lifeSystem') }}</h3>
      </div>

      <!-- Current Lives Display -->
      <div :class="$style.livesDisplay">
        <div :class="$style.livesContainer">
          <div 
            v-for="n in maxLives" 
            :key="n"
            :class="[$style.lifeIcon, { [$style.lifeUsed]: n > currentLives }]"
          >
            {{ n <= currentLives ? '❤️' : '🖤' }}
          </div>
        </div>
        <span :class="$style.livesText">{{ currentLives }}/{{ maxLives }} {{ t('lives') }}</span>
      </div>

      <!-- Life Regeneration Timer -->
      <div v-if="lifeRegenTime > 0" :class="$style.regenTimer">
        <div :class="$style.regenIcon">⏱️</div>
        <span :class="$style.regenText">
          {{ t('nextLifeIn') }}: {{ formatTime(lifeRegenTime) }}
        </span>
        <div :class="$style.regenProgressBar">
          <div 
            :class="$style.regenProgressFill"
            :style="{ width: `${regenProgressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Revival Options (when defeated) -->
      <div v-if="battleResult === 'defeat'" :class="$style.revivalOptions">
        <div :class="$style.revivalTitle">{{ t('revivalOptions') }}</div>
        
        <button 
          v-if="currentLives > 0"
          :class="[$style.revivalButton, $style.revivalButtonPrimary]"
          @click="reviveWithLife"
          :disabled="reviving"
        >
          <span :class="$style.buttonIcon">❤️</span>
          <span :class="$style.buttonText">{{ t('useLifeToRevive') }}</span>
          <span :class="$style.buttonCost">(-1 {{ t('life') }})</span>
        </button>

        <button 
          :class="[$style.revivalButton, $style.revivalButtonSecondary]"
          @click="waitForRegen"
          :disabled="lifeRegenTime === 0"
        >
          <span :class="$style.buttonIcon">⏱️</span>
          <span :class="$style.buttonText">{{ t('waitForRegen') }}</span>
          <span :class="$style.buttonTime">{{ formatTime(lifeRegenTime) }}</span>
        </button>

        <button 
          :class="[$style.revivalButton, $style.revivalButtonPurchase]"
          @click="purchaseLife"
          :disabled="purchasing"
        >
          <span :class="$style.buttonIcon">🪙</span>
          <span :class="$style.buttonText">{{ t('purchaseLife') }}</span>
          <span :class="$style.buttonCost">{{ lifeCost }} {{ t('coins') }}</span>
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div :class="$style.actionButtons">
      <button 
        v-if="battleResult === 'victory' && hasNextLevel"
        :class="[$style.actionButton, $style.actionButtonPrimary]"
        @click="proceedToNextLevel"
        :disabled="processing"
      >
        <span :class="$style.buttonIcon">⚔️</span>
        <span :class="$style.buttonText">{{ t('nextLevel') }}</span>
      </button>

      <button 
        v-if="battleResult === 'victory' && !hasNextLevel"
        :class="[$style.actionButton, $style.actionButtonSuccess]"
        @click="showCongratulations"
      >
        <span :class="$style.buttonIcon">🏆</span>
        <span :class="$style.buttonText">{{ t('gameCompleted') }}</span>
      </button>

      <button 
        :class="[$style.actionButton, $style.actionButtonSecondary]"
        @click="returnToMenu"
      >
        <span :class="$style.buttonIcon">🏠</span>
        <span :class="$style.buttonText">{{ t('backToMenu') }}</span>
      </button>
    </div>

    <!-- Error Messages -->
    <div v-if="errorMessage" :class="$style.errorMessage">
      <div :class="$style.errorIcon">⚠️</div>
      <span :class="$style.errorText">{{ errorMessage }}</span>
    </div>

    <!-- Loading Overlay -->
    <div v-if="processing" :class="$style.loadingOverlay">
      <div :class="$style.loadingSpinner"></div>
      <span :class="$style.loadingText">{{ t('processing') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  battleResult: {
    type: String,
    required: true,
    validator: (value) => ['victory', 'defeat', 'draw'].includes(value)
  },
  currentLevel: Number,
  expGained: Number,
  currentExp: Number,
  expRequiredForNext: Number,
  monsters: Array,
  currentLives: Number,
  maxLives: Number,
  lifeRegenTime: Number,
  playerCoins: Number,
  lang: String,
  t: Function,
  hasNextLevel: Boolean,
  leveledUp: Boolean,
  statBonuses: Array
})

const emit = defineEmits([
  'next-level',
  'revive-with-life',
  'purchase-life',
  'return-to-menu',
  'show-congratulations'
])

// Reactive state
const animatedExpGained = ref(0)
const animatedCurrentExp = ref(props.currentExp - props.expGained)
const processing = ref(false)
const reviving = ref(false)
const purchasing = ref(false)
const errorMessage = ref('')

// Computed properties
const expProgressPercentage = computed(() => {
  return Math.min(100, (animatedCurrentExp.value / props.expRequiredForNext) * 100)
})

const expGainPercentage = computed(() => {
  return Math.min(100, (props.expGained / props.expRequiredForNext) * 100)
})

const regenProgressPercentage = computed(() => {
  const totalRegenTime = 300 // 5 minutes in seconds
  return Math.max(0, ((totalRegenTime - props.lifeRegenTime) / totalRegenTime) * 100)
})

const lifeCost = computed(() => {
  return 50 // Cost in coins to purchase a life
})

const monsterProgressData = computed(() => {
  return props.monsters.map((monster, index) => ({
    ...monster,
    defeated: Math.min(index + 1, props.currentLevel + 1),
    required: index + 1
  }))
})

// Methods
const animateExpGain = () => {
  const duration = 2000
  const startTime = Date.now()
  const startExp = props.currentExp - props.expGained
  const startExpGained = 0

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function for smooth animation
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    
    animatedExpGained.value = Math.floor(props.expGained * easeOutCubic)
    animatedCurrentExp.value = Math.floor(startExp + (props.expGained * easeOutCubic))
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const proceedToNextLevel = async () => {
  processing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
    emit('next-level')
  } catch (error) {
    errorMessage.value = 'Failed to proceed to next level'
  } finally {
    processing.value = false
  }
}

const reviveWithLife = async () => {
  if (props.currentLives <= 0) {
    errorMessage.value = 'No lives available'
    return
  }
  
  reviving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('revive-with-life')
  } catch (error) {
    errorMessage.value = 'Revival failed'
  } finally {
    reviving.value = false
  }
}

const purchaseLife = async () => {
  if (props.playerCoins < lifeCost.value) {
    errorMessage.value = 'Insufficient coins'
    return
  }
  
  purchasing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('purchase-life')
  } catch (error) {
    errorMessage.value = 'Purchase failed'
  } finally {
    purchasing.value = false
  }
}

const waitForRegen = () => {
  // Just close the modal and wait
  emit('return-to-menu')
}

const returnToMenu = () => {
  emit('return-to-menu')
}

const showCongratulations = () => {
  emit('show-congratulations')
}

// Lifecycle
onMounted(() => {
  if (props.battleResult === 'victory' && props.expGained > 0) {
    setTimeout(() => {
      animateExpGain()
    }, 500)
  }
})

// Clear error messages after 5 seconds
watch(errorMessage, (newError) => {
  if (newError) {
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }
})
</script>

<style module>
.postBattleScreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.battleResult {
  text-align: center;
  margin-bottom: 2rem;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.resultIcon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-out;
}

.result--victory {
  filter: drop-shadow(0 0 20px gold);
}

.result--defeat {
  filter: drop-shadow(0 0 20px red);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

.resultTitle {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.progressionSection,
.lifeSystemSection {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1), 
    rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 600px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.sectionHeader {
  margin-bottom: 1.5rem;
  text-align: center;
}

.sectionTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.currentLevel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.levelBadge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.levelNumber {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  line-height: 1;
}

.levelLabel {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.expGained {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 25px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.expGainedText {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  font-family: 'Roboto Mono', monospace;
}

.expGainedIcon {
  font-size: 1.5rem;
  animation: sparkle 1s infinite;
}

@keyframes sparkle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
}

.expProgressContainer {
  margin-bottom: 1.5rem;
}

.expProgressInfo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: 'Roboto Mono', monospace;
  color: white;
}

.expCurrent {
  font-size: 1.2rem;
  font-weight: 700;
  color: #22c55e;
}

.expSeparator {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.expRequired {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

.expLabel {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.expProgressBar {
  position: relative;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.expProgressFill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.expProgressGain {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 10px;
  animation: progressGain 2s ease-out;
}

@keyframes progressGain {
  from { opacity: 0; transform: scaleX(0); }
  to { opacity: 1; transform: scaleX(1); }
}

.monsterProgress {
  margin-bottom: 1.5rem;
}

.monsterProgressTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
}

.monsterList {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.monsterItem {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.monsterItem.completed {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
}

.monsterIcon {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.monsterIcon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.completedBadge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  font-weight: bold;
}

.monsterInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.monsterName {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.monsterProgressBar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.monsterProgressFill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #d97706);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.monsterCount {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Roboto Mono', monospace;
}

.levelUpNotification {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.2), 
    rgba(255, 152, 0, 0.2));
  border: 2px solid rgba(255, 193, 7, 0.4);
  border-radius: 16px;
  animation: levelUpPulse 1s ease-out;
}

@keyframes levelUpPulse {
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.levelUpIcon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.levelUpTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 1rem;
}

.statsImprovement {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.statBonus {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 60px;
}

.statName {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
}

.statValue {
  font-size: 1.2rem;
  font-weight: 700;
  color: #22c55e;
  font-family: 'Roboto Mono', monospace;
}

.livesDisplay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.livesContainer {
  display: flex;
  gap: 0.5rem;
}

.lifeIcon {
  font-size: 2rem;
  transition: all 0.3s ease;
}

.lifeUsed {
  opacity: 0.3;
  filter: grayscale(100%);
}

.livesText {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  font-family: 'Roboto Mono', monospace;
}

.regenTimer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.regenIcon {
  font-size: 1.5rem;
}

.regenText {
  font-size: 1rem;
  color: white;
  text-align: center;
}

.regenProgressBar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.regenProgressFill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 1s linear;
}

.revivalOptions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.revivalTitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  text-align: center;
  margin-bottom: 0.5rem;
}

.revivalButton {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
}

.revivalButtonPrimary {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.revivalButtonSecondary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.revivalButtonPurchase {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.revivalButton:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.revivalButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.buttonIcon {
  font-size: 1.2rem;
}

.buttonText {
  flex: 1;
  text-align: center;
}

.buttonCost,
.buttonTime {
  font-size: 0.9rem;
  opacity: 0.8;
  font-family: 'Roboto Mono', monospace;
}

.actionButtons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.actionButton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
  justify-content: center;
}

.actionButtonPrimary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.actionButtonSuccess {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.actionButtonSecondary {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

.actionButton:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.actionButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.errorMessage {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 12px;
  color: white;
  margin-top: 1rem;
  animation: shake 0.5s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.errorIcon {
  font-size: 1.2rem;
}

.errorText {
  font-weight: 600;
}

.loadingOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 16px;
}

.loadingSpinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loadingText {
  color: white;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .postBattleScreen {
    padding: 0.5rem;
  }
  
  .resultTitle {
    font-size: 2rem;
  }
  
  .resultIcon {
    font-size: 3rem;
  }
  
  .progressionSection,
  .lifeSystemSection {
    padding: 1rem;
  }
  
  .currentLevel {
    flex-direction: column;
    gap: 1rem;
  }
  
  .levelBadge {
    width: 80px;
    height: 80px;
  }
  
  .levelNumber {
    font-size: 1.5rem;
  }
  
  .monsterList {
    grid-template-columns: 1fr;
  }
  
  .actionButtons {
    flex-direction: column;
    width: 100%;
  }
  
  .actionButton {
    width: 100%;
  }
  
  .revivalButton {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .expGained {
    flex-direction: column;
    text-align: center;
  }
  
  .statsImprovement {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .livesContainer {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .progressionSection,
  .lifeSystemSection {
    border: 2px solid white;
  }
  
  .expProgressBar,
  .monsterProgressBar,
  .regenProgressBar {
    border: 1px solid white;
  }
}

/* Color blind friendly indicators */
.monsterItem.completed::before {
  content: '✓';
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>