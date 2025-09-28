document.addEventListener('DOMContentLoaded', () => {

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

        // O valor do gap (espaçamento) é definido no CSS: 20px
        const GAP = 20;

        // Centraliza o carrossel no item ativo
        function updateCarousel() {
            // 1. Atualiza a classe 'active'
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            });

            const activeItem = items[currentIndex];
            const containerWidth = carousel.parentElement.offsetWidth;
            
            // Largura calculada do item ativo após a classe 'active' ser aplicada
            // É importante garantir que o layout tenha tempo de recalcular a largura,
            // mas para a maioria dos navegadores, a leitura é instantânea.
            const activeItemWidth = activeItem.offsetWidth;

            // Posição do item ativo em relação ao carrossel
            // Soma a largura de todos os itens e gaps *antes* do item ativo
            let offsetLeft = 0;
            for (let i = 0; i < currentIndex; i++) {
                // Para simplificar, assumimos que os itens não ativos têm a mesma largura.
                // Se a largura de todos os itens for igual (exceto o ativo), 
                // podemos somar a largura do item anterior + o gap.
                // Usaremos a largura do primeiro item não ativo como base.
                const itemBefore = items[i];
                offsetLeft += itemBefore.offsetWidth + GAP; 
            }
            
            // CALCULAR O DESLOCAMENTO:
            // O valor para TRANSLATE X é:
            // (Posição inicial do item ativo) - (Metade da Largura do Contêiner) + (Metade da Largura do Item Ativo)
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
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }

    // Inicializa o Carrossel de Fotos (Horizontal)
    initializeCarousel('image-carousel', 'prev-btn', 'next-btn');
    
    // Inicializa o Carrossel de Vídeos (Vertical)
    initializeCarousel('video-carousel', 'prev-video-btn', 'next-video-btn');
});