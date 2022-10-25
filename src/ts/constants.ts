import { IGameType } from "./interfaces";

export const LOGO: { [k in IGameType]: string } = {
  rps: "./images/logo.svg",
  rpsls: "./images/logo-bonus.svg",
};

export const RULES: { [K in IGameType]: string } = {
  rps: "/images/image-rules.svg",
  rpsls: "/images/image-rules-bonus.svg",
};


export const GAME_TYPES = {
  original: "original",
  bonus: "bonus"
}

export const HAND_BUTTON_NAME = "hand";

export const VISIBILITY = {
  on: 'show',
  off: 'hide'
};

export const GAME_CLASSES = ["rock", "paper", "scissors", "lizard", "spock", "winner", "loser"];