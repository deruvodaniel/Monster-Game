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
    
    <!-- Game Content -->
    <main class="main-content">
      <GameView
        :player-name="playerName"
        :player-coins="playerCoins"
        :player-health="playerHealth"
        :monster-health="monsterHealth"
        :player-stamina="playerStamina"
        :monster-stamina="monsterStamina"
        :max-stamina="maxStamina"
        :current-round="currentRound"
        :winner="winner"
        :lives="lives"
        :max-lives="maxLives"
        :started="started"
        :current-level="currentLevel"
        :characters="characters"
        :selected-character-id="selectedCharacterId"
        :lang="lang"
        :theme="theme"
        :sound-enabled="soundEnabled"
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
import { ref, computed, onMounted, watch } from 'vue'
import AppHeader from './components/organisms/AppHeader.vue'
import GameView from './views/GameView.vue'

// Game state
const playerName = ref('')
const playerCoins = ref(0)
const playerHealth = ref(100)
const monsterHealth = ref(100)
const playerStamina = ref(0)
const monsterStamina = ref(0)
const maxStamina = ref(100)
const currentRound = ref(0)
const winner = ref(null)
const lives = ref(3)
const maxLives = ref(3)
const started = ref(false)
const currentLevel = ref(0)

// UI state
const lang = ref('es')
const theme = ref('light')
const soundEnabled = ref(true)
const showHelp = ref(false)
const showUserMenu = ref(false)
const editingName = ref('')

// Character selection
const characters = ref([
  {
    id: 'warrior',
    icon: '⚔️',
    name: { es: 'Guerrero', en: 'Warrior' },
    image: 'https://i.pinimg.com/736x/26/b2/3a/26b23a08befd52566b5c42b566d1007a.jpg',
    stats: { attack: 25, defend: 20, heal: 5, special: 40 }
  },
  {
    id: 'elf',
    icon: '🏹',
    name: { es: 'Elfo', en: 'Elf' },
    image: 'https://i.pinimg.com/736x/20/6c/f4/206cf40f4522ff901f00e40e6cc3f5cf.jpg',
    stats: { attack: 18, defend: 10, heal: 15, special: 35 }
  },
  {
    id: 'mage',
    icon: '🔮',
    name: { es: 'Mago', en: 'Wizard' },
    image: 'https://i.pinimg.com/736x/01/cb/51/01cb51e44ad11b3d5ae84d44bb21f5ba.jpg',
    stats: { attack: 15, defend: 8, heal: 25, special: 45 }
  },
  {
    id: 'dwarf',
    icon: '⛏️',
    name: { es: 'Enano', en: 'Dwarf' },
    image: 'https://i.pinimg.com/736x/7b/37/fb/7b37fb2963e63c7444b770c19debc3cb.jpg',
    stats: { attack: 22, defend: 25, heal: 8, special: 30 }
  }
])

const selectedCharacterId = ref(null)

// Computed properties
const selectedCharacter = computed(() => {
  return characters.value.find(c => c.id === selectedCharacterId.value) || null
})

// Methods
const setLang = (language) => {
  lang.value = language
  try {
    localStorage.setItem('lang', language)
  } catch (e) {
    console.warn('Could not save language to localStorage')
  }
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  try {
    localStorage.setItem('soundEnabled', soundEnabled.value.toString())
  } catch (e) {
    console.warn('Could not save sound setting to localStorage')
  }
}

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
  editingName.value = playerName.value
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
    if (savedLang) lang.value = savedLang
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) theme.value = savedTheme
    
    const savedSound = localStorage.getItem('soundEnabled')
    if (savedSound !== null) soundEnabled.value = savedSound === 'true'
    
    const savedPlayerName = localStorage.getItem('playerName')
    if (savedPlayerName) playerName.value = savedPlayerName
    
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