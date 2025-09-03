function getRandomValue (min, max) {
	return Math.floor(Math.random() * (max - min)) +  min;
}

const app = Vue.createApp({

	data() {
		return {
			playerHealth: 100,
			monsterHealth: 100,
			currentRound: 0,
			fullHealth: null,
			winner: null,
			logMsgs: [],
			isPlayerHit: false,
			isMonsterHit: false,
			isPlayerDefending: false,
			isMonsterTurn: false,
			hasAttackedThisTurn: false,
			playerImg: 'https://images.pexels.com/photos/10068851/pexels-photo-10068851.jpeg',
			monsterImg: 'https://www.cinemascomics.com/wp-content/uploads/2025/02/Tiamat-Dragon-mas-poderoso-de-toda-la-literatura-fantastica-poster.jpg',
			started: false,
			lang: 'es',
			theme: 'light',
			audioCtx: null,
			soundEnabled: true,
			sfxEnabled: true,
			// Background music (BGM)
			bgmAudioA: null,
			bgmAudioB: null,
			bgmActive: 'A',
			bgmVolume: 0.6,
			bgmFadeTimer: null,
			bgmCurrentUrl: null,
			bgmTargetUrl: null,
			bgmStage: null,
			bgmTracks: {
				landing: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F84bd54c61bf14dafa0e86116011e9010?alt=media&token=00db2d6f-6946-4a95-8869-24f51b640905&apiKey=eb9edba76d874a5385833a00b6be2b6e',
				battle: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F9386db22b85a440b98e94a68f979d6b8?alt=media&token=36bbf65f-430f-4709-855e-80f83760a23f&apiKey=eb9edba76d874a5385833a00b6be2b6e',
				credits: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F14003e39846b4575a9549f77f31cb8c0?alt=media&token=009b1637-30da-470d-bfd9-2a123e8137a7&apiKey=eb9edba76d874a5385833a00b6be2b6e',
				congrats: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F14003e39846b4575a9549f77f31cb8c0?alt=media&token=009b1637-30da-470d-bfd9-2a123e8137a7&apiKey=eb9edba76d874a5385833a00b6be2b6e'
			},
			userInteracted: false,
			showHelp: false,
			showMobileSettings: false,
			showWelcomeModal: true,
			showMapScreen: false,
			slashMonster: false,
			slashMonsterSpecial: false,
			slashPlayer: false,
			isHealing: false,
			burstMonsterSpecial: false,
			centerBubbleText: null,
			centerBubbleClass: '',
			centerBubbleTimer: null,
			lastLevelUpAt: 0,
			showCredits: false,
			// Run lives
			lives: 3,
			maxLives: 3,
			isLevelTransitioning: false,
			lastLeveledTo: -1,
			// Floating damage
			damageMonster: null,
			damagePlayer: null,
			// Character selection
			characters: [
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
			],
			selectedCharacterId: null,
			playerStats: null,
			defenseReductionActive: 0,
			// Levels / monsters
			monsters: [
				{ id: 'ghost-entity', name: { es: 'Ente Fantasmal', en: 'Ghost Entity' }, image: 'https://i.pinimg.com/1200x/c3/df/cc/c3dfcc2627727ba491a3c5147e640cf8.jpg', stats: { attack: 10 } },
				{ id: 'blood-tiger', name: { es: 'Tigre sangriento', en: 'Blood Tiger' }, image: 'https://i.pinimg.com/1200x/a2/ae/15/a2ae15542cbf18fc808e16f8e2592762.jpg', stats: { attack: 14 } },
				{ id: 'forest-spirit', name: { es: 'Espíritu del bosque', en: 'Forest Spirit' }, image: 'https://i.pinimg.com/736x/83/0b/07/830b07a8ee78c3751404c14fdfcea0dd.jpg', stats: { attack: 18 } },
				{ id: 'apoc-colossus', name: { es: 'Coloso apocalíptico', en: 'Apocalyptic Colossus' }, image: 'https://i.pinimg.com/1200x/47/29/31/4729319b7a8d14fcbaba715d970e2bc6.jpg', stats: { attack: 24 } },
				{ id: 'cursed-siren', name: { es: 'Sirena maldita', en: 'Cursed Siren' }, image: 'https://i.pinimg.com/1200x/91/29/2d/91292dd2087febdf4e8fcf97d38205e3.jpg', stats: { attack: 27 } },
				{ id: 'death-angel', name: { es: 'Ángel de la muerte', en: 'Angel of Death' }, image: 'https://i.pinimg.com/736x/80/84/5a/80845aba50bdf5256357713bfb682f86.jpg', stats: { attack: 30 } }
			],
			currentLevel: 0,
			messages: {
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
					congratsMsg: 'You’ve conquered every foe. The realm sings your name—rest, celebrate, then seek new adventures.',
					backToStart: 'Back to Start',
					nextLevel: 'Next Level',
					congratsTitle: 'Glory is yours, warrior! 🏆',
					congratsMsg: 'You’ve conquered every foe. The realm sings your name—rest, celebrate, then seek new adventures.',
					backToStart: 'Back to Start'
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
					raisesShield: 'levanta un escudo 🛡️ y reduce el pr��ximo daño',
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
					backToStart: 'Volver al inicio',
					nextLevel: 'Siguiente nivel',
					congratsTitle: '¡Gloria para ti, guerrero! 🏆',
					congratsMsg: 'Has vencido a todos los enemigos. El reino canta tu nombre: descansa, celebra y prepárate para nuevas gestas.',
					backToStart: 'Volver al inicio'
				}
			}
		};
	},

	computed: {
			controlsDisabled() {
				return this.isMonsterTurn;
			},
		canAttack() {
			// Only elf can attack multiple times per turn
			if (this.selectedCharacter && this.selectedCharacter.id === 'elf') return true;
			// Other characters can only attack once per turn
			return !this.hasAttackedThisTurn;
		},
		monsterBarStyles(){
			if ( this.monsterHealth < 0) {
				return { width: '0%' }
			}
			const max = typeof this.getMonsterMaxHealth === 'function' ? this.getMonsterMaxHealth(this.currentLevel) : 100;
			const pct = Math.max(0, Math.min(100, Math.round((this.monsterHealth / max) * 100)));
			return { width: pct + '%' }
		},

		playerBarStyles(){
			if ( this.playerHealth < 0) {
				return { width: '0%' }
			}
			const pmax = typeof this.getPlayerMaxHealth === 'function' ? this.getPlayerMaxHealth(this.currentLevel) : 100;
			const pct = Math.max(0, Math.min(100, Math.round((this.playerHealth / pmax) * 100)));
			return { width: pct + '%' }
		},

		mayUseSpecialAttack(){
			return this.currentRound % 3 !== 0;
		},

		mayUseHeal(){
			const pmax = typeof this.getPlayerMaxHealth === 'function' ? this.getPlayerMaxHealth(this.currentLevel) : 100;
			this.fullHealth = this.playerHealth >= pmax;
			return this.fullHealth;
		},

		selectedCharacter() {
			return this.characters.find(c => c.id === this.selectedCharacterId) || null;
		},

		currentMonster() {
			return this.monsters[this.currentLevel] || null;
		},

		isPlayerCritical() {
			return this.playerHealth <= 15;
		},
		isMonsterCritical() {
			const max = typeof this.getMonsterMaxHealth === 'function' ? this.getMonsterMaxHealth(this.currentLevel) : 100;
			return (this.monsterHealth / max) * 100 <= 15;
		},
	},

	watch: {
		playerHealth(value) {
			if (value <= 0 && this.monsterHealth <= 0) {
				// Draw
				this.winner = 'draw';
			} else if (value <= 0) {
				// Player Lost
				this.winner = 'monster';
			}
		},

		monsterHealth(value) {
			if (value <= 0 && this.playerHealth <= 0) {
				// Draw
				this.winner = 'draw';
			} else if (value <= 0) {
				// Player win
				this.winner = 'player';
			}
		},
	},

	mounted() {
		try {
			const savedLang = localStorage.getItem('lang');
			if (savedLang) this.lang = savedLang;
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) this.theme = savedTheme;
			document.body.setAttribute('data-theme', this.theme);
			this.updateStageBg();
			this.$watch('winner', (value) => {
				if (!value) { this.updateStageBg(); return; }
				this.updateStageBg();
			});
			this.$watch(() => [this.playerHealth, this.monsterHealth, this.winner, this.started], ([p, m, w, s]) => {
				if (w || !s) return;
				this.updateStageBg();
			});
			this.$watch(() => [this.started, this.showCredits], () => this.updateStageBg());
			// Attempt to unlock and play BGM after first user interaction (autoplay policies)
			const resumeAndPlay = () => {
				if (this.userInteracted) return;
				this.userInteracted = true;
				this.updateStageBg();
				window.removeEventListener('pointerdown', resumeAndPlay);
			};
			window.addEventListener('pointerdown', resumeAndPlay, { once: true });
		} catch (e) {}
	},

	methods: {
		// Character selection helpers
		selectCharacter(id) {
			this.selectedCharacterId = id;
		},
		rollValue(base, variance = 0.2) {
			const min = Math.max(1, Math.floor(base * (1 - variance)));
			const max = Math.max(min + 1, Math.ceil(base * (1 + variance)));
			return getRandomValue(min, max + 1);
		},
		getDefenseReduction(base) {
			// Stronger shield: map base to 50%–85% reduction
			const r = Math.max(0.5, Math.min(0.85, base / 40 + 0.35));
			return r;
		},

		showCenterBubble(text, css, dur = 1000) {
			// Prevent duplicate Level Up bubble showing twice
			if (css.includes('bubble--level') && this.centerBubbleText && this.centerBubbleClass.includes('bubble--level')) return;
			this.centerBubbleText = text;
			this.centerBubbleClass = css;
			if (this.centerBubbleTimer) { clearTimeout(this.centerBubbleTimer); this.centerBubbleTimer = null; }
			this.centerBubbleTimer = setTimeout(() => { this.centerBubbleText = null; this.centerBubbleClass = ''; this.centerBubbleTimer = null; }, dur);
		},

		attackMonster () {
			this.sound('attack');
			this.currentRound++;
			this.hasAttackedThisTurn = true;
			let attackValue;
			if (this.playerStats) attackValue = this.rollValue(this.playerStats.attack);
			else attackValue = getRandomValue(5, 12);
			this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
			this.damageMonster = attackValue;
			this.showCenterBubble('-' + attackValue, 'bubble--to-monster');
			setTimeout(() => { this.damageMonster = null; }, 900);
			this.isMonsterHit = true;
			this.slashMonster = true;
			setTimeout(() => { this.isMonsterHit = false; this.slashMonster = false; }, 500);
			setTimeout(() => { this.attackPlayer(); }, 900);
		
		},
		
		attackPlayer () {
			if (this.monsterHealth <= 0 || this.winner === 'player') { this.isMonsterTurn = false; return; }
			this.sound('hit');
			this.isMonsterTurn = true;
			this.slashPlayer = true;
			let attackValue;
			if (this.currentMonster && this.currentMonster.stats && this.currentMonster.stats.attack) {
				attackValue = this.rollValue(this.currentMonster.stats.attack, 0.18);
			} else {
				attackValue = getRandomValue(8 ,15);
			}
			if (this.isPlayerDefending) {
				const reduction = this.defenseReductionActive || 0.5;
				attackValue = Math.floor(attackValue * (1 - reduction));
				this.isPlayerDefending = false;
				this.defenseReductionActive = 0;
			}
			if (this.monsterHealth <= 0 || this.winner === 'player') { this.isMonsterTurn = false; return; }
			this.playerHealth = Math.max(this.playerHealth - attackValue, 0);
			this.damagePlayer = attackValue;
			this.showCenterBubble('-' + attackValue, 'bubble--to-player');
			setTimeout(() => { this.damagePlayer = null; }, 1000);
			this.isPlayerHit = true;
			setTimeout(() => {
				this.isPlayerHit = false;
				this.isMonsterTurn = false;
				this.slashPlayer = false;
				// Reset attack flag for next player turn
				this.hasAttackedThisTurn = false;
			}, 900);
		},

		specialAttackMonster() {
			this.sound('special');
			this.currentRound++;
			this.hasAttackedThisTurn = true;
			let attackValue;
			if (this.playerStats) attackValue = this.rollValue(this.playerStats.special, 0.18);
			else attackValue = getRandomValue(10, 25);
			this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
			this.damageMonster = attackValue;
			this.showCenterBubble('-' + attackValue, 'bubble--to-monster');
			this.burstMonsterSpecial = true;
			setTimeout(() => { this.damageMonster = null; }, 900);
			this.isMonsterHit = true;
			this.slashMonster = true;
			setTimeout(() => { this.isMonsterHit = false; this.slashMonster = false; this.burstMonsterSpecial = false; }, 550);
			setTimeout(() => { this.attackPlayer(); }, 900);
		},

		healPLayer() {
			this.currentRound++;
			this.hasAttackedThisTurn = true;
			let healValue;
			if (this.playerStats) healValue = this.rollValue(this.playerStats.heal, 0.15);
			else healValue = getRandomValue(8, 20);
			const pmax = this.getPlayerMaxHealth ? this.getPlayerMaxHealth(this.currentLevel) : 100;
			this.playerHealth = Math.min(this.playerHealth + healValue, pmax);
			this.sound('heal');
			this.isHealing = true;
			this.showCenterBubble('+' + healValue, 'bubble--heal');
			setTimeout(() => { this.isHealing = false; }, 1000);
			setTimeout(() => { this.attackPlayer(); }, 900);
		},

		surrender() {
			this.sound('lose');
			this.goToLanding();
		},

		restart() {
			this.playerHealth = 100;
			this.monsterHealth = 100;
			this.currentRound = 0;
			this.winner = null;
			this.logMsgs = [];
			this.isPlayerHit = false;
			this.isMonsterHit = false;
			this.isPlayerDefending = false;
			this.isMonsterTurn = false;
			this.hasAttackedThisTurn = false;
		},

		getMonsterMaxHealth(level) {
			return 120 + level * 30;
		},

		getPlayerMaxHealth(level) {
			return 100 + level * 15;
		},

		loadLevel(idx) {
			if (idx < 0 || idx >= this.monsters.length) return;
			this.currentLevel = idx;
			if (this.currentMonster) this.monsterImg = this.currentMonster.image;
			this.monsterHealth = this.getMonsterMaxHealth(idx);
			this.currentRound = 0;
			this.winner = null;
			this.logMsgs = [];
			this.isMonsterTurn = false;
			this.isMonsterHit = false;
			this.isPlayerHit = false;
			this.isLevelTransitioning = false;
			this.hasAttackedThisTurn = false;
		},

		nextLevel() {
			const next = this.currentLevel + 1;
			if (next < this.monsters.length) {
				// Show map screen first, then proceed
				setTimeout(() => {
					this.showMapProgress();
				}, 500);
			}
		},

		proceedToNextLevel() {
			const next = this.currentLevel + 1;
			if (next < this.monsters.length) {
				if (this.isLevelTransitioning) return;
				this.isLevelTransitioning = true;
				// Guard against double triggering and repeated same target
				const now = Date.now();
				if (now - this.lastLevelUpAt < 1500 || this.lastLeveledTo === next) { this.loadLevel(next); return; }
				this.lastLevelUpAt = now;
				this.lastLeveledTo = next;
				// Level-up buffs
				let atk=0, sp=0, heal=0, def=0, hp=0;
				if (this.playerStats) {
					this.playerStats.attack += (atk = 3);
					this.playerStats.special += (sp = 5);
					this.playerStats.heal += (heal = 2);
					this.playerStats.defend += (def = 1);
				}
				const newMax = this.getPlayerMaxHealth ? this.getPlayerMaxHealth(next) : 100;
				this.playerHealth = Math.min(newMax, this.playerHealth + (hp = 20));
				this.showCenterBubble(`Level Up! +HP ${hp} · +ATK ${atk} · +SP ${sp} · +HEAL ${heal} · +DEF ${def}`, 'bubble--level', 2400);
				this.loadLevel(next);
			}
		},

		goToLanding() {
			this.stopBgm();
			this.started = false;
			this.currentLevel = 0;
			this.winner = null;
			this.playerHealth = 100;
			this.monsterHealth = 100;
			this.logMsgs = [];
			this.lives = this.maxLives;
			this.isLevelTransitioning = false;
			this.lastLeveledTo = -1;
			this.showCredits = false;
			this.showMapScreen = false;
			this.updateStageBg();
		},

		addLogMessage() {
			// log removed
		},

		defend() {
			this.currentRound++;
			this.hasAttackedThisTurn = true;
			this.isPlayerDefending = true;
			this.defenseReductionActive = this.playerStats ? this.getDefenseReduction(this.playerStats.defend) : 0.5;
			this.addLogMessage('player', 'defend', 0);
			this.sound('defend');
			setTimeout(() => { this.attackPlayer(); }, 900);
		},

		startGame() {
			if (!this.selectedCharacter) return;
			this.started = true;
			this.showCredits = false;
			this.showMapScreen = false;
			this.playerStats = { ...this.selectedCharacter.stats };
			this.playerImg = this.selectedCharacter.image;
			this.playerHealth = 100;
			this.lives = this.maxLives;
			this.currentLevel = 0;
			this.loadLevel(0);
			this.sound('start');
			this.updateStageBg();
		},

		setLang(lang) {
			this.lang = lang;
			try { localStorage.setItem('lang', lang); } catch(e) {}
		},

		toggleTheme() {
			this.theme = this.theme === 'dark' ? 'light' : 'dark';
			document.body.setAttribute('data-theme', this.theme);
			try { localStorage.setItem('theme', this.theme); } catch(e) {}
		},

		openHelp() { this.showHelp = true; },
		closeHelp() { this.showHelp = false; },
		toggleMobileSettings() { this.showMobileSettings = !this.showMobileSettings; },
		closeWelcomeModal() { this.showWelcomeModal = false; },
		showMapProgress() { this.showMapScreen = true; },
		continueToNextLevel() {
			this.showMapScreen = false;
			this.proceedToNextLevel();
		},
		t(key) {
			return (this.messages[this.lang] && this.messages[this.lang][key]) || key;
		},

		initAudio() {
			if (!this.audioCtx) {
				const AC = window.AudioContext || window.webkitAudioContext;
				try { this.audioCtx = new AC(); } catch (e) { this.audioCtx = null; }
			}
		},

		sound(name) {
			// SFX (WebAudio synth) permanently disabled — no-op
			return;
		},

		toggleSound() {
			this.soundEnabled = !this.soundEnabled;
			if (!this.soundEnabled) {
				if (this.bgmAudio) { try { this.bgmAudio.pause(); } catch(e) {} }
			} else {
				this.updateStageBg();
			}
		},


		// Stage BGM control using mp3 files
		playBgmForStage(stage) {
			const url = this.bgmTracks && this.bgmTracks[stage];
			if (!url || !this.soundEnabled) { this.stopBgm(); return; }
			const ensure = (which) => {
				if (which === 'A' && !this.bgmAudioA) { this.bgmAudioA = new Audio(); this.bgmAudioA.loop = true; this.bgmAudioA.volume = 0; }
				if (which === 'B' && !this.bgmAudioB) { this.bgmAudioB = new Audio(); this.bgmAudioB.loop = true; this.bgmAudioB.volume = 0; }
			};
			ensure('A'); ensure('B');
			// If already playing or targeting the same url for this stage, don't start a new crossfade
			if ((this.bgmStage === stage && this.bgmCurrentUrl === url) || this.bgmTargetUrl === url) {
				const a = this.bgmAudioA, b = this.bgmAudioB;
				if ((a && a.src === url && !a.paused) || (b && b.src === url && !b.paused)) return;
			}
			const from = this.bgmActive === 'A' ? this.bgmAudioA : this.bgmAudioB;
			const to = this.bgmActive === 'A' ? this.bgmAudioB : this.bgmAudioA;
			if (to.src !== url) { try { to.pause(); } catch(e) {} to.src = url; }
			to.currentTime = 0;
			to.volume = 0;
			this.bgmTargetUrl = url;
			to.play().catch(() => {});
			const duration = 600; // ms
			const start = performance.now();
			if (this.bgmFadeTimer) cancelAnimationFrame(this.bgmFadeTimer);
			const clampVol = (v) => Math.max(0, Math.min(1, v));
			const step = (ts) => {
				const t = Math.min(1, Math.max(0, (ts - start) / duration));
				to.volume = clampVol(this.bgmVolume * t);
				if (from) from.volume = clampVol(this.bgmVolume * (1 - t));
				if (t < 1) {
					this.bgmFadeTimer = requestAnimationFrame(step);
				} else {
					if (from) { try { from.pause(); } catch(e) {} from.src = ''; from.currentTime = 0; from.volume = 0; }
					this.bgmActive = this.bgmActive === 'A' ? 'B' : 'A';
					this.bgmCurrentUrl = url;
					this.bgmStage = stage;
					this.bgmTargetUrl = null;
				}
			};
			this.bgmFadeTimer = requestAnimationFrame(step);
		},
		stopBgm() {
			if (this.bgmFadeTimer) { cancelAnimationFrame(this.bgmFadeTimer); this.bgmFadeTimer = null; }
			if (this.bgmAudioA) { try { this.bgmAudioA.pause(); } catch(e) {} this.bgmAudioA.src=''; this.bgmAudioA.currentTime = 0; this.bgmAudioA.volume = 0; }
			if (this.bgmAudioB) { try { this.bgmAudioB.pause(); } catch(e) {} this.bgmAudioB.src=''; this.bgmAudioB.currentTime = 0; this.bgmAudioB.volume = 0; }
			this.bgmCurrentUrl = null; this.bgmTargetUrl = null; this.bgmStage = null;
		},
		setBgmVolume(vol) {
			this.bgmVolume = Math.max(0, Math.min(1, vol));
			if (this.bgmAudioA) this.bgmAudioA.volume = Math.max(0, Math.min(1, this.bgmAudioA.volume));
			if (this.bgmAudioB) this.bgmAudioB.volume = Math.max(0, Math.min(1, this.bgmAudioB.volume));
		},

		goToCredits() { this.showCredits = true; this.updateStageBg(); },

		updateStageBg() {
			let stage = 'landing';
			if (this.started && !this.winner) stage = 'battle';
			if (this.winner === 'player' && this.currentLevel === this.monsters.length - 1 && !this.showCredits) stage = 'congrats';
			if (this.showCredits) stage = 'credits';
			document.body.setAttribute('data-stage', stage);
			if (this.bgmTracks && this.bgmTracks[stage]) {
				this.playBgmForStage(stage);
			} else {
				this.stopBgm();
			}
		},




		loseLifeAndRetry() {
			if (this.lives > 0) this.lives -= 1;
			if (this.lives > 0) {
				// Continue same level preserving monster health, restore to full for current level
				const pmax = this.getPlayerMaxHealth ? this.getPlayerMaxHealth(this.currentLevel) : 100;
				this.playerHealth = pmax;
				this.winner = null;
				this.isMonsterTurn = false;
				this.isPlayerHit = false;
				this.isMonsterHit = false;
				this.hasAttackedThisTurn = false;
				return;
			}
			this.goToLanding();
		},

		sound(name) {
			if (!this.sfxEnabled || !this.soundEnabled) return;
			this.initAudio();
			const ctx = this.audioCtx;
			if (!ctx) return;
			try { if (ctx.state === 'suspended') ctx.resume(); } catch(e) {}
			const now = ctx.currentTime;
			const play = (freq, type = 'sine', dur = 0.14, vol = 0.1, delay = 0) => {
				const o = ctx.createOscillator();
				const g = ctx.createGain();
				o.type = type;
				o.frequency.setValueAtTime(freq, now + delay);
				g.gain.setValueAtTime(0, now + delay);
				g.gain.linearRampToValueAtTime(vol, now + delay + 0.01);
				g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
				o.connect(g);
				g.connect(ctx.destination);
				o.start(now + delay);
				o.stop(now + delay + dur + 0.05);
			};
			const sweep = (startF, endF, dur = 0.25, type = 'square', vol = 0.14, delay = 0) => {
				const o = ctx.createOscillator();
				const g = ctx.createGain();
				o.type = type;
				o.frequency.setValueAtTime(startF, now + delay);
				o.frequency.exponentialRampToValueAtTime(Math.max(endF, 1), now + delay + dur);
				g.gain.setValueAtTime(0, now + delay);
				g.gain.linearRampToValueAtTime(vol, now + delay + 0.02);
				g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
				o.connect(g);
				g.connect(ctx.destination);
				o.start(now + delay);
				o.stop(now + delay + dur + 0.05);
			};
			const noiseBurst = (dur = 0.1, vol = 0.12, delay = 0) => {
				const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
				const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
				const data = buffer.getChannelData(0);
				for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
				const src = ctx.createBufferSource();
				const g = ctx.createGain();
				src.buffer = buffer;
				g.gain.setValueAtTime(0, now + delay);
				g.gain.linearRampToValueAtTime(vol, now + delay + 0.01);
				g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
				src.connect(g);
				g.connect(ctx.destination);
				src.start(now + delay);
			};
			switch (name) {
				case 'attack':
					// fast whoosh + impact
					sweep(600, 180, 0.12, 'sawtooth', 0.12);
					play(120, 'square', 0.08, 0.12, 0.12);
					noiseBurst(0.07, 0.14, 0.12);
					break;
				case 'hit':
					play(120, 'sine', 0.08, 0.1);
					play(90, 'triangle', 0.09, 0.08, 0.04);
					noiseBurst(0.06, 0.1, 0.02);
					break;
				case 'special':
					// charge up + sparkle + big impact
					sweep(220, 1200, 0.32, 'square', 0.22);
					play(1567.98, 'sine', 0.12, 0.14, 0.32); // sparkle
					play(1318.51, 'sine', 0.12, 0.12, 0.38);
					noiseBurst(0.18, 0.28, 0.34);
					play(196, 'square', 0.18, 0.18, 0.36); // thump
					break;
				case 'heal':
					play(392.0, 'sine', 0.12, 0.06);
					play(523.25, 'sine', 0.12, 0.06, 0.08);
					play(659.25, 'sine', 0.16, 0.06, 0.16);
					break;
				case 'defend':
					play(329.63, 'triangle', 0.12, 0.06);
					play(415.30, 'triangle', 0.12, 0.06, 0.06);
					break;
				case 'win': play(523.25, 'sine', 0.15, 0.07); play(659.25, 'sine', 0.15, 0.07, 0.05); play(783.99, 'sine', 0.2, 0.07, 0.1); break;
				case 'lose': play(392, 'sawtooth', 0.18, 0.06); play(261.63, 'sawtooth', 0.22, 0.06, 0.08); break;
				case 'start': play(329.63, 'sine', 0.12, 0.06); play(392, 'sine', 0.12, 0.06, 0.08); break;
			}
		},
		playEndJingle(type) {
			if (!this.sfxEnabled || !this.soundEnabled) return;
			this.initAudio();
			const ctx = this.audioCtx;
			if (!ctx) return;
			if (type === 'win') {
				// Trumpet-like fanfare
				const chords = [
					[392.0, 523.25], // G4 + C5
					[440.0, 587.33], // A4 + D5
					[523.25, 659.25], // C5 + E5
					[587.33, 784.0]  // D5 + G5
				];
				let t = 0;
				const trumpet = (freq, start) => {
					const o = ctx.createOscillator();
					const f = ctx.createBiquadFilter();
					const g = ctx.createGain();
					o.type = 'sawtooth';
					o.frequency.setValueAtTime(freq, start);
					f.type = 'bandpass';
					f.frequency.setValueAtTime(1200, start);
					f.Q.value = 6;
					g.gain.setValueAtTime(0, start);
					g.gain.linearRampToValueAtTime(0.12, start + 0.04);
					g.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
					o.connect(f); f.connect(g); g.connect(ctx.destination);
					o.start(start);
					o.stop(start + 0.4);
				};
				chords.forEach(([a,b]) => {
					const start = ctx.currentTime + t;
					trumpet(a, start);
					trumpet(b, start);
					t += 0.28;
				});
				return;
			}
			// Lose jingle
			const notes = [392.0, 349.23, 261.63, 174.61];
			let t = 0;
			notes.forEach((f) => {
				const o = ctx.createOscillator();
				const g = ctx.createGain();
				o.type = 'square';
				o.frequency.setValueAtTime(f, ctx.currentTime + t);
				g.gain.setValueAtTime(0, ctx.currentTime + t);
				g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + t + 0.02);
				g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.25);
				o.connect(g); g.connect(ctx.destination);
				o.start(ctx.currentTime + t);
				o.stop(ctx.currentTime + t + 0.3);
				t += 0.25;
			});
		},
	},
});

app.mount('#game');
