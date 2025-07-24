// --- DOM элементы ---
const levelSelect = document.getElementById('level');
const sublevelSelect = document.getElementById('sublevel');
const startQuizBtn = document.getElementById('startQuizBtn');
const resultsLink = document.getElementById('resultsLink');
const topLink = document.getElementById('topLink');
const sectionOne = document.getElementById('one');
const sectionTwo = document.getElementById('two');
const sectionThree = document.getElementById('three');
const leaderboardDiv = document.getElementById('leaderboard');
const showLeaderboardBtn = document.getElementById('showLeaderboardBtn');
const backToStartBtn = document.getElementById('backToStartBtn');
const backToStartBtn2 = document.getElementById('backToStartBtn2');
const top10List = document.getElementById('top10-list');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const scoreDisplay = document.getElementById('score');
const searchName = document.getElementById('searchName');
const resultsList = document.getElementById('resultsList');

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
                setTimeout(checkFirebase, 100); // Проверяем каждые 100 мс
            }
        };
        checkFirebase();
    });
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await waitForFirebase();
        if (!window.englishQuizQuestions || Object.keys(window.englishQuizQuestions).length === 0) {
            console.error('Вопросы не загружены. Проверьте импорт englishQuizQuestions.js');
            window.englishQuizQuestions = {}; // Fallback
        }
    } catch (error) {
        console.error('Ошибка инициализации Firebase:', error);
        alert('Ошибка подключения к базе данных. Обновите страницу или обратитесь к разработчику.');
    }
});

// --- Выбор подуровня ---
levelSelect.addEventListener('change', function() {
    const level = levelSelect.value;
    console.log('Выбран уровень:', level);
    sublevelSelect.innerHTML = '<option value="">Выберите подуровень</option>';
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

// --- Запуск нового теста ---
startQuizBtn.addEventListener('click', function() {
    userName = document.getElementById('userName').value.trim();
    if (!userName) {
        alert('Введите имя!');
        return;
    }
    if (!levelSelect.value || !sublevelSelect.value) {
        alert('Выберите уровень и подуровень!');
        return;
    }
    userLevel = levelSelect.value;
    userSublevel = sublevelSelect.value.toLowerCase();
    console.log('Выбранный уровень:', userLevel, 'Подуровень:', userSublevel);
    const questions = window.englishQuizQuestions[userLevel]?.[userSublevel] || [];
    if (questions.length === 0) {
        alert('Вопросы для выбранного уровня и подуровня не найдены!');
        return;
    }
    currentQuestions = shuffle(questions).slice(0, 20);
    currentQuestion = 0;
    score = 0;
    sectionOne.classList.add('hidden');
    sectionTwo.classList.remove('hidden');
    showQuestion(currentQuestion);
});

// --- Показ результатов с поиском по имени ---
resultsLink.addEventListener('click', function(e) {
    e.preventDefault();
    sectionOne.classList.add('hidden');
    sectionTwo.classList.add('hidden');
    sectionThree.classList.remove('hidden');
    scoreDisplay.textContent = 'Результаты всех тестов';
    displayResultsByName();
});

searchName.addEventListener('input', function() {
    displayResultsByName();
});

// --- Работа с вопросами ---
function showQuestion(index) {
    if (index >= currentQuestions.length) {
        showResults();
        return;
    }
    questionNumber.textContent = `Вопрос ${index + 1} из ${currentQuestions.length}`;
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

function checkAnswer(selected, btn) {
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

function showResults() {
    sectionTwo.classList.add('hidden');
    sectionThree.classList.remove('hidden');
    const percentage = ((score / currentQuestions.length) * 100).toFixed(1);
    scoreDisplay.textContent = `Ваш результат: ${score} из ${currentQuestions.length} (${percentage}%)`;
    saveResult(userName, userLevel, userSublevel, score);
}

function saveResult(name, level, sublevel, score) {
    if (!push || !resultsRef) {
        console.error('Firebase push или resultsRef не доступен');
        alert('Ошибка сохранения результата. Обратитесь к разработчику.');
        return;
    }
    const result = {
        name: name,
        level: level,
        sublevel: sublevel,
        score: score,
        date: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })
    };
    push(resultsRef, result);
}

function displayResultsByName() {
    if (!onValue || !resultsRef) {
        console.error('Firebase onValue или resultsRef не доступен');
        resultsList.innerHTML = '<p>Ошибка загрузки результатов</p>';
        return;
    }
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
            resultsList.innerHTML = '<p>Нет результатов для этого имени</p>';
        }
    });
}

// --- Показ рейтинга всех тестов по подуровням ---
topLink.addEventListener('click', function(e) {
    e.preventDefault();
    sectionOne.classList.add('hidden');
    leaderboardDiv.classList.remove('hidden');
    showAllLeaderboard();
});

function showAllLeaderboard() {
    if (!onValue || !resultsRef) {
        console.error('Firebase onValue или resultsRef не доступен');
        top10List.innerHTML = '<p>Ошибка загрузки рейтинга</p>';
        return;
    }
    top10List.innerHTML = '';
    onValue(resultsRef, (snapshot) => {
        const allResults = snapshot.val() || {};
        const allLeaderboards = {};

        // Группируем результаты по уровням и подуровням
        Object.values(allResults).forEach(entry => {
            const key = `${entry.level}_${entry.sublevel}`;
            if (!allLeaderboards[key]) allLeaderboards[key] = [];
            allLeaderboards[key].push(entry);
        });

        // Сортируем и отображаем каждый подуровень со всеми результатами
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
            top10List.innerHTML = '<p>Нет результатов</p>';
        }
    });
}

showLeaderboardBtn.addEventListener('click', function() {
    leaderboardDiv.classList.remove('hidden');
    showLeaderboard(userLevel, userSublevel);
});

function showLeaderboard(level, sublevel) {
    top10List.innerHTML = '<p>Функция временно не реализована для сервера</p>';
}

backToStartBtn.addEventListener('click', function() {
    leaderboardDiv.classList.add('hidden');
    sectionThree.classList.add('hidden');
    sectionOne.classList.remove('hidden');
    score = 0;
    currentQuestion = 0;
    document.getElementById('userName').value = '';
    levelSelect.value = '';
    sublevelSelect.innerHTML = '<option value="">Выберите подуровень</option>';
    sublevelSelect.disabled = true;
});

backToStartBtn2.addEventListener('click', function() {
    leaderboardDiv.classList.add('hidden');
    sectionOne.classList.remove('hidden');
    score = 0;
    currentQuestion = 0;
    document.getElementById('userName').value = '';
    levelSelect.value = '';
    sublevelSelect.innerHTML = '<option value="">Выберите подуровень</option>';
    sublevelSelect.disabled = true;
});