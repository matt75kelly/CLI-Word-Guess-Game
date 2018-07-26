var Word = require("./word.js");
var ask = require("inquirer");
var fs = require("fs");
// Object to track the number of Guesses the Player has on the current Word
let attempts = {
    current : 0,
    max : 0
}
// Array to store previous Player Guesses
let lettersGuessed = [];
// function to check whether or not the Player submitted a unique guess
function newGuess(char){
    for(let i = 0; i < lettersGuessed.length; i++){
        if(char.charAt(0) === lettersGuessed[i]){
            return false;
        }
    }
    return true;
}
function setMax(word){
    return Math.floor(1.25 * Math.sqrt(word.length * 10)) - 1;
}

function resetGame(data){
    let wordList = data.split("\n");
    let index = Math.floor(Math.random() * wordList.length);
    let word = wordList[index].trim();
    attempts.max = setMax(wordList[index]);
    attempts.current = 0;
    return word;
}
function wordGuess(string){
    let target = string;
        fs.readFile("words.txt","utf-8", (err, data) =>{
            if(err){
                console.log(`Error: ${err}`);
            }
            else{

                
                if(attempts.current === 0){
                    // console.log(`Resetting the WORD`);
                    word = resetGame(data);
                    console.log(word);
                    target = new Word(word);
                    target.buildWord();
                    // console.log(`Target: ${target}`);
                }
                console.log(target.showWord());
                console.log(attempts.current);

                if(attempts.current <= attempts.max && !target.isGuessed){
                    ask.prompt([
                        {
                            type: "input",
                            name: "guess",
                            message: "Guess a Letter!",
                            validate: function(value){
                                let input = value.trim().toLowerCase();
                                let char = input.charCodeAt(0);
                                if(newGuess(value)){
                                    if(char > 0x60 && char < 0x7B) return true;
                                    else if(char === 0x20 || char === 0x27 || char === 0x2D) return true;
                                    else return false;
                                }
                                else {
                                    console.log("\nYou've already guessed that letter! Pick a different one.\n");
                                    return false;
                                }
                            }
                        }
                    ]).then(answers =>{
                        let char = answers.guess.charAt(0);
                        lettersGuessed.push(char);
                        let gotOne = target.guessLetter(char);
                        if(gotOne > 0) {
                            console.log(`\n-------Correct!-------`);
                            attempts.current++;
                            attempts.max++;
                        }
                        else {
                            console.log(`\n-------Incorrect!-------`);attempts.current++;
                        }

                        console.log(`\nYou have ${attempts.max - attempts.current} guesses remaining.\n`);

                        wordGuess(target);
                    }).catch(error =>{
                        console.log(`Error: ${error}.`);
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
                            lettersGuessed = [];
                            wordGuess(target);
                        }
                        else{
                            console.log(`\nThanks for Playing!\nSee you Next Time.`)
                        }
                    });
                }
                else if(attempts.current > attempts.max && !target.isGuessed) {
                    console.log(`\nSorry! You ran out of attempts!\n`);
                    console.log(`The word was: ${target.word}.\n`);
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
                            lettersGuessed = [];
                            wordGuess(target);
                        }
                        else{
                            console.log(`\nThanks for Playing!\nSee you Next Time.`)
                        }
                    })
                }
            }
        })
    }
let string = new Word (``);
wordGuess(string);