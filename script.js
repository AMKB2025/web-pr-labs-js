// == Отримуємо доступні системні дані браузера та ОС
const systemData = {
    userAgent: navigator.userAgent,
    platform: navigator.platform || "Невідомо",
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`
};

// Зберігаємо об'єкт у localStorage у вигляді JSON-рядка
localStorage.setItem('userSystemInfo', JSON.stringify(systemData));

// Зчитуємо дані назад із localStorage та парсимо JSON
let value = localStorage.getItem('userSystemInfo');

if (value) {
    let savedData = JSON.parse(value);
    let footerInfoElement = document.getElementById('system-info');

    if (footerInfoElement) {
        footerInfoElement.textContent =
            `ОС / Платформа: ${savedData.platform} | Браузер: ${savedData.userAgent} 
            | Мова: ${savedData.language} | Роздільна здатність: ${savedData.screenResolution}`;
    }
}

// == Отримання відгуків через Fetch API

const reviewsUrl = 'https://jsonplaceholder.typicode.com/posts/1/comments';
const reviewsContainer = document.getElementById('reviews-container');

fetch(reviewsUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Помилка мережі: ${response.status}`);
        }
        return response.json();
    })
    .then(comments => {

        // Перебираємо коментарі у порядку їх отримання та додаємо в DOM
        comments.forEach(comment => {
            const reviewCard = document.createElement('article');
            reviewCard.className = 'review-item';

            reviewCard.innerHTML = `
        <p class="review-author">${comment.name}</p>
        <p class="review-email">Email: ${comment.email}</p>
        <p class="review-text">${comment.body}</p>
      `;

            reviewsContainer.appendChild(reviewCard);
        });
    })
    .catch(error => {
        console.error('Помилка при завантаженні коментарів:', error);
        if (reviewsContainer) {
            reviewsContainer.innerHTML = '<p style="color: #ef4444;">Не вдалося завантажити відгуки роботодавців.</p>';
        }
    });


// == Модальне вікно через 1 хвилину

const modal = document.getElementById('contact-modal');
const closeModalBtn = document.getElementById('close-modal');

// Встановлюємо таймер на 60 000 мс
setTimeout(() => {
    if (modal) {
        modal.classList.remove('hidden');
    }
}, 60000);

// Закриття вікна при кліку на хрестик
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

// Закриття вікна при кліку на затемнений фон поза вікном
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
}); 


// == Перемикач теми (День / Ніч)

const themeToggleBtn = document.getElementById('theme-toggle');

// Функція перевірки часу: 07:00 - 21:00
function isDayTime() {
    const currentHour = new Date().getHours();
    return currentHour >= 7 && currentHour < 21;
}

// Функція оновлення вигляду кнопки
function updateThemeButton(isDark) {
    if (themeToggleBtn) {
        themeToggleBtn.textContent = isDark ? 'Денна тема' : 'Нічна тема';
    }
}

// 1. Визначаємо початкову тему:
// Спочатку дивимось, чи зберігав користувач свій вибір у localStorage
let savedTheme = localStorage.getItem('userTheme');

if (savedTheme) {
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeButton(true);
    } else {
        document.body.classList.remove('dark-theme');
        updateThemeButton(false);
    }
} else {
    // Якщо вибору немає — вмикаємо автоматично за часом доби
    if (!isDayTime()) {
        document.body.classList.add('dark-theme');
        updateThemeButton(true);
    } else {
        document.body.classList.remove('dark-theme');
        updateThemeButton(false);
    }
}

// 2. Обробка кліку на кнопку перемикача
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDarkNow = document.body.classList.contains('dark-theme');

        // Оновлюємо напис на кнопці
        updateThemeButton(isDarkNow);

        // Запам'ятовуємо вибір користувача в localStorage
        localStorage.setItem('userTheme', isDarkNow ? 'dark' : 'light');
    });
}