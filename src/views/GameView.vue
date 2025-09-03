<template>
  <div class="game-view">
    <!-- Welcome Modal -->
    <div v-if="showWelcomeModal" class="modal-overlay" @click="closeWelcomeModal">
      <div class="welcome-modal" @click.stop>
        <h2>{{ t('welcome') }}</h2>
        <p>{{ t('welcomeMsg') }}</p>
        <div class="name-input">
          <input 
            v-model="localPlayerName" 
            type="text" 
            :placeholder="lang === 'es' ? 'Tu nombre' : 'Your name'"
            maxlength="20"
            @keydown.enter="closeWelcomeModal"
          />
        </div>
        <button @click="closeWelcomeModal" class="modal-button">
          {{ t('start') }}
        </button>
      </div>
    </div>

    <!-- Character Selection Screen -->
    <div v-if="!started && !showWelcomeModal" class="character-selection-screen">
      <CharacterSelection
        :characters="characters"
        :selected-character-id="selectedCharacterId"
        :lang="lang"
        :t="t"
        @select-character="selectCharacterHandler"
        @start-game="startGameHandler"
      />
    </div>

    <!-- Game Battle Screen -->
    <div v-if="started && !winner" class="battle-screen">
      <!-- Battle Arena -->
      <div class="battle-arena">
        <div class="battle-layout">
          <!-- Monster Section -->
          <div class="fighter-section monster-section" :class="{ 
            'is-hit': isMonsterHit, 
            'is-active': isMonsterTurn, 
            'is-critical': isMonsterCritical 
          }">
            <div class="fighter-info">
              <h3 class="fighter-name">{{ currentMonster?.name[lang] || 'Monster' }}</h3>
              <div class="health-info">
                <span class="health-label">{{ t('monsterHealth') }}</span>
                <BaseProgressBar
                  :value="monsterHealth"
                  :max="getMonsterMaxHealth(currentLevel)"
                  type="health"
                />
              </div>
              <div class="stamina-info">
                <span class="stamina-label">{{ lang === 'es' ? 'CARGA' : 'CHARGE' }}</span>
                <BaseProgressBar
                  :value="monsterStamina"
                  :max="maxStamina"
                  type="stamina"
                />
              </div>
            </div>
            <div class="fighter-avatar">
              <BaseAvatar
                :src="currentMonster?.image || 'https://i.pinimg.com/1200x/c3/df/cc/c3dfcc2627727ba491a3c5147e640cf8.jpg'"
                :alt="currentMonster?.name[lang] || 'Monster'"
                :size="120"
              />
              <div v-if="slashMonster" class="slash-effect"></div>
              <div v-if="burstMonsterSpecial" class="burst-effect"></div>
            </div>
          </div>

          <!-- VS Indicator -->
          <div class="vs-indicator">
            <span class="vs-text">VS</span>
            <div class="turn-indicator">
              {{ isMonsterTurn ? t('turnMonster') : t('turnPlayer') }}
            </div>
          </div>

          <!-- Player Section -->
          <div class="fighter-section player-section" :class="{ 
            'is-hit': isPlayerHit, 
            'is-defending': isPlayerDefending, 
            'is-healing': isHealing, 
            'is-active': !isMonsterTurn, 
            'is-critical': isPlayerCritical 
          }">
            <div class="fighter-avatar">
              <BaseAvatar
                :src="selectedCharacter?.image || 'https://i.pinimg.com/736x/26/b2/3a/26b23a08befd52566b5c42b566d1007a.jpg'"
                :alt="selectedCharacter?.name[lang] || 'Player'"
                :size="120"
              />
              <div v-if="slashPlayer" class="slash-effect"></div>
              <div v-if="isHealing" class="heal-effect"></div>
            </div>
            <div class="fighter-info">
              <h3 class="fighter-name">{{ selectedCharacter?.name[lang] || 'Player' }}</h3>
              <div class="health-info">
                <span class="health-label">{{ t('yourHealth') }}</span>
                <BaseProgressBar
                  :value="playerHealth"
                  :max="getPlayerMaxHealth(currentLevel)"
                  type="health"
                />
              </div>
              <div class="stamina-info" :class="{ 'stamina-full': canUseSuperSpecial }">
                <span class="stamina-label">{{ canUseSuperSpecial ? (lang === 'es' ? 'SUPER!' : 'SUPER!') : (lang === 'es' ? 'CARGA' : 'CHARGE') }}</span>
                <BaseProgressBar
                  :value="playerStamina"
                  :max="maxStamina"
                  type="stamina"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Game Controls -->
      <GameControls
        :can-attack="canAttack"
        :can-use-super-special="canUseSuperSpecial"
        :controls-disabled="controlsDisabled"
        :t="t"
        @attack="attackMonsterHandler"
        @special="specialAttackMonsterHandler"
        @heal="healPlayerHandler"
        @defend="defendHandler"
        @surrender="goToLanding"
      />
    </div>

    <!-- Game Over Screen -->
    <PostBattleScreen
      v-if="winner"
      :battle-result="winner === 'player' ? 'victory' : winner === 'monster' ? 'defeat' : 'draw'"
      :current-level="currentLevel"
      :exp-gained="winner === 'player' ? 50 + currentLevel * 10 : 0"
      :current-exp="(currentLevel + 1) * 100"
      :exp-required-for-next="(currentLevel + 2) * 100"
      :monsters="monsters"
      :current-lives="lives"
      :max-lives="3"
      :life-regen-time="winner === 'monster' ? 300 : 0"
      :player-coins="playerCoins"
      :lang="lang"
      :t="t"
      :has-next-level="currentLevel < monsters.length - 1"
      :leveled-up="winner === 'player'"
      :stat-bonuses="[
        { name: 'attack', bonus: 3 },
        { name: 'special', bonus: 5 },
        { name: 'heal', bonus: 2 },
        { name: 'defend', bonus: 1 }
      ]"
      @next-level="nextLevel"
      @revive-with-life="reviveWithLife"
      @purchase-life="purchaseLife"
      @return-to-menu="goToLanding"
      @show-congratulations="showCongratulations"
    />

    <!-- Legacy Game Over Screen (backup) -->
    <div v-if="false && winner" class="game-over-screen">
      <div class="game-over-content">
        <h2 v-if="winner === 'player'">{{ t('youWon') }}</h2>
        <h2 v-else-if="winner === 'monster'">{{ t('youLost') }}</h2>
        <h2 v-else>{{ t('draw') }}</h2>
        
        <div v-if="winner === 'player'" class="victory-actions">
          <button 
            v-if="currentLevel < monsters.length - 1"
            @click="nextLevel"
            class="next-level-button"
          >
            {{ t('nextLevel') }}
          </button>
          <div v-else class="congratulations">
            <h3>{{ t('congratsTitle') }}</h3>
            <p>{{ t('congratsMsg') }}</p>
          </div>
        </div>
        
        <button @click="goToLanding" class="back-button">
          {{ t('backToStart') }}
        </button>
      </div>
    </div>

    <!-- Floating Damage Numbers -->
    <div v-if="damageMonster" class="floating-damage damage-to-monster">
      -{{ damageMonster }}
    </div>
    <div v-if="damagePlayer" class="floating-damage damage-to-player">
      -{{ damagePlayer }}
    </div>

    <!-- Help Modal -->
    <div v-if="showHelp" class="modal-overlay" @click="closeHelp">
      <div class="help-modal" @click.stop>
        <h2>{{ t('howToPlay') }}</h2>
        <div class="help-content">
          <p>{{ t('rulesIntro') }}</p>
          <ul>
            <li>{{ t('rule1') }}</li>
            <li>{{ t('rule2') }}</li>
            <li>{{ t('rule3') }}</li>
            <li>{{ t('rule4') }}</li>
          </ul>
        </div>
        <button @click="closeHelp" class="modal-button">
          {{ t('close') }}
        </button>
      </div>
    </div>

    <!-- User Menu Modal -->
    <div v-if="showUserMenu" class="modal-overlay" @click="closeUserMenu">
      <div class="user-menu-modal" @click.stop>
        <h2>{{ lang === 'es' ? 'Perfil de Usuario' : 'User Profile' }}</h2>
        <div class="user-info">
          <div class="name-edit">
            <label>{{ lang === 'es' ? 'Nombre:' : 'Name:' }}</label>
            <input 
              v-model="localEditingName" 
              type="text" 
              maxlength="20"
              @keydown.enter="saveName"
            />
          </div>
          <div class="user-stats">
            <p>{{ lang === 'es' ? 'Monedas:' : 'Coins:' }} {{ playerCoins }}</p>
            <p>{{ lang === 'es' ? 'Nivel actual:' : 'Current Level:' }} {{ currentLevel + 1 }}</p>
          </div>
        </div>
        <div class="user-actions">
          <button @click="saveName" class="save-button">
            {{ lang === 'es' ? 'Guardar' : 'Save' }}
          </button>
          <button @click="closeUserMenu" class="modal-button">
            {{ t('close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseProgressBar from '../components/atoms/BaseProgressBar.vue'
import BaseAvatar from '../components/atoms/BaseAvatar.vue'
import GameControls from '../components/molecules/GameControls.vue'
import CharacterSelection from '../components/organisms/CharacterSelection.vue'
import PostBattleScreen from '../components/organisms/PostBattleScreen.vue'

// Props from parent - all game state and functions
const props = defineProps({
  playerName: String,
  playerCoins: Number,
  playerHealth: Number,
  monsterHealth: Number,
  playerStamina: Number,
  monsterStamina: Number,
  maxStamina: Number,
  currentLevel: Number,
  winner: String,
  lives: Number,
  started: Boolean,
  characters: Array,
  monsters: Array,
  selectedCharacterId: String,
  selectedCharacter: Object,
  currentMonster: Object,
  isPlayerHit: Boolean,
  isMonsterHit: Boolean,
  isPlayerDefending: Boolean,
  isMonsterTurn: Boolean,
  isHealing: Boolean,
  slashMonster: Boolean,
  slashPlayer: Boolean,
  burstMonsterSpecial: Boolean,
  damageMonster: Number,
  damagePlayer: Number,
  canUseSuperSpecial: Boolean,
  isPlayerCritical: Boolean,
  isMonsterCritical: Boolean,
  canAttack: Boolean,
  controlsDisabled: Boolean,
  lang: String,
  theme: String,
  soundEnabled: Boolean,
  showHelp: Boolean,
  showUserMenu: Boolean,
  editingName: String,
  t: Function,
  getMonsterMaxHealth: Function,
  getPlayerMaxHealth: Function,
  attackMonster: Function,
  specialAttackMonster: Function,
  healPlayer: Function,
  defend: Function,
  startGame: Function,
  nextLevel: Function,
  goToLanding: Function,
  selectCharacter: Function,
  sound: Function,
  playBgmForStage: Function,
  stopBgm: Function
})

// Emits
const emit = defineEmits([
  'close-help',
  'close-user-menu',
  'update-player-name'
])

// Local state
const showWelcomeModal = ref(false)
const localPlayerName = ref('')
const localEditingName = ref('')

// Initialize welcome modal based on player name
watch(() => props.playerName, (newName) => {
  if (!newName || newName.trim() === '') {
    showWelcomeModal.value = true
    localPlayerName.value = ''
  } else {
    showWelcomeModal.value = false
    localPlayerName.value = newName
  }
}, { immediate: true })

// Watch for editing name changes
watch(() => props.editingName, (name) => {
  localEditingName.value = name || ''
}, { immediate: true })

// Methods
const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  if (localPlayerName.value.trim()) {
    emit('update-player-name', localPlayerName.value.trim())
  }
}

const selectCharacterHandler = (id) => {
  props.selectCharacter(id)
}

const startGameHandler = () => {
  if (!props.selectedCharacter) return
  
  props.sound('start')
  props.startGame()
}

const attackMonsterHandler = () => {
  props.sound('attack')
  props.attackMonster()
}

const specialAttackMonsterHandler = () => {
  props.sound('special')
  props.specialAttackMonster()
}

const healPlayerHandler = () => {
  props.sound('heal')
  props.healPlayer()
}

const defendHandler = () => {
  props.sound('defend')
  props.defend()
}

const closeHelp = () => {
  emit('close-help')
}

const closeUserMenu = () => {
  emit('close-user-menu')
}

const saveName = () => {
  if (localEditingName.value.trim() && localEditingName.value.trim() !== props.playerName) {
    emit('update-player-name', localEditingName.value.trim())
  }
}
</script>

<style scoped>
.game-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
}

.character-selection-screen,
.battle-screen,
.game-over-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
}

.battle-screen {
  gap: 2rem;
}

/* Battle Arena Styles */
.battle-arena {
  padding: 0.5rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.battle-layout {
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

.fighter-section {
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

.monster-section {
  flex-direction: row;
  background: linear-gradient(135deg, rgba(220, 38, 127, 0.1), rgba(139, 69, 19, 0.1));
  border-color: #dc267f;
}

.player-section {
  flex-direction: row-reverse;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border-color: #3b82f6;
}

.fighter-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fighter-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

.health-info,
.stamina-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.health-label,
.stamina-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  text-align: center;
}

.fighter-avatar {
  position: relative;
  flex-shrink: 0;
}

.vs-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 1rem 0.5rem;
}

.vs-text {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--accent-color);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.turn-indicator {
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
.is-active {
  border-color: var(--accent-color);
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
  transform: scale(1.02);
}

.is-hit {
  animation: hitFlash 0.5s ease-out;
}

.is-critical {
  border-color: var(--danger-color);
  animation: criticalPulse 1s ease-in-out infinite;
}

.is-defending .fighter-avatar img {
  border-color: var(--warning-color);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
}

.is-healing .fighter-avatar img {
  border-color: var(--success-color);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

.stamina-full .stamina-label {
  color: var(--accent-color);
  animation: glow 1s ease-in-out infinite alternate;
}

/* Effects */
.slash-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%);
  animation: slash 0.5s ease-out;
  pointer-events: none;
}

.burst-effect {
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

.heal-effect {
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

.game-over-screen {
  align-items: center;
  text-align: center;
}

.game-over-content {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  max-width: 500px;
  width: 100%;
}

.game-over-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.victory-actions {
  margin: 1.5rem 0;
}

.next-level-button,
.back-button,
.save-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0.5rem;
}

.next-level-button {
  background: var(--success-color);
  color: white;
}

.back-button {
  background: var(--secondary-color);
  color: white;
}

.save-button {
  background: var(--primary-color);
  color: white;
}

.next-level-button:hover,
.back-button:hover,
.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.congratulations {
  padding: 1rem;
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.1), 
    rgba(255, 193, 7, 0.1));
  border-radius: 12px;
  border: 1px solid var(--success-color);
}

.congratulations h3 {
  color: var(--success-color);
  margin-bottom: 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.welcome-modal,
.help-modal,
.user-menu-modal {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.welcome-modal h2,
.help-modal h2,
.user-menu-modal h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.name-input {
  margin: 1.5rem 0;
}

.name-input input,
.name-edit input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--surface-color);
  color: var(--text-primary);
  font-size: 1rem;
}

.name-input input:focus,
.name-edit input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.modal-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: var(--accent-color);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.help-content {
  text-align: left;
  margin: 1.5rem 0;
}

.help-content ul {
  padding-left: 1.5rem;
}

.help-content li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.user-info {
  margin: 1.5rem 0;
  text-align: left;
}

.name-edit {
  margin-bottom: 1rem;
}

.name-edit label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-stats p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
  font-family: 'Roboto Mono', monospace;
}

.user-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Floating Damage */
.floating-damage {
  position: fixed;
  font-size: 2rem;
  font-weight: 900;
  font-family: 'Roboto Mono', monospace;
  pointer-events: none;
  z-index: 999;
  animation: floatUp 1s ease-out forwards;
}

.damage-to-monster {
  top: 30%;
  right: 20%;
  color: var(--danger-color);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.damage-to-player {
  top: 30%;
  left: 20%;
  color: var(--warning-color);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(1.2);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .battle-layout {
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .fighter-section {
    flex-direction: column;
    text-align: center;
    padding: 0.75rem;
  }
  
  .player-section {
    flex-direction: column;
  }
  
  .fighter-info {
    order: 2;
  }
  
  .fighter-avatar {
    order: 1;
  }
  
  .vs-indicator {
    order: 0;
    padding: 0.5rem;
  }
  
  .vs-text {
    font-size: 1.2rem;
  }
  
  .game-over-content {
    padding: 1.5rem;
  }
  
  .game-over-content h2 {
    font-size: 1.5rem;
  }
  
  .welcome-modal,
  .help-modal,
  .user-menu-modal {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .floating-damage {
    font-size: 1.5rem;
  }
  
  .damage-to-monster {
    right: 10%;
  }
  
  .damage-to-player {
    left: 10%;
  }
}

@media (max-width: 480px) {
  .battle-arena {
    padding: 0.25rem;
  }
  
  .fighter-section {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .fighter-name {
    font-size: 1rem;
  }
  
  .health-label,
  .stamina-label {
    font-size: 0.7rem;
  }
  
  .user-actions {
    flex-direction: column;
  }
  
  .floating-damage {
    font-size: 1.2rem;
  }
}
</style>