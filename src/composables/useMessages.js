import { ref } from 'vue'

export function useMessages() {
  const lang = ref('es')
  
  const messages = {
    en: {
      monsterHealth: 'Monster Health',
      yourHealth: 'Your Health',
      gameOver: 'Game Over!',
      youLost: 'You lost!',
      youWon: 'You won!',
      levelCleared: 'Level Cleared!',
      draw: "It's a Draw!",
      startNew: 'Start New Game',
      attack: 'ATTACK',
      special: 'SPECIAL',
      heal: 'HEAL',
      defend: 'DEFEND',
      surrender: 'SURRENDER',
      battleLog: 'Battle Log',
      player: 'Player',
      monster: 'Monster',
      healsFor: 'heals 💚 for',
      raisesShield: 'raises a shield 🛡️ reducing next damage',
      specialDeals: 'unleashes a SPECIAL ATTACK 💥 and deals',
      attacksDeals: 'attacks 👊 and deals',
      themeToggle: 'Toggle Theme',
      soundToggle: 'Toggle Sound',
      howToPlay: 'How to play',
      close: 'Close',
      changeMonster: 'Change Monster Image',
      turnMonster: "Monster's turn...",
      turnPlayer: 'Your turn!',
      welcome: 'Monster Slayer',
      welcomeMsg: 'Welcome, hero! Prepare your strategy and good luck.',
      rulesIntro: 'Defeat the monster before it defeats you. Each round you can attack, special attack (every 3 rounds), heal, or defend.',
      rule1: 'Attack deals 5–12 damage.',
      rule2: 'Special Attack deals 10–25 damage (every 3 rounds).',
      rule3: 'Heal restores 8–20 health (max 100).',
      rule4: 'Defend halves the next damage you take.',
      start: 'START',
      chooseCharacter: 'Choose your character',
      nextLevel: 'Next Level',
      congratsTitle: 'Glory is yours, warrior! 🏆',
      congratsMsg: 'You\'ve conquered every foe. The realm sings your name—rest, celebrate, then seek new adventures.',
      backToStart: 'Back to Start',
      levelProgression: 'Level Progression',
      level: 'Level',
      exp: 'EXP',
      monsterProgress: 'Monster Progress',
      levelUp: 'Level Up',
      lifeSystem: 'Life System',
      lives: 'Lives',
      nextLifeIn: 'Next life in',
      revivalOptions: 'Revival Options',
      useLifeToRevive: 'Use Life to Revive',
      life: 'Life',
      waitForRegen: 'Wait for Regeneration',
      purchaseLife: 'Purchase Life',
      coins: 'Coins',
      gameCompleted: 'Game Completed',
      backToMenu: 'Back to Menu',
      processing: 'Processing...',
      attack: 'Attack',
      special: 'Special',
      heal: 'Heal',
      defend: 'Defend'
    },
    es: {
      monsterHealth: 'Salud del Monstruo',
      yourHealth: 'Tu Salud',
      gameOver: '¡Fin del Juego!',
      youLost: '¡Perdiste!',
      youWon: '¡Ganaste!',
      levelCleared: '¡Nivel superado!',
      draw: '¡Empate!',
      startNew: 'Comenzar de Nuevo',
      attack: 'ATACAR',
      special: 'ESPECIAL',
      heal: 'CURAR',
      defend: 'DEFENDER',
      surrender: 'RENDIRSE',
      battleLog: 'Registro de Batalla',
      player: 'Jugador',
      monster: 'Monstruo',
      healsFor: 'se cura 💚 por',
      raisesShield: 'levanta un escudo 🛡️ y reduce el próximo daño',
      specialDeals: 'lanza un ATAQUE ESPECIAL 💥 y causa',
      attacksDeals: 'ataca 👊 y causa',
      themeToggle: 'Cambiar Tema',
      soundToggle: 'Sonido',
      howToPlay: 'Cómo jugar',
      close: 'Cerrar',
      changeMonster: 'Cambiar imagen del monstruo',
      turnMonster: 'Turno del monstruo...',
      turnPlayer: '¡Tu turno!',
      welcome: 'Cazador de Monstruos',
      welcomeMsg: '¡Bienvenido, héroe! Prepara tu estrategia y mucha suerte.',
      rulesIntro: 'Derrota al monstruo antes de que te derrote. En cada ronda puedes atacar, usar especial (cada 3 rondas), curarte o defenderte.',
      rule1: 'El ataque hace 5–12 de daño.',
      rule2: 'Especial hace 10–25 de daño (cada 3 rondas).',
      rule3: 'Curar restaura 8–20 de vida (máx 100).',
      rule4: 'Defender reduce a la mitad el próximo daño.',
      start: 'EMPEZAR',
      chooseCharacter: 'Elige tu personaje',
      nextLevel: 'Siguiente nivel',
      congratsTitle: '¡Gloria para ti, guerrero! 🏆',
      congratsMsg: 'Has vencido a todos los enemigos. El reino canta tu nombre: descansa, celebra y prepárate para nuevas gestas.',
      backToStart: 'Volver al inicio'
    }
  }

  const t = (key) => {
    return (messages[lang.value] && messages[lang.value][key]) || key
  }

  const setLang = (language) => {
    lang.value = language
    try {
      localStorage.setItem('lang', language)
    } catch (e) {
      console.warn('Could not save language to localStorage')
    }
  }

  return {
    lang,
    t,
    setLang
  }
}