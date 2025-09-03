import { ref, computed, watch } from 'vue'

// Game state composable
export function useGame() {
  // Core game state
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
  const isPlayerHit = ref(false)
  const isMonsterHit = ref(false)
  const isPlayerDefending = ref(false)
  const isMonsterTurn = ref(false)
  const hasAttackedThisTurn = ref(false)
  const isHealing = ref(false)
  const slashMonster = ref(false)
  const slashPlayer = ref(false)
  const burstMonsterSpecial = ref(false)
  const defenseReductionActive = ref(0)
  
  // Floating damage
  const damageMonster = ref(null)
  const damagePlayer = ref(null)
  
  // Character selection
  const selectedCharacterId = ref(null)
  const playerStats = ref(null)
  
  // Game data
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

  const monsters = ref([
    { 
      id: 'ghost-entity', 
      name: { es: 'Ente Fantasmal', en: 'Ghost Entity' }, 
      image: 'https://i.pinimg.com/1200x/c3/df/cc/c3dfcc2627727ba491a3c5147e640cf8.jpg', 
      stats: { attack: 10 } 
    },
    { 
      id: 'blood-tiger', 
      name: { es: 'Tigre sangriento', en: 'Blood Tiger' }, 
      image: 'https://i.pinimg.com/1200x/a2/ae/15/a2ae15542cbf18fc808e16f8e2592762.jpg', 
      stats: { attack: 14 } 
    },
    { 
      id: 'forest-spirit', 
      name: { es: 'Espíritu del bosque', en: 'Forest Spirit' }, 
      image: 'https://i.pinimg.com/736x/83/0b/07/830b07a8ee78c3751404c14fdfcea0dd.jpg', 
      stats: { attack: 18 } 
    },
    { 
      id: 'apoc-colossus', 
      name: { es: 'Coloso apocalíptico', en: 'Apocalyptic Colossus' }, 
      image: 'https://i.pinimg.com/1200x/47/29/31/4729319b7a8d14fcbaba715d970e2bc6.jpg', 
      stats: { attack: 24 } 
    },
    { 
      id: 'cursed-siren', 
      name: { es: 'Sirena maldita', en: 'Cursed Siren' }, 
      image: 'https://i.pinimg.com/1200x/91/29/2d/91292dd2087febdf4e8fcf97d38205e3.jpg', 
      stats: { attack: 27 } 
    },
    { 
      id: 'death-angel', 
      name: { es: 'Ángel de la muerte', en: 'Angel of Death' }, 
      image: 'https://i.pinimg.com/736x/80/84/5a/80845aba50bdf5256357713bfb682f86.jpg', 
      stats: { attack: 30 } 
    }
  ])

  // Stamina charges for actions
  const staminaCharges = {
    attack: 20,
    special: 0,
    heal: 25,
    defend: 15,
    monsterAttack: 15
  }

  // Computed properties
  const selectedCharacter = computed(() => {
    return characters.value.find(c => c.id === selectedCharacterId.value) || null
  })

  const currentMonster = computed(() => {
    return monsters.value[currentLevel.value] || null
  })

  const canUseSuperSpecial = computed(() => {
    return playerStamina.value >= maxStamina.value
  })

  const playerStaminaPercentage = computed(() => {
    return Math.max(0, Math.min(100, (playerStamina.value / maxStamina.value) * 100))
  })

  const monsterStaminaPercentage = computed(() => {
    return Math.max(0, Math.min(100, (monsterStamina.value / maxStamina.value) * 100))
  })

  const isPlayerCritical = computed(() => {
    return playerHealth.value <= 15
  })

  const isMonsterCritical = computed(() => {
    const max = getMonsterMaxHealth(currentLevel.value)
    return (monsterHealth.value / max) * 100 <= 15
  })

  const canAttack = computed(() => {
    if (selectedCharacter.value && selectedCharacter.value.id === 'elf') return true
    return !hasAttackedThisTurn.value
  })

  const controlsDisabled = computed(() => {
    return isMonsterTurn.value
  })

  // Utility functions
  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const rollValue = (base, variance = 0.2) => {
    const min = Math.max(1, Math.floor(base * (1 - variance)))
    const max = Math.max(min + 1, Math.ceil(base * (1 + variance)))
    return getRandomValue(min, max + 1)
  }

  const getMonsterMaxHealth = (level) => {
    return 120 + level * 30
  }

  const getPlayerMaxHealth = (level) => {
    return 100 + level * 15
  }

  const getDefenseReduction = (base) => {
    const r = Math.max(0.5, Math.min(0.85, base / 40 + 0.35))
    return r
  }

  // Game actions
  const chargeStamina = (entity, action) => {
    const charge = staminaCharges[action] || 0
    if (entity === 'player') {
      const oldStamina = playerStamina.value
      playerStamina.value = Math.min(maxStamina.value, playerStamina.value + charge)
    } else if (entity === 'monster') {
      monsterStamina.value = Math.min(maxStamina.value, monsterStamina.value + charge)
    }
  }

  const useSpecialAttack = () => {
    if (playerStamina.value >= maxStamina.value) {
      playerStamina.value = 0
      return true
    }
    return false
  }

  const resetStamina = () => {
    playerStamina.value = 0
    monsterStamina.value = 0
  }

  // Combat actions
  const attackMonster = () => {
    chargeStamina('player', 'attack')
    currentRound.value++
    hasAttackedThisTurn.value = true
    
    let attackValue
    if (playerStats.value) {
      attackValue = rollValue(playerStats.value.attack)
    } else {
      attackValue = getRandomValue(5, 12)
    }
    
    monsterHealth.value = Math.max(monsterHealth.value - attackValue, 0)
    damageMonster.value = attackValue
    
    setTimeout(() => {
      damageMonster.value = null
    }, 900)
    
    isMonsterHit.value = true
    slashMonster.value = true
    
    setTimeout(() => {
      isMonsterHit.value = false
      slashMonster.value = false
    }, 500)
    
    setTimeout(() => {
      attackPlayer()
    }, 900)
  }

  const attackPlayer = () => {
    if (monsterHealth.value <= 0 || winner.value === 'player') {
      isMonsterTurn.value = false
      return
    }
    
    chargeStamina('monster', 'monsterAttack')
    isMonsterTurn.value = true
    slashPlayer.value = true
    
    let attackValue
    if (currentMonster.value && currentMonster.value.stats && currentMonster.value.stats.attack) {
      attackValue = rollValue(currentMonster.value.stats.attack, 0.18)
    } else {
      attackValue = getRandomValue(8, 15)
    }
    
    if (isPlayerDefending.value) {
      const reduction = defenseReductionActive.value || 0.5
      attackValue = Math.floor(attackValue * (1 - reduction))
      isPlayerDefending.value = false
      defenseReductionActive.value = 0
    }
    
    if (monsterHealth.value <= 0 || winner.value === 'player') {
      isMonsterTurn.value = false
      return
    }
    
    playerHealth.value = Math.max(playerHealth.value - attackValue, 0)
    damagePlayer.value = attackValue
    
    setTimeout(() => {
      damagePlayer.value = null
    }, 1000)
    
    isPlayerHit.value = true
    
    setTimeout(() => {
      isPlayerHit.value = false
      isMonsterTurn.value = false
      slashPlayer.value = false
      hasAttackedThisTurn.value = false
    }, 900)
  }

  const specialAttackMonster = () => {
    const isSuperSpecial = useSpecialAttack()
    currentRound.value++
    hasAttackedThisTurn.value = true
    
    let attackValue
    if (playerStats.value) {
      attackValue = rollValue(playerStats.value.special, 0.18)
      if (isSuperSpecial) {
        attackValue *= 2
      }
    } else {
      attackValue = getRandomValue(10, 25)
      if (isSuperSpecial) {
        attackValue *= 2
      }
    }
    
    monsterHealth.value = Math.max(monsterHealth.value - attackValue, 0)
    damageMonster.value = attackValue
    burstMonsterSpecial.value = true
    
    setTimeout(() => {
      damageMonster.value = null
    }, 900)
    
    isMonsterHit.value = true
    slashMonster.value = true
    
    setTimeout(() => {
      isMonsterHit.value = false
      slashMonster.value = false
      burstMonsterSpecial.value = false
    }, 550)
    
    setTimeout(() => {
      attackPlayer()
    }, 900)
  }

  const healPlayer = () => {
    chargeStamina('player', 'heal')
    currentRound.value++
    hasAttackedThisTurn.value = true
    
    let healValue
    if (playerStats.value) {
      healValue = rollValue(playerStats.value.heal, 0.15)
    } else {
      healValue = getRandomValue(8, 20)
    }
    
    const pmax = getPlayerMaxHealth(currentLevel.value)
    playerHealth.value = Math.min(playerHealth.value + healValue, pmax)
    
    isHealing.value = true
    
    setTimeout(() => {
      isHealing.value = false
    }, 1000)
    
    setTimeout(() => {
      attackPlayer()
    }, 900)
  }

  const defend = () => {
    chargeStamina('player', 'defend')
    currentRound.value++
    hasAttackedThisTurn.value = true
    isPlayerDefending.value = true
    defenseReductionActive.value = playerStats.value ? 
      getDefenseReduction(playerStats.value.defend) : 0.5
    
    setTimeout(() => {
      attackPlayer()
    }, 900)
  }

  // Game management
  const startGame = () => {
    if (!selectedCharacter.value) return
    
    started.value = true
    playerStats.value = { ...selectedCharacter.value.stats }
    playerHealth.value = 100
    lives.value = maxLives.value
    currentLevel.value = 0
    resetStamina()
    loadLevel(0)
  }

  const loadLevel = (idx) => {
    if (idx < 0 || idx >= monsters.value.length) return
    
    currentLevel.value = idx
    monsterHealth.value = getMonsterMaxHealth(idx)
    currentRound.value = 0
    winner.value = null
    isMonsterTurn.value = false
    isMonsterHit.value = false
    isPlayerHit.value = false
    hasAttackedThisTurn.value = false
  }

  const nextLevel = () => {
    const next = currentLevel.value + 1
    if (next < monsters.value.length) {
      currentLevel.value = next
      proceedToCurrentLevel()
    }
  }

  const proceedToCurrentLevel = () => {
    if (currentLevel.value < monsters.value.length) {
      // Level-up buffs
      if (playerStats.value) {
        playerStats.value.attack += 3
        playerStats.value.special += 5
        playerStats.value.heal += 2
        playerStats.value.defend += 1
      }
      
      const newMax = getPlayerMaxHealth(currentLevel.value)
      playerHealth.value = Math.min(newMax, playerHealth.value + 20)
      
      loadLevel(currentLevel.value)
    }
  }

  const restart = () => {
    playerHealth.value = 100
    monsterHealth.value = 100
    currentRound.value = 0
    winner.value = null
    isPlayerHit.value = false
    isMonsterHit.value = false
    isPlayerDefending.value = false
    isMonsterTurn.value = false
    hasAttackedThisTurn.value = false
  }

  const goToLanding = () => {
    started.value = false
    currentLevel.value = 0
    winner.value = null
    playerHealth.value = 100
    monsterHealth.value = 100
    lives.value = maxLives.value
    playerCoins.value = 0
    resetStamina()
  }

  const selectCharacter = (id) => {
    selectedCharacterId.value = id
  }

  // Watchers
  watch(playerHealth, (value) => {
    if (value <= 0 && monsterHealth.value <= 0) {
      winner.value = 'draw'
    } else if (value <= 0) {
      winner.value = 'monster'
    }
  })

  watch(monsterHealth, (value) => {
    if (value <= 0 && playerHealth.value <= 0) {
      winner.value = 'draw'
    } else if (value <= 0) {
      playerCoins.value += 10
      winner.value = 'player'
    }
  })

  return {
    // State
    playerName,
    playerCoins,
    playerHealth,
    monsterHealth,
    playerStamina,
    monsterStamina,
    maxStamina,
    currentRound,
    winner,
    lives,
    maxLives,
    started,
    currentLevel,
    isPlayerHit,
    isMonsterHit,
    isPlayerDefending,
    isMonsterTurn,
    hasAttackedThisTurn,
    isHealing,
    slashMonster,
    slashPlayer,
    burstMonsterSpecial,
    damageMonster,
    damagePlayer,
    selectedCharacterId,
    playerStats,
    characters,
    monsters,
    
    // Computed
    selectedCharacter,
    currentMonster,
    canUseSuperSpecial,
    playerStaminaPercentage,
    monsterStaminaPercentage,
    isPlayerCritical,
    isMonsterCritical,
    canAttack,
    controlsDisabled,
    
    // Methods
    getMonsterMaxHealth,
    getPlayerMaxHealth,
    attackMonster,
    specialAttackMonster,
    healPlayer,
    defend,
    startGame,
    loadLevel,
    nextLevel,
    proceedToCurrentLevel,
    restart,
    goToLanding,
    selectCharacter
  }
}