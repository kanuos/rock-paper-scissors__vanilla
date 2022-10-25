// UI is a singleton object
// this file exposes a UI object that gives access to public methods
// this file is responsible for all DOM events
// this file is responsible for all DOM painting

import {
  GAME_CLASSES,
  GAME_TYPES,
  HAND_BUTTON_NAME,
  LOGO,
  RULES,
  VISIBILITY,
} from "./constants";
import { HandType, IGameType, IPlayResult } from "./interfaces";

class UI {
  // state for header elements
  #scoreEl: HTMLHeadingElement;
  #gameTypeImg: HTMLImageElement;
  #gameTypeToggler: HTMLButtonElement;
  #gameTypeARIA: HTMLSpanElement;
  // state for modal elements
  #ruleModalBtn: HTMLButtonElement;
  #ruleModal: HTMLDialogElement;
  #modalImg: HTMLImageElement;
  // state for game hand selectors
  #handSelectors: NodeListOf<HTMLButtonElement>;
  #gameBoardType: HTMLElement;

  #gameBoardUIContainer: HTMLElement;
  #gameResultContainer: HTMLElement;

  #gameResultText: HTMLHeadingElement;
  // new game btn
  #newGameBtn: HTMLButtonElement;

  // result elements
  #userContainer: HTMLElement;
  #houseContainer: HTMLElement;
  #userImg: HTMLImageElement;
  #houseImg: HTMLImageElement;

  // PUBLIC methods and constructor

  constructor() {
    // header elements
    this.#scoreEl = document.getElementById("score") as HTMLHeadingElement;
    this.#gameTypeImg = document.getElementById("logoImg") as HTMLImageElement;
    this.#gameTypeToggler = document.getElementById(
      "gameTypeToggler"
    ) as HTMLButtonElement;
    this.#gameTypeARIA = document.getElementById("logoText") as HTMLSpanElement;

    // rules modal elements
    this.#ruleModalBtn = document.getElementById(
      "showRuleBtn"
    ) as HTMLButtonElement;
    this.#ruleModal = document.getElementById(
      "gameRuleModal"
    ) as HTMLDialogElement;
    this.#modalImg = document.getElementById("gameRuleImg") as HTMLImageElement;

    // game elements
    this.#gameBoardType = document.getElementById("gameBoard") as HTMLElement;
    this.#handSelectors = document.querySelectorAll(
      ".game-control"
    ) as NodeListOf<HTMLButtonElement>;

    this.#gameBoardUIContainer = document.getElementById(
      "gameContainer"
    ) as HTMLElement;
    this.#gameResultContainer = document.getElementById(
      "gameResultContainer"
    ) as HTMLElement;

    this.#gameResultText = document.getElementById(
      "gameResult"
    ) as HTMLHeadingElement;

    this.#newGameBtn = document.getElementById("newGame") as HTMLButtonElement;

    this.#userContainer = document.getElementById("user") as HTMLElement;
    this.#houseContainer = document.getElementById("house") as HTMLElement;
    this.#userImg = document.getElementById("user__img") as HTMLImageElement;
    this.#houseImg = document.getElementById("house__img") as HTMLImageElement;
  }

  /**
   * @desc this method is responsible for showing/hiding the rules modal
   */
  public toggleRulesModal(gameType: IGameType) {
    if (this.#ruleModal.open) {
      this.#ruleModal.close();
      return;
    }
    this.updateRuleImage(gameType);
    this.#ruleModal.showModal();
  }

  /**
   * @param gameType - IGameType i.e can be only "rps" or "rpsls"
   * @param score - number represents the score for gameType
   * @desc method is responsible for painting the header
   * section elements. It is used for the following actions:
   * 1. update the score for appropriate game type
   * 2. update the logo and logoText for game type
   */
  public paintHeader(gameType: IGameType, score: number) {
    // 1. update the score for appropriate game type
    this.#scoreEl.textContent = score.toString();
    // 2. update the logo and logoText for game type
    this.#gameTypeImg.setAttribute("src", LOGO[gameType]);
    this.#gameTypeImg.setAttribute("alt", gameType);
    this.#gameTypeARIA.textContent = gameType;
  }

  /**
   *
   * @desc
   *  this method performs the following actions:
   *  - updates the game board background -> "pentagon" or "triangle"
   *  - shows available hands based on game type
   *  - if gameType is "rps" => shows 'rock', 'paper' and 'scissors' handles
   *  - if gameType is "rpsls" => shows 'rock', 'paper', 'scissors', 'lizard' and 'spock' handles
   * @param gameType IGameType i.e. "rps" or "rpsls"
   * @returns nothing
   *
   */
  public toggleGameMode(gameType: IGameType): void {
    const { classList } = this.#gameBoardType;
    if (gameType === "rps") {
      classList.remove(GAME_TYPES.bonus);
      if (!classList.contains(GAME_TYPES.original)) {
        classList.add(GAME_TYPES.original);
      }
      return;
    }
    classList.remove(GAME_TYPES.original);
    if (!classList.contains(GAME_TYPES.bonus)) {
      classList.add(GAME_TYPES.bonus);
    }
    return;
  }

  /**
   *
   * @param btn receives a btn which belongs to the gameHandSelectors.
   * @desc every hand button has a data attribute that represents the name of the hand e.g 'rock', 'paper' etc.
   * this method returns that name
   * @returns the name of the button
   */
  public getHandInfo(btn: HTMLButtonElement): HandType {
    return btn.dataset[HAND_BUTTON_NAME] as HandType;
  }

  /**
   * @desc this method is responsible for the following actions:
   *  - hides the game board
   *  - shows the result section
   *  - shows the initial user and house placeholder
   *  - hides the house placeholder and shows the house hand
   *  - declares the game result and the new game button
   * @param res IPLayResult containing userHand, houseHand, resultText, score and gameType
   */
  public async showResultUI(res: IPlayResult) {
    this.hideGameBoard();
    this.showGameResult();

    // Hide the newGame button initially and show it once the results are out
    if (!this.#newGameBtn.classList.contains("hide")) {
      this.#newGameBtn.classList.add("hide");
    }
    this.#gameResultText.textContent = "";
    // remove all the game related classes from user as well as house
    removeAllGameClasses(this.#userContainer);
    removeAllGameClasses(this.#houseContainer);

    // add classes to user based on hand user selected
    // show user img and house placeholder
    this.#userContainer.classList.add(res.user);
    this.#userImg.setAttribute("src", `images/icon-${res.user}.svg`);
    this.#userImg.setAttribute("alt", res.user);

    // show the placeholder image for 2s
    // after 2 seconds remove the placeholder and add the house specific class to create suspense/curiosity
    await promisifyTimeout(() => {
      this.#houseImg.setAttribute("src", `images/icon-${res.house}.svg`);
      this.#houseImg.setAttribute("alt", res.house);
      this.#houseContainer.classList.remove("placeholder");
      this.#houseContainer.classList.add(res.house);
      // add winner class to house or user
      // show result in text
      this.#gameResultText.textContent = res.result;
      if (res.result === "you win") {
        this.#userContainer.classList.add("winner");
        this.#houseContainer.classList.add("loser");
      }
      else if (res.result === "you lose") {
        this.#userContainer.classList.add("loser");
        this.#houseContainer.classList.add("winner");
      }

      // remove the hide class from new game btn i.e make it visible
      this.#newGameBtn.classList.remove("hide");

      // update the header UI
      this.paintHeader(res.type, res.score)

    }, 2000);

  }

  /**
   * @desc this method hides the game result UI and shows the game board UI
   */
  public showGameBoardUI() {
    this.hideGameResult();
    this.showGameBoard();
    if (!this.#houseContainer.classList.contains("placeholder")) {
      this.#houseContainer.classList.add("placeholder");
    }

    this.#gameResultText.textContent = "";
    this.#newGameBtn.classList.add("hide");
    // remove all game based classes that determine winner-loser and result specific classes
    removeAllGameClasses(this.#userContainer);
    removeAllGameClasses(this.#houseContainer);
  }

  /**
   * @param gameType IGameType i.e can be only "rps" or "rpsls"
   * @desc this method is responsible for updating the rule Image i.e rules for bonus or original game mode
   */
  private updateRuleImage(gameType: IGameType) {
    this.#modalImg.setAttribute("src", RULES[gameType]);
    this.#modalImg.setAttribute("alt", gameType);
  }

  // PRIVATE METHODS : accessible by class variables and methods

  /**
   * this method shows the game board
   */
  private showGameBoard() {
    toggleClassList(this.#gameBoardUIContainer, VISIBILITY.on, VISIBILITY.off);
  }

  /**
   * this method hides the game board
   */
  private hideGameBoard() {
    toggleClassList(this.#gameBoardUIContainer, VISIBILITY.off, VISIBILITY.on);
  }

  /**
   * this method shows the game result section
   */
  private showGameResult() {
    toggleClassList(this.#gameResultContainer, VISIBILITY.on, VISIBILITY.off);
  }

  /**
   * this method hides the game result section
   */
  private hideGameResult() {
    toggleClassList(this.#gameResultContainer, VISIBILITY.off, VISIBILITY.on);
  }

  // getters - get the game Toggler btn
  public get gameToggleBtn(): HTMLButtonElement {
    return this.#gameTypeToggler;
  }

  public get ruleModalToggleBtn(): HTMLButtonElement {
    return this.#ruleModalBtn;
  }

  public get gameHandSelectors(): NodeListOf<HTMLButtonElement> {
    return this.#handSelectors;
  }

  public get newGameBtn(): HTMLButtonElement {
    return this.#newGameBtn;
  }
}

/**
 * @desc a util function to add and remove classes to DOM element
 * @param el HTML DOM element
 * @param add single class string that will be added
 * @param remove single class string that will be removed
 */
function toggleClassList(el: HTMLElement, add: string, remove: string) {
  if (!el.classList.contains(add)) {
    el.classList.add(add);
  }
  el.classList.remove(remove);
}

/**
 *
 * @param cb a callback function that will be executed asynchronously
 * @param timeout duration of execution in milliseconds
 * @returns a promise which can be awaited using async or chained by .then
 */
function promisifyTimeout(cb: TimerHandler, timeout: number) {
  return Promise.resolve(setTimeout(cb, timeout));
}

/**
 *
 * @desc this function removes all existing game classes i.e 'rock', 'paper', 'scissors', 'lizard' or 'spock'
 * the function ensures that there's no DOM element with multiple HAND-Classes
 * Eg. no element at any time can have 'rock' and 'spock' classes.
 * @param el a DOM element
 */
function removeAllGameClasses(el: HTMLElement) {
  console.log(el.id, el.classList);
  const { classList } = el;
  classList.forEach((cls) => {
    if (GAME_CLASSES.includes(cls)) {
      console.log(`remove ${cls} from ${classList}`);
      classList.remove(cls);
    }
  });
}

export const uiController = new UI();
