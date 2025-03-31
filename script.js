        // Логика прелоадера с замедлением
        document.addEventListener('DOMContentLoaded', () => {
            const preloader = document.querySelector('.preloader');
            const fill = document.querySelector('.fill');
            const percentageText = document.querySelector('.percentage');
            let progress = 0;
            let time = 0;
            const duration = 3000; // Общее время анимации в миллисекундах (3 секунды)

            function easeOutQuad(t) {
                return t * (2 - t); // Квадратичная функция для замедления
            }

            const loading = setInterval(() => {
                time += 30; // Шаг времени
                progress = time / duration; // Прогресс от 0 до Ascending = true;
                if (progress > 1) progress = 1;

                const load = Math.round(easeOutQuad(progress) * 100); // Нелинейный прогресс
                percentageText.textContent = `${load}%`;
                const degrees = (load / 100) * 360;
                fill.style.transform = `rotate(${degrees}deg)`;

                if (load >= 100) {
                    clearInterval(loading);
                    setTimeout(() => {
                        preloader.style.opacity = '0';
                        setTimeout(() => {
                            preloader.style.display = 'none';
                        }, 500);
                    }, 500);
                }
            }, 30); // Обновление каждые 30мс
        });