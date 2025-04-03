document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const fill = document.querySelector('.fill');
    const percentageText = document.querySelector('.percentage');
    const sections = document.querySelectorAll('.section');
    const videoIframe = document.querySelector('iframe[src*="vk.com"]'); // Ищем iframe от VK
    const secondScreen = document.querySelector('.second-screen');
    const INITIAL_DELAY = 4000; // 4 секунды холостой загрузки
    const INITIAL_PROGRESS = 60; // До 60% за 3 секунды

    // Скрываем основной контент до полной загрузки
    sections.forEach(section => section.style.opacity = '0');

    // Инициализируем прогресс и состояние загрузки
    let currentProgress = 0;
    let isVideoLoaded = false;
    let isFontLoaded = false;
    let startTime = Date.now();

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
        sections.forEach(section => section.style.opacity = '1');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000); // Время анимации исчезновения
    };

    // Холостая анимация первые 3 секунды
    const initialAnimation = () => {
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const initialProgress = (elapsedTime / INITIAL_DELAY) * INITIAL_PROGRESS;

            updateProgress(initialProgress);

            if (elapsedTime >= INITIAL_DELAY) {
                clearInterval(interval);
                updateProgress(INITIAL_PROGRESS); // Устанавливаем 60%
                startLoadingContent(); // Начинаем реальную загрузку
            }
        }, 50); // Обновление каждые 50 мс для плавности
    };

    // Реальная загрузка контента
    const startLoadingContent = () => {
        // Подключаем шрифт
        const fontLink = document.getElementById('font-preload');
        fontLink.onload = () => fontLink.rel = 'stylesheet';

        Promise.all([
            document.fonts.load('400 1em "Fira Sans"'),
            document.fonts.load('700 1em "Fira Sans"')
        ]).then(() => {
            isFontLoaded = true;
            // console.log('Шрифты загружены');
            checkCompletion();
        }).catch((error) => {
            console.error('Ошибка загрузки шрифта:', error);
            isFontLoaded = true; // Продолжаем даже при ошибке
            checkCompletion();
        });

        // Ожидание загрузки iframe с видео
        if (videoIframe) {
            videoIframe.addEventListener('load', () => {
                isVideoLoaded = true;
                updateProgress(100);
                // console.log('Iframe с видео загружен');
                checkCompletion();
            });
            
            // На случай ошибки загрузки iframe
            videoIframe.addEventListener('error', () => {
                console.error('Ошибка загрузки iframe с видео');
                isVideoLoaded = true;
                updateProgress(100);
                checkCompletion();
            });
            
            // Имитация прогресса загрузки (так как мы не можем отслеживать прогресс загрузки iframe)
            const progressInterval = setInterval(() => {
                if (currentProgress < 90) {
                    updateProgress(currentProgress + 5);
                } else {
                    clearInterval(progressInterval);
                }
            }, 300);
        } else {
            // Если iframe не найден, продолжаем без него
            console.warn('Iframe с видео не найден');
            isVideoLoaded = true;
            updateProgress(100);
            checkCompletion();
        }
    };

    // Проверка завершения загрузки
    const checkCompletion = () => {
        if (isVideoLoaded && isFontLoaded) {
            finishPreloader();
        }
    };

    // Запускаем холостую анимацию
    initialAnimation();
});