const sampleText = "The quick brown fox jumps over the lazy dog.";
const userInput = document.getElementById('user-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const startResetButton = document.getElementById('start-reset-btn');
const sampleTextElement = document.getElementById('sample-text');

let startTime;
let timerInterval;
let isTyping = false;
let isCompleted = false;

function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000);
        timerElement.textContent = timeElapsed;
        updateMetrics(); 
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function calculateWPM() {
    const wordsTyped = userInput.value.trim().split(/\s+/).length;
    const timeElapsed = parseInt(timerElement.textContent, 10);
    if (timeElapsed > 0) {
        const wpm = (wordsTyped / timeElapsed) * 60;
        return Math.round(wpm);
    }
    return 0;
}

function calculateAccuracy() {
    const inputText = userInput.value;
    let correctChars = 0;

    for (let i = 0; i < Math.min(inputText.length, sampleText.length); i++) {
        if (inputText[i] === sampleText[i]) {
            correctChars++;
        }
    }

    return (correctChars / sampleText.length) * 100;
}

function updateMetrics() {
    if (isTyping && !isCompleted) {
        wpmElement.textContent = calculateWPM();
        accuracyElement.textContent = Math.round(calculateAccuracy());
        highlightText(); 
    }
}

function highlightText() {
    const inputText = userInput.value;
    let highlightedText = '';
    for (let i = 0; i < sampleText.length; i++) {
        if (i < inputText.length) {
            if (inputText[i] === sampleText[i]) {
                highlightedText += `<span class="correct">${sampleText[i]}</span>`;
            } else {
                highlightedText += `<span class="error">${sampleText[i]}</span>`;
            }
        } else {
            highlightedText += `<span>${sampleText[i]}</span>`;
        }
    }
    sampleTextElement.innerHTML = highlightedText;
}

function resetTest() {
    stopTimer();
    timerElement.textContent = '0';
    wpmElement.textContent = '0';
    accuracyElement.textContent = '0';
    userInput.value = '';
    userInput.disabled = true;  
    sampleTextElement.innerHTML = sampleText;  
    isTyping = false;
    isCompleted = false;
    startResetButton.textContent = 'Start';
    startResetButton.disabled = false;
}

function checkCompletion() {
    if (userInput.value.trim() === sampleText) {
        stopTimer();
        isCompleted = true;
        userInput.disabled = true;  
        startResetButton.textContent = 'Reset';
        startResetButton.disabled = false;
    }
}

startResetButton.addEventListener('click', () => {
    if (isCompleted) {
        resetTest();  
    } else {
        userInput.disabled = false;  
        userInput.focus(); 
        startTimer();
        startResetButton.disabled = true;
    }
});

userInput.addEventListener('input', () => {
    if (!isTyping && !isCompleted) {
        isTyping = true;
    }
    checkCompletion();  
    updateMetrics();  
});

resetTest();  

