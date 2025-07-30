// --- DOM элементы ---
let levelSelect, sublevelSelect, startQuizBtn, resultsLink, topLink, sectionOne, sectionTwo, sectionThree;
let leaderboardDiv, showLeaderboardBtn, backToStartBtn, backToStartBtn2, top10List, questionNumber, questionText;
let optionsDiv, scoreDisplay, searchName, resultsList, title, headlineP, leaderboardTitle, languageSelect, burgerMenu;
let navLinks;

// --- Переводы ---
const translations = {
    en: {
        title: "English Language Test",
        userNamePlaceholder: "Enter your name",
        levelPlaceholder: "Select level",
        sublevelPlaceholder: "Select sublevel",
        startQuizBtn: "Start Test",
        resultsLink: "Results",
        topLink: "Top",
        scoreText: "Your result: ",
        searchNamePlaceholder: "Search by name",
        showLeaderboardBtn: "Show Ranking",
        backToStartBtn: "Back",
        leaderboardTitle: "Ranking",
        noResults: "No results for this name",
        noLevelResults: "No results for this level and sublevel",
        enterNameAlert: "Enter your name!",
        selectLevelAlert: "Select level and sublevel!",
        noQuestionsAlert: "No questions found for this level and sublevel!",
        questionPrefix: "Question ",
        navHome: "Home",
        navTest: "Test",
        navResults: "Results",
        navLeaderboard: "Ranking",
        navTelegram: "Our Telegram Bot",
        headlineP: "Select a level and sublevel to start testing."
    },
    ru: {
        title: "Тест по английскому языку",
        userNamePlaceholder: "Введите ваше имя",
        levelPlaceholder: "Выберите уровень",
        sublevelPlaceholder: "Выберите подуровень",
        startQuizBtn: "Начать тест",
        resultsLink: "Результаты",
        topLink: "Top",
        scoreText: "Ваш результат: ",
        searchNamePlaceholder: "Поиск по имени",
        showLeaderboardBtn: "Показать рейтинг",
        backToStartBtn: "Вернуться",
        leaderboardTitle: "Рейтинг",
        noResults: "Нет результатов для этого имени",
        noLevelResults: "Нет результатов для этого уровня и подуровня",
        enterNameAlert: "Введите имя!",
        selectLevelAlert: "Выберите уровень и подуровень!",
        noQuestionsAlert: "Вопросы для выбранного уровня и подуровня не найдены!",
        questionPrefix: "Вопрос ",
        navHome: "Главная",
        navTest: "Тест",
        navResults: "Результаты",
        navLeaderboard: "Рейтинг",
        navTelegram: "Наш Телеграм бот",
        headlineP: "Выберите уровень и подуровень, чтобы начать тестирование."
    },
    uz: {
        title: "Ingliz tili testi",
        userNamePlaceholder: "Ismingizni kiriting",
        levelPlaceholder: "Darajani tanlang",
        sublevelPlaceholder: "Past darajani tanlang",
        startQuizBtn: "Testni boshlash",
        resultsLink: "Natijalar",
        topLink: "Eng yaxshilar",
        scoreText: "Sizning natijangiz: ",
        searchNamePlaceholder: "Ism bo'yicha qidiruv",
        showLeaderboardBtn: "Reytingni ko'rsatish",
        backToStartBtn: "Orqaga",
        leaderboardTitle: "Reyting",
        noResults: "Bu ism uchun natijalar yo'q",
        noLevelResults: "Bu daraja va past daraja uchun natijalar yo'q",
        enterNameAlert: "Ismingizni kiriting!",
        selectLevelAlert: "Daraja va past darajani tanlang!",
        noQuestionsAlert: "Bu daraja va past daraja uchun savollar topilmadi!",
        questionPrefix: "Savol ",
        navHome: "Asosiy",
        navTest: "Test",
        navResults: "Natijalar",
        navLeaderboard: "Reyting",
        navTelegram: "Bizning Telegram bot",
        headlineP: "Daraja va past darajani tanlang, testi boshlash uchun."
    },
    krh: {
        title: "İngliz tili testi",
        userNamePlaceholder: "Adingizdi kiritip",
        levelPlaceholder: "Deñge tanlañ",
        sublevelPlaceholder: "Kiči deñgeni tanlañ",
        startQuizBtn: "Testti baslap",
        resultsLink: "Natïjalar",
        topLink: "Eng jaqsïlar",
        scoreText: "Siziñ natïjañiz: ",
        searchNamePlaceholder: "Ad boýınsha izdew",
        showLeaderboardBtn: "Reytingti körsetiw",
        backToStartBtn: "Orqaga",
        leaderboardTitle: "Reyting",
        noResults: "Bul ad úshin natïjalar joq",
        noLevelResults: "Bul deñge men kiči deñge úshin natïjalar joq",
        enterNameAlert: "Adingizdi kiritip!",
        selectLevelAlert: "Deñge men kiči deñgeni tanlañ!",
        noQuestionsAlert: "Bul deñge men kiči deñge úshin savollar joq!",
        questionPrefix: "Savol ",
        navHome: "Basqa",
        navTest: "Test",
        navResults: "Natïjalar",
        navLeaderboard: "Reyting",
        navTelegram: "Bizdiñ Telegram botï",
        headlineP: "Deñge men kiči deñgeni tanlañ, testti baslap úshin."
    }
};

// --- Подуровни ---
const sublevels = {
    beginner: ['A1', 'A2'],
    intermediate: ['B1', 'B2'],
    advanced: ['C1', 'C2']
};

// --- Глобальные переменные ---
let currentQuestions = [];
let currentQuestion = 0;
let score = 0;
let userName = '';
let userLevel = '';
let userSublevel = '';
let currentLanguage = 'ru';

// --- Firebase ---
let database, resultsRef, push, onValue;

// Ждем инициализации Firebase
function waitForFirebase() {
    return new Promise((resolve) => {
        const checkFirebase = () => {
            if (window.database && window.resultsRef && window.push && window.onValue) {
                database = window.database;
                resultsRef = window.resultsRef;
                push = window.push;
                onValue = window.onValue;
                console.log('Firebase доступен:', { database, resultsRef });
                resolve();
            } else {
                console.log('Ожидание Firebase...');
                setTimeout(checkFirebase, 100);
            }
        };
        checkFirebase();
    });
}

// Функция перемешивания
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Функция отображения вопроса с отладкой
function showQuestion(index) {
    if (index >= 0 && index < currentQuestions.length && optionsDiv) {
        const question = currentQuestions[index];
        questionNumber.textContent = `${translations[currentLanguage].questionPrefix}${index + 1}/${currentQuestions.length}`;
        questionText.textContent = question.question;
        optionsDiv.innerHTML = '';
        question.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-btn';
            optionsDiv.appendChild(button);
            console.log('Созданна кнопка:', { option, index });
        });
        console.log('Показан вопрос:', question, 'Правильный ответ:', question.correctAnswer);
    } else {
        console.error('Ошибка отображения вопроса:', { index, currentQuestions, optionsDiv });
    }
}

// Функция проверки ответа с подсветкой
function checkAnswer(selected, correctAnswer) {
    console.log('Проверяем ответ:', { selected, correctAnswer, currentQuestion, score });
    const buttons = optionsDiv.getElementsByClassName('option-btn');
    for (let button of buttons) {
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === selected && selected !== correctAnswer) {
            button.classList.add('incorrect');
        }
    }
    if (selected === correctAnswer) {
        score++;
        console.log('Правильный ответ, новый score:', score);
    } else {
        console.log('Неправильный ответ, текущий score:', score);
    }
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < currentQuestions.length) {
            showQuestion(currentQuestion);
        } else {
            showResults();
        }
        for (let button of buttons) {
            button.classList.remove('correct', 'incorrect');
        }
    }, 1000); // Задержка 1 секунда для отображения подсветки
}

// Функция отображения результатов
function showResults() {
    if (sectionTwo && sectionThree && scoreDisplay) {
        sectionTwo.classList.add('hidden');
        sectionThree.classList.remove('hidden');
        scoreDisplay.textContent = `${translations[currentLanguage].scoreText}${score}/${currentQuestions.length}`;
        saveResult();
        console.log('Тест завершен, итоговый score:', score);
    }
}

// Функция сохранения результата
function saveResult() {
    if (!userName || !userLevel || !userSublevel || !database || !resultsRef) {
        console.error('Ошибка сохранения: отсутствуют данные или подключение', { userName, userLevel, userSublevel, database, resultsRef });
        return;
    }
    if (currentQuestions.length === 0) {
        console.error('Ошибка: currentQuestions пустой');
        return;
    }
    const result = {
        name: userName,
        level: userLevel,
        sublevel: userSublevel,
        score: score,
        total: currentQuestions.length,
        timestamp: new Date().toISOString()
    };
    push(resultsRef, result)
        .then(() => console.log('Результат сохранен:', result))
        .catch(error => console.error('Ошибка при сохранении в Firebase:', error));
}

// Функция отображения результатов по имени
function displayResultsByName() {
    if (searchName && resultsList && database && onValue) {
        const searchValue = searchName.value.trim().toLowerCase();
        onValue(resultsRef, (snapshot) => {
            resultsList.innerHTML = '';
            const data = snapshot.val();
            if (data) {
                Object.values(data).forEach(result => {
                    if (result.name.toLowerCase().includes(searchValue) && result.total && result.timestamp) {
                        resultsList.innerHTML += `<div>${result.name}: ${result.score}/${result.total} (${new Date(result.timestamp).toLocaleString()})</div>`;
                    }
                });
            }
            if (!resultsList.innerHTML) resultsList.innerHTML = `<p>${translations[currentLanguage].noResults}</p>`;
        });
    }
}

// Функция отображения общего рейтинга
function showAllLeaderboard() {
    if (top10List && database && onValue) {
        onValue(resultsRef, (snapshot) => {
            top10List.innerHTML = '';
            const data = snapshot.val();
            if (data) {
                const results = Object.values(data)
                    .filter(result => result.total && result.timestamp && !isNaN(result.score) && !isNaN(result.total))
                    .sort((a, b) => b.score / b.total - a.score / a.total || b.timestamp.localeCompare(a.timestamp))
                    .slice(0, 10);
                if (results.length > 0) {
                    results.forEach((result, index) => {
                        top10List.innerHTML += `<div>${index + 1}. ${result.name}: ${result.score}/${result.total} (${new Date(result.timestamp).toLocaleString()})</div>`;
                    });
                } else {
                    top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
                }
            } else {
                top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
            }
        });
    }
}

// Функция отображения рейтинга по уровню и подуровню
function showLeaderboard(level, sublevel) {
    if (top10List && database && onValue) {
        onValue(resultsRef, (snapshot) => {
            top10List.innerHTML = '';
            const data = snapshot.val();
            if (data) {
                const filtered = Object.values(data)
                    .filter(r => r.level === level && r.sublevel === sublevel && r.total && r.timestamp && !isNaN(r.score) && !isNaN(r.total));
                const results = filtered.sort((a, b) => b.score / b.total - a.score / a.total || b.timestamp.localeCompare(a.timestamp)).slice(0, 10);
                if (results.length > 0) {
                    results.forEach((result, index) => {
                        top10List.innerHTML += `<div>${index + 1}. ${result.name}: ${result.score}/${result.total} (${new Date(result.timestamp).toLocaleString()})</div>`;
                    });
                } else {
                    top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
                }
            } else {
                top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
            }
        });
    }
}

// Обновление текста на странице
function updateLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];
    if (title) title.textContent = t.title;
    if (document.getElementById('userName')) document.getElementById('userName').placeholder = t.userNamePlaceholder;
    if (levelSelect && levelSelect.options[0]) levelSelect.options[0].text = t.levelPlaceholder;
    if (sublevelSelect && sublevelSelect.options[0]) sublevelSelect.options[0].text = t.sublevelPlaceholder;
    if (startQuizBtn) startQuizBtn.textContent = t.startQuizBtn;
    if (resultsLink) resultsLink.textContent = t.resultsLink;
    if (topLink) topLink.textContent = t.topLink;
    if (leaderboardTitle) leaderboardTitle.textContent = t.leaderboardTitle;
    if (showLeaderboardBtn) showLeaderboardBtn.textContent = t.showLeaderboardBtn;
    if (backToStartBtn) backToStartBtn.textContent = t.backToStartBtn;
    if (backToStartBtn2) backToStartBtn2.textContent = t.backToStartBtn;
    if (searchName) searchName.placeholder = t.searchNamePlaceholder;
    if (headlineP) headlineP.textContent = t.headlineP;

    // Обновление пунктов меню
    if (navLinks) {
        navLinks[0].textContent = t.navHome;
        navLinks[1].textContent = t.navTest;
        navLinks[2].textContent = t.navResults;
        navLinks[3].textContent = t.navLeaderboard;
        navLinks[4].textContent = t.navTelegram;
    }

    if (scoreDisplay) scoreDisplay.textContent = scoreDisplay.textContent.replace(/Ваш результат: |Your result: |Sizning natijangiz: |Siziñ natïjañiz: /, t.scoreText);
    if (questionNumber) questionNumber.textContent = questionNumber.textContent.replace(/Вопрос |Question |Savol /, t.questionPrefix || '');
    if (resultsList && resultsList.textContent.includes('Нет результатов')) resultsList.innerHTML = `<p>${t.noResults}</p>`;
    if (top10List && top10List.textContent.includes('Нет результатов')) top10List.innerHTML = `<p>${t.noLevelResults}</p>`;

    const selected = languageSelect.querySelector('.select-selected');
    const flagOption = languageSelect.querySelector(`.flag-option[data-value="${lang}"]`);
    if (selected && flagOption) {
        selected.innerHTML = flagOption.innerHTML;
    }
}

// ... (остальной код остается без изменений до setupCustomSelect) ...

// Кастомный выпадающий список
function setupCustomSelect() {
    const select = document.getElementById('languageSelect');
    if (!select) {
        console.error('Элемент languageSelect не найден');
        return;
    }
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');
    const options = items.querySelectorAll('.flag-option');

    if (!selected || !items || !options.length) {
        console.error('Ошибка инициализации кастомного выпадающего списка:', { selected, items, options });
        return;
    }

    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        items.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
        console.log('Клик по select-selected, классы items:', items.className);

        // Скрываем текущий выбранный язык и показываем только другие
        const currentLang = currentLanguage;
        options.forEach(option => {
            const lang = option.getAttribute('data-value');
            if (lang === currentLang) {
                option.style.display = 'none'; // Скрываем текущий язык
            } else {
                option.style.display = 'block'; // Показываем остальные языки
            }
        });
    });

    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.getAttribute('data-value');
            updateLanguage(value);

            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
            selected.innerHTML = this.innerHTML;

            // После выбора нового языка обновляем список, скрывая только что выбранный
            setTimeout(() => {
                const newCurrentLang = value;
                options.forEach(opt => {
                    const lang = opt.getAttribute('data-value');
                    if (lang === newCurrentLang) {
                        opt.style.display = 'none';
                    } else {
                        opt.style.display = 'block';
                    }
                });
            }, 0);
        });
    });

    document.addEventListener('click', function(e) {
        if (!select.contains(e.target)) {
            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
        }
    });

    // Инициализация: скрываем текущий язык при загрузке
    const initialLang = currentLanguage;
    options.forEach(option => {
        const lang = option.getAttribute('data-value');
        if (lang === initialLang) {
            option.style.display = 'none';
        }
    });
}







// Переключение бургер-меню
function setupBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');
    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
            const isActive = navList.classList.contains('active');
            console.log('Бургер-меню переключено, активен:', isActive, 'классы nav-list:', navList.className);
        });
    } else {
        console.error('Бургер-меню или nav-list не найдены');
    }
}


// Обработчик изменения уровня с обновлением цвета
function setupLevelChange() {
    if (levelSelect) {
        levelSelect.addEventListener('change', function() {
            const level = this.value;
            console.log('Выбран уровень:', level);
            if (sublevelSelect) {
                sublevelSelect.innerHTML = `<option value="">${translations[currentLanguage].sublevelPlaceholder}</option>`;
                sublevelSelect.disabled = true;

                if (sublevels[level]) {
                    sublevels[level].forEach(sub => {
                        const opt = document.createElement('option');
                        opt.value = sub.toLowerCase();
                        opt.textContent = sub;
                        sublevelSelect.appendChild(opt);
                    });
                    sublevelSelect.disabled = false;
                    console.log('Добавлены подуровни:', sublevels[level]);
                } else {
                    console.log('Уровень не найден в sublevels:', level);
                }
            }
            // Обновление цвета поля уровня
            updateLevelColor();
        });
    }
}

// Обработчик изменения подуровня с обновлением цвета
function setupSublevelChange() {
    if (sublevelSelect) {
        sublevelSelect.addEventListener('change', function() {
            updateSublevelColor();
        });
    }
}

// Функция обновления цвета поля уровня
function updateLevelColor() {
    if (levelSelect) {
        const level = levelSelect.value;
        levelSelect.style.backgroundColor = getLevelColor(level);
        levelSelect.style.color = getTextColor(level);
        console.log('Обновлён цвет уровня:', { level, color: levelSelect.style.backgroundColor });
    }
}

// Функция обновления цвета поля подуровня
function updateSublevelColor() {
    if (sublevelSelect) {
        const sublevel = sublevelSelect.value;
        sublevelSelect.style.backgroundColor = getSublevelColor(sublevel);
        sublevelSelect.style.color = getTextColorFromSublevel(sublevel);
        console.log('Обновлён цвет подуровня:', { sublevel, color: sublevelSelect.style.backgroundColor });
    }
}

// Функция получения цвета для уровня
function getLevelColor(level) {
    const colors = {
        'beginner': '#00FF00',
        'intermediate': '#FFFF00',
        'advanced': '#FF0000',
        '': '#fff' // Плейсхолдер
    };
    return colors[level] || '#fff';
}

// Функция получения цвета текста для уровня (чёрный для светлых, белый для тёмных)
function getTextColor(level) {
    const darkColors = ['#FF0000']; // Тёмные цвета, требующие белого текста
    return darkColors.includes(getLevelColor(level)) ? '#fff' : '#000';
}

// Функция получения цвета для подуровня
function getSublevelColor(sublevel) {
    const colors = {
        'a1': '#00FF00',
        'a2': '#00B7EB',
        'b1': '#FFFF00',
        'b2': '#FFA500',
        'c1': '#FF0000',
        'c2': '#800080',
        '': '#fff' // Плейсхолдер
    };
    return colors[sublevel] || '#fff';
}

// Функция получения цвета текста для подуровня
function getTextColorFromSublevel(sublevel) {
    const darkColors = ['#FF0000', '#800080']; // Тёмные цвета, требующие белого текста
    return darkColors.includes(getSublevelColor(sublevel)) ? '#fff' : '#000';
}

// ... (остальной код остается без изменений до setupNavLinks) ...

// Функция для обработки навигационных ссылок
function setupNavLinks() {
    if (navLinks) {
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const action = {
                    0: () => window.open(window.location.href, '_blank'), // Главная
                    1: () => {
                        if (sectionOne && sectionTwo) {
                            sectionTwo.classList.add('hidden');
                            sectionOne.classList.remove('hidden');
                            window.open(window.location.href, '_blank');
                        }
                    }, // Тест
                    2: () => {
                        if (sectionOne && sectionTwo && sectionThree && scoreDisplay) {
                            sectionOne.classList.add('hidden');
                            sectionTwo.classList.add('hidden');
                            sectionThree.classList.remove('hidden');
                            scoreDisplay.textContent = translations[currentLanguage].scoreText + scoreDisplay.textContent.replace(/Ваш результат: /, '');
                            displayResultsByName();
                            window.open(window.location.href + '#results', '_blank');
                        }
                    }, // Результаты
                    3: () => {
                        if (sectionOne && leaderboardDiv) {
                            sectionOne.classList.add('hidden');
                            leaderboardDiv.classList.remove('hidden');
                            showAllLeaderboard();
                            window.open(window.location.href + '#leaderboard', '_blank');
                        }
                    }, // Рейтинг
                    4: () => window.open(link.href, '_blank') // Наш Телеграм бот
                }[index];
                if (action) action();
            });
        });
    }
}

// ... (остальной код остается без изменений) ...
// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Инициализация DOM элементов
    levelSelect = document.getElementById('level');
    sublevelSelect = document.getElementById('sublevel');
    startQuizBtn = document.getElementById('startQuizBtn');
    resultsLink = document.getElementById('resultsLink');
    topLink = document.getElementById('topLink');
    sectionOne = document.getElementById('one');
    sectionTwo = document.getElementById('two');
    sectionThree = document.getElementById('three');
    leaderboardDiv = document.getElementById('leaderboard');
    showLeaderboardBtn = document.getElementById('showLeaderboardBtn');
    backToStartBtn = document.getElementById('backToStartBtn');
    backToStartBtn2 = document.getElementById('backToStartBtn2');
    top10List = document.getElementById('top10-list');
    questionNumber = document.getElementById('question-number');
    questionText = document.getElementById('question');
    optionsDiv = document.getElementById('options');
    scoreDisplay = document.getElementById('score');
    searchName = document.getElementById('searchName');
    resultsList = document.getElementById('resultsList');
    title = document.querySelector('.headline h1');
    headlineP = document.querySelector('.headline p');
    leaderboardTitle = document.getElementById('leaderboardTitle');
    languageSelect = document.getElementById('languageSelect');
    burgerMenu = document.querySelector('.burger-menu');
    navLinks = document.querySelectorAll('.nav-list a');

    console.log('DOM elements initialized:', {
        levelSelect, sublevelSelect, startQuizBtn, resultsLink, topLink, sectionOne, sectionTwo,
        sectionThree, leaderboardDiv, showLeaderboardBtn, backToStartBtn, backToStartBtn2, top10List,
        questionNumber, questionText, optionsDiv, scoreDisplay, searchName, resultsList, title,
        headlineP, leaderboardTitle, languageSelect, burgerMenu, navLinks
    });

    await waitForFirebase();
    if (!window.englishQuizQuestions || Object.keys(window.englishQuizQuestions).length === 0) {
        console.error('Вопросы не загружены. Проверьте импорт englishQuizQuestions.js');
        window.englishQuizQuestions = {};
    }

    setupLevelChange();
    setupSublevelChange();
    updateLanguage(currentLanguage);
    setupCustomSelect();
    setupBurgerMenu();
    setupNavLinks(); // Добавляем обработчики для навигационных ссылок

    // Временный глобальный слушатель для диагностики
    document.addEventListener('click', (e) => {
        console.log('Глобальный клик:', { target: e.target.tagName, class: e.target.className, id: e.target.id });
    });

    // Делегирование событий для обработки кликов на ответы
    if (optionsDiv) {
        optionsDiv.addEventListener('click', (e) => {
            if (e.target.className === 'option-btn' && currentQuestions.length > 0 && currentQuestion < currentQuestions.length) {
                const selected = e.target.textContent;
                console.log('Клик по кнопке ответа:', { selected, currentQuestion, question: currentQuestions[currentQuestion] });
                checkAnswer(selected, currentQuestions[currentQuestion].correctAnswer);
            } else {
                console.log('Клик не обработан:', { target: e.target.className, currentQuestions, currentQuestion });
            }
        });
    } else {
        console.error('optionsDiv не найден');
    }

    // Привязка событий
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            console.log('Клик по "Начать тест"');
            userName = document.getElementById('userName').value.trim();
            if (!userName) {
                alert(translations[currentLanguage].enterNameAlert || 'Введите имя!');
                return;
            }
            if (!levelSelect.value || !sublevelSelect.value) {
                alert(translations[currentLanguage].selectLevelAlert || 'Выберите уровень и подуровень!');
                return;
            }
            userLevel = levelSelect.value;
            userSublevel = sublevelSelect.value.toLowerCase();
            console.log('Выбранный уровень:', userLevel, 'Подуровень:', userSublevel);
            const questions = window.englishQuizQuestions[userLevel]?.[userSublevel] || [];
            if (questions.length === 0) {
                alert(translations[currentLanguage].noQuestionsAlert || 'Вопросы для выбранного уровня и подуровня не найдены!');
                return;
            }
            currentQuestions = shuffle(questions).slice(0, 20);
            currentQuestion = 0;
            score = 0;
            if (sectionOne && sectionTwo) {
                sectionOne.classList.add('hidden');
                sectionTwo.classList.remove('hidden');
                showQuestion(currentQuestion);
                console.log('Переход к вопросу:', currentQuestion, 'Количество вопросов:', currentQuestions.length);
            }
        });
    }

    if (resultsLink) resultsLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (sectionOne && sectionTwo && sectionThree && scoreDisplay) {
            sectionOne.classList.add('hidden');
            sectionTwo.classList.add('hidden');
            sectionThree.classList.remove('hidden');
            scoreDisplay.textContent = translations[currentLanguage].scoreText + scoreDisplay.textContent.replace(/Ваш результат: /, '');
            displayResultsByName();
        }
    });

    if (searchName) searchName.addEventListener('input', displayResultsByName);
    if (topLink) topLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Клик по "Top"');
        if (sectionOne && leaderboardDiv) {
            sectionOne.classList.add('hidden');
            leaderboardDiv.classList.remove('hidden');
            showAllLeaderboard();
            console.log('Рейтинг отображен');
        }
    });
    if (showLeaderboardBtn) showLeaderboardBtn.addEventListener('click', function() {
        if (leaderboardDiv) {
            leaderboardDiv.classList.remove('hidden');
            showLeaderboard(userLevel, userSublevel);
        }
    });
    if (backToStartBtn) backToStartBtn.addEventListener('click', function() {
        if (leaderboardDiv && sectionThree && sectionOne) {
            leaderboardDiv.classList.add('hidden');
            sectionThree.classList.add('hidden');
            sectionOne.classList.remove('hidden');
            score = 0;
            currentQuestion = 0;
            document.getElementById('userName').value = '';
            if (levelSelect && sublevelSelect) {
                levelSelect.value = '';
                sublevelSelect.innerHTML = `<option value="">${translations[currentLanguage].sublevelPlaceholder}</option>`;
                sublevelSelect.disabled = true;
                // Сброс цветов при возврате
                levelSelect.style.backgroundColor = '#fff';
                levelSelect.style.color = '#000';
                sublevelSelect.style.backgroundColor = '#fff';
                sublevelSelect.style.color = '#000';
            }
        }
    });
    if (backToStartBtn2) backToStartBtn2.addEventListener('click', function() {
        if (leaderboardDiv && sectionOne) {
            leaderboardDiv.classList.add('hidden');
            sectionOne.classList.remove('hidden');
            score = 0;
            currentQuestion = 0;
            document.getElementById('userName').value = '';
            if (levelSelect && sublevelSelect) {
                levelSelect.value = '';
                sublevelSelect.innerHTML = `<option value="">${translations[currentLanguage].sublevelPlaceholder}</option>`;
                sublevelSelect.disabled = true;
                // Сброс цветов при возврате
                levelSelect.style.backgroundColor = '#fff';
                levelSelect.style.color = '#000';
                sublevelSelect.style.backgroundColor = '#fff';
                sublevelSelect.style.color = '#000';
            }
        }
    });
});