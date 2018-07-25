var Letter = require("./letter.js");

console.log(`Word.js is Loaded`);

var Word = function(string){
    this.word = string;
    this.letters = [];
    this.isGuessed = false;
    this.buildWord = function(){
        let word = this.word.toLowerCase().trim();
        let array = [];
        for(let i = 0; i < word.length; i++){
            this.letters.push(new Letter(word.charAt(i)));
        }
        return array;
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
            if(this.letters[i].isGuessed) rightGuesses++;
        }
        if(rightGuesses === this.letters.length) this.isGuessed = true;
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