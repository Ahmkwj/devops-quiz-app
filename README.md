# DevOps Quiz Application

A interactive quiz application designed to test and improve your knowledge of DevOps concepts, practices, and tools.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Question Format](#question-format)
- [Topics Covered](#topics-covered)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Overview

This DevOps Quiz Application is an educational tool that helps developers, operations engineers, and DevOps practitioners test their understanding of essential DevOps concepts. The quiz covers multiple topics including DevOps culture, version control, CI/CD pipelines, and Infrastructure as Code.

## Features

- **20+ Curated Questions**: Carefully crafted questions covering core DevOps topics
- **Multiple Choice Format**: Four options per question to test your knowledge
- **Instant Feedback**: Get immediate explanations after answering each question
- **Topic Variety**: Questions span across 6 different DevOps domains
- **Progress Tracking**: Monitor your performance and identify areas for improvement
- **Educational Explanations**: Learn from detailed explanations for each answer
- Changes by Student A
- Changes by Student b

## Question Format

Each question in the quiz follows a standardized JSON structure to ensure consistency and ease of parsing. Below is the detailed format specification:

### Structure

```json
{
  "id": "Q1",
  "topic": "Continuous Integration",
  "question": "What is the primary goal of Continuous Integration?",
  "options": [
    "Automatically deploy to production",
    "Frequently integrate code changes into a shared repository",
    "Eliminate the need for testing",
    "Remove the need for branches"
  ],
  "answerIndex": 1,
  "explanation": "Continuous Integration aims to detect integration issues early by frequently merging code changes and running automated tests."
}
```

### Field Descriptions

| Field         | Type   | Description                                                           |
| ------------- | ------ | --------------------------------------------------------------------- |
| `id`          | String | Unique identifier for the question (e.g., "Q1", "Q2", etc.)           |
| `topic`       | String | The DevOps topic category this question belongs to                    |
| `question`    | String | The question text presented to the user                               |
| `options`     | Array  | An array of exactly 4 possible answers (strings)                      |
| `answerIndex` | Number | The zero-based index of the correct answer in the options array (0-3) |
| `explanation` | String | Educational explanation of why the answer is correct                  |

### Important Notes

- **Zero-Based Indexing**: The `answerIndex` uses 0-based indexing, meaning:
  - `0` = first option
  - `1` = second option
  - `2` = third option
  - `3` = fourth option
- **Answer Array**: Always provide exactly 4 options for consistency
- **Unique IDs**: Each question must have a unique ID
- **Clear Explanations**: Explanations should be concise but informative

### Example

If the correct answer is "Frequently integrate code changes into a shared repository" (the second option), the `answerIndex` would be `1`:

```json
{
  "options": [
    "Automatically deploy to production", // index 0
    "Frequently integrate code changes...", // index 1 ✓ (correct)
    "Eliminate the need for testing", // index 2
    "Remove the need for branches" // index 3
  ],
  "answerIndex": 1
}
```

## Topics Covered

The quiz includes questions from the following DevOps topics:

1. **The DevOps Culture** - Principles, values, and collaborative practices
2. **Version Control Systems** - Git, branching strategies, and collaboration workflows
3. **Plan with DevOps** - Agile methodologies and planning practices
4. **Continuous Integration** - CI principles, tools, and best practices
5. **Continuous Delivery** - CD pipelines and deployment readiness
6. **Continuous Deployment** - Automated deployment strategies
7. **Infrastructure as Code** - IaC tools, practices, and benefits

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ahmkwj/devops-quiz.git
cd devops-quiz
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

## Usage

1. **Start the Quiz**: Click the "Start Quiz" button on the home page
2. **Answer Questions**: Read each question carefully and select your answer
3. **Submit**: Click "Submit Answer" to check if you're correct
4. **Learn**: Review the explanation provided for each question
5. **Continue**: Move to the next question or review your overall score
6. **Retake**: You can retake the quiz at any time to improve your score

### Adding New Questions

When adding new questions to `questions.json`:

- Follow the exact format specified in the [Question Format](#question-format) section
- Ensure the `answerIndex` is correct (0-based)
- Provide clear, educational explanations
- Verify that questions are accurate and up-to-date
- Cover diverse aspects of the topic
