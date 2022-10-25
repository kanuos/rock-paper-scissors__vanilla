export type IGameType = "rps" | "rpsls";

export enum HANDS {
  rock = "Rock",
  paper = "Paper",
  scissors = "Scissors",
  lizard = "Lizard",
  spock = "Spock",
}

export type HandType = "rock" | "paper" | "scissors" | "lizard" | "spock";

export interface GameState {
  score: number;
  type: IGameType;
}


export type GameResults = "you win" | "you lose" | "draw";


export interface IPlayResult {
  user: HandType,
  house: HandType,
  result: GameResults,
  score: number,
  type: IGameType
}