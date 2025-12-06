document.addEventListener('DOMContentLoaded', () => {
    const urlDados = 'Data/gestoes.json';
    const container = document.getElementById('container-gestoes');
    const btnCarregarMais = document.getElementById('btn-carregar-mais');

    // Variáveis de controle da paginação
    let gestoesDados = []; // Armazena todos os dados carregados
    let itensExibidos = 0; // Contador de quantos já apareceram
    const itensPorPagina = 6; // Quantidade a carregar por clique

    // Elementos do Modal
    const modal = document.getElementById('modal-gestao');
    const closeBtn = document.querySelector('.close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalPeriodo = document.getElementById('modal-periodo');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescricao = document.getElementById('modal-descricao');
    const modalCargos = document.getElementById('modal-cargos');
    const modalPremios = document.getElementById('modal-premios');

    // --- FUNÇÕES DO MODAL ---

    function abrirModal(gestao) {
        modalImg.src = gestao.foto;
        modalPeriodo.innerText = gestao.periodo;
        modalTitulo.innerText = gestao.MC;
        modalDescricao.innerText = gestao.biografia || gestao.resumo;

        // Limpar listas
        modalCargos.innerHTML = '';
        modalPremios.innerHTML = '';

        // Preencher Cargos
        if (gestao.cargos && gestao.cargos.length > 0) {
            gestao.cargos.forEach(cargo => {
                const li = document.createElement('li');
                li.innerText = cargo;
                modalCargos.appendChild(li);
            });
        } else {
            modalCargos.innerHTML = '<li>Nenhum cargo registrado.</li>';
        }

        // Preencher Prêmios
        if (gestao.premios && gestao.premios.length > 0) {
            gestao.premios.forEach(premio => {
                const li = document.createElement('li');
                li.classList.add('item-premio');
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

    // --- LÓGICA DE CARREGAMENTO E PAGINAÇÃO ---

    // Função que cria o HTML do card e adiciona ao container
    function renderizarCards() {
        // Pega uma fatia do array (ex: do 0 ao 6, depois do 6 ao 12...)
        const proximosItens = gestoesDados.slice(itensExibidos, itensExibidos + itensPorPagina);

        proximosItens.forEach(gestao => {
            const card = document.createElement('article');
            card.classList.add('gestao-card');

            // Efeito suave de entrada (opcional)
            card.style.animation = 'slideUp 0.5s ease forwards'; 

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

            card.addEventListener('click', () => {
                abrirModal(gestao);
            });

            container.appendChild(card);
        });

        // Atualiza o contador
        itensExibidos += itensPorPagina;

        // Verifica se acabaram os itens para esconder o botão
        if (itensExibidos >= gestoesDados.length) {
            btnCarregarMais.classList.add('hidden');
        }
    }

    // Função Principal de Setup
    async function inicializar() {
        try {
            const resposta = await fetch(urlDados);
            if (!resposta.ok) throw new Error('Erro ao carregar dados.');
            
            gestoesDados = await resposta.json();
            
            // Ordena decrescente pelo ID
            gestoesDados.sort((a, b) => b.id - a.id);

            // Renderiza os primeiros 6
            renderizarCards();

            // Adiciona evento ao botão
            btnCarregarMais.addEventListener('click', renderizarCards);

        } catch (erro) {
            console.error(erro);
            container.innerHTML = '<p>Erro ao carregar as gestões.</p>';
            btnCarregarMais.classList.add('hidden');
        }
    }

    inicializar();
});