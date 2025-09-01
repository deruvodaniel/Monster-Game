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
			slashMonster: false,
			slashPlayer: false,
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
			musicTimer: null,
			musicOsc: null,
			musicGain: null,
			messages: {
				en: {
					monsterHealth: 'Monster Health',
					yourHealth: 'Your Health',
					gameOver: 'Game Over!',
					youLost: 'You lost!',
					youWon: 'You won!',
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
					start: 'START'
				},
				es: {
					monsterHealth: 'Salud del Monstruo',
					yourHealth: 'Tu Salud',
					gameOver: '¡Fin del Juego!',
					youLost: '¡Perdiste!',
					youWon: '¡Ganaste!',
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
					start: 'EMPEZAR'
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
				return {
					width: '0%'
				}
			}
			return {
				width: this.monsterHealth + '%'
			}
		},

		playerBarStyles(){
			if ( this.playerHealth < 0) {
				return {
					width: '0%'
				}
			}
			return {
				width: this.playerHealth + '%'
			}
		},

		mayUseSpecialAttack(){
			return this.currentRound % 3 !== 0;
		},

		mayUseHeal(){
			if(this.playerHealth === 100) {
				this.fullHealth = true;
			} else {
				this.fullHealth = false;
			}
			return this.fullHealth;
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
				if (value === 'player') this.sound('win');
				else if (value === 'monster') this.sound('lose');
			});
		} catch (e) {}
	},

	methods: {
		attackMonster () {
			this.sound('attack');
			this.currentRound++;
			const attackValue = getRandomValue(5, 12);
			this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
			this.addLogMessage('player', 'attack', attackValue);
			this.isMonsterHit = true;
			this.slashMonster = true;
			setTimeout(() => { this.isMonsterHit = false; this.slashMonster = false; }, 350);
			this.attackPlayer();
		
		},
		
		attackPlayer () {
			this.sound('hit');
			this.isMonsterTurn = true;
			this.slashPlayer = true;
			let attackValue = getRandomValue(8 ,15);
			if (this.isPlayerDefending) {
				attackValue = Math.floor(attackValue / 2);
				this.isPlayerDefending = false;
			}
			this.playerHealth = Math.max(this.playerHealth - attackValue, 0);
			this.addLogMessage('monster', 'attack', attackValue);
			this.isPlayerHit = true;
			setTimeout(() => { this.isPlayerHit = false; this.isMonsterTurn = false; this.slashPlayer = false; }, 400);
		},

		specialAttackMonster() {
			this.sound('special');
			this.currentRound++;
			const attackValue = getRandomValue(10, 25);
			this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
			this.addLogMessage('player', 'special-attack', attackValue);
			this.isMonsterHit = true;
			this.slashMonster = true;
			setTimeout(() => { this.isMonsterHit = false; this.slashMonster = false; }, 350);
			this.attackPlayer();
		},

		healPLayer() {
			this.currentRound++;
			const healValue = getRandomValue(8, 20);
			this.playerHealth = Math.min(this.playerHealth + healValue, 100);
			this.addLogMessage('player', 'heal', healValue);
			this.sound('heal');
			this.attackPlayer();
		},

		surrender() {
			this.winner = 'monster';
			this.sound('lose');
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

		addLogMessage(who, what, value) {
			this.logMsgs.unshift({
				actionBy: who,
				actionType: what,
				actionValue: value
			});
		},

		defend() {
			this.currentRound++;
			this.isPlayerDefending = true;
			this.addLogMessage('player', 'defend', 0);
			this.sound('defend');
		},

		startGame() {
			this.started = true;
			this.restart();
			this.sound('start');
			if (this.soundEnabled) this.startMusic();
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
			const play = (freq, type = 'sine', dur = 0.12, vol = 0.06, delay = 0) => {
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
			switch (name) {
				case 'attack': play(440, 'square'); break;
				case 'hit': play(220, 'sawtooth'); break;
				case 'special': play(660, 'square', 0.18, 0.08); break;
				case 'heal': play(523.25, 'sine', 0.18, 0.06); break;
				case 'defend': play(261.63, 'triangle', 0.14, 0.06); break;
				case 'win': play(523.25, 'sine', 0.15, 0.07); play(659.25, 'sine', 0.15, 0.07, 0.05); play(783.99, 'sine', 0.2, 0.07, 0.1); break;
				case 'lose': play(392, 'sawtooth', 0.18, 0.06); play(261.63, 'sawtooth', 0.22, 0.06, 0.08); break;
				case 'start': play(329.63, 'sine', 0.12, 0.06); play(392, 'sine', 0.12, 0.06, 0.08); break;
			}
		},

		toggleSound() {
			this.soundEnabled = !this.soundEnabled;
			if (this.soundEnabled) this.startMusic(); else this.stopMusic();
			if (this.audioCtx) {
				if (!this.soundEnabled && this.audioCtx.state !== 'suspended') this.audioCtx.suspend();
				if (this.soundEnabled && this.audioCtx.state === 'suspended') this.audioCtx.resume();
			}
		},

		startMusic() {
			this.initAudio();
			const ctx = this.audioCtx;
			if (this.musicOsc) return;
			this.musicOsc = ctx.createOscillator();
			this.musicGain = ctx.createGain();
			this.musicOsc.type = 'square';
			this.musicGain.gain.value = 0.03;
			this.musicOsc.connect(this.musicGain);
			this.musicGain.connect(ctx.destination);
			this.musicOsc.start();
			const pattern = [329.63, 392.0, 523.25, 392.0, 349.23, 440.0, 587.33, 440.0];
			let step = 0;
			this.musicTimer = setInterval(() => {
				if (!this.musicOsc) return;
				this.musicOsc.frequency.setValueAtTime(pattern[step % pattern.length], ctx.currentTime);
				step++;
			}, 220);
		},

		stopMusic() {
			if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
			if (this.musicOsc) { try { this.musicOsc.stop(); } catch(e) {} this.musicOsc.disconnect(); this.musicOsc = null; }
			if (this.musicGain) { try { this.musicGain.disconnect(); } catch(e) {} this.musicGain = null; }
		},

		changeMonsterImage() {
			const url = prompt(this.t('changeMonster'));
			if (url) this.monsterImg = url;
		}
	},
});

app.mount('#game');
