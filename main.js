const quiz = document.querySelector(".quiz");
let wrapper = document.querySelector(".wrapper");
let subBtn = document.querySelector(".button");
let answers = [];
let correctAnswer = "";
let result = document.querySelector(".result");
let correctAnswerScore = document.querySelector(".correct_score");
let uncorrectAnswerScore = document.querySelector(".uncorrect_score");
let restartGame = document.querySelector(".restart_game");
let correctScore = 0;
let uncorrectScore = 0;
let amount = 1;
let saniye = 3;

let fetcQuizData = async () => {
  try {
    if (amount <= 10) {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}`
      );

      if (response.status === 429) {
        let waitQues = document.createElement("div");
        let x = setInterval(() => {
          waitQues.innerHTML = `${saniye} saniyə sonra suallar yenidən gələcək`;
          saniye--;
          if (saniye === 0) {
            clearInterval(x);
            saniye = 3;
          }
        }, 1000);

        quiz.appendChild(waitQues);
        setTimeout(() => {
          fetcQuizData();
          waitQues.style.display = "none";
        }, 3000);
      }

      const data = await response.json();
      let questions = document.createElement("div");
      questions.classList.add("question");
      quiz.appendChild(questions);
      let ques = data.results.map((element) => {
        return element;
      });
      let index = Math.floor(Math.random(ques.length) * ques.length);
      questions.innerHTML = ques[index].question;
      correctAnswer = ques[index].correct_answer;
      answers = [ques[index].correct_answer, ...ques[index].incorrect_answers];
      answers.sort(() => Math.random() - 0.5);
      answers.forEach((answer) => {
        let answerDiv = document.createElement("div");
        answerDiv.classList.add("option");

        let input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = answer;

        let label = document.createElement("label");
        label.innerHTML = answer;

        answerDiv.appendChild(input);
        answerDiv.appendChild(label);
        quiz.appendChild(answerDiv);
      });
      amount++;
    } else {
      wrapper.innerHTML = `10 sualdan ${correctScore} düz ${uncorrectScore} səhv`;
      restartGame.style.display = "inline-block";
    }
  } catch {}
};

subBtn.addEventListener("click", () => {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  const allOption = document.querySelectorAll('input[name="answer"]');
  if (selectedOption) {
    if (selectedOption.value === correctAnswer) {
      result.style.display = "flex";
      result.classList.remove("red");
      result.classList.add("green");
      result.innerHTML = correctAnswer;
      selectedOption.classList.add("green");
      correctScore++;
      correctAnswerScore.innerHTML = correctScore;
      resetFunc();
    } else {
      result.style.display = "flex";
      result.classList.remove("green");
      result.classList.add("red");
      result.innerHTML = `True correct: ${correctAnswer}`;
      uncorrectScore++;
      uncorrectAnswerScore.innerHTML = uncorrectScore;
      selectedOption.classList.add("green");
      resetFunc();
    }
  } else {
    alert("Please select an answer.");
  }
  allOption.forEach((element) => element.setAttribute("disabled", true));
});

const resetFunc = async () => {
  setTimeout(() => {
    quiz.innerHTML = "";
    result.style.display = "none";
    fetcQuizData();
  }, 1000);
};

fetcQuizData();

restartGame.addEventListener("click", () => {
  location.reload();
});
