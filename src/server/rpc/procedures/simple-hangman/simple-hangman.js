// This is a hangman set of RPC's which will select a word for the student to
// try to guess
'use strict';

// Word list
var words = ['accurate','address', 'afford','alert','analyze','ancestor',
'annual','apparent','appropriate','arena','arrest','ascend','assist','attempt',
'attentive','attractive','awkward','baggage','basic','benefit','blend','blossom',
'burrow','calculate','capable','captivity','carefree','century','chamber',
'circular','coax','column','communicate','competition','complete','concentrate',
'concern','conclude','confuse','congratulate','considerable','content','contribute',
'crafty','create','demonstrate','descend','desire','destructive','develop','disaster',
'disclose','distract','distress','dusk','eager','ease','entertain','entire','entrance',
'envy','essential','extraordinary','flexible','focus','fragile','frantic','frequent',
'frontier','furious','generosity','hail','hardship','heroic','host','humble','Impact',
'increase','indicate','inspire','instant','invisible','jagged','lack','limb','limp',
'manufacture','master','mature','meadow','mistrust','mock','modest','noble','orchard',
'outstanding','peculiar','peer','permit','plead','plentiful','pointless','portion',
'practice','precious','prefer','prepare','proceed','queasy','recent','recognize','reduce',
'release','represent','request','resist','response','reveal','routine','severe','shabby',
'shallow','sole','source','sturdy','surface','survive','terror','threat','tidy','tour',
'tradition','tragic','typical','vacant','valiant','variety','vast','venture','weary'];

var debug = require('debug'),
    trace = debug('netsblox:rpc:simple-hangman:trace');

var SimpleHangman = function() {
    this._state = {};
    this._state.word = null;
    this._state.wrongGuesses = 0;
    this._state.knownIndices = [];

    this._restart();
};

// Actions
SimpleHangman.prototype.restart = function() {
    this._restart();
    return true;
};

SimpleHangman.prototype.getCurrentlyKnownWord = function() {
    var letters = this._state.word.split('').map(() => '_');

    this._state.knownIndices.forEach(function(index) {
        letters[index] = this._state.word[index];
    }, this);
    trace('Currently known word is "'+letters.join(' ')+'"');
    trace('word is '+this._state.word);
    return letters.join(' ');
};

SimpleHangman.prototype.guess = function(letter) {
    var indices,
        added;

    letter = letter[0];
    trace('Guessing letter: '+letter);
    indices = SimpleHangman.getAllIndices(this._state.word, letter);
    added = SimpleHangman.merge(this._state.knownIndices, indices);
    if (added === 0) {
        this._state.wrongGuesses++;
    }
    return indices;
};

SimpleHangman.prototype.isWordGuessed = function() {
    var isComplete = this._state.word.length === this._state.knownIndices.length;
    return isComplete;
};

SimpleHangman.prototype.getWrongCount = function() {
    trace('wrong count is '+this._state.wrongGuesses);
    return this._state.wrongGuesses;
};

// Private
/**
 * Get a new random word
 *
 * @return {undefined}
 */
SimpleHangman.prototype._restart = function() {
    var index = Math.floor(Math.random()*words.length);
    this._state.word = words[index];
    this._state.wrongGuesses = 0;
    this._state.knownIndices = [];
};

SimpleHangman.getAllIndices = function(word, letter) {
    var index = word.indexOf(letter),
        offset = 0,
        indices = [];

    while (index > -1) {
        indices.push(index+offset);
        offset += index + 1;
        word = word.substring(index+1);
        index = word.indexOf(letter);
    }

    return indices;
};

SimpleHangman.merge = function(array1, array2) {
    var added = 0;
    for (var i = array2.length; i--;){
        if (array1.indexOf(array2[i]) === -1) {
            array1.push(array2[i]);
            ++added;
        }
    }
    return added;
};

module.exports = SimpleHangman;
