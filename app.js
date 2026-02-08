function setupEventListeners() {
    elements.startBtn.addEventListener('click', () => {
      alert("Questions loaded! Next commit: topic filtering.");
    });
  }

  elements.startBtn.addEventListener('click', () => {
    showTopicSelection();
  });
  
  // ===========================
// Global State Management
// ===========================
let allQuestions = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];

// ===========================
// DOM Elements
// ===========================
const screens = {
    welcome: document.getElementById('welcome-screen'),
    topic: document.getElementById('topic-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    topicButtons: document.getElementById('topic-buttons'),
    questionCounter: document.getElementById('question-counter'),
    topicDisplay: document.getElementById('topic-display'),
    progressFill: document.getElementById('progress-fill'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedbackContainer: document.getElementById('feedback-container'),
    feedbackMessage: document.getElementById('feedback-message'),
    explanation: document.getElementById('explanation'),
    submitBtn: document.getElementById('submit-btn'),
    nextBtn: document.getElementById('next-btn'),
    currentScore: document.getElementById('current-score'),
    finalScore: document.getElementById('final-score'),
    totalQuestions: document.getElementById('total-questions'),
    percentageScore: document.getElementById('percentage-score'),
    performanceMessage: document.getElementById('performance-message'),
    correctAnswers: document.getElementById('correct-answers'),
    incorrectAnswers: document.getElementById('incorrect-answers'),
    accuracyRate: document.getElementById('accuracy-rate'),
    retryBtn: document.getElementById('retry-btn'),
    changeTopicBtn: document.getElementById('change-topic-btn')
};

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        await loadQuestions();
        setupEventListeners();
        showScreen('welcome');
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Failed to load quiz questions. Please refresh the page and try again.');
    }
}

// ===========================
// Data Loading
// ===========================
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allQuestions = data.questions;
        
        if (!allQuestions || allQuestions.length === 0) {
            throw new Error('No questions found in the data file');
        }
        
        console.log(`Successfully loaded ${allQuestions.length} questions`);
    } catch (error) {
        console.error('Error loading questions:', error);
        throw error;
    }
}

// ===========================
// Event Listeners Setup
// ===========================
function setupEventListeners() {
    elements.startBtn.addEventListener('click', () => {
        showTopicSelection();
    });

    elements.submitBtn.addEventListener('click', handleSubmitAnswer);
    elements.nextBtn.addEventListener('click', handleNextQuestion);
    elements.retryBtn.addEventListener('click', handleRetry);
    elements.changeTopicBtn.addEventListener('click', handleChangeTopic);
}

// ===========================
// Screen Navigation
// ===========================
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

// ===========================
// Topic Selection
// ===========================
function showTopicSelection() {
    const topics = getUniqueTopics();
    renderTopicButtons(topics);
    showScreen('topic');
}

function getUniqueTopics() {
    const topicsSet = new Set();
    allQuestions.forEach(q => {
        if (q.topic) {
            topicsSet.add(q.topic);
        }
    });
    return Array.from(topicsSet).sort();
}

function renderTopicButtons(topics) {
    elements.topicButtons.innerHTML = '';
    
    // Add "All Topics" button
    const allTopicsBtn = createTopicButton('All Topics', 'all-topics');
    allTopicsBtn.addEventListener('click', () => startQuiz('all'));
    elements.topicButtons.appendChild(allTopicsBtn);
    
    // Add individual topic buttons
    topics.forEach(topic => {
        const topicBtn = createTopicButton(topic);
        topicBtn.addEventListener('click', () => startQuiz(topic));
        elements.topicButtons.appendChild(topicBtn);
    });
}

function createTopicButton(text, extraClass = '') {
    const button = document.createElement('button');
    button.className = `topic-btn ${extraClass}`;
    button.textContent = text;
    return button;
}

// ===========================
// Quiz Start & Management
// ===========================
function startQuiz(selectedTopic) {
    // Filter questions based on selected topic
    if (selectedTopic === 'all') {
        currentQuestions = [...allQuestions];
    } else {
        currentQuestions = allQuestions.filter(q => q.topic === selectedTopic);
    }
    
    // Shuffle questions for variety
    currentQuestions = shuffleArray(currentQuestions);
    
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    selectedAnswer = null;
    
    // Update topic display
    elements.topicDisplay.textContent = selectedTopic === 'all' ? 'All Topics' : selectedTopic;
    
    // Show quiz screen and load first question
    showScreen('quiz');
    loadQuestion();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===========================
// Question Display
// ===========================
function loadQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    // Update question counter and progress
    updateProgress();
    
    // Display question text
    elements.questionText.textContent = question.question;
    
    // Display options
    renderOptions(question.options);
    
    // Reset UI state
    resetQuestionUI();
    
    // Update score display
    updateScoreDisplay();
}

function updateProgress() {
    const current = currentQuestionIndex + 1;
    const total = currentQuestions.length;
    
    elements.questionCounter.textContent = `Question ${current} of ${total}`;
    
    const progressPercentage = (current / total) * 100;
    elements.progressFill.style.width = `${progressPercentage}%`;
}

function renderOptions(options) {
    elements.optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const optionElement = createOptionElement(option, index);
        optionElement.addEventListener('click', () => selectOption(index));
        elements.optionsContainer.appendChild(optionElement);
    });
}

function createOptionElement(text, index) {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.dataset.index = index;
    
    const letterSpan = document.createElement('span');
    letterSpan.className = 'option-letter';
    letterSpan.textContent = String.fromCharCode(65 + index); // A, B, C, D
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    
    optionDiv.appendChild(letterSpan);
    optionDiv.appendChild(textSpan);
    
    return optionDiv;
}

function selectOption(index) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`.option[data-index="${index}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        selectedAnswer = index;
    }
}

function resetQuestionUI() {
    selectedAnswer = null;
    elements.feedbackContainer.classList.add('hidden');
    elements.submitBtn.classList.remove('hidden');
    elements.nextBtn.classList.add('hidden');
    
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    });
}

// ===========================
// Answer Checking
// ===========================
function handleSubmitAnswer() {
    if (selectedAnswer === null) {
        alert('Please select an answer before submitting.');
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.answerIndex;
    
    // Update score
    if (isCorrect) {
        score++;
    }
    
    // Store user answer
    userAnswers.push({
        questionId: question.id,
        selectedAnswer: selectedAnswer,
        correctAnswer: question.answerIndex,
        isCorrect: isCorrect
    });
    
    // Show feedback
    displayFeedback(isCorrect, question);
    
    // Highlight correct and incorrect answers
    highlightAnswers(question.answerIndex, selectedAnswer);
    
    // Disable all options
    disableOptions();
    
    // Update UI buttons
    elements.submitBtn.classList.add('hidden');
    elements.nextBtn.classList.remove('hidden');
    
    // Update score display
    updateScoreDisplay();
}

function displayFeedback(isCorrect, question) {
    elements.feedbackContainer.classList.remove('hidden');
    
    // Set feedback message
    elements.feedbackMessage.textContent = isCorrect ? 'Correct!' : 'Incorrect';
    elements.feedbackMessage.className = isCorrect ? 'feedback-message correct' : 'feedback-message incorrect';
    
    // Set explanation
    elements.explanation.textContent = question.explanation;
}

function highlightAnswers(correctIndex, selectedIndex) {
    document.querySelectorAll('.option').forEach((opt, index) => {
        if (index === correctIndex) {
            opt.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== correctIndex) {
            opt.classList.add('incorrect');
        }
    });
}

function disableOptions() {
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
        opt.style.cursor = 'not-allowed';
    });
}

function updateScoreDisplay() {
    const answered = currentQuestionIndex + (selectedAnswer !== null ? 1 : 0);
    elements.currentScore.textContent = `Score: ${score}/${answered}`;
}

// ===========================
// Navigation
// ===========================
function handleNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// ===========================
// Results Display
// ===========================
function showResults() {
    const totalQuestions = currentQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Update score values
    elements.finalScore.textContent = score;
    elements.totalQuestions.textContent = totalQuestions;
    elements.percentageScore.textContent = `${percentage}%`;
    
    // Update stats
    elements.correctAnswers.textContent = score;
    elements.incorrectAnswers.textContent = totalQuestions - score;
    elements.accuracyRate.textContent = `${percentage}%`;
    
    // Set performance message
    elements.performanceMessage.textContent = getPerformanceMessage(percentage);
    
    // Show results screen
    showScreen('results');
}

function getPerformanceMessage(percentage) {
    if (percentage === 100) {
        return 'Perfect! Outstanding DevOps knowledge! 🌟';
    } else if (percentage >= 80) {
        return 'Excellent work! You have strong DevOps skills! 🎯';
    } else if (percentage >= 60) {
        return 'Good job! Keep learning and improving! 💪';
    } else if (percentage >= 40) {
        return 'Not bad! Review the topics and try again! 📚';
    } else {
        return 'Keep studying! Practice makes perfect! 📖';
    }
}

// ===========================
// Quiz Control Actions
// ===========================
function handleRetry() {
    showTopicSelection();
}

function handleChangeTopic() {
    showTopicSelection();
}

// ===========================
// Utility Functions
// ===========================
function debugLog(message, data = null) {
    if (data) {
        console.log(`[DevOps Quiz] ${message}`, data);
    } else {
        console.log(`[DevOps Quiz] ${message}`);
    }
}

// ===========================
// Error Handling
// ===========================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    alert('An error occurred. Please refresh the page and try again.');
});

// ===========================
// Keyboard Navigation Support
// ===========================
document.addEventListener('keydown', (event) => {
    // Only handle keyboard events in quiz screen
    if (!screens.quiz.classList.contains('active')) {
        return;
    }
    
    // Handle number keys 1-4 for option selection
    if (event.key >= '1' && event.key <= '4') {
        const index = parseInt(event.key) - 1;
        const options = document.querySelectorAll('.option');
        if (options[index] && !options[index].classList.contains('disabled')) {
            selectOption(index);
        }
    }
    
    // Handle Enter key for submit/next
    if (event.key === 'Enter') {
        if (!elements.submitBtn.classList.contains('hidden')) {
            handleSubmitAnswer();
        } else if (!elements.nextBtn.classList.contains('hidden')) {
            handleNextQuestion();
        }
    }
});

// ===========================
// Console Welcome Message
// ===========================
console.log('%c🚀 DevOps Quiz Application', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cTest your DevOps knowledge!', 'color: #64748b; font-size: 14px;');
console.log('%cKeyboard shortcuts: Use 1-4 to select options, Enter to submit/continue', 'color: #10b981; font-size: 12px;');