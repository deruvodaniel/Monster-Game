<template>
  <div id="app">
    <AppHeader 
      :player-name="playerName"
      :player-coins="playerCoins"
      :lives="lives"
      :started="started"
      :selected-character="selectedCharacter"
      :lang="lang"
      :theme="theme"
      :sound-enabled="soundEnabled"
      @set-language="setLang"
      @toggle-sound="toggleSound"
      @toggle-theme="toggleTheme"
      @open-help="openHelp"
      @open-user-menu="openUserMenu"
    />
    
    <main class="main-content">
      <GameView
        :player-name="playerName"
        :player-coins="playerCoins"
        :player-health="playerHealth"
        :monster-health="monsterHealth"
        :player-stamina="playerStamina"
        :monster-stamina="monsterStamina"
        :max-stamina="maxStamina"
        :current-level="currentLevel"
        :winner="winner"
        :lives="lives"
        :started="started"
        :characters="characters"
        :monsters="monsters"
        :selected-character-id="selectedCharacterId"
        :selected-character="selectedCharacter"
        :current-monster="currentMonster"
        :is-player-hit="isPlayerHit"
        :is-monster-hit="isMonsterHit"
        :is-player-defending="isPlayerDefending"
        :is-monster-turn="isMonsterTurn"
        :is-healing="isHealing"
        :slash-monster="slashMonster"
        :slash-player="slashPlayer"
        :burst-monster-special="burstMonsterSpecial"
        :damage-monster="damageMonster"
        :damage-player="damagePlayer"
        :can-use-super-special="canUseSuperSpecial"
        :is-player-critical="isPlayerCritical"
        :is-monster-critical="isMonsterCritical"
        :can-attack="canAttack"
        :controls-disabled="controlsDisabled"
        :lang="lang"
        :theme="theme"
        :sound-enabled="soundEnabled"
        :show-help="showHelp"
        :show-user-menu="showUserMenu"
        :editing-name="editingName"
        :t="t"
        :get-monster-max-health="getMonsterMaxHealth"
        :get-player-max-health="getPlayerMaxHealth"
        :attack-monster="attackMonster"
        :special-attack-monster="specialAttackMonster"
        :heal-player="healPlayer"
        :defend="defend"
        :start-game="startGame"
        :next-level="nextLevel"
        :go-to-landing="goToLanding"
        :select-character="selectCharacter"
        :sound="sound"
        :play-bgm-for-stage="playBgmForStage"
        :stop-bgm="stopBgm"
        :revive-with-life="reviveWithLife"
        :purchase-life="purchaseLife"
        :show-congratulations="showCongratulations"
        @close-help="closeHelp"
        @close-user-menu="closeUserMenu"
        @update-player-name="updatePlayerName"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGame } from './composables/useGame.js'
import { useAudio } from './composables/useAudio.js'
import { useMessages } from './composables/useMessages.js'
import AppHeader from './components/organisms/AppHeader.vue'
import GameView from './views/GameView.vue'

// Composables
const gameState = useGame()
const audioState = useAudio()
const messageState = useMessages()

// Destructure all reactive state
const {
  playerName,
  playerCoins,
  playerHealth,
  monsterHealth,
  playerStamina,
  monsterStamina,
  maxStamina,
  currentLevel,
  winner,
  lives,
  started,
  characters,
  monsters,
  selectedCharacterId,
  selectedCharacter,
  currentMonster,
  isPlayerHit,
  isMonsterHit,
  isPlayerDefending,
  isMonsterTurn,
  isHealing,
  slashMonster,
  slashPlayer,
  burstMonsterSpecial,
  damageMonster,
  damagePlayer,
  canUseSuperSpecial,
  isPlayerCritical,
  isMonsterCritical,
  canAttack,
  controlsDisabled,
  getMonsterMaxHealth,
  getPlayerMaxHealth,
  attackMonster,
  specialAttackMonster,
  healPlayer,
  defend,
  startGame,
  nextLevel,
  goToLanding,
  selectCharacter
} = gameState

const { soundEnabled, sound, playBgmForStage, stopBgm, toggleSound } = audioState
const { lang, t, setLang } = messageState

// Local state
const theme = ref('light')
const showHelp = ref(false)
const showUserMenu = ref(false)
const editingName = ref('')

// Methods
const updatePlayerName = (newName) => {
  playerName.value = newName
  try {
    localStorage.setItem('playerName', newName)
  } catch (e) {
    console.warn('Could not save player name to localStorage')
  }
}

const reviveWithLife = () => {
  if (lives.value > 0) {
    lives.value--
    playerHealth.value = getPlayerMaxHealth(currentLevel.value)
    winner.value = null
    isMonsterTurn.value = false
    isPlayerHit.value = false
    isMonsterHit.value = false
    hasAttackedThisTurn.value = false
  }
}

const purchaseLife = () => {
  const cost = 50
  if (playerCoins.value >= cost) {
    playerCoins.value -= cost
    lives.value++
  }
}

const showCongratulations = () => {
  // Show congratulations screen
  console.log('Congratulations! Game completed!')
}

// Methods
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.body.setAttribute('data-theme', theme.value)
  try {
    localStorage.setItem('theme', theme.value)
  } catch (e) {
    console.warn('Could not save theme to localStorage')
  }
}

const openHelp = () => {
  showHelp.value = true
}

const closeHelp = () => {
  showHelp.value = false
}

const openUserMenu = () => {
  editingName.value = gameState.playerName.value
  showUserMenu.value = true
}

const closeUserMenu = () => {
  showUserMenu.value = false
  editingName.value = ''
}

// Initialize app
onMounted(() => {
  try {
    // Load saved settings
    const savedLang = localStorage.getItem('lang')
    if (savedLang) setLang(savedLang)
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) theme.value = savedTheme
    
    const savedSound = localStorage.getItem('soundEnabled')
    if (savedSound !== null) soundEnabled.value = savedSound === 'true'
    
    // Load saved player name
    const savedPlayerName = localStorage.getItem('playerName')
    if (savedPlayerName) {
      playerName.value = savedPlayerName
    }
    
    // Apply theme
    document.body.setAttribute('data-theme', theme.value)
    
    // Set initial background music
    playBgmForStage('landing')
  } catch (e) {
    console.warn('Could not load settings from localStorage')
  }
})

// Watch for game state changes
watch(winner, (newWinner) => {
  if (newWinner === 'player') {
    sound('win')
    if (currentLevel.value === monsters.value.length - 1) {
      playBgmForStage('congrats')
    }
  } else if (newWinner === 'monster') {
    sound('lose')
  }
})

watch(started, (isStarted) => {
  if (isStarted) {
    playBgmForStage('battle')
  } else {
    playBgmForStage('landing')
  }
})

// Watch for sound setting changes
watch(soundEnabled, (enabled) => {
  if (!enabled) {
    stopBgm()
  } else if (started.value) {
    playBgmForStage('battle')
  } else {
    playBgmForStage('landing')
  }
})

// Watch for theme changes
watch(theme, (newTheme) => {
  document.body.setAttribute('data-theme', newTheme)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>