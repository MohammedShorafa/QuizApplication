//select Elements
let countSpan =document.querySelector(".quizInfo .count span");
let bulletsSpanCountainer=document.querySelector(".bullets .spans");
let quizArea=document.querySelector(".quizApp .quizArea");
let answersArea=document.querySelector(".answersArea");
let submitButton=document.querySelector(".submitButton");
let bullets = document.querySelector(".bullets"); //i use it in function show results
let resultsContainer = document.querySelector(".results");

//set options
let currentIndex=0;
let rightAnswers=0;


function getQuestions(){

    let myRequest=new XMLHttpRequest();

    myRequest.onreadystatechange=function(){
        if(this.readyState===4&&this.status===200){
            let questionObject=JSON.parse(this.responseText)
            let qCount =questionObject.length;

            //Create Bullets + set question count
            createBullets(qCount);

            //add question data
           addQueastionData(questionObject[currentIndex],qCount); //questionObject[0] بس مش هينفع دايما يجبلي السوال الاول 
            
            //click on submit
            submitButton.onclick=function(){

                //GIT RIGHT ANSWER
                let theRightAnswer=questionObject[currentIndex]["right_answer"];
                

                //increase the index
                currentIndex++;

                //check the answer 
                checkAnswer(theRightAnswer,qCount);

                //Remove Previous Question
                quizArea.innerHTML="";
                answersArea.innerHTML="";

                //use function again ////add question data
                addQueastionData(questionObject[currentIndex],qCount);

                handelBullets();

                //show Results
                showResults(qCount)



            }
        
        }
    };

    myRequest.open("Get","question.json",true);
    myRequest.send();

}

getQuestions();










//function to create bullets and put no of question

function createBullets(num){
    countSpan.innerHTML=num;

    for(i=0;i<num;i++){
        let theBullet=document.createElement("span");
        if(i===0){
            theBullet.classList.add("on")
        }

        bulletsSpanCountainer.appendChild(theBullet);
    }
}



//function add data question
function addQueastionData(obj,count){
    
    if(currentIndex<count){

    //create h2 //title of question
    let questionTitle=document.createElement("h2");
    let questionText=document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    //create the answers
    for(let i=1;i<=4;i++){

        //create main answer div 
        let mainDiv=document.createElement("div");
        mainDiv.className='answer';

        //create radio input
        let radioInput=document.createElement("input");
        radioInput.setAttribute("type","radio");
        radioInput.setAttribute("id",`answer_${i}`);
        radioInput.name="question";
        if(i===1){
            radioInput.checked=true;
        }
        radioInput.dataset.answer = obj[`answer_${i}`];
        

        //create the lable 
        let theLable = document.createElement("label");
        theLable.htmlFor=`answer_${i}`;
        let textLable=document.createTextNode(obj[`answer_${i}`]);
        theLable.appendChild(textLable);

        //add radio input and lable to main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLable);
        answersArea.appendChild(mainDiv);
    }}
}



//checkAnswer 

function checkAnswer(rAnswer,count){     //right answer and qcount عدد الاسئلة 
    let answers=document.getElementsByName("question");
    let theChoosenAnswer;
    for(let i=0 ;i<answers.length;i++){
        if(answers[i].checked){
            theChoosenAnswer=answers[i].dataset.answer;
        }
    }
    if(theChoosenAnswer === rAnswer){
        rightAnswers++;
    }
}


//move active class from span 

function handelBullets(){
    let bulletsSpans=document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans=Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {      //index revere to array of spans

        if(currentIndex === index){
            span.className="on";
        }
        
    });
    
}



function showResults(count){
    let theResults;
    if(currentIndex===count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

            if (rightAnswers > count / 2 && rightAnswers < count) {
        theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
        theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
        theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
    }}
