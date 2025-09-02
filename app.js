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
			playerImg: 'https://images.pexels.com/photos/10068851/pexels-photo-10068851.jpeg',
			monsterImg: 'https://www.cinemascomics.com/wp-content/uploads/2025/02/Tiamat-Dragon-mas-poderoso-de-toda-la-literatura-fantastica-poster.jpg',
			started: false,
			lang: 'es',
			theme: 'light',
			audioCtx: null,
			soundEnabled: true,
			slashMonster: false,
			slashMonsterSpecial: false,
			slashPlayer: false,
			isHealing: false,
			burstMonsterSpecial: false,
			musicTimer: null,
			musicOsc: null,
			musicGain: null,
			musicMode: 'off',
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
					image: 'https://guerrerosdelahistoria.com/wp-content/uploads/2017/07/guerrero-medieval.jpeg',
					stats: { attack: 25, defend: 20, heal: 5, special: 40 }
				},
				{
					id: 'elf',
					icon: '🏹',
					name: { es: 'Elfo', en: 'Elf' },
					image: 'https://orbedosdragoes.com/wp-content/uploads/2022/01/PF2-elfo-03-405x600.png',
					stats: { attack: 18, defend: 10, heal: 15, special: 35 }
				},
				{
					id: 'mage',
					icon: '🔮',
					name: { es: 'Mago', en: 'Wizard' },
					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3F5j9KRQOC1I-BAQPiqrmkUN0OcT5bS0zeCuRbAyIuw&s',
					stats: { attack: 15, defend: 8, heal: 25, special: 45 }
				},
				{
					id: 'dwarf',
					icon: '⛏️',
					name: { es: 'Enano', en: 'Dwarf' },
					image: 'https://preview.redd.it/4rrgn1wet4u61.jpg?width=1080&crop=smart&auto=webp&s=27f2825b584010c46b9e1c65766f5248823b0162',
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
				{ id: 'death-angel', name: { es: 'Ángel de la muerte', en: 'Angel of Death' }, image: 'https://i.pinimg.com/736x/80/84/5a/80845aba50bdf5256357713bfb682f86.jpg', stats: { attack: 30 } }
			],
			currentLevel: 0,
			// Levels / monsters
			monsters: [
				{ id: 'ghost-entity', name: { es: 'Ente Fantasmal', en: 'Ghost Entity' }, image: 'https://i.pinimg.com/1200x/c3/df/cc/c3dfcc2627727ba491a3c5147e640cf8.jpg', stats: { attack: 10 } },
				{ id: 'blood-tiger', name: { es: 'Tigre sangriento', en: 'Blood Tiger' }, image: 'https://i.pinimg.com/1200x/a2/ae/15/a2ae15542cbf18fc808e16f8e2592762.jpg', stats: { attack: 14 } },
				{ id: 'forest-spirit', name: { es: 'Espíritu del bosque', en: 'Forest Spirit' }, image: 'https://i.pinimg.com/736x/83/0b/07/830b07a8ee78c3751404c14fdfcea0dd.jpg', stats: { attack: 18 } },
				{ id: 'apoc-colossus', name: { es: 'Coloso apocalíptico', en: 'Apocalyptic Colossus' }, image: 'https://i.pinimg.com/1200x/47/29/31/4729319b7a8d14fcbaba715d970e2bc6.jpg', stats: { attack: 24 } },
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
			this.$watch('winner', (value) => {
				if (!value) { this.updateStageBg(); return; }
				this.stopMusic();
				if (value === 'player') { this.sound('win'); this.playEndJingle('win'); }
				else if (value === 'monster') { this.sound('lose'); this.playEndJingle('lose'); }
				this.updateStageBg();
			});
			this.$watch(() => [this.playerHealth, this.monsterHealth, this.winner], ([p, m, w]) => {
				if (w) return;
				const lowHealth = p <= 35; // 35% or less
				const behind = p < m; // losing compared to monster
				const losing = lowHealth || behind;
				this.setMusicMode(losing ? 'danger' : 'normal');
			});
			this.$watch(() => [this.started, this.showCredits], () => this.updateStageBg());
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
			setTimeout(() => { this.isPlayerHit = false; this.isMonsterTurn = false; this.slashPlayer = false; }, 900);
		},

		specialAttackMonster() {
			this.sound('special');
			this.currentRound++;
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
		},

		nextLevel() {
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
			this.stopMusic();
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
			this.updateStageBg();
		},

		addLogMessage() {
			// log removed
		},

		defend() {
			this.currentRound++;
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
			this.playerStats = { ...this.selectedCharacter.stats };
			this.playerImg = this.selectedCharacter.image;
			this.playerHealth = 100;
			this.lives = this.maxLives;
			this.currentLevel = 0;
			this.loadLevel(0);
			this.sound('start');
			if (this.soundEnabled) this.startMusic('normal');
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

		t(key) {
			return (this.messages[this.lang] && this.messages[this.lang][key]) || key;
		},

		initAudio() {
			if (!this.audioCtx) {
				const AC = window.AudioContext || window.webkitAudioContext;
				this.audioCtx = new AC();
			}
		},

		sound(name) {
			if (!this.soundEnabled) return;
			this.initAudio();
			const ctx = this.audioCtx;
			if (ctx.state === 'suspended') ctx.resume();
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
					sweep(220, 1200, 0.32, 'square', 0.12);
					play(1567.98, 'sine', 0.1, 0.06, 0.32); // sparkle
					play(1318.51, 'sine', 0.1, 0.06, 0.38);
					noiseBurst(0.18, 0.2, 0.34);
					play(196, 'square', 0.14, 0.12, 0.36); // thump
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

		toggleSound() {
			this.soundEnabled = !this.soundEnabled;
			if (this.soundEnabled) this.startMusic(this.musicMode === 'off' ? 'normal' : this.musicMode); else this.stopMusic();
			if (this.audioCtx) {
				if (!this.soundEnabled && this.audioCtx.state !== 'suspended') this.audioCtx.suspend();
				if (this.soundEnabled && this.audioCtx.state === 'suspended') this.audioCtx.resume();
			}
		},

		startMusic(mode = 'normal') {
			this.initAudio();
			const ctx = this.audioCtx;
			if (this.musicOsc) return;
			this.musicOsc = ctx.createOscillator();
			this.musicGain = ctx.createGain();
			const cfg = mode === 'danger'
				? { type: 'sawtooth', gain: 0.05, step: 160, pattern: [220.0, 246.94, 261.63, 246.94] }
				: { type: 'square', gain: 0.035, step: 160, pattern: [392.0, 523.25, 659.25, 784.0, 659.25, 523.25, 440.0, 523.25, 392.0, 440.0, 523.25, 659.25] };
			this.musicOsc.type = cfg.type;
			this.musicGain.gain.value = cfg.gain;
			this.musicOsc.connect(this.musicGain);
			this.musicGain.connect(ctx.destination);
			this.musicOsc.start();
			const pattern = cfg.pattern;
			let step = 0;
			this.musicTimer = setInterval(() => {
				if (!this.musicOsc) return;
				this.musicOsc.frequency.setValueAtTime(pattern[step % pattern.length], ctx.currentTime);
				step++;
			}, cfg.step);
			this.musicMode = mode;
		},

		goToCredits() { this.showCredits = true; this.updateStageBg(); },

		updateStageBg() {
			let stage = 'landing';
			if (this.started && !this.winner) stage = 'battle';
			if (this.winner === 'player' && this.currentLevel === this.monsters.length - 1 && !this.showCredits) stage = 'congrats';
			if (this.showCredits) stage = 'credits';
			document.body.setAttribute('data-stage', stage);
		},

		stopMusic() {
			if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
			if (this.musicOsc) { try { this.musicOsc.stop(); } catch(e) {} this.musicOsc.disconnect(); this.musicOsc = null; }
			if (this.musicGain) { try { this.musicGain.disconnect(); } catch(e) {} this.musicGain = null; }
			this.musicMode = 'off';
		},


		setMusicMode(mode) {
			if (!this.soundEnabled) { this.musicMode = mode; return; }
			if (this.musicMode === mode) return;
			this.stopMusic();
			this.startMusic(mode);
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
				return;
			}
			this.goToLanding();
		},

		playEndJingle(type) {
			this.initAudio();
			const ctx = this.audioCtx;
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
		}
	},
});

app.mount('#game');
