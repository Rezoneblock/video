document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const fill = document.querySelector('.fill');
    const percentageText = document.querySelector('.percentage');
    const sections = document.querySelectorAll('.section');
    
    // Скрываем основной контент до полной загрузки
    sections.forEach(section => section.style.display = 'none');

    // Инициализируем прогресс
    let currentProgress = 0;
    const startTime = Date.now();
    const TOTAL_DURATION = 600; // 6 секунд общее время загрузки

    // Функция обновления прогресса
    const updateProgress = (progress) => {
        currentProgress = Math.min(progress, 100);
        percentageText.textContent = `${Math.round(currentProgress)}%`;
        const dashOffset = 283 * (1 - currentProgress / 100); // 283 - длина окружности
        fill.style.strokeDashoffset = dashOffset;
    };

    // Функция завершения прелоадера
    const finishPreloader = () => {
        preloader.style.opacity = '0';
        sections.forEach(section => section.style.display = 'flex');
        setTimeout(() => {
            const wow = new WOW();
            wow.init();
            preloader.style.display = 'none';
            document.querySelectorAll('.animate-now').forEach(el => {
                el.style.visibility = 'visible';
                wow.show(el);
            });
        }, 1000); // Время анимации исчезновения
    };

    // Плавная анимация загрузки в течение 6 секунд
    const animateLoading = () => {
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = (elapsedTime / TOTAL_DURATION) * 100;

            updateProgress(progress);

            if (elapsedTime >= TOTAL_DURATION) {
                clearInterval(interval);
                updateProgress(100);
                finishPreloader();
            }
        }, 50); // Обновление каждые 50 мс для плавности
    };

    // Запускаем анимацию загрузки
    animateLoading();

    const anchors = document.querySelectorAll('a[href*="#"]');
    for (let anchor of anchors) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const blockID = anchor.getAttribute('href').substr(1);
            const targetElement = document.getElementById(blockID);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - 120; // Отнимаем 120px
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});