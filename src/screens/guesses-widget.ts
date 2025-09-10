import { GameObject, get_distribution } from "../game-engine";
import { GameState, PotionGuess } from "../state";
import { BaseLayout } from "../layout";
import { PotionWidget } from "./potion-widget";
import { Container, Graphics, Sprite } from "pixi.js";
import { Colors } from "../palette";
import { autorun, observable } from "mobx";
import { GuessWidget } from "./guess-widget";
import { AssetDB } from "../asset-db";
import { Tween, Easing } from "@tweenjs/tween.js";

export class GuessesWidget extends GameObject {
  // 152px / 2340px screen height = 0.06495726496
  // 0.06495726496 * (390 x 844) = 54.8239316262 (aka 54)
  static _layout = observable({
    ...BaseLayout,
    width: BaseLayout.screenWidth,
    height: BaseLayout.screenHeight / 1.61,
  });
  get layout() {
    return GuessesWidget._layout;
  }

  grid: GuessesGrid;

  async onCreate(state: GameState) {
    await super.onCreate();

    const l = this.layout;

    this.grid = await this.create(GuessesGrid, state);
    this.attach(this.grid);

    autorun(() => {
      this.grid.x = (l.width - this.grid.width) * 0.5;
      this.grid.y = (l.height - this.grid.height) * 0.5;
    });
  }
}

class GuessesGrid extends GameObject {
  static _layout = observable({
    ...BaseLayout,
    width: 390,
    height: 640,
  });
  state: GameState;
  get layout() {
    return GuessesWidget._layout;
  }

  _height = 0;
  get height(): number {
    return this._height;
  }
  _width = 0;
  get width(): number {
    return this._width;
  }

  async onCreate(state: GameState) {
    await super.onCreate();

    this.content = new Container();

    const highlight = new Graphics();

    this.attach(highlight);

    const widgets = await Promise.all(
      state.guesses.map(async (guess, guess_index, list) => {
        const shelf = await this.create(GuessRow, guess, guess_index);
        this.attach(shelf);

        shelf.y = (list.length - guess_index - 1) * shelf.layout.height;
        this._width = shelf.layout.width;
        this._height = shelf.layout.height * state.guesses.length;
        return shelf;
      }),
    );

    autorun(() => {
      const gi = state.guessIndex;
      if (gi < widgets.length) {
        const widget = widgets[gi];

        highlight
          .clear()
          .beginFill(Colors.Header, 0.15)
          .drawRect(0, 0, widget.layout.width, widget.layout.height)
          .endFill();

        new Tween(highlight)
          .to(
            {
              y: widget.y,
            },
            550,
          )
          .easing(Easing.Back.InOut)
          .start();
      }
    });
  }
}

export class GuessRow extends GameObject {
  static _layout = {
    width: 706,
    height: 160,
    margin: 100,
    resultsGap: 20,
  };

  get layout() {
    return GuessRow._layout;
  }

  async onCreate(guess: PotionGuess) {
    await super.onCreate();

    const l = this.layout;
    const shelf = new Sprite(AssetDB.instance.getTexture("Wooden_Shelf"));
    shelf.y = l.height - shelf.height;
    this.attach(shelf);

    const shelfWidth = l.width;

    await Promise.all(
      guess.ingredients.map(async (val, potion_index, list) => {
        const widget = await this.create(
          PotionWidget,
          guess.ingredients,
          potion_index,
        );

        widget.x = get_distribution(
          list.length,
          potion_index,
          shelfWidth,
          l.margin,
        );
        widget.y = l.height - shelf.height;

        this.attach(widget);

        return widget;
      }),
    );

    const resultWidget = await this.create(GuessRowResult, guess);

    resultWidget.x = this.layout.width + this.layout.resultsGap;
    resultWidget.y = this.layout.height - shelf.height - resultWidget.height;

    autorun(() => {
      if (guess.isSubmitted) {
        this.attach(resultWidget);
      } else {
        this.detach(resultWidget);
      }
    });
  }
}

class GuessRowResult extends GameObject {
  static _layout = {
    width: 98,
    height: 96,

    checkGapX: 10,
    checkGapY: 8,
  };

  get layout() {
    return GuessRowResult._layout;
  }

  async onCreate(guess: PotionGuess) {
    await super.onCreate();

    const l = this.layout;

    const shadow = new Sprite(AssetDB.instance.getTexture("Guess_Shadow"));
    shadow.position.set(9, 6);
    this.attach(shadow);

    const frame = new Sprite(AssetDB.instance.getTexture("Guess_Board"));
    this.attach(frame);

    const nail = new Sprite(AssetDB.instance.getTexture("Guess_Nail"));
    nail.position.set(36, -20);
    this.attach(nail);

    const checks = new Container();
    this.attach(checks);
    await guess.ingredients.map(async (ingredient, i) => {
      const check = await this.create(GuessWidget, guess, i);

      checks.addChild(check.content);

      check.position.set(
        (i % 2) * (check.layout.width + l.checkGapY),
        Math.floor(i / 2) * (check.layout.height + l.checkGapX),
      );
    });

    checks.x = 20;
    checks.y = 20;
  }
}
