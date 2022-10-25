// this file is the controller that acts as the mediator between UI, Game and Storage classes
import { Game } from "./ts/game"
import { uiController } from "./ts/UI"
const database = window.localStorage;

// initialize the game object
// pass the database object to the constructor
// sets the initial game state based on stored data
const game = new Game(database);

// DOM UI interactive elements
const gameToggler = uiController.gameToggleBtn;
const ruleToggler = uiController.ruleModalToggleBtn;
const gameHandSelectors = uiController.gameHandSelectors;
const newGameBtn = uiController.newGameBtn;

window.addEventListener("load", () => {
  // update the header with game variables
  uiController.paintHeader(game.type, game.score);
});


// change the game type from-to "bonus" to "original" mode
gameToggler.addEventListener("click", () => {
  // change the game type using the game object
  game.toggleGameType();
  uiController.toggleGameMode(game.type)
  // update the UI accordingly
  uiController.paintHeader(game.type, game.score);

})

gameHandSelectors.forEach(hand => {
  hand.addEventListener("click", () => {
    // selectedHand represents the button name -> 'rock', 'paper', 'scissors', 'lizard', 'spock'
    const selectedHand = uiController.getHandInfo(hand);
    const res = game.play(selectedHand);
    // game result containing userHand, houseHand, gameType, finalScore, game result in text

    uiController.showResultUI(res);
  })
})

// toggle the rules modal for current game type
ruleToggler.addEventListener("click", () => uiController.toggleRulesModal(game.type))


// start a new game
newGameBtn.addEventListener("click", () => {
  uiController.showGameBoardUI()
})