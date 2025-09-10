import { rand_range_int, KeyDownHandler } from "./game-engine";
import { makeAutoObservable, action } from "mobx";

export enum GameResult {
  Unknown = 0,
  InProgress,
  Won,
  Lost,
}

export enum PotionType {
  Empty = 0,
  Answer,
  Mushtopia,
  Aquatica,
  Doomsdom,
  OuterLimit,
  Mysterium,
  Void,
}

export type PotionTypes = keyof typeof PotionType;
export type PotionIngredients = PotionType[];

export enum PotionGuessResult {
  Unknown = 0,
  Miss,
  Near,
  Correct,
}

export class PotionGuess {
  ingredients: PotionIngredients;

  isCurrent = false;

  isSubmitted = false;

  private answer: PotionIngredients;

  constructor(size: number, answer: PotionIngredients = null) {
    this.ingredients = new Array(size).fill(PotionType.Empty);
    this.answer = answer;
    makeAutoObservable(this);
  }

  get result() {
    const r = [];

    const answerCopy = this.answer.slice();
    const thisCopy = this.ingredients.slice();
    for (let i = 0; i < this.answer.length; i++) {
      const index = answerCopy.indexOf(this.ingredients[i]);
      if (this.ingredients[i] == this.answer[i] && index > -1) {
        r.push(PotionGuessResult.Correct);
        answerCopy.splice(index, 1);
        thisCopy.splice(index, 1);
      }
    }
    let i = 0;
    while (i < answerCopy.length) {
      const index = thisCopy.indexOf(answerCopy[i]);
      if (index > -1) {
        r.push(PotionGuessResult.Near);
        answerCopy.splice(i, 1);
        thisCopy.splice(index, 1);
      } else {
        i++;
      }
    }

    while (r.length < this.answer.length) {
      r.push(PotionGuessResult.Miss);
    }

    return r;
  }

  clear() {
    for (let i = 0; i < this.ingredients.length; i++) {
      this.ingredients[i] = PotionType.Empty;
    }
  }

  copyFrom(guess: PotionGuess) {
    for (let i = 0; i < this.ingredients.length; i++) {
      this.ingredients[i] = guess.ingredients[i];
    }
  }
}

export class GameState {
  answer: PotionIngredients;

  guesses: PotionGuess[];

  guessIndex = 0;

  cheats: Cheats;

  get currentGuess(): PotionGuess {
    if (this.guessIndex < this.guesses.length) {
      return this.guesses[this.guessIndex];
    }
    return null;
  }

  get visibleAnswer(): PotionIngredients {
    if (this.cheats.showAnswer) {
      return this.answer.concat();
    }
    return this.answer.map(() => PotionType.Answer);
  }

  // FIXME: only react to guessIndex?
  get gameResult(): GameResult {
    if (this.guessIndex == 0) {
      return GameResult.InProgress;
    }

    const lastGuess = this.guesses[this.guessIndex - 1];
    const win = lastGuess.result.every((r) => r == PotionGuessResult.Correct);
    if (win) {
      return GameResult.Won;
    }

    if (this.guessIndex >= this.guesses.length) {
      return GameResult.Lost;
    }

    return GameResult.InProgress;
  }

  constructor(answer: PotionIngredients, options: GameOptions) {
    this.answer = answer;
    this.guesses = new Array(options.numGuesses)
      .fill(0)
      .map(() => new PotionGuess(this.answer.length, answer));
    this.cheats = new Cheats();
    this.guesses[0].isCurrent = true;
    makeAutoObservable(this, {
      cheats: false,
    });
  }

  submitCurrentGuess(): boolean {
    console.log("submitting");
    if (this.guessIndex >= this.guesses.length) {
      return false;
    }

    this.guesses[this.guessIndex].isSubmitted = true;
    this.guesses[this.guessIndex].isCurrent = false;
    this.guessIndex++;
    if (this.guessIndex < this.guesses.length) {
      this.guesses[this.guessIndex].isCurrent = true;
    }
    return true;
  }
}

interface GameOptions {
  numGuesses: number;
  potionSize: number;
  isDaily: boolean;
  allowDuplicates: boolean;
}

const defaultGameOptions: GameOptions = {
  numGuesses: 8,
  potionSize: 4,
  isDaily: true,
  allowDuplicates: true, // TODO: disallow duplicates
};

export function createGameState() {
  const options: GameOptions = {
    ...defaultGameOptions,
    // numGuesses: 1,
  };
  const answer = generateAnswer(options);
  const state = new GameState(answer, options);

  // state.guesses[0].ingredients = [
  //     PotionType.Mushtopia,
  //     PotionType.Mysterium,
  //     PotionType.OuterLimit,
  //     PotionType.Mushtopia,
  // ]
  // state.guessIndex++;
  // state.guesses[1].ingredients = [
  //     PotionType.Mysterium,
  //     PotionType.OuterLimit,
  //     PotionType.Mushtopia,
  //     PotionType.Void,
  // ]
  // state.guessIndex++;

  return state;
}

export function generateAnswer(options: GameOptions): PotionIngredients {
  const answer = new Array(options.potionSize).fill(0).map(() => {
    const i = 2 + rand_range_int(0, 6);
    const t = i as PotionType;
    return t;
  });

  // console.log("Generated Answer:", answer.map(i => PotionType[i]));

  return answer;
}

class Cheats {
  showAnswer = false;

  constructor() {
    KeyDownHandler.create(
      "c",
      action("cheat-keydown", () => {
        this.toggleCheats();
      }),
    );
    makeAutoObservable(this);
  }

  toggleCheats() {
    this.showAnswer = !this.showAnswer;
  }
}
