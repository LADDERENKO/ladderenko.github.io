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

    // Дополнительный эффект при наведении (сохраняем)
    const bamBaamPhrases = document.querySelectorAll('strong');
    bamBaamPhrases.forEach(phrase => {
        phrase.addEventListener('mouseenter', () => {
            // Эффект, который будет добавлен в CSS
        });
    });

    // --- НОВЫЙ БЛОК: СНЕЖНАЯ АГРЕССИЯ (Падающий снег) ---
    const body = document.body;
    const numberOfSnowflakes = 50; 

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const size = Math.random() * 3 + 1; 
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;

        snowflake.style.left = `${Math.random() * 100}vw`;

        const duration = Math.random() * 15 + 10; 
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `-${Math.random() * 10}s`; 

        body.appendChild(snowflake);

        // Удаление снежинки, чтобы не было, сука, утечки памяти
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000 + 100); 
    }

    // Запускаем генерацию снежинок
    setInterval(createSnowflake, 500); 
    
    // Начальная генерация снежинок для заполнения экрана
    for (let i = 0; i < numberOfSnowflakes; i++) {
        createSnowflake();
    }
    // --- КОНЕЦ НОВОГО БЛОКА СНЕГА ---
    
    // Скрипт для Аккордеона (Меню навигации)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Функция для создания эффекта частиц (сохраняем функционал)
    function createParticles(parentContainer) {
        const particleCount = 10;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            // Агрессивное позиционирование частиц
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 4 + 2; 
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