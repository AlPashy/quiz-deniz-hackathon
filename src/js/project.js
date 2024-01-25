var questions = [
    {
        question: "Welche Branche ist das Haupttätigkeitsfeld der Atruvia AG?",
        options: ["Lebensmittel", "Technologie und Software", "Gesundheitswesen", "Bergbau und Rohstoffe"],
        correctAnswerIndex: 1
    },
    {
        question: "Wie viel Mitarbeiter hat die Atruvia?",
        options: ["2500", "4100", "5100", "6000"],
        correctAnswerIndex: 2
    },
    {
        question: "Was ist der größte Standort der Atruvia AGs",
        options: ["München", "Karlsruhe", "Münster"],
        correctAnswerIndex: 1 
    },
    {
        question: "Wie viele Azubis gibt es insgesamt an allen Standorten?",
        options: ["50", "100", "200", "300"],
        correctAnswerIndex: 2
    },
    {   
        question: "Wann war die Fusion zwischen der Fiducia & GAD?",
        options: ["2005", "2010", "2015"],
        correctAnswerIndex: 2  
    },
    {
        question: "Welche Arten von Dienstleistungen oder Produkte biete die Atruvia AG an?",
        options: ["Automobile", "Medizinische Geräte", "Softwarelösungen für Compliance und Datenschutz"],
        correctAnswerIndex: 2
    },
    {
        question: "Warum ist die Atruvia AG einer der größten Kunden der Deutschen Post?",
        options: ["Hohe Nachfrage nach Briefmarken", "Nutzung von Postdienstleistungen für den Versand von Unterlagen", "Exklusiver Vertrag für Paketlieferungen"],
        correctAnswerIndex: 1
    },
    {
        question: "Welche bekannten Kunden oder Partner hat die Atruvia AG?",
        options: ["Tesla", "Microsoft", "Volksbanken", "Alle der oben genannten"],
        correctAnswerIndex: 2
    }
];

var currentQuestionIndex = 0;
var correctAnswersFr = 0;
var timer;


async function register() {
    var url = "http://192.168.10.139:8080/register"
    console.log(url)
    const response = await fetch(url, {
        method: "GET" // *GET, POST, PUT, DELETE, etc.
      });
     var json = await response.json(); // parses JSON response into native JavaScript objects

     return json.uuid;
}

async function result(uuid, score) {
    var url = "http://192.168.10.139:8080/result?uuid=" + uuid + "&score=" + score
    console.log(url)
    await fetch(url, {
        method: "GET" // *GET, POST, PUT, DELETE, etc.
      });

}

async function statusCall(uuid) {
    var url = "http://192.168.10.139:8080/status?uuid=" + uuid
    console.log(url)
    const response = await fetch(url, {
        method: "GET" // *GET, POST, PUT, DELETE, etc.
      });
     var json = await response.json(); // parses JSON response into native JavaScript objects

     return json;
}

async function test() {
    var uuid1 = await register();
    var uuid2 = await register();

    await result(uuid1, 1)
    await result(uuid2, 5)

    var end1 = await statusCall(uuid1)
    var end2 = await statusCall(uuid2)

    console.log(end1.won, end1.opponentScore)
    console.log(end2.won, end2.opponentScore)
}



var uuid;

register().then(uuid1 => {
    uuid = uuid1
})

document.addEventListener('DOMContentLoaded', function () {
    updateQuestion();
    startTimer();
});

function run() {
    statusCall(uuid).then(result => {
        if (result.opponentScore !== -1) {
            console.log("finished")
           
            // Win / Lose screen
            var won = result.won
            var message = document.getElementById("result");
            if (won) {
            message.textContent = 'You win! 👑';
            } else {
            message.textContent = 'You lose! 👑';
            }

        }
        console.log(result)
    })
    console.log("Check")
    window.setTimeout(run, 1000)
}

//window.setTimeout(run(), 1000)
run()

function startTimer() {
    var timerDisplay = document.getElementById('timer');
    var timeLeft = 100;

    function updateTimerDisplay() {
        timerDisplay.textContent = 'Time left: ' + timeLeft + 's';
    }

    function countdown() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            timer = setTimeout(countdown, 1000);
        } else {
            displayScore();
        }
    }

    updateTimerDisplay();
    timer = setTimeout(countdown, 1000);
}

function updateQuestion() {
    var questionContainer = document.getElementById('questionContainer');
    var currentQuestion = questions[currentQuestionIndex];
    // Clear previous Q
    questionContainer.innerHTML = '';
    var questionHeading = document.createElement('h4');
    questionHeading.className = 'buttons';
    questionHeading.textContent = currentQuestion.question;
    questionContainer.appendChild(questionHeading);
    var answerOptions = document.createElement('ul');
    answerOptions.className = "answer-options";

    currentQuestion.options.forEach(function (option, index) {
        var button = document.createElement('button');
        button.className = 'button-style';
        button.dataset.option = 'option' + (index + 1);
        button.textContent = option;
        button.onclick = function () {
            checkAnswer('option' + (index + 1));
        };
        var li = document.createElement('li');
        li.appendChild(button);
        answerOptions.appendChild(li);
    });

    questionContainer.appendChild(answerOptions);
}

function checkAnswer(selectedOption) {
    var selectedRadioButton = document.querySelector('input[name="slide"]:checked');
    var answerButtons = selectedRadioButton.parentElement.querySelectorAll('.button-style');
    var correctAnswerButton = answerButtons[questions[currentQuestionIndex].correctAnswerIndex];
    var userAnswerButton = selectedRadioButton.parentElement.querySelector('.button-style[data-option="' + selectedOption + '"]');
    answerButtons.forEach(function (button) {
        button.disabled = true;
    });

    if (userAnswerButton !== correctAnswerButton) {
        userAnswerButton.style.backgroundColor = 'red';
    } else {
        userAnswerButton.style.backgroundColor = 'green';
        correctAnswersFr++;
    }

    correctAnswerButton.style.backgroundColor = 'green';

    setTimeout(function () {
        playGame();
    }, 500);
}

function playGame() {
    if (currentQuestionIndex === questions.length - 1) {
        displayScore();
    } else {
        document.querySelector('.container').classList.add('hidden');
        setTimeout(function () {
            if (currentQuestionIndex === questions.length - 1) {
                // Display user's score
                displayScore();
            } else {
                currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
                var answerButtons = document.querySelectorAll('.button-style');
                answerButtons.forEach(function (button) {
                    button.style.backgroundColor = '';
                    button.disabled = false;
                });
                updateQuestion();
                document.querySelector('.container').classList.remove('hidden');
            }
        }, 500);
    }
}

function displayScore() {
    var score = calculateScore();
    var questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = '';
    var scoreHeading = document.createElement('h4');
    scoreHeading.textContent = 'Your Score: ' + score + ' out of ' + questions.length;
    scoreHeading.style.fontSize = '25px';

    questionContainer.appendChild(scoreHeading);
    var message = document.createElement('p');
    message.style.fontSize = '25px';
    message.id = "result";
    message.textContent = "Warte auf Gegner..."

    result(uuid, score)

    /*if (score === questions.length) {
        message.textContent = 'You win! 👑';
    } else {
        message.textContent = 'You lose! 😂';
    }*/

    questionContainer.appendChild(message);

    var retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.className = 'button-style';
    retryButton.onclick = function () {
        resetQuiz();
    };
    questionContainer.appendChild(retryButton);

    clearTimeout(timer);
}


function resetQuiz() {
    currentQuestionIndex = 0;
    correctAnswersFr = 0;
    var answerButtons = document.querySelectorAll('.button-style');
    answerButtons.forEach(function (button) {
        button.style.backgroundColor = '';
        button.disabled = false;
    });
    updateQuestion();
    resetTimer();
}

function calculateScore() {
    return correctAnswersFr;
}

function resetTimer() {
    clearTimeout(timer);
    startTimer();
}




