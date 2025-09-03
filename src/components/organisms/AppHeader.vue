<template>
  <header class="app-header">
    <!-- Main Header Content -->
    <div class="header-content">
      <!-- Logo/Title -->
      <h1 class="app-title">Monster Slayer</h1>

      <!-- Player Info (visible when game started) -->
      <div 
        v-if="playerName && started" 
        class="player-info" 
        @click="openUserMenu"
        role="button"
        :aria-label="lang === 'es' ? 'Abrir menú de usuario' : 'Open user menu'"
        tabindex="0"
        @keydown.enter="openUserMenu"
        @keydown.space.prevent="openUserMenu"
      >
        <img 
          v-if="selectedCharacter" 
          :src="selectedCharacter.image" 
          :alt="selectedCharacter.name[lang]" 
          class="player-avatar"
        />
        <div class="player-details">
          <span class="player-name">{{ playerName }}</span>
          <span class="player-coins">🪙 {{ playerCoins }}</span>
        </div>
      </div>

      <!-- Lives Badge -->
      <div class="lives-badge" :aria-label="lang === 'es' ? 'Vidas' : 'Lives'">
        ❤️ × {{ lives }}
      </div>

      <!-- Settings Dropdown -->
      <div class="settings-container" ref="settingsContainer">
        <button 
          class="settings-button"
          @click="toggleSettings"
          :aria-label="lang === 'es' ? 'Configuración' : 'Settings'"
          :aria-expanded="showSettings"
          aria-haspopup="true"
        >
          ⚙️
        </button>

        <!-- Unified Settings Dropdown -->
        <div 
          v-show="showSettings"
          class="settings-dropdown"
          role="menu"
          :aria-hidden="!showSettings"
        >
          <!-- Language Selection -->
          <div class="settings-section">
            <div class="section-label">{{ lang === 'es' ? 'IDIOMA' : 'LANGUAGE' }}</div>
            <div class="language-group">
              <button 
                class="language-button"
                :class="{ active: lang === 'es' }"
                @click="setLanguage('es')"
                role="menuitem"
              >
                ES
              </button>
              <button 
                class="language-button"
                :class="{ active: lang === 'en' }"
                @click="setLanguage('en')"
                role="menuitem"
              >
                EN
              </button>
            </div>
          </div>

          <!-- Menu Items -->
          <button 
            v-if="playerName && started"
            class="settings-item"
            @click="openUserMenu"
            role="menuitem"
          >
            <span class="item-icon">👤</span>
            <span class="item-text">{{ lang === 'es' ? 'PERFIL' : 'PROFILE' }}</span>
          </button>

          <button 
            class="settings-item"
            @click="toggleSound"
            role="menuitem"
          >
            <span class="item-icon">{{ soundEnabled ? '🔊' : '🔇' }}</span>
            <span class="item-text">{{ lang === 'es' ? 'SONIDO' : 'SOUND' }}</span>
          </button>

          <button 
            class="settings-item"
            @click="toggleTheme"
            role="menuitem"
          >
            <span class="item-icon">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
            <span class="item-text">{{ lang === 'es' ? 'TEMA' : 'THEME' }}</span>
          </button>

          <button 
            class="settings-item"
            @click="openHelp"
            role="menuitem"
          >
            <span class="item-icon">ℹ️</span>
            <span class="item-text">{{ lang === 'es' ? 'AYUDA' : 'HELP' }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'

// Props
const props = defineProps({
  playerName: String,
  playerCoins: Number,
  lives: Number,
  started: Boolean,
  selectedCharacter: Object,
  lang: String,
  theme: String,
  soundEnabled: Boolean
})

// Emits
const emit = defineEmits([
  'set-language',
  'toggle-sound',
  'toggle-theme',
  'open-help',
  'open-user-menu'
])

// Reactive state
const showSettings = ref(false)
const settingsContainer = ref(null)

// Methods
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const closeSettings = () => {
  showSettings.value = false
}

const setLanguage = (language) => {
  emit('set-language', language)
  closeSettings()
}

const toggleSound = () => {
  emit('toggle-sound')
  closeSettings()
}

const toggleTheme = () => {
  emit('toggle-theme')
  closeSettings()
}

const openHelp = () => {
  emit('open-help')
  closeSettings()
}

const openUserMenu = () => {
  emit('open-user-menu')
  closeSettings()
}

// Click outside handler
const handleClickOutside = (event) => {
  if (settingsContainer.value && !settingsContainer.value.contains(event.target)) {
    closeSettings()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.95) 0%, 
    rgba(var(--secondary-rgb), 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.app-title {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.player-info:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.player-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
  object-fit: cover;
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.player-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
}

.player-coins {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: 'Roboto Mono', monospace;
  line-height: 1;
}

.lives-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: rgba(220, 38, 127, 0.2);
  border: 1px solid rgba(220, 38, 127, 0.4);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Roboto Mono', monospace;
}

.settings-container {
  position: relative;
}

.settings-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--surface-color);
  color: var(--text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-button:hover {
  border-color: var(--accent-color);
  background: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
}

.settings-button:active {
  transform: translateY(0);
}

.settings-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.95) 0%, 
    rgba(255, 152, 0, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  z-index: 1000;
  animation: dropdownSlide 0.2s ease-out;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.settings-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 0.5px;
}

.language-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.language-button {
  flex: 1;
  padding: 0.5rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.language-button.active {
  background: rgba(255, 255, 255, 0.9);
  color: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.8);
}

.settings-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.settings-item:last-child {
  margin-bottom: 0;
}

.settings-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.item-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.item-text {
  flex: 1;
  text-align: left;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header {
    padding: 0.5rem 0.75rem;
  }
  
  .header-content {
    gap: 0.75rem;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
  
  .player-info {
    padding: 0.375rem 0.5rem;
    gap: 0.5rem;
  }
  
  .player-avatar {
    width: 28px;
    height: 28px;
  }
  
  .player-name {
    font-size: 0.8rem;
  }
  
  .player-coins {
    font-size: 0.7rem;
  }
  
  .lives-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .settings-button {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
  
  .settings-dropdown {
    right: -0.5rem;
    min-width: 180px;
  }
}

@media (max-width: 480px) {
  .header-content {
    gap: 0.5rem;
  }
  
  .app-title {
    font-size: 1.1rem;
  }
  
  .player-details {
    display: none;
  }
  
  .settings-dropdown {
    right: -1rem;
    min-width: 160px;
  }
}

/* Dark theme adjustments */
[data-theme="dark"] .settings-dropdown {
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.9) 0%, 
    rgba(255, 152, 0, 0.9) 100%);
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .settings-button,
  .settings-item,
  .language-button,
  .player-info {
    transition: none;
  }
  
  .settings-dropdown {
    animation: none;
  }
}

/* Focus styles for keyboard navigation */
.settings-button:focus-visible,
.settings-item:focus-visible,
.language-button:focus-visible,
.player-info:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
</style>