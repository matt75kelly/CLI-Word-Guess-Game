var Word = require("./word.js");
var ask = require("inquirer");
var fs = require("fs");
let attempts = {
    current : 0,
    max : 0
}
function setMax(word){
    return Math.floor(1.25 * Math.sqrt(word.length * 10));
}

function resetGame(data){
    console.log(`WordBank is Loaded`);
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

                console.log(target.showWord());
                console.log(attempts.current);
                if(attempts.current === 0){
                    console.log(`Resetting the WORD`);
                    word = resetGame(data);
                    console.log(word);
                    target = new Word(word);
                    target.buildWord();
                    console.log(`Target: ${target}`);
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
                    ]).then(answers =>{
                        let char = answers.guess.charAt(0);
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
                            wordGuess(target);
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