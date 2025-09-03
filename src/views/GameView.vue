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
        :selected-character-id="selectedCharacterIdProp"
        :lang="lang"
        :t="t"
        @select-character="selectCharacterHandler"
        @start-game="startGameHandler"
      />
    </div>

    <!-- Game Battle Screen -->
    <div v-if="started && !winner" class="battle-screen">
      <BattleArena
        :player-health="playerHealth"
        :monster-health="monsterHealth"
        :player-stamina="playerStamina"
        :monster-stamina="monsterStamina"
        :max-stamina="maxStamina"
        :current-level="currentLevel"
        :current-monster="currentMonster"
        :selected-character="selectedCharacter"
        :is-player-hit="isPlayerHit"
        :is-monster-hit="isMonsterHit"
        :is-player-defending="isPlayerDefending"
        :is-monster-turn="isMonsterTurn"
        :is-healing="isHealing"
        :slash-monster="slashMonster"
        :slash-player="slashPlayer"
        :burst-monster-special="burstMonsterSpecial"
        :can-use-super-special="canUseSuperSpecial"
        :is-player-critical="isPlayerCritical"
        :is-monster-critical="isMonsterCritical"
        :lang="lang"
        :t="t"
        :get-monster-max-health="getMonsterMaxHealth"
        :get-player-max-health="getPlayerMaxHealth"
      />
      
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
    <div v-if="winner" class="game-over-screen">
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
import BattleArena from '../components/organisms/BattleArena.vue'
import GameControls from '../components/molecules/GameControls.vue'
import CharacterSelection from '../components/organisms/CharacterSelection.vue'

// Props from parent - all game state and functions
const props = defineProps({
  playerName: Object,
  playerCoins: Object,
  playerHealth: Object,
  monsterHealth: Object,
  playerStamina: Object,
  monsterStamina: Object,
  maxStamina: Object,
  currentLevel: Object,
  winner: Object,
  lives: Object,
  started: Object,
  characters: Object,
  monsters: Object,
  selectedCharacterId: Object,
  selectedCharacter: Object,
  currentMonster: Object,
  isPlayerHit: Object,
  isMonsterHit: Object,
  isPlayerDefending: Object,
  isMonsterTurn: Object,
  isHealing: Object,
  slashMonster: Object,
  slashPlayer: Object,
  burstMonsterSpecial: Object,
  damageMonster: Object,
  damagePlayer: Object,
  canUseSuperSpecial: Object,
  isPlayerCritical: Object,
  isMonsterCritical: Object,
  canAttack: Object,
  controlsDisabled: Object,
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

// Computed properties to access reactive values
const selectedCharacterIdProp = computed(() => props.selectedCharacterId?.value)

// Initialize welcome modal based on player name
watch(() => props.playerName?.value, (newName) => {
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
  if (!props.selectedCharacter?.value) return
  
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
  if (localEditingName.value.trim() && localEditingName.value.trim() !== props.playerName?.value) {
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
    rgba(var(--success-rgb), 0.1), 
    rgba(var(--accent-rgb), 0.1));
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
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
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
  .user-actions {
    flex-direction: column;
  }
  
  .floating-damage {
    font-size: 1.2rem;
  }
}
</style>