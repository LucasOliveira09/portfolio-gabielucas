document.addEventListener('DOMContentLoaded', () => {

    /**
     * Função Debounce: Atraso na execução da função para evitar chamadas excessivas.
     * Útil em eventos como 'resize' ou 'scroll'.
     * @param {Function} func A função a ser executada.
     * @param {number} delay O tempo de espera em milissegundos.
     */
    function debounce(func, delay = 250) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * Função principal para inicializar e gerenciar um carrossel.
     * @param {string} carouselId O ID do elemento do carrossel (ex: 'image-carousel').
     * @param {string} prevBtnId O ID do botão anterior.
     * @param {string} nextBtnId O ID do botão próximo.
     */
    function initializeCarousel(carouselId, prevBtnId, nextBtnId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (items.length === 0) return;

        let currentIndex = 0;
        const totalItems = items.length;

        // OTIMIZAÇÃO: Lê o 'gap' diretamente do CSS.
        // O valor 20 é um fallback caso a leitura falhe.
        const gap = parseFloat(getComputedStyle(carousel).gap) || 20;

        // Armazena as larguras para recalcular no resize
        let itemWidths = [];

        function calculateWidths() {
            // OTIMIZAÇÃO: Cache das larguras de todos os itens (no seu estado não-ativo)
            // Resetar a classe 'active' garante que estamos pegando a largura base.
            items.forEach(item => item.classList.remove('active'));
            itemWidths = [...items].map(item => item.offsetWidth);
            
            // Re-aplica a classe 'active' ao item atual
            if (items[currentIndex]) {
                items[currentIndex].classList.add('active');
            }
        }

        // Centraliza o carrossel no item ativo
        function updateCarousel() {
            // 1. Atualiza a classe 'active'
            items.forEach((item, index) => {
                item.classList.toggle('active', index === currentIndex);
            });

            // Garante que as larguras estão calculadas
            if(itemWidths.length === 0) {
                 calculateWidths();
            }

            const activeItem = items[currentIndex];
            if (!activeItem) return;

            // --- OTIMIZAÇÃO PRINCIPAL ---
            // Lê as larguras do DOM o mínimo possível.

            // Leitura 1: Largura do contêiner pai
            const containerWidth = carousel.parentElement.offsetWidth;
            
            // Leitura 2: Largura do item ATIVO (que é diferente dos outros)
            const activeItemWidth = activeItem.offsetWidth; 

            // OTIMIZAÇÃO: Cálculo do offset sem loop de leitura do DOM
            // Usamos as larguras cacheadas (itemWidths) para os itens anteriores
            const offsetLeft = itemWidths.slice(0, currentIndex)
                                         .reduce((acc, width) => acc + width + gap, 0);

            // CALCULAR O DESLOCAMENTO:
            const scrollAmount = offsetLeft - (containerWidth / 2) + (activeItemWidth / 2);

            // Aplica o transform.
            carousel.style.transform = `translateX(-${scrollAmount}px)`;
        }

        // 2. Navegação
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalItems - 1;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < totalItems - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }

        // 3. Inicializa e recalcula em resize
        
        // Função para recalcular larguras e atualizar
        function handleResize() {
            calculateWidths(); // Recalcula as larguras base
            updateCarousel();  // Reposiciona o carrossel
        }

        calculateWidths();
        updateCarousel(); // Chamada inicial
        
        // OTIMIZAÇÃO: Usa o 'debounce' no evento de resize
        window.addEventListener('resize', debounce(handleResize, 300));
    }

    // Inicializa o Carrossel de Fotos
    initializeCarousel('image-carousel', 'prev-btn', 'next-btn');

    // Inicializa o Carrossel de Vídeos
    initializeCarousel('video-carousel', 'prev-video-btn', 'next-video-btn');
});