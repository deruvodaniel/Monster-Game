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
			isPlayerDefending: false
		};
	},

	computed: {
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

	methods: {
		attackMonster () {
			this.currentRound++;
			const attackValue = getRandomValue(5, 12);
			this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
			this.addLogMessage('player', 'attack', attackValue);
			this.isMonsterHit = true;
			setTimeout(() => { this.isMonsterHit = false; }, 350);
			this.attackPlayer();
		
		},
		
		attackPlayer () {
			let attackValue = getRandomValue(8 ,15);
			if (this.isPlayerDefending) {
				attackValue = Math.floor(attackValue / 2);
				this.isPlayerDefending = false;
			}
			this.playerHealth = Math.max(this.playerHealth - attackValue, 0);
			this.addLogMessage('monster', 'attack', attackValue);
			this.isPlayerHit = true;
			setTimeout(() => { this.isPlayerHit = false; }, 350);
		},

		specialAttackMonster() {
			this.currentRound++;
			const attackValue = getRandomValue(10, 25);
			this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
			this.addLogMessage('player', 'special-attack', attackValue);
			this.isMonsterHit = true;
			setTimeout(() => { this.isMonsterHit = false; }, 350);
			this.attackPlayer();
		},

		healPLayer() {
			this.currentRound++;
			const healValue = getRandomValue(8, 20);
			this.playerHealth = Math.min(this.playerHealth + healValue, 100);
			this.addLogMessage('player', 'heal', healValue);
			this.attackPlayer();
		},

		surrender() {
			this.winner = 'monster';
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
		}
	},
});

app.mount('#game');
