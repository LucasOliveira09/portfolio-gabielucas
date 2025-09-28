document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Função principal para inicializar e gerenciar um carrossel.
     * @param {string} carouselId O ID do elemento do carrossel (ex: 'image-carousel').
     * @param {string} prevBtnId O ID do botão anterior.
     * @param {string} nextBtnId O ID do botão próximo.
     */
    function initializeCarousel(carouselId, prevBtnId, nextBtnId) {
        const carousel = document.getElementById(carouselId);
        
        if (!carousel) return; // Sai se o carrossel não for encontrado
        
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        let currentIndex = 0; 
        const totalItems = items.length;

        // Centraliza o carrossel no item ativo
        function updateCarousel() {
            // 1. Atualiza a classe 'active'
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            });

            // 2. Calcula o deslocamento (para centralizar o item ativo)
            if (items.length === 0) return;

            const activeItem = items[currentIndex];
            // Largura do item ATUAL com a classe 'active'
            const activeItemWidth = activeItem.offsetWidth; 
            // Largura do contêiner visível
            const containerWidth = carousel.parentElement.offsetWidth; 
            
            // Posição do item ativo em relação ao carrossel
            const offsetLeft = activeItem.offsetLeft; 
            
            // Calcula o quanto mover para centralizar o item ativo
            // Deslocamento = Posição Inicial do Item - (Metade da Largura do Contêiner) + (Metade da Largura do Item Ativo)
            const scrollAmount = offsetLeft - (containerWidth / 2) + (activeItemWidth / 2);
            
            // Aplica o transform. 
            carousel.style.transform = `translateX(-${scrollAmount}px)`;
        }

        // 3. Navegação
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

        // Inicializa e recalcula em resize
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }

    // Inicializa o Carrossel de Fotos (Horizontal)
    initializeCarousel('image-carousel', 'prev-btn', 'next-btn');
    
    // Inicializa o Carrossel de Vídeos (Vertical)
    initializeCarousel('video-carousel', 'prev-video-btn', 'next-video-btn');
});