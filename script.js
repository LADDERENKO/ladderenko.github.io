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
        threshold: 0.1, // Блок появляется, когда 10% его видно (было 20%)
        rootMargin: "0px 0px 100px 0px" // Отступ снизу увеличен до 100px, чтобы блоки появлялись раньше
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                appearOnScroll.unobserve(entry.target); // Отключаем наблюдение после появления
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Дополнительный эффект при наведении на "Бам и баааам"
    const bamBaamPhrases = document.querySelectorAll('strong'); // Выбираем все strong элементы, т.к. "бам и баааам" и "довольно важный аспект" выделены strong

    bamBaamPhrases.forEach(phrase => {
        phrase.addEventListener('mouseenter', () => {
            // Здесь можно было бы добавить более сложную JS анимацию
            // Например, случайное изменение цвета или краткий звуковой эффект
            // Для примера оставим только CSS-анимацию, которая уже задана
        });
    });
});
