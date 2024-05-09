import { getCategories, getQuestions } from "./service-api.js";

let category = "";
let amount = 5;
let difficulty = "";
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const categories = await getCategories();
const categoryElement = document.getElementById('category');

function addCategories(){
    categories.trivia_categories.forEach(element => {
    let option = document.createElement('option');
    option.id = element.id;
    option.value = element.id;
    option.textContent = element.name;
    categoryElement.appendChild(option);
    });
}

async function getFilteredQuestions(category, difficulty, amount){
    questions = await getQuestions(category, difficulty, amount);
    document.querySelector('.home-page').style.display='none';
    showQuestions();
}

function reset(){
    document.querySelector('.question-page').innerHTML='';
}

function showQuestions(){
    reset();
    let buttonText = currentQuestionIndex < questions.length-1 ? "Next": "Submit";
    const questionPage = document.querySelector('.question-page');
    const currentQuestion = questions[currentQuestionIndex];
    const h2 = document.createElement('h2');
    h2.textContent = `${currentQuestionIndex+1}. ${atob(currentQuestion.question)}`;
    questionPage.appendChild(h2);
    currentQuestion.answers.forEach((option, index)=>{
        const div = document.createElement('div');
        div.classList.add('options');
        const input = document.createElement('input');
        input.setAttribute("type", "radio");
        input.setAttribute("name", currentQuestion.question);
        input.setAttribute("id", index);
        input.setAttribute("value", option);
        const label = document.createElement('label');
        label.htmlFor = index;
        label.textContent = atob(option);
        div.appendChild(input);
        div.appendChild(label);
        questionPage.appendChild(div);
    });

    const button = document.createElement("button");
    button.id = 'submit';
    button.textContent = buttonText;
    button.disabled = true;
    document.querySelector('.question-page').append(button);
    document.querySelector('.question-page').style.display = 'flex';

    let selectedAnswer = "";
    document.getElementsByName(currentQuestion.question).forEach((element)=>{
        element.addEventListener('change',function(){
            button.disabled = false;
            selectedAnswer = element.value;
        })
    })
    document.querySelector('.question-page button').addEventListener('click', function(){
        if(selectedAnswer===currentQuestion.correct_answer){
            score++;
        }
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length){
            showQuestions();
        }
        else{
            document.querySelector('.question-page').style.display = 'none';
            showScore();
        }
    });
}


function showScore(){
    const scorePage = document.querySelector('.score-page');
    const h2 = document.createElement('h2');
    h2.textContent = `You scored ${score} out of ${questions.length}`;
    const button = document.createElement('button');
    button.id = 'play-again';
    button.textContent = "Play again"
    scorePage.appendChild(h2);
    scorePage.appendChild(button);
    document.querySelector('.score-page').style.display = 'flex';
    document.getElementById('play-again').addEventListener('click',function(){
        document.querySelector('.score-page').style.display = 'none';
        document.querySelector('.score-page').innerHTML = '';
        currentQuestionIndex=0;
        score=0;
        questions=[];
        document.getElementById('category').selectedIndex=0;
        document.getElementById('difficulty').selectedIndex=0;
        document.getElementById('amount').selectedIndex=0;
        document.querySelector('.home-page').style.display = 'block';
    })

}

document.getElementById('category').addEventListener("change", function(event){
    category = event.target.value;
    
});
document.getElementById('difficulty').addEventListener("change", function(event){
    difficulty = event.target.value;
    
});
document.getElementById('amount').addEventListener("change", function(event){
    amount = event.target.value;
    
});
document.querySelector('.home-page button').addEventListener('click', function(){
    getFilteredQuestions(category, difficulty, amount);
});


addCategories();





