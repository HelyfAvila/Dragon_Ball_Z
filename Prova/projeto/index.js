const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { life: 100, name: "Goku", sprite: "assets/Goku.png" },
            villain: { life: 100, name: "Vegeta", sprite: "assets/Vegeta.jpg" },
            attackHistory: [],
            winner: null,
            attackGif: "assets/goku_ataca.gif",
            attackGiftwo: "assets/vegeta_ataca.gif",
            isMusicStarted: false, // Novo estado para controlar a música
        };
    },
    mounted() {
        const backgroundMusic = document.getElementById('backgroundMusic');
        backgroundMusic.volume = 0.2; // Definindo volume baixo para a música de fundo
        backgroundMusic.muted = true; // Inicialmente mutar a música

        // Função para tocar música
        const playMusic = () => {
            backgroundMusic.muted = false; // Desmutar a música
            backgroundMusic.play().catch(error => {
                console.error("Não foi possível tocar a música de fundo:", error);
            });
            document.removeEventListener('click', playMusic); // Remove o ouvinte após a primeira interação
        };

        // Adiciona um ouvinte para tocar a música na primeira interação do usuário
        document.addEventListener('click', playMusic);
    },
    methods: {
        attack(isHero) {
            const damage = 10; // Dano do ataque
            let actionMessage;

            // Tocar som de ataque
            this.playSound('attackSound', 5000); // Tocar som por 5 segundos

            if (isHero) {
                this.hero.sprite = this.attackGif; // Troca a imagem do herói pelo GIF
                setTimeout(() => {
                    this.hero.sprite = "assets/Goku.png"; // Retorna à imagem original após 3 segundos
                }, 3000); // 3000 milissegundos (3 segundos)
                this.villain.life -= damage;
                actionMessage = `${this.hero.name} atacou ${this.villain.name} causando ${damage} de dano!`;
            } else {
                this.villain.sprite = this.attackGiftwo;
                setTimeout(() => {
                    this.villain.sprite = "assets/Vegeta.jpg"; // Retorna à imagem original após 3 segundos
                }, 3000); // 3000 milissegundos (3 segundos)
                this.hero.life -= damage;
                actionMessage = `${this.villain.name} atacou ${this.hero.name} causando ${damage} de dano!`;
            }

            this.attackHistory.push(actionMessage);
            this.checkGameOver();
            this.villainAction();
        },
        defense(isHero) {
            if (isHero) {
                alert(`${this.hero.name} se defendeu!`);
            } else {
                alert(`${this.villain.name} se defendeu!`);
            }
        },
        usePotion(isHero) {
            const heal = 20;

            if (isHero) {
                this.hero.life += heal;
                if (this.hero.life > 100) this.hero.life = 100;
                alert(`${this.hero.name} usou uma poção e recuperou ${heal} de vida!`);
            } else {
                this.villain.life += heal;
                if (this.villain.life > 100) this.villain.life = 100;
                alert(`${this.villain.name} usou uma poção e recuperou ${heal} de vida!`);
            }
        },
        flee(isHero) {
            if (isHero) {
                alert(`${this.hero.name} correu da batalha!`);
            } else {
                alert(`${this.villain.name} correu da batalha!`);
            }
        },
        villainAction() {
            const actions = ['attack', 'defense', 'usePotion', 'flee'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            this[randomAction](false);
        },
        checkGameOver() {
            if (this.hero.life <= 0) {
                this.winner = this.villain.name;
                alert(`${this.hero.name} foi derrotado! O jogo acabou.`);
                this.resetGame();
            } else if (this.villain.life <= 0) {
                this.winner = this.hero.name;
                alert(`${this.villain.name} foi derrotado! Você venceu!`);
                this.resetGame();
            }
        },
        resetGame() {
            this.hero.life = 100;
            this.villain.life = 100;
            this.attackHistory = [];
            this.winner = null;
        },
        playSound(soundId, duration) {
            const sound = document.getElementById(soundId);
            sound.play();
            setTimeout(() => {
                sound.pause();
                sound.currentTime = 0; // Resetar o som para o início
            }, duration); // Pausar o som após a duração especificada (5 segundos)
        }
    }
}).mount("#app");
