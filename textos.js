const attackButtons = document.getElementById('attackButtons');
const dynamicText = document.getElementById('dynamicText');

// Adicione eventos de mouseover e mouseout aos botões
attackButtons.addEventListener('mouseover', function (event) {
    const buttonText = event.target.innerText;

    // Lógica para definir o texto com base no botão
    if (buttonText === 'LATIDO') {
        dynamicText.innerText = 'Lu manda Brau latir para inimigo!\n\n-5 DE DANO';
    } else if (buttonText === 'CAVAR') {
        dynamicText.innerText = 'Brau cava no chão jogando areia no inimigo!\n\n-10 DE DANO';
    } else if (buttonText === 'DEFESA HUMANA') {
        dynamicText.innerText = 'Brau usa a humana de escudo, se defendendo do ataque inimigo.\n\n-0 DE DANO';
    }
});

    //    attackButtons.addEventListener('mouseout', function () {
    //        dynamicText.innerText = 'INIMIGO ENCONTRADO';
    //    });

// Adicione eventos de clique aos botões
attackButtons.addEventListener('click', function (event) {
    const buttonText = event.target.innerText;

    // Lógica para definir o texto com base no clique
    if (buttonText === 'LATIDO') {
        dynamicText.innerText = 'Causou 5 de dano no inimigo!';
    }else if (buttonText === 'CAVAR') {
        dynamicText.innerText = 'Causou 10 de dano no inimigo!';
    }else if (buttonText === 'DEFESA HUMANA') {
        dynamicText.innerText = 'Brau usou a humana como escudo!';
    }
});

