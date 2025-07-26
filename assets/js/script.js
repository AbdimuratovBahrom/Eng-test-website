// --- DOM элементы ---
let levelSelect, sublevelSelect, startQuizBtn, resultsLink, topLink, sectionOne, sectionTwo, sectionThree;
let leaderboardDiv, showLeaderboardBtn, backToStartBtn, backToStartBtn2, top10List, questionNumber, questionText;
let optionsDiv, scoreDisplay, searchName, resultsList, title, leaderboardTitle, languageSelect;

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
        questionPrefix: "Question "
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
        questionPrefix: "Вопрос "
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
        questionPrefix: "Savol "
    },
    krh: {
        title: "İngliz tili testi",
        userNamePlaceholder: "Adingizdi kiritip",
        levelPlaceholder: "Deñge tanlañ",
        sublevelPlaceholder: "Kiçi deñgeni tanlañ",
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
        selectLevelAlert: "Deñge men kiçi deñgeni tanlañ!",
        noQuestionsAlert: "Bul deñge men kiči deñge úshin savollar joq!",
        questionPrefix: "Savol "
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
let currentLanguage = 'ru'; // Язык по умолчанию

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

// Обновление текста на странице
function updateLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];
    if (title) title.textContent = t.title; // Проверка на null
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

    // Обновление динамических текстов
    if (scoreDisplay) scoreDisplay.textContent = scoreDisplay.textContent.replace(/Ваш результат: |Your result: |Sizning natijangiz: |Siziñ natïjañiz: /, t.scoreText);
    if (questionNumber) questionNumber.textContent = questionNumber.textContent.replace(/Вопрос |Question |Savol /, t.questionPrefix || '');
    if (resultsList && resultsList.textContent.includes('Нет результатов')) resultsList.innerHTML = `<p>${t.noResults}</p>`;
    if (top10List && top10List.textContent.includes('Нет результатов')) top10List.innerHTML = `<p>${t.noLevelResults}</p>`;

    // Обновляем отображаемый язык в кастомном select
    const selected = languageSelect.querySelector('.select-selected');
    const flagOption = languageSelect.querySelector(`.flag-option[data-value="${lang}"]`);
    if (selected && flagOption) {
        selected.innerHTML = flagOption.innerHTML;
    }
}

// Кастомный выпадающий список
function setupCustomSelect() {
    const select = languageSelect;
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');
    const options = items.querySelectorAll('.flag-option');

    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        items.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
    });

    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.getAttribute('data-value');
            updateLanguage(value);
            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
        });
    });

    // Закрываем выпадающий список при клике вне его
    document.addEventListener('click', function(e) {
        if (!select.contains(e.target)) {
            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
        }
    });
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
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
        title = document.getElementById('title');
        leaderboardTitle = document.getElementById('leaderboardTitle');
        languageSelect = document.getElementById('languageSelect');

        // Отладка: выводим, какие элементы не найдены
        console.log('DOM elements:', {
            levelSelect, sublevelSelect, startQuizBtn, resultsLink, topLink, sectionOne, sectionTwo,
            sectionThree, leaderboardDiv, showLeaderboardBtn, backToStartBtn, backToStartBtn2, top10List,
            questionNumber, questionText, optionsDiv, scoreDisplay, searchName, resultsList, title,
            leaderboardTitle, languageSelect
        });

        await waitForFirebase();
        if (!window.englishQuizQuestions || Object.keys(window.englishQuizQuestions).length === 0) {
            console.error('Вопросы не загружены. Проверьте импорт englishQuizQuestions.js');
            window.englishQuizQuestions = {}; // Fallback
        }

        // Устанавливаем начальный язык
        updateLanguage(currentLanguage);
        setupCustomSelect();

        // Привязка событий
        if (levelSelect) {
            levelSelect.addEventListener('change', function() {
                const level = levelSelect.value;
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
            });
        }

        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', function() {
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
                }
            });
        }

        if (resultsLink) {
            resultsLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (sectionOne && sectionTwo && sectionThree && scoreDisplay) {
                    sectionOne.classList.add('hidden');
                    sectionTwo.classList.add('hidden');
                    sectionThree.classList.remove('hidden');
                    scoreDisplay.textContent = translations[currentLanguage].scoreText + scoreDisplay.textContent.replace(/Ваш результат: /, '');
                    displayResultsByName();
                }
            });
        }

        if (searchName) {
            searchName.addEventListener('input', function() {
                displayResultsByName();
            });
        }

        if (topLink) {
            topLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (sectionOne && leaderboardDiv) {
                    sectionOne.classList.add('hidden');
                    leaderboardDiv.classList.remove('hidden');
                    showAllLeaderboard();
                }
            });
        }

        if (showLeaderboardBtn) {
            showLeaderboardBtn.addEventListener('click', function() {
                if (leaderboardDiv) {
                    leaderboardDiv.classList.remove('hidden');
                    showLeaderboard(userLevel, userSublevel);
                }
            });
        }

        if (backToStartBtn) {
            backToStartBtn.addEventListener('click', function() {
                console.log('Кнопка "Вернуться" нажата (section three)');
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
                    }
                }
            });
        }

        if (backToStartBtn2) {
            backToStartBtn2.addEventListener('click', function() {
                console.log('Кнопка "Вернуться" нажата (leaderboard)');
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
                    }
                }
            });
        }
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        alert('Ошибка инициализации приложения. Обновите страницу или обратитесь к разработчику.');
    }
});

// --- Функция перемешивания ---
function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// --- Работа с вопросами ---
function showQuestion(index) {
    if (index >= currentQuestions.length) {
        showResults();
        return;
    }
    if (questionNumber && questionText && optionsDiv) {
        questionNumber.textContent = `${translations[currentLanguage].questionPrefix || 'Question '} ${index + 1} из ${currentQuestions.length}`;
        questionText.textContent = currentQuestions[index].question;
        optionsDiv.innerHTML = '';
        currentQuestions[index].options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'option-btn';
            btn.onclick = () => checkAnswer(opt, btn);
            optionsDiv.appendChild(btn);
        });
    }
}

function checkAnswer(selected, btn) {
    if (optionsDiv) {
        const correct = currentQuestions[currentQuestion].correctAnswer;
        const allButtons = optionsDiv.getElementsByClassName('option-btn');
        if (selected === correct) {
            score++;
            btn.style.backgroundColor = '#4CAF50';
        } else {
            btn.style.backgroundColor = '#e74c3c';
            Array.from(allButtons).forEach(b => {
                if (b.textContent === correct) b.style.backgroundColor = '#4CAF50';
            });
        }
        Array.from(allButtons).forEach(b => b.disabled = true);
        setTimeout(() => {
            Array.from(allButtons).forEach(b => {
                b.style.backgroundColor = '';
                b.disabled = false;
            });
            currentQuestion++;
            showQuestion(currentQuestion);
        }, 1000);
    }
}

function showResults() {
    if (sectionTwo && sectionThree && scoreDisplay) {
        sectionTwo.classList.add('hidden');
        sectionThree.classList.remove('hidden');
        const percentage = ((score / currentQuestions.length) * 100).toFixed(1);
        scoreDisplay.textContent = `${translations[currentLanguage].scoreText}${score} из ${currentQuestions.length} (${percentage}%)`;
        saveResult(userName, userLevel, userSublevel, score);
    }
}

function saveResult(name, level, sublevel, score) {
    if (push && resultsRef) {
        const result = {
            name: name,
            level: level,
            sublevel: sublevel,
            score: score,
            date: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })
        };
        push(resultsRef, result);
    } else {
        console.error('Firebase push или resultsRef не доступен');
        alert('Ошибка сохранения результата. Обратитесь к разработчику.');
    }
}

function displayResultsByName() {
    if (onValue && resultsRef && resultsList) {
        resultsList.innerHTML = '';
        const searchTerm = searchName.value.trim().toLowerCase();
        onValue(resultsRef, (snapshot) => {
            const allResults = snapshot.val() || {};
            let hasResults = false;
            for (let key in sublevels) {
                for (let sublevel of sublevels[key]) {
                    const filteredResults = Object.values(allResults)
                        .filter(entry =>
                            entry.level === key &&
                            entry.sublevel === sublevel.toLowerCase() &&
                            entry.name.toLowerCase().includes(searchTerm) &&
                            entry.score > 0
                        );
                    if (filteredResults.length > 0) {
                        hasResults = true;
                        const header = document.createElement('h3');
                        header.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)} ${sublevel}`;
                        resultsList.appendChild(header);

                        filteredResults.forEach(entry => {
                            const div = document.createElement('div');
                            div.textContent = `${entry.name} — ${entry.score} (${entry.date})`;
                            resultsList.appendChild(div);
                        });
                        const spacer = document.createElement('hr');
                        resultsList.appendChild(spacer);
                    }
                }
            }
            if (!hasResults) {
                resultsList.innerHTML = `<p>${translations[currentLanguage].noResults}</p>`;
            }
        });
    } else {
        console.error('Firebase onValue или resultsRef не доступен');
        if (resultsList) resultsList.innerHTML = '<p>Ошибка загрузки результатов</p>';
    }
}

// --- Показ рейтинга всех тестов по подуровням ---
function showAllLeaderboard() {
    if (onValue && resultsRef && top10List) {
        top10List.innerHTML = '';
        onValue(resultsRef, (snapshot) => {
            const allResults = snapshot.val() || {};
            const allLeaderboards = {};

            Object.values(allResults).forEach(entry => {
                const key = `${entry.level}_${entry.sublevel}`;
                if (!allLeaderboards[key]) allLeaderboards[key] = [];
                allLeaderboards[key].push(entry);
            });

            let hasResults = false;
            for (let key in allLeaderboards) {
                const leaderboard = allLeaderboards[key].sort((a, b) => b.score - a.score);
                if (leaderboard.length > 0) {
                    hasResults = true;
                    const [level, sublevel] = key.split('_');
                    const header = document.createElement('h3');
                    header.textContent = `${level.charAt(0).toUpperCase() + level.slice(1)} ${sublevel.toUpperCase()}`;
                    top10List.appendChild(header);

                    leaderboard.forEach((entry, idx) => {
                        const div = document.createElement('div');
                        let placeText = `${idx + 1}. ${entry.name} — ${entry.score} (${entry.date}) [${key}]`;
                        if (idx === 0) {
                            div.className = 'place-1';
                            placeText += ' 🥇';
                        } else if (idx === 1) {
                            div.className = 'place-2';
                            placeText += ' 🥈';
                        } else if (idx === 2) {
                            div.className = 'place-3';
                            placeText += ' 🥉';
                        }
                        div.textContent = placeText;
                        top10List.appendChild(div);
                    });
                    const spacer = document.createElement('hr');
                    top10List.appendChild(spacer);
                }
            }

            if (!hasResults) {
                top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
            }
        });
    } else {
        console.error('Firebase onValue или resultsRef не доступен');
        if (top10List) top10List.innerHTML = '<p>Ошибка загрузки рейтинга</p>';
    }
}

function showLeaderboard(level, sublevel) {
    if (onValue && resultsRef && top10List) {
        top10List.innerHTML = '';
        onValue(resultsRef, (snapshot) => {
            const allResults = snapshot.val() || {};
            const leaderboard = [];

            Object.values(allResults).forEach(entry => {
                if (entry.level === level && entry.sublevel === sublevel.toLowerCase() && entry.score > 0) {
                    leaderboard.push(entry);
                }
            });

            leaderboard.sort((a, b) => b.score - a.score);

            if (leaderboard.length > 0) {
                const header = document.createElement('h3');
                header.textContent = `${level.charAt(0).toUpperCase() + level.slice(1)} ${sublevel.toUpperCase()}`;
                top10List.appendChild(header);

                leaderboard.forEach((entry, idx) => {
                    const div = document.createElement('div');
                    let placeText = `${idx + 1}. ${entry.name} — ${entry.score} (${entry.date})`;
                    if (idx === 0) {
                        div.className = 'place-1';
                        placeText += ' 🥇';
                    } else if (idx === 1) {
                        div.className = 'place-2';
                        placeText += ' 🥈';
                    } else if (idx === 2) {
                        div.className = 'place-3';
                        placeText += ' 🥉';
                    }
                    div.textContent = placeText;
                    top10List.appendChild(div);
                });
                const spacer = document.createElement('hr');
                top10List.appendChild(spacer);
            } else {
                top10List.innerHTML = `<p>${translations[currentLanguage].noLevelResults}</p>`;
            }
        });
    } else {
        console.error('Firebase onValue или resultsRef не доступен');
        if (top10List) top10List.innerHTML = '<p>Ошибка загрузки рейтинга</p>';
    }
}