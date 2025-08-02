// --- DOM элементы ---
let levelSelect, sublevelSelect, startQuizBtn, resultsLink, topLink, sectionOne, sectionTwo, sectionThree;
let leaderboardDiv, showLeaderboardBtn, backToStartBtn, backToStartBtn2, top10List, questionNumber, questionText;
let optionsDiv, scoreDisplay, searchName, resultsList, title, headlineP, leaderboardTitle, languageSelect, burgerMenu;
let navLinks, filterSublevel, leaderboardSublevel;

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
                console.log('Firebase доступен');
                resolve();
            } else {
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
        });
    }
}

// Функция проверки ответа с подсветкой
function checkAnswer(selected, correctAnswer) {
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
    }
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < currentQuestions.length) {
            showQuestion(currentQuestion);
            for (let button of buttons) {
                button.classList.remove('correct', 'incorrect');
            }
        } else {
            showResults();
            for (let button of buttons) {
                button.classList.remove('correct', 'incorrect');
            }
        }
    }, 1000);
}

// Функция отображения результатов
function showResults() {
    if (sectionTwo && sectionThree && scoreDisplay) {
        sectionTwo.classList.add('hidden');
        sectionThree.classList.remove('hidden');
        scoreDisplay.textContent = `${translations[currentLanguage].scoreText}${score}/${currentQuestions.length}`;
        saveResult();
    }
}

// Функция сохранения результата
function saveResult() {
    if (!userName || !userLevel || !userSublevel || !database || !resultsRef) return;
    if (currentQuestions.length === 0) return;
    const result = {
        name: userName,
        level: userLevel,
        sublevel: userSublevel,
        score: score,
        total: currentQuestions.length,
        timestamp: new Date().toISOString()
    };
    push(resultsRef, result).catch(error => console.error('Ошибка сохранения:', error));
}

// Функция отображения результатов по имени с фильтром по подуровню
function displayResultsByName() {
    if (searchName && resultsList && database && onValue && filterSublevel) {
        const searchValue = searchName.value.trim().toLowerCase();
        const selectedSublevel = filterSublevel.value.toLowerCase();
        onValue(resultsRef, (snapshot) => {
            resultsList.innerHTML = '';
            const data = snapshot.val();
            if (data) {
                Object.values(data).forEach(result => {
                    if (result.name.toLowerCase().includes(searchValue) && result.total && result.timestamp &&
                        (!selectedSublevel || result.sublevel === selectedSublevel)) {
                        resultsList.innerHTML += `<div>${result.name}: ${result.score}/${result.total} (${new Date(result.timestamp).toLocaleString()}) - ${result.sublevel.toUpperCase()}</div>`;
                    }
                });
            }
            if (!resultsList.innerHTML) resultsList.innerHTML = `<p>${translations[currentLanguage].noResults}</p>`;
        });
    }
}

// Функция отображения общего рейтинга с фильтром по подуровню
function showAllLeaderboard() {
    if (top10List && database && onValue && leaderboardSublevel) {
        const selectedSublevel = leaderboardSublevel.value.toLowerCase();
        onValue(resultsRef, (snapshot) => {
            top10List.innerHTML = '';
            const data = snapshot.val();
            if (data) {
                const results = Object.values(data)
                    .filter(result => result.total && result.timestamp && !isNaN(result.score) && !isNaN(result.total) &&
                        (!selectedSublevel || result.sublevel === selectedSublevel))
                    .sort((a, b) => b.score / b.total - a.score / a.total)
                    .slice(0, 10);
                if (results.length > 0) {
                    results.forEach((result, index) => {
                        top10List.innerHTML += `<div>${index + 1}. ${result.name}: ${result.score}/${result.total} - ${result.sublevel.toUpperCase()}</div>`;
                    });
                } else {
                    top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
                }
            }
        });
    }
}

// Функция отображения рейтинга по уровню и подуровню
function showLeaderboard(level, sublevel) {
    if (top10List && database && onValue && leaderboardSublevel) {
        const selectedSublevel = leaderboardSublevel.value.toLowerCase() || sublevel.toLowerCase();
        onValue(resultsRef, (snapshot) => {
            top10List.innerHTML = '';
            const data = snapshot.val();
            if (data) {
                const filtered = Object.values(data)
                    .filter(r => r.level === level && r.sublevel === selectedSublevel && r.total && !isNaN(r.score) && !isNaN(r.total));
                const results = filtered.sort((a, b) => b.score / b.total - a.score / a.total).slice(0, 10);
                if (results.length > 0) {
                    results.forEach((result, index) => {
                        top10List.innerHTML += `<div>${index + 1}. ${result.name}: ${result.score}/${result.total} - ${result.sublevel.toUpperCase()}</div>`;
                    });
                } else {
                    top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
                }
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

    if (navLinks) {
        navLinks[0].textContent = t.navHome;
        navLinks[1].textContent = t.navTest;
        navLinks[2].textContent = t.navResults;
        navLinks[3].textContent = t.navLeaderboard;
        navLinks[4].textContent = t.navTelegram;
    }

    if (scoreDisplay) scoreDisplay.textContent = scoreDisplay.textContent.replace(/Ваш результат: |Your result: |Sizning natijangiz: /, t.scoreText);
    if (questionNumber) questionNumber.textContent = questionNumber.textContent.replace(/Вопрос |Question |Savol /, t.questionPrefix || '');
    if (resultsList && resultsList.textContent.includes('Нет результатов')) resultsList.innerHTML = `<p>${t.noResults}</p>`;
    if (top10List && top10List.textContent.includes('Нет результатов')) top10List.innerHTML = `<p>${t.noLevelResults}</p>`;

    const selected = languageSelect.querySelector('.select-selected');
    const flagOption = languageSelect.querySelector(`.flag-option[data-value="${lang}"]`);
    if (selected && flagOption) {
        selected.innerHTML = flagOption.innerHTML;
    }
}

// Обработчик изменения уровня с обновлением цвета
function setupLevelChange() {
    if (levelSelect) {
        levelSelect.addEventListener('change', function() {
            const level = this.value;
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
                }
            }
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
    }
}

// Функция обновления цвета поля подуровня
function updateSublevelColor() {
    if (sublevelSelect) {
        const sublevel = sublevelSelect.value;
        sublevelSelect.style.backgroundColor = getSublevelColor(sublevel);
        sublevelSelect.style.color = getTextColorFromSublevel(sublevel);
    }
}

// Функция получения цвета для уровня
function getLevelColor(level) {
    const colors = {
        'beginner': '#00FF00',
        'intermediate': '#FFFF00',
        'advanced': '#FF0000',
        '': '#fff'
    };
    return colors[level] || '#fff';
}

// Функция получения цвета текста для уровня
function getTextColor(level) {
    const darkColors = ['#FF0000'];
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
        '': '#fff'
    };
    return colors[sublevel] || '#fff';
}

// Функция получения цвета текста для подуровня
function getTextColorFromSublevel(sublevel) {
    const darkColors = ['#FF0000', '#800080'];
    return darkColors.includes(getSublevelColor(sublevel)) ? '#fff' : '#000';
}

// Функция для обработки навигационных ссылок
function setupNavLinks() {
    if (navLinks) {
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const action = {
                    0: () => window.open(window.location.href, '_blank'),
                    1: () => { if (sectionOne && sectionTwo) { sectionTwo.classList.add('hidden'); sectionOne.classList.remove('hidden'); } },
                    2: () => { if (sectionOne && sectionTwo && sectionThree && scoreDisplay) { sectionOne.classList.add('hidden'); sectionTwo.classList.add('hidden'); sectionThree.classList.remove('hidden'); scoreDisplay.textContent = translations[currentLanguage].scoreText + score; displayResultsByName(); } },
                    3: () => { if (sectionOne && leaderboardDiv) { sectionOne.classList.add('hidden'); leaderboardDiv.classList.remove('hidden'); showAllLeaderboard(); } },
                    4: () => window.open(link.href, '_blank')
                }[index];
                if (action) action();
            });
        });
    }
}

// Переключение бургер-меню
function setupBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');
    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', () => {
            const isActive = navList.classList.toggle('active');
            if (isActive) {
                burgerMenu.textContent = '×';
                burgerMenu.classList.add('active');
            } else {
                burgerMenu.textContent = '☰';
                burgerMenu.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (navList.classList.contains('active')) {
                const isClickInsideMenu = navList.contains(e.target) || burgerMenu.contains(e.target);
                if (!isClickInsideMenu) {
                    navList.classList.remove('active');
                    burgerMenu.textContent = '☰';
                    burgerMenu.classList.remove('active');
                }
            }
        });
    }
}

// Кастомный выпадающий список (только три других флага)
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
        console.error('Ошибка инициализации кастомного выпадающего списка');
        return;
    }

    // Функция для обновления отображаемых флагов
    function updateVisibleFlags() {
        options.forEach(option => {
            const value = option.getAttribute('data-value');
            if (value === currentLanguage) {
                option.style.display = 'none'; // Скрываем текущий язык
            } else {
                option.style.display = 'flex'; // Показываем остальные
            }
        });
    }

    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        items.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
        updateVisibleFlags(); // Обновляем флаги при открытии
        console.log('Клик по select-selected, текущий язык:', currentLanguage, 'классы items:', items.className);
    });

    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.getAttribute('data-value');
            updateLanguage(value);
            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
            selected.innerHTML = this.innerHTML;
            updateVisibleFlags(); // Обновляем флаги после выбора
        });
    });

    document.addEventListener('click', function(e) {
        if (!select.contains(e.target)) {
            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
        }
    });

    // Инициализация: скрываем текущий язык при загрузке
    updateVisibleFlags();
}

// Обработчик изменения фильтра подуровня для результатов
function setupSublevelFilter() {
    if (filterSublevel) {
        filterSublevel.addEventListener('change', () => {
            displayResultsByName();
        });
    }
}

// Обработчик изменения фильтра подуровня для рейтинга
function setupLeaderboardSublevelFilter() {
    if (leaderboardSublevel) {
        leaderboardSublevel.addEventListener('change', () => {
            showAllLeaderboard();
            if (userLevel && userSublevel) {
                showLeaderboard(userLevel, userSublevel);
            }
        });
    }
}

// Инициализация
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
    filterSublevel = document.getElementById('filterSublevel');
    leaderboardSublevel = document.getElementById('leaderboardSublevel');

    console.log('DOM elements initialized:', { startQuizBtn, languageSelect });

    await waitForFirebase();
    if (!window.englishQuizQuestions || Object.keys(window.englishQuizQuestions).length === 0) {
        console.warn('Вопросы не загружены, используются временные данные');
        window.englishQuizQuestions = {
            beginner: { a1: [{ question: "What is 1+1?", options: ["2", "3", "4"], correctAnswer: "2" }] }
        };
    }

    setupLevelChange();
    setupSublevelChange();
    updateLanguage(currentLanguage);
    setupCustomSelect();
    setupBurgerMenu();
    setupNavLinks();
    setupSublevelFilter();
    setupLeaderboardSublevelFilter();

    document.addEventListener('click', (e) => {
        console.log('Глобальный клик:', { target: e.target.tagName, class: e.target.className, id: e.target.id });
    });

    if (optionsDiv) {
        optionsDiv.addEventListener('click', (e) => {
            if (e.target.className === 'option-btn' && currentQuestions.length > 0 && currentQuestion < currentQuestions.length) {
                const selected = e.target.textContent;
                checkAnswer(selected, currentQuestions[currentQuestion].correctAnswer);
            }
        });
    }

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            userName = document.getElementById('userName').value.trim();
            if (!userName) {
                alert(translations[currentLanguage].enterNameAlert);
                return;
            }
            if (!levelSelect.value || !sublevelSelect.value) {
                alert(translations[currentLanguage].selectLevelAlert);
                return;
            }
            userLevel = levelSelect.value;
            userSublevel = sublevelSelect.value.toLowerCase();
            const questions = window.englishQuizQuestions[userLevel]?.[userSublevel] || [];
            if (questions.length === 0) {
                alert(translations[currentLanguage].noQuestionsAlert);
                return;
            }
            currentQuestions = shuffle(questions).slice(0, 20);
            currentQuestion = 0;
            score = 0;
            if (sectionOne && sectionTwo) {
                sectionOne.classList.add('hidden');
                sectionTwo.classList.remove('hidden');
                showQuestion(currentQuestion);
            }
        });
    }

    if (resultsLink) resultsLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (sectionOne && sectionTwo && sectionThree && scoreDisplay) {
            sectionOne.classList.add('hidden');
            sectionTwo.classList.add('hidden');
            sectionThree.classList.remove('hidden');
            scoreDisplay.textContent = translations[currentLanguage].scoreText + score;
            displayResultsByName();
        }
    });

    if (searchName) searchName.addEventListener('input', displayResultsByName);
    if (topLink) topLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (sectionOne && leaderboardDiv) {
            sectionOne.classList.add('hidden');
            leaderboardDiv.classList.remove('hidden');
            showAllLeaderboard();
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
                levelSelect.style.backgroundColor = '#fff';
                levelSelect.style.color = '#000';
                sublevelSelect.style.backgroundColor = '#fff';
                sublevelSelect.style.color = '#000';
            }
        }
    });
});