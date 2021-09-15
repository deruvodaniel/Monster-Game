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
			logMsgs: []
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
			this.monsterHealth -= attackValue;
			this.addLogMessage('player', 'attack', attackValue);
			this.attackPlayer();
		
		},
		
		attackPlayer () {
			const attackValue = getRandomValue(8 ,15);
			this.playerHealth -= attackValue;
			this.addLogMessage('monster', 'attack', attackValue);
		},

		specialAttackMonster() {
			this.currentRound++;
			const attackValue = getRandomValue(10, 25);
			this.monsterHealth -= attackValue;
			this.addLogMessage('player', 'special-attack', attackValue);
			this.attackPlayer();
		},

		healPLayer() {
			this.currentRound++;
			const healValue = getRandomValue(8, 20);
			if (this.playerHealth + healValue > 100) {
				this.playerHealth = 100;
			} else {
				this.playerHealth += healValue;
			}
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
			this.logMsgs = []
		},

		addLogMessage(who, what, value) {
			this.logMsgs.unshift({
				actionBy: who,
				actionType: what,
				actionValue: value
			});
		}
	},
});

app.mount('#game');