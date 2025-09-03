<template>
  <div :class="$style.characterSelection">
    <div :class="$style.selectionHeader">
      <h2 :class="$style.selectionTitle">{{ t('chooseCharacter') }}</h2>
    </div>
    
    <div :class="$style.charactersContainer">
      <!-- Navigation arrows for mobile -->
      <button 
        v-if="isTabletOrMobile"
        :class="[$style.navButton, $style.navButtonPrev]"
        @click="carouselPrev"
        aria-label="Previous character"
      >
        ‹
      </button>
      
      <div 
        :class="[$style.charactersGrid, { [$style.isCarousel]: isTabletOrMobile }]"
        ref="charactersGrid"
      >
        <CharacterCard
          v-for="character in displayCharacters"
          :key="character.index || character.id"
          :character="character"
          :is-selected="character.id === selectedCharacterId"
          :center-focused="false"
          :lang="lang"
          @select="selectCharacter"
        />
      </div>
      
      <button 
        v-if="isTabletOrMobile"
        :class="[$style.navButton, $style.navButtonNext]"
        @click="carouselNext"
        aria-label="Next character"
      >
        ›
      </button>
    </div>
    
    <div v-if="selectedCharacter" class="selection-actions">
      <button 
        class="start-button"
        @click="$emit('start-game')"
      >
        {{ t('start') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import CharacterCard from '../molecules/CharacterCard.vue'

const props = defineProps({
  characters: Array,
  selectedCharacterId: String,
  lang: String,
  t: Function
})

const emit = defineEmits(['select-character', 'start-game'])

const charactersGrid = ref(null)
const currentCarouselIndex = ref(0)

const isTabletOrMobile = computed(() => {
  return typeof window !== 'undefined' && window.innerWidth <= 900
})

const selectedCharacter = computed(() => {
  return props.characters.find(c => c.id === props.selectedCharacterId) || null
})

const displayCharacters = computed(() => {
  if (!isTabletOrMobile.value) {
    return props.characters.map((char, index) => ({ ...char, index }))
  }
  
  // Create infinite carousel for mobile
  const chars = props.characters
  const infiniteArray = []
  
  // Add last 2 characters at beginning
  for (let i = chars.length - 2; i < chars.length; i++) {
    infiniteArray.push({ ...chars[i], index: `pre-${i}` })
  }
  
  // Add all characters
  for (let i = 0; i < chars.length; i++) {
    infiniteArray.push({ ...chars[i], index: `main-${i}` })
  }
  
  // Add first 2 characters at end
  for (let i = 0; i < 2; i++) {
    infiniteArray.push({ ...chars[i], index: `post-${i}` })
  }
  
  return infiniteArray
})

const selectCharacter = (id) => {
  if (isTabletOrMobile.value) {
    const centerChar = getCenterCharacterInCarousel()
    if (centerChar && centerChar.id === id) {
      emit('select-character', id)
    }
  } else {
    emit('select-character', id)
  }
}

const getCenterCharacterInCarousel = () => {
  if (!isTabletOrMobile.value || !charactersGrid.value) return null
  
  const carousel = charactersGrid.value
  const cards = carousel.querySelectorAll('.character-card')
  if (!cards.length) return null
  
  const carouselRect = carousel.getBoundingClientRect()
  const carouselCenter = carouselRect.left + carouselRect.width / 2
  
  let centerCard = null
  let minDistance = Infinity
  
  cards.forEach(card => {
    const cardRect = card.getBoundingClientRect()
    const cardCenter = cardRect.left + cardRect.width / 2
    const distance = Math.abs(carouselCenter - cardCenter)
    
    if (distance < minDistance) {
      minDistance = distance
      centerCard = card
    }
  })
  
  if (centerCard) {
    const charId = centerCard.getAttribute('data-char-id')
    return props.characters.find(c => c.id === charId)
  }
  
  return null
}

const carouselNext = () => {
  if (!isTabletOrMobile.value || !charactersGrid.value) return
  
  const cardWidth = 260 + 24 // card width + gap
  charactersGrid.value.scrollBy({ left: cardWidth, behavior: 'smooth' })
}

const carouselPrev = () => {
  if (!isTabletOrMobile.value || !charactersGrid.value) return
  
  const cardWidth = 260 + 24 // card width + gap
  charactersGrid.value.scrollBy({ left: -cardWidth, behavior: 'smooth' })
}

const scrollToMainCharacters = () => {
  if (!isTabletOrMobile.value || !charactersGrid.value) return
  
  const cardWidth = 260 + 24 // card width + gap
  const offsetToMain = cardWidth * 2 // Skip 2 pre-duplicate cards
  charactersGrid.value.scrollLeft = offsetToMain
}

const handleInfiniteScroll = () => {
  if (!isTabletOrMobile.value || !charactersGrid.value) return
  
  const carousel = charactersGrid.value
  const cardWidth = 260 + 24 // card width + gap
  const totalCards = displayCharacters.value.length
  const duplicateOffset = cardWidth * 2 // 2 duplicate cards on each side
  
  // If scrolled to the very beginning (at pre-duplicates)
  if (carousel.scrollLeft <= 0) {
    const jumpTo = cardWidth * (totalCards - 4) // Go to end of main chars
    carousel.scrollLeft = jumpTo
  }
  // If scrolled to the very end (at post-duplicates)
  else if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
    carousel.scrollLeft = duplicateOffset
  }
}

const setupCarouselListeners = () => {
  if (!isTabletOrMobile.value || !charactersGrid.value) return
  
  let scrollTimeout
  charactersGrid.value.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      handleInfiniteScroll()
    }, 50)
  })
  
  setTimeout(() => {
    scrollToMainCharacters()
  }, 200)
}

onMounted(() => {
  nextTick(() => {
    setupCarouselListeners()
    
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 900) {
        setTimeout(() => {
          scrollToMainCharacters()
        }, 200)
      }
    })
  })
})
</script>

<style module>
.characterSelection {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.selectionHeader {
  text-align: center;
  margin-bottom: 2rem;
}

.selectionTitle {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.charactersContainer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.charactersGrid {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.isCarousel {
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 1rem;
}

.isCarousel::-webkit-scrollbar {
  display: none;
}

.navButton {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--surface-color);
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navButton:hover {
  border-color: var(--accent-color);
  background: var(--accent-color);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.navButtonPrev {
  left: -24px;
}

.navButtonNext {
  right: -24px;
}

.selectionActions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.startButton {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
}

.startButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.4);
}

.startButton:active {
  transform: translateY(0);
}

.selection-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.start-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.4);
}

.start-button:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .characterSelection {
    padding: 1rem;
  }
  
  .selectionTitle {
    font-size: 1.5rem;
  }
  
  .navButtonPrev {
    left: -12px;
  }
  
  .navButtonNext {
    right: -12px;
  }
}

@media (max-width: 480px) {
  .navButton {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .startButton {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}
</style>