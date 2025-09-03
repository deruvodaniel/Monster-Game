<template>
  <div 
    :class="[
      $style.characterCard, 
      { 
        [$style.selected]: isSelected,
        [$style.centerFocused]: centerFocused 
      }
    ]"
    :data-char-id="character.id"
    @click="$emit('select', character.id)"
  >
    <div :class="$style.cardHeader">
      <span :class="$style.characterIcon">{{ character.icon }}</span>
      <h3 :class="$style.characterName">{{ character.name[lang] }}</h3>
    </div>
    
    <div :class="$style.characterImage">
      <BaseAvatar
        :src="character.image"
        :alt="character.name[lang]"
        :size="120"
      />
    </div>
    
    <div :class="$style.characterStats">
      <div :class="$style.statItem">
        <span :class="$style.statIcon">⚔️</span>
        <span :class="$style.statValue">{{ character.stats.attack }}</span>
      </div>
      <div :class="$style.statItem">
        <span :class="$style.statIcon">🛡️</span>
        <span :class="$style.statValue">{{ character.stats.defend }}</span>
      </div>
      <div :class="$style.statItem">
        <span :class="$style.statIcon">💚</span>
        <span :class="$style.statValue">{{ character.stats.heal }}</span>
      </div>
      <div :class="$style.statItem">
        <span :class="$style.statIcon">💥</span>
        <span :class="$style.statValue">{{ character.stats.special }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseAvatar from '../atoms/BaseAvatar.vue'

defineProps({
  character: {
    type: Object,
    required: true
  },
  isSelected: Boolean,
  centerFocused: Boolean,
  lang: String
})

defineEmits(['select'])
</script>

<style module>
.characterCard {
  width: 260px;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.characterCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-color);
}

.selected {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.1), 
    rgba(var(--accent-rgb), 0.1));
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
}

.centerFocused {
  transform: scale(1.05);
  border-color: var(--accent-color);
  box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.3);
}

.cardHeader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.characterIcon {
  font-size: 2rem;
}

.characterName {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

.characterImage {
  position: relative;
}

.characterStats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
}

.statItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--surface-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.statIcon {
  font-size: 1rem;
}

.statValue {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Roboto Mono', monospace;
}

/* Responsive Design */
@media (max-width: 480px) {
  .characterCard {
    width: 220px;
    padding: 1rem;
  }
  
  .characterName {
    font-size: 1rem;
  }
  
  .characterStats {
    gap: 0.5rem;
  }
  
  .statItem {
    padding: 0.375rem;
  }
}
</style>