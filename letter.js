console.log(`Letter.js is loaded`);

var Letter = function(character){
    this.char = character;
    this.empty = "_";
    this.isGuessed = false;
    this.showChar = function(){
        if(this.isGuessed) return this.char;
        else return this.empty;
    };
    this.checkGuess = function(guess){
        let temp = guess.toLowerCase();
        if(temp === this.char){
            this.isGuessed = true;
        }
    };
}

module.exports = Letter; 