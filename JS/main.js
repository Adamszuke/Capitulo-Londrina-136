document.addEventListener('DOMContentLoaded', () => {
    const urlDados = 'Data/gestoes.json';
    const container = document.getElementById('container-gestoes');

    // Elementos do Modal
    const modal = document.getElementById('modal-gestao');
    const closeBtn = document.querySelector('.close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalPeriodo = document.getElementById('modal-periodo');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescricao = document.getElementById('modal-descricao');

    const modalCargos = document.getElementById('modal-cargos');
    const modalPremios = document.getElementById('modal-premios');

    // Função para abrir o modal 
    function abrirModal(gestao) {
        modalImg.src = gestao.foto;
        modalPeriodo.innerText = gestao.periodo;
        modalTitulo.innerText = gestao.MC;
        modalDescricao.innerText = gestao.biografia || gestao.resumo;

        // 1. Limpar as listas anteriores (para não acumular)
        modalCargos.innerHTML = '';
        modalPremios.innerHTML = '';

        // 2. Preencher Cargos (Verifica se existe e se tem itens)
        if (gestao.cargos && gestao.cargos.length > 0) {
            gestao.cargos.forEach(cargo => {
                const li = document.createElement('li');
                li.innerText = cargo;
                modalCargos.appendChild(li);
            });
        } else {
            modalCargos.innerHTML = '<li>Nenhum cargo registrado.</li>';
        }

        // 3. Preencher Prêmios (ATUALIZADO PARA IMAGENS)
        if (gestao.premios && gestao.premios.length > 0) {
            gestao.premios.forEach(premio => {
                const li = document.createElement('li');
                
                // Adiciona uma classe para facilitar o CSS
                li.classList.add('item-premio');

                // Monta o HTML: Imagem + Nome do prêmio
                // Se não tiver ícone no JSON, ele mostra uma medalha padrão (opcional)
                const icone = premio.icone ? premio.icone : 'Assets/img/MCs/default.png';

                li.innerHTML = `
                    <img src="${icone}" alt="Ícone de ${premio.nome}">
                    <span>${premio.nome}</span>
                `;
                
                modalPremios.appendChild(li);
            });
        } else {
            modalPremios.innerHTML = '<li class="sem-premio">Nenhuma premiação registrada.</li>';
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Função para fechar o modal
    function fecharModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; 
    }

    closeBtn.addEventListener('click', fecharModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // Carrega os dados das gestões e cria os cards
    async function carregarGestoes() {
        try {
            const resposta = await fetch(urlDados);
            if (!resposta.ok) throw new Error('Erro ao carregar dados.');
            
            let gestoes = await resposta.json();
            
            // Ordena decrescente pelo ID
            gestoes.sort((a, b) => b.id - a.id);

            gestoes.forEach(gestao => {
                const card = document.createElement('article');
                card.classList.add('gestao-card');

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${gestao.foto}" alt="Foto de ${gestao.MC}">
                    </div>
                    <div class="card-content">
                        <span class="card-period">${gestao.periodo}</span>
                        <h3 class="card-title">${gestao.MC}</h3>
                        <p class="card-resume">${gestao.resumo}</p>
                    </div>
                `;

                // Adiciona o evento de clique para abrir o modal
                card.addEventListener('click', () => {
                    abrirModal(gestao);
                });

                container.appendChild(card);
            });

        } catch (erro) {
            console.error(erro);
        }
    }

    carregarGestoes();
});