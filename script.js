let quizData = [];
let currentQuiz = 0;
let score = 0;
let currentQuestion = 0;
let timer;
let timeLeft = 0;

// URL parameter voor quiz
const urlParams = new URLSearchParams(window.location.search);
const quizIndex = urlParams.get('quiz');

fetch('quizzes.json')
    .then(res => res.json())
    .then(data => {
        quizData = data[quizIndex];
        document.getElementById('quiz-title').textContent = quizData.title;
        showQuestion();
    });

function showQuestion() {
    if (currentQuestion >= quizData.questions.length) {
        finishQuiz();
        return;
    }

    const question = quizData.questions[currentQuestion];
    const container = document.getElementById('question-container');

    // Media toevoegen
    let mediaHTML = '';
    if (question.media) {
        if (question.media.endsWith('.mp4') || question.media.endsWith('.webm')) {
            mediaHTML = `<video controls class="media"><source src="${question.media}" type="video/mp4"></video>`;
        } else {
            mediaHTML = `<img src="${question.media}" class="media" />`;
        }
    }

    container.innerHTML = `
        <h2>${question.question}</h2>
        ${mediaHTML}
        <div class="options"></div>
    `;

    const optionsContainer = container.querySelector('.options');
    question.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => selectAnswer(i);
        optionsContainer.appendChild(btn);
    });

    // Timer
    clearInterval(timer);
    timeLeft = question.time;
    document.getElementById('time').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function selectAnswer(index) {
    const correct = quizData.questions[currentQuestion].answer;
    if (index === correct) score++;
    nextQuestion();
}

function nextQuestion() {
    clearInterval(timer);
    currentQuestion++;
    showQuestion();
}

function finishQuiz() {
    clearInterval(timer); // Stop de timer
    if (confirm("Weet je zeker dat je de toets wilt beëindigen?")) {
        // Cijfer berekenen
        const grade = calculateGrade(score, quizData.questions.length);
        // Resultaat downloaden
        downloadResult(grade);
        // Terug naar startpagina
        window.location.href = 'index.html';
    }
}

function downloadResult() {
    const element = document.createElement('a');
    const text = `Toets: ${quizData.title}\nScore: ${score}/${quizData.questions.length}\nDatum: ${new Date().toLocaleString()}`;
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${quizData.title}_resultaat.txt`;
    document.body.appendChild(element);
    element.click();
}



function finishQuiz() {
    clearInterval(timer); // Stop de timer
    // Optioneel: alert of bevestiging
    if (confirm("Weet je zeker dat je de toets wilt beëindigen?")) {
        // Resultaat downloaden
        downloadResult();
        // Terug naar startpagina
        window.location.href = 'index.html';
    }
}
