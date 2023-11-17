document.addEventListener('DOMContentLoaded', function () {
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dynamicText = document.getElementById('dynamicText');

const imagensDirecao = {
    aDireita: document.getElementById('andando_direita'),
    aEsquerda: document.getElementById('andando_esquerda'),
    paradoR: document.getElementById('parado_direita'),
    paradoL: document.getElementById('parado_esquerda')
};

const player = {
    x: 20,
    y: 200,
    width: 200,
    height: 200,
    speed: 4,
    dx: 0,
    dy: 0,
    direction: 'aDireita',
    isMoving: false,
    xp: 0,
    level: 1
};

const player_width = 200;
const player_height = 200;

const teclasPressionadas = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let inBattle = false;

// Declaração da variável enemy
const enemy = {
    x: 700,
    y: 500,
    width: 50,
    height: 50,
    imgPath: 'imagens/pombo.gif'
};

const enemy2 = {
    x: 900,
    y: 30,
    width: 50,
    height: 50,
    imgPath: 'imagens/pombo.gif'
};

const moto = {
    x: 1000,
    y: 100,
    width: 200,
    height: 200,
    imgPath: 'imagens/moto.png',
    speed: 3,
    direction: 1
};

const enemyImage = new Image();
enemyImage.src = enemy.imgPath;

const motoImage = new Image();
motoImage.src = moto.imgPath;

//MASCARA DE COLISAO
function draw() {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 0, 0, 0)";
    //ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.drawImage(enemyImage, enemy2.x, enemy2.y, enemy2.width, enemy2.height);

    const battleWindow = document.getElementById("battleWindow");
    battleWindow.style.display = inBattle ? "block" : "none";

    // Adiciona a lógica de desenho da moto quando estiver na fase 2
    if (faseAtual === 2) {
        // Move a moto da direita para a esquerda e vice-versa
        moto.x += moto.speed * moto.direction;

        // Verifica se a moto atingiu a borda direita
        if (moto.x + moto.width > canvas.width) {
            moto.direction = -1;  // Inverte a direção para a esquerda
        }

        // Verifica se a moto atingiu a borda esquerda
        if (moto.x < 0) {
            moto.direction = 1;  // Inverte a direção para a direita
        }

        // Desenha a moto, ajustando a escala horizontal se necessário
            if (moto.direction === 1) {
               // Inverte a imagem horizontalmente apenas no eixo x
               ctx.save();
               ctx.scale(-1, 1);
               ctx.drawImage(motoImage, -moto.x - moto.width, moto.y, moto.width, moto.height);
               ctx.restore();
            } else {
                ctx.drawImage(motoImage, moto.x, moto.y, moto.width, moto.height);
            }
        }

    requestAnimationFrame(draw);
}

let faseAtual = 1;
let playerHealth = 1000;
let enemyHealth = 50;

let playerDamage = 10;
let enemyDamage = 5;

let currentPlayerTurn = true;
let enemyAttackTimeout = null;

let defesa = false;
let atualizacaoHpFeita = false;
let motobatalha = false;

function xpNeededForNextLevel(level) {
    // Lógica para calcular a XP necessária para subir de nível
    return level * 100;
}

function atualizaHp(){
    console.log("Atualizando a interface de saúde...");

    // Atualiza a saúde na interface gráfica
    const playerHealthElement = document.getElementById("playerHealth");
    const enemyHealthElement = document.getElementById("enemyHealth");

    enemyHealthElement.innerText = Math.max(0, enemyHealth);

    if (playerHealthElement && enemyHealthElement) {
        playerHealthElement.innerText = playerHealth;
        enemyHealthElement.innerText = enemyHealth;
    } else {
        console.error("Elementos de saúde não encontrados!");
    }
}

function update() {
    if (!inBattle) {
        player.x += player.dx;
        player.y += player.dy;

        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

        player.isMoving = player.dx !== 0 || player.dy !== 0;
    }

    if (inBattle) {
        let inimigo = document.querySelector(".enemy-img");
        let inimigoHp = document.getElementById('enemyHealth');

        console.log(atualizacaoHpFeita);

        if (faseAtual === 1 && !atualizacaoHpFeita) {
            inimigo.style.marginTop = '60px';
            inimigoHp.style.top = '8%';
            inimigoHp.style.left = '58%';
            enemyHealth = 50;
            atualizaHp();

            atualizacaoHpFeita = true;
        } else if (faseAtual === 2 && !atualizacaoHpFeita) {
            motobatalha = true;
            inimigo.src = 'imagens/moto.png';
            inimigo.style.width = '100px';
            inimigo.style.height = '80px';
            inimigo.style.marginTop = '5px';
            inimigoHp.style.top = '4%';
            inimigoHp.style.left = '55%';
            enemyHealth = 80;
            atualizaHp();

            atualizacaoHpFeita = true;
        }
        console.log(atualizacaoHpFeita);


        // Se estiver em batalha, pare o jogador
        player.dx = 0;
        player.dy = 0;

        // Defina a imagem parada com base na direção do jogador
        if (player.direction === 'aDireita') {
            imagensDirecao.aDireita.style.display = 'none';
            imagensDirecao.paradoR.style.display = 'block';
            imagensDirecao.paradoR.style.transform = `translate(${player.x}px, ${player.y}px)`;
            imagensDirecao.paradoR.style.width = `${player_width}px`;
            imagensDirecao.paradoR.style.height = `${player_height}px`;
        } else if (player.direction === 'aEsquerda') {
            imagensDirecao.aEsquerda.style.display = 'none';
            imagensDirecao.paradoL.style.display = 'block';
            imagensDirecao.paradoL.style.transform = `translate(${player.x}px, ${player.y}px)`;
            imagensDirecao.paradoL.style.width = `${player_width}px`;
            imagensDirecao.paradoL.style.height = `${player_height}px`;
        }

        // Lógica do turno do inimigo
        if (!currentPlayerTurn && !enemyAttackTimeout && enemyHealth > 0) {
            clearTimeout(enemyAttackTimeout); 
            enemyAttackTimeout = setTimeout(function () {

                if (!defesa){
                    // Subtrai o dano do inimigo
                    playerHealth -= enemyDamage;

                    // Garante que a saúde do jogador não seja negativa
                    playerHealth = Math.max(0, playerHealth);
                    
                    dynamicText.innerText = `o inimigo causou ${enemyDamage} de dano!`
                } else {
                    dynamicText.innerText = `Você se defendeu do inimigo!`
                    defesa = false;
                }
                
                if (faseAtual === 1) {
                    // Muda temporariamente a imagem após 300 milissegundos
                    inimigo.src = 'imagens/pombob.gif';
                    // Após mais 300 milissegundos, volta à imagem normal
                    setTimeout(function () {
                        inimigo.src = 'imagens/pombo.gif';
                    }, 1000);
                }

                enemyHealth = Math.max(enemyHealth, 0);

                atualizaHp();

                // Verifica se a batalha terminou
                if (enemyHealth == 0) {
                    endBattle();
                }
                if (playerHealth == 0) {
                    GameOver();
                }

                // Reinicia a variável para permitir o próximo turno do inimigo
                currentPlayerTurn = true;
                enemyAttackTimeout = null;
            }, 2000); // 3000 milissegundos = 3 segundos
        }

    }

    if (faseAtual === 1){
        if (
            (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) ||
            (player.x < enemy2.x + enemy2.width &&
                player.x + player.width > enemy2.x &&
                player.y < enemy2.y + enemy2.height &&
                player.y + player.height > enemy2.y)
        ) {
            inBattle = true;
        } else {
            if (!inBattle) {
                moveEnemyToStartPosition();
                atualizacaoHpFeita = false;
            }
        }
    }

    if (faseAtual == 2){
        if (player.x < moto.x + moto.width &&
            player.x + player.width > moto.x &&
            player.y < moto.y + moto.height &&
            player.y + player.height > moto.y){
                inBattle = true;
            }else {
                if (!inBattle) {
                    atualizacaoHpFeita = false;
                }
            }
        }
    
    healthAnim();
    updateLevel(update);
    requestAnimationFrame(update);
    
    
}

attackButtons.addEventListener("click", function (event) {
    // Verifique se o clique ocorreu em um botão dentro do contêiner de botões de ataque
    if (event.target.tagName === "BUTTON") {
        const attackName = event.target.innerText;
        handleAttack(attackName);
    }
});

function handleAttack(attackName) {
    const playerImage = document.querySelector(".character-img"); 

    if (inBattle) {
        if (currentPlayerTurn) {
            // Lógica do turno do jogador
            currentPlayerTurn = false;

            playerDamage = Math.max(0, playerDamage);

            if (attackName == 'LATIDO') {
                playerDamage = Math.max(0, enemyHealth >= 0 ? 5 : -enemyHealth);
                console.log("Antes do ataque: enemyHealth =", enemyHealth);
                enemyHealth -= playerDamage;
                console.log("Depois do ataque: enemyHealth =", enemyHealth);
                if (playerImage) {
                    // Ganha XP ao atacar
                    player.xp += 10;
                    // Muda temporariamente a imagem após 300 milissegundos
                    playerImage.src = 'imagens/LuEBrauLatir.gif';

                    // Após mais 300 milissegundos, volta à imagem normal
                    setTimeout(function () {
                        playerImage.src = 'imagens/LuEBrauIdleRight.png';
                    }, 1000);
                }
            } else if (attackName == 'CAVAR') {
                playerDamage = Math.max(0, enemyHealth >= 0 ? 10 : -enemyHealth);
                enemyHealth -= playerDamage;
                if (playerImage) {
                    // Ganha XP ao atacar
                    player.xp += 20;
                    // Muda temporariamente a imagem após 300 milissegundos
                    playerImage.src = 'imagens/LuEBrauCavar.gif';

                    // Após mais 300 milissegundos, volta à imagem normal
                    setTimeout(function () {
                        playerImage.src = 'imagens/LuEBrauIdleRight.png';
                    }, 1000);
                }
            } else if (attackName == 'DEFESA HUMANA') {
                playerDamage = Math.max(0, enemyHealth >= 0 ? 0 : -enemyHealth);
                enemyHealth -= playerDamage;
                if (playerImage) {
                    // Ganha XP ao atacar
                    player.xp += 10;
                    // Muda temporariamente a imagem após 300 milissegundos
                    playerImage.src = 'imagens/LuEBrauDefense.gif';

                    // Após mais 300 milissegundos, volta à imagem normal
                    setTimeout(function () {
                        playerImage.src = 'imagens/LuEBrauDefenseIdle.png';
                        defesa = true;
                    }, 1200);
                }

                dynamicText.innerText = `Causou ${playerDamage} de dano no inimigo!`;
            
            }

            // Atualiza a saúde na interface gráfica
            const playerHealthElement = document.getElementById("playerHealth");
            const enemyHealthElement = document.getElementById("enemyHealth");

            if (playerHealthElement && enemyHealthElement) {
                playerHealthElement.innerText = playerHealth;
                enemyHealthElement.innerText = Math.max(0, enemyHealth);
            } else {
                console.error("Elementos de saúde não encontrados!");
            }

            if (player.xp >= xpNeededForNextLevel(player.level)) {
                player.level++;
                dynamicText.innerText = `Você alcançou o nível ${player.level}!`;
                if (playerImage) {
                    setTimeout(function(){
                        // Ganha XP ao atacar
                        player.xp += 10;
                        // Muda temporariamente a imagem após 300 milissegundos
                        playerImage.src = 'imagens/LuEBrauXp.gif';
                        subiuDeNivel();

                        // Após mais 300 milissegundos, volta à imagem normal
                        setTimeout(function () {
                            playerImage.src = 'imagens/LuEBrauIdleRight.png';
                            defesa = true;
                        }, 1200);
                    }, 1200);
                    
                }
            }

            updatePlayerStats();

            // Verifica se a batalha terminou
            if (enemyHealth == 0) {
                setTimeout(() => {
                    endBattle();
                }, 4000);
            }else  if (playerHealth == 0) {
                GameOver();
            }
        }
    }

    atualizaHp();
}

function subiuDeNivel(){}

function updateLevel() {
    if (faseAtual === 1) {
        if (player.x > window.innerWidth - player_width) {
            // Mudando para a Fase 2
            document.body.style.backgroundImage = 'url("imagens/fundo1.png")';
            faseAtual = 2;

            // Reposiciona o jogador para a borda esquerda
            player.x = 10;

            // Mantém as posições do inimigo
            enemy.x = -1000;
            enemy.y = -1000;

            enemy2.x = -1000;
            enemy2.y = -1000;
        }
    } else if (faseAtual === 2) {
        // Limita as coordenadas do jogador na tela da Fase 2
        if (player.x < 1) {
            // Mudando para a Fase 1
            document.body.style.backgroundImage = 'url("imagens/fundo0.png")';
            faseAtual = 1;

            // Reposiciona o jogador para a borda direita
            player.x = window.innerWidth - player_width;

            // Mantém as posições do inimigo
            enemy.x = 700;
            enemy.y = 500;

            enemy2.x = 900;
            enemy2.y = 40;
        }
    }
}

function updatePlayerStats() {
    const playerLevelElement = document.getElementById("playerLevel");
    const playerXPElement = document.getElementById("playerXP");

    if (playerLevelElement && playerXPElement) {
        playerLevelElement.innerText = `Nível: ${player.level}`;
        playerXPElement.innerText = `XP: ${player.xp} / ${xpNeededForNextLevel(player.level)}`;
    } else {
        console.error("Elementos de estatísticas do jogador não encontrados!");
    }
}

function startGame() {
    moveEnemyToStartPosition();
    update();
    draw();
    atualizaHp();
}

function moveEnemyToStartPosition() {
    enemy.x;
    enemy.y;
}

function healthAnim(){
    let enemyVida = document.getElementById('enemyHealth');
    let playerVida = document.getElementById('playerHealth');

    if (enemyHealth <= 20) {
        enemyVida.style.color = 'red';
    } else if (enemyHealth <= enemyHealth / 2) {
        enemyVida.style.color = 'orange';
    } else {
        enemyVida.style.color = 'green';
    }

    if (playerHealth <= 20) {
        playerVida.style.color = 'red';
    } else if (playerHealth <= playerHealth / 2) {
        playerVida.style.color = 'orange';
    } else {
        playerVida.style.color = 'green';
    }
}

function endBattle() {
    enemyHealth = 50;
    atualizaHp();
    inBattle = false;
    currentPlayerTurn = true;  // Reinicia o turno do jogador
    defesa = false;

    // Mova o inimigo para fora da tela(sumir)
    if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y){
            enemy.x = -1000;
            enemy.y = -1000;
    }else if (player.x < enemy2.x + enemy2.width &&
            player.x + player.width > enemy2.x &&
            player.y < enemy2.y + enemy2.height &&
            player.y + player.height > enemy2.y){
            enemy2.x = -1000;
            enemy2.y = -1000; 
    }

    if(motobatalha){
        moto.x = -1000;
        moto.y = -1000;
    }
    
}

function GameOver() {
    document.body.style.backgroundImage = 'url("imagens/fundo0.png")';
    player.xp = 0;
    player.level = 1;
    updatePlayerStats();

    playerHealth = 50;
    player.x = 20;
    player.y = 200;

    enemyHealth = 50;
    atualizaHp();
    inBattle = false;
    currentPlayerTurn = true;
    defesa = false;

    enemy.x = 700;
    enemy.y = 500;

    enemy2.x = 900;
    enemy2.y = 40;
}


window.onload = startGame;

//PERSONAGEM
function moverImagem() {
    if (!inBattle) {
        var movimento = false;

        for (var direcao in imagensDirecao) {
            imagensDirecao[direcao].style.display = 'none';
        }

        if (teclasPressionadas.ArrowRight) {
            imagensDirecao.aDireita.style.display = 'block';
            player.direction = 'aDireita';
            player.x += player.speed;
            movimento = true;
        } else if (teclasPressionadas.ArrowLeft) {
            imagensDirecao.aEsquerda.style.display = 'block';
            player.direction = 'aEsquerda';
            player.x -= player.speed;
            movimento = true;
        } else if (teclasPressionadas.ArrowUp) {
            if (player.direction === 'aDireita') {
                imagensDirecao.aDireita.style.display = 'block';
            } else if (player.direction === 'aEsquerda') {
                imagensDirecao.aEsquerda.style.display = 'block';
            }
            player.y -= player.speed;
            movimento = true;
        } else if (teclasPressionadas.ArrowDown) {
            if (player.direction === 'aDireita') {
                imagensDirecao.aDireita.style.display = 'block';
            } else if (player.direction === 'aEsquerda') {
                imagensDirecao.aEsquerda.style.display = 'block';
            }
            player.y += player.speed;
            movimento = true;
        }

        if (!movimento) {
            if (player.direction === 'aDireita') {
                imagensDirecao.paradoR.style.display = 'block';
                imagensDirecao.paradoR.style.transform = `translate(${player.x}px, ${player.y}px)`;
                imagensDirecao.paradoR.style.width = `${player_width}px`;
                imagensDirecao.paradoR.style.height = `${player_height}px`;
            } else if (player.direction === 'aEsquerda') {
                imagensDirecao.paradoL.style.display = 'block';
                imagensDirecao.paradoL.style.transform = `translate(${player.x}px, ${player.y}px)`;
                imagensDirecao.paradoL.style.width = `${player_width}px`;
                imagensDirecao.paradoL.style.height = `${player_height}px`;
            }
        }

        imagensDirecao[player.direction].style.transform = `translate(${player.x}px, ${player.y}px)`;
        imagensDirecao[player.direction].style.width = `${player_width}px`;
        imagensDirecao[player.direction].style.height = `${player_height}px`;
    }

    requestAnimationFrame(moverImagem);
}

document.addEventListener('keydown', function (event) {
        if (event.key in teclasPressionadas) {
            teclasPressionadas[event.key] = true;
        }
});

document.addEventListener('keyup', function (event) {
    if (event.key in teclasPressionadas) {
        teclasPressionadas[event.key] = false;
    }
});

moverImagem(); 
draw();
});


