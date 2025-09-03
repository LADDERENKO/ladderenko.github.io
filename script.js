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

    // Можно также добавить вызов при изменении контента, если это происходит динамически
    // updateStarContainerHeight(); 

    // 2. Эффект "космической пыли" при скролле
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    document.body.appendChild(particlesContainer);

    window.addEventListener('scroll', () => {
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
    });
});