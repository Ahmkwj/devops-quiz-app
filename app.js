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

