const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
var currentQuiz;

let currentQuestionIndex = 0;
let score = 0;

function showCategories() {
  _categoryList = document.getElementById("category-list");
  categories.forEach(category => {
    _categoryList.innerHTML += `<a class="btn" href="quiz.html?c=${category.id}">${category.name}</a>`;
  });
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  loadQuiz();
  showQuestion();
}

function loadQuiz() {
  const url = new URL(window.location.href); // Get the current URL
  const params = new URLSearchParams(url.search); // Extract query string
  const value = params.get('c'); // Replace 'parameterName' with your key
  currentQuiz = questions.filter(q => q.categoryid == value);
  console.log(currentQuiz);
}

function showQuestion() {
  resetState();

  let currentQuestion = currentQuiz[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  let shuffledAnswers = currentQuestion.answers.sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);

    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }

    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.length) {
    showQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${currentQuiz.length}!`;
  nextButton.innerHTML = "Home";
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < currentQuiz.length) {
    handleNextButton();
  } else {
    if (nextButton.innerHTML == "Home") {
      window.location.href = "index.html";
    } else {
      startQuiz();
    }
  }
});

startQuiz();