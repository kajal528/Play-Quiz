export async function getCategories(){
    const response = await fetch('https://opentdb.com/api_category.php');
    return response.json();
}

export async function getQuestions(category, difficulty, amount){
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&encode=base64`);
    const result = await response.json();
    const questions = [];
    result.results.forEach(element => {
        let question = element.question;
        let randomPosition = Math.floor(Math.random()*(element.incorrect_answers.length+1));
        let answers = element.incorrect_answers;
        answers.splice(randomPosition,0,element.correct_answer);
        questions.push({
            question,
            answers,
            correct_answer: element.correct_answer
        });
    });
    return questions;
}
