var Word = require("./word.js");
var ask = require("inquirer");
var fs = require("fs");
let attempts = {
    current : 0,
    max : 0
}
var target = new Word(`initialization`);


function setMax(word){
    return Math.floor(1.25 * Math.sqrt(word.length * 10));
}

function resetGame(data){
    console.log(`WordBank is Loaded`);
    let wordList = data.split("\n");
    let index = Math.floor(Math.random() * wordList.length);
    target = new Word(wordList[index]).buildWord();
    attempts.max = setMax(wordList[index]);
    attempts.current = 0;
    console.log(wordList[index])
    console.log(attempts);
}
function wordGuess(){
        fs.readFile("words.txt","utf-8", (err, data) =>{
            if(err){
                console.log(`Error: ${err}`);
            }
            else{
                let displayCurrent = target.showWord();
                console.log(displayCurrent);
                if(attempts.current === 0){
                    resetGame(data);
                }

                if(attempts.current <= attempts.max && !target.isGuessed){
                    ask.prompt([
                        {
                            type: "input",
                            name: "guess",
                            message: "Guess a Letter!",
                            validate: function(value){
                                let input = value.trim().toLowerCase();
                                let char = input.charCodeAt(0);
                                if(char > 0x60 && char < 0x7A) return true;
                                else if(char === 0x20 || char === 0x27 || char === 0x2D) return true;
                                else return false;
                            }
                        }
                    ]).catch(error =>{
                        console.log(`Error: ${error}.`);
                    }).then(answers =>{
                        let char = answers.guess.charAt(0);
                        let gotOne = target.guessLetter(char);
                        if(gotOne > 0) {
                            console.log(`\n-------Correct!-------`);
                        }
                        else {
                            console.log(`\n-------Incorrect!-------`);
                        }

                        attempts.current++;

                        console.log(`\nYou have ${attempts.max - attempts.current} guesses remaining.\n`);

                        wordGuess();
                    })
                }
                else if(attempts.current <= attempts.max && target.isGuessed){
                    console.log(`\nYou Guessed Correctly!!!`);
                    ask.prompt([
                        {
                            type: "confirm",
                            name: "playAgain",
                            message: `\nWould you like to play another round?`,
                            default: true
                        }
                    ]).catch(error=>{
                        console.log(`Error: ${error}`);
                    }).then(answers=>{
                        if(answers.playAgain){
                            attempts.current = 0;
                            wordGuess();
                        }
                        else{
                            console.log(`\nThanks for Playing!\nSee you Next Time.`)
                        }
                    });
                }
                else if(attempts.current > attempts.max && !target.isGuessed) {
                    console.log(`\nSorry! You ran out of attempts!`)
                    ask.prompt([
                        {
                            type: "confirm",
                            name: "playAgain",
                            message: `\nWould you like to play another round?`,
                            default: true
                        }
                    ]).catch(error=>{
                        console.log(`Error: ${error}`);
                    }).then(answers=>{
                        if(answers.playAgain){
                            attempts.current = 0;
                            wordGuess();
                        }
                        else{
                            console.log(`\nThanks for Playing!\nSee you Next Time.`)
                        }
                    })
                }
            }
        })
    }
wordGuess();