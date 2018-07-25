var Letter = require("./letter.js");

console.log(`Word.js is Loaded`);

var Word = function(string){
    this.word = string;
    this.letters = [];
    this.isGuessed = false;
    this.buildWord = function(){
        let keyword = this.word.toLowerCase().trim();
        for(let i = 0; i < keyword.length; i++){
            this.letters.push(new Letter(keyword.charAt(i)));
        }
    };

    this.showWord = ()=>{
        let word = "";
        for(let i = 0; i < this.letters.length; i++){
            word += this.letters[i].showChar()
            word += " ";
        }
        return word.trim();
    };

    this.guessLetter = (char)=>{
        let rightGuesses = 0;
        for(let i = 0; i < this.letters.length; i++){
            this.letters[i].checkGuess(char);
            if(this.letters[i].isGuessed) {
                rightGuesses++;
            }
        }
        if(rightGuesses === this.letters.length) {
            this.isGuessed = true;
            console.log(rightGuesses + ` == ` + this.letters.length); 
        }
        return rightGuesses;
    }   
}

// let test = new Word(`start`);
// test.buildWord();
// console.log(test);
// console.log(test.letters);
// console.log(test.showWord());
// console.log(test.isGuessed);


module.exports = Word;