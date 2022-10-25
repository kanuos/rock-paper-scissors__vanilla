import { GameResults, GameState, HandType, IGameType, IPlayResult } from "./interfaces";
import { database as store } from "./storage";

export class Game {
  #___type: IGameType = "rps";
  #___score: number = 0;
  #__database: Storage = window.sessionStorage;

  constructor(database: Storage) {
    this.database = database;
    this.score = (
      store.get(this.database).find((el) => el.type === this.type) as GameState
    ).score;
  }

  public set type(v: IGameType) {
    this.#___type = v;
  }
  public set score(v: number) {
    // only accepts integers. Min can be negative too.
    this.#___score = Math.round(v);
  }
  public set database(v: Storage) {
    this.#__database = v;
  }
  public get type(): IGameType {
    return this.#___type;
  }
  public get score(): number {
    return this.#___score;
  }
  public get database(): Storage {
    return this.#__database;
  }

  // user clicks on a button i.e selects a hand
  play(user: HandType): IPlayResult {
    let availableHands: HandType[] = ["rock", "paper", "scissors"];
    if (this.type === "rpsls") {
      availableHands = [...availableHands, "lizard", "spock"];
    }

    // pick a random index between 0 and the length of available hands
    const randomHouseHandIndex =
      Math.round(Math.random() * availableHands.length) % availableHands.length;
    const house = availableHands.at(randomHouseHandIndex) as HandType;

    // game result
    const result = this.calculateGameResult(
      user,
      house
    );
    let scoreBeforeOperation = this.score;

    if (result === "you win") {
      // update score
      this.score++;
    } else if (result === "you lose") {
      this.score--;
    }

    if (scoreBeforeOperation !== this.score) {
      const currentState: GameState = {
        score: this.score,
        type: this.type,
      };

      // update store
      store.set(this.database, currentState);
    }

    return {
      user,
      house,
      result,
      score: this.score,
      type: this.type
    }

  }

  // determines game result
  private calculateGameResult(user: HandType, house: HandType): GameResults {
    // draw situation
    if (user === house) {
      return "draw";
    }
    // all cases where user wins
    if (user === "rock") {
      if (house === "lizard" || house === "scissors") {
        return "you win";
      }
    }

    if (user === "paper") {
      if (house === "rock" || house === "spock") {
        return "you win";
      }
    }

    if (user === "scissors") {
      if (house === "paper" || house === "lizard") {
        return "you win";
      }
    }

    if (user === "lizard") {
      if (house === "spock" || house === "paper") {
        return "you win";
      }
    }

    if (user === "spock") {
      if (house === "rock" || house === "scissors") {
        return "you win";
      }
    }

    return "you lose";
  }

  // toggle between original and bonus game
  toggleGameType() {
    this.type = this.type === "rps" ? "rpsls" : "rps";
    this.score = (
      store.get(this.database).find((el) => el.type === this.type) as GameState
    ).score;
  }
}

