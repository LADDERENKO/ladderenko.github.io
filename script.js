// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Плавный скролл при клике на CTA-кнопку
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.querySelector('.intro-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Анимация появления блоков при скролле
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Дополнительный эффект при наведении
    const bamBaamPhrases = document.querySelectorAll('strong');
    bamBaamPhrases.forEach(phrase => {
        phrase.addEventListener('mouseenter', () => {
            // Эффект, который будет добавлен в CSS
        });
    });

    // --- Космические эффекты ---

    // 1. Генерация мерцающих звезд по всей высоте документа
    const starContainer = document.createElement('div');
    starContainer.classList.add('star-container');
    document.body.appendChild(starContainer);

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        // Позиционируем звезды по всей высоте документа
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * document.documentElement.scrollHeight}px`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starContainer.appendChild(star);
    }

    // Создаем 150 звезд
    const totalStars = 150;
    for (let i = 0; i < totalStars; i++) {
        createStar();
    }
    
    // Динамически обновляем высоту star-container при изменении размера окна и контента
    function updateStarContainerHeight() {
        starContainer.style.height = `${document.documentElement.scrollHeight}px`;
    }

    // Вызываем функцию при загрузке страницы и при изменении её размера
    window.addEventListener('load', updateStarContainerHeight);
    window.addEventListener('resize', updateStarContainerHeight);

    // Добавляем IntersectionObserver для динамического контента, если он будет
    const contentObserver = new MutationObserver(updateStarContainerHeight);
    contentObserver.observe(document.body, { childList: true, subtree: true });

    // 2. Эффект "космической пыли" при скролле
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    document.body.appendChild(particlesContainer);

    let lastScrollY = 0;
    let particleTimeout = null;
    const scrollHandler = () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);

        // Ограничиваем создание частиц, чтобы избежать "зависаний"
        if (scrollDelta > 50 && !particleTimeout) {
            // Создаем "частицу"
            const particle = document.createElement('div');
            particle.classList.add('scroll-particle');
            particlesContainer.appendChild(particle);

            const size = Math.random() * 2 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${window.scrollY + window.innerHeight}px`;

            const duration = Math.random() * 1 + 0.5;
            particle.style.animation = `particle-move ${duration}s forwards`;
            particle.style.animationTimingFunction = 'linear';

            // Удаляем частицу после завершения анимации
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration * 1000);

            lastScrollY = currentScrollY;
            particleTimeout = setTimeout(() => {
                particleTimeout = null;
            }, 50); // Задержка в 50мс между созданиями частиц
        }
    };

    window.addEventListener('scroll', scrollHandler);

    // --- Логика для сворачивающихся разделов (аккордеона) ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Функция для создания эффекта частиц
    function createParticles(parentContainer) {
        const particleCount = 20; // Количество частиц
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('accordion-particle');
            // Случайная позиция внутри блока
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            // Случайный размер
            const size = Math.random() * 3 + 1; // Размер от 1px до 4px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            // Случайная задержка анимации
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            parentContainer.appendChild(particle);

            // Удаляем частицу после завершения анимации
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            // Если контент уже открыт, закрываем его
            if (content.classList.contains('active')) {
                header.classList.remove('active');
                content.classList.remove('active');
            } else {
                // Закрываем все другие открытые разделы
                document.querySelectorAll('.accordion-header').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelectorAll('.accordion-content').forEach(item => {
                    item.classList.remove('active');
                });

                // Открываем текущий раздел
                header.classList.add('active');
                content.classList.add('active');

                // Создаём эффект частиц
                createParticles(content);
            }
        });
    });
});