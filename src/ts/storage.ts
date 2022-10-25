import { GameState } from "./interfaces";

const KEY: string = "R_P_S_L_S";

const INIT_STATE: GameState[] = [
  {
    type: "rps",
    score: 0,
  },
  {
    type: "rpsls",
    score: 0,
  },
];

function getCachedState(DB: Storage): GameState[] {
  const cachedState = DB.getItem(KEY);
  if (!cachedState) {
    DB.setItem(KEY, JSON.stringify(INIT_STATE));
    return INIT_STATE;
  }
  return JSON.parse(cachedState) as GameState[];
}

function setCachedState(DB: Storage, state: GameState): void {
  const previousState = getCachedState(DB);
  const updatedState = previousState.map(({ type, score }) =>
    type !== state.type ? { type, score } : state
  );
  DB.setItem(KEY, JSON.stringify(updatedState));
}

export const database = {
  get: getCachedState,
  set: setCachedState,
};
