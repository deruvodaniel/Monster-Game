<template>
  <div id="app">
    <AppHeader 
      :player-name="gameState.playerName.value"
      :player-coins="gameState.playerCoins.value"
      :lives="gameState.lives.value"
      :started="gameState.started.value"
      :selected-character="gameState.selectedCharacter.value"
      :lang="messages.lang.value"
      :theme="theme"
      :sound-enabled="audioState.soundEnabled.value"
      @set-language="messages.setLang"
      @toggle-sound="audioState.toggleSound"
      @toggle-theme="toggleTheme"
      @open-help="openHelp"
      @open-user-menu="openUserMenu"
    />
    
    <main class="main-content">
      <GameView
        :lang="messages.lang.value"
        :theme="theme"
        :sound-enabled="audioState.soundEnabled.value"
        :show-help="showHelp"
        :show-user-menu="showUserMenu"
        :editing-name="editingName"
        @close-help="closeHelp"
        @close-user-menu="closeUserMenu"
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
const messages = useMessages()

// Local state
const theme = ref('light')
const showHelp = ref(false)
const showUserMenu = ref(false)
const editingName = ref('')

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
    if (savedLang) messages.setLang(savedLang)
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) theme.value = savedTheme
    
    const savedSound = localStorage.getItem('soundEnabled')
    if (savedSound !== null) audioState.soundEnabled.value = savedSound === 'true'
    
    // Apply theme
    document.body.setAttribute('data-theme', theme.value)
  } catch (e) {
    console.warn('Could not load settings from localStorage')
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