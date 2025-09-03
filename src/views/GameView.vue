<template>
  <div class="game-view">
    <!-- Game content will be implemented here -->
    <div class="game-container">
      <p>Game View Component - Ready for implementation</p>
    </div>
  </div>
</template>

<script setup>
// Props that will be passed from App.vue
const props = defineProps({
  playerName: String,
  playerCoins: Number,
  playerHealth: Number,
  monsterHealth: Number,
  playerStamina: Number,
  monsterStamina: Number,
  maxStamina: Number,
  currentRound: Number,
  winner: String,
  lives: Number,
  maxLives: Number,
  started: Boolean,
  currentLevel: Number,
  characters: Array,
  selectedCharacterId: String,
  lang: String,
  theme: String,
  soundEnabled: Boolean,
  showHelp: Boolean,
  showUserMenu: Boolean,
  editingName: String
})

// Emits for parent communication
const emit = defineEmits([
  'close-help',
  'close-user-menu'
])
</script>

<style scoped>
.game-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.game-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-color);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}
</style>