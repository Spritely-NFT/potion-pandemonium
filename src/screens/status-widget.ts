import { GameObject, get_distribution } from "../game-engine";
import { action, autorun, makeAutoObservable, observable } from "mobx";
import { Container, Graphics, ITextStyle, Sprite, Text, Ticker } from "pixi.js";
import { AssetDB } from "../asset-db";
import { GameResult, GameState } from "../state";
import { Colors } from "../palette";
import { BaseLayout } from "../layout";
import { PotionWidget } from "./potion-widget";
import { GuessRow } from "./guesses-widget";
import { Tween } from "@tweenjs/tween.js";

export class StatusWidget extends GameObject {
  // 152px / 2340px screen height = 0.06495726496
  // 0.06495726496 * (390 x 844) = 54.8239316262 (aka 54)
  static _layout = observable({
    ...BaseLayout,
    width: BaseLayout.screenWidth,
    height: 220,
  });
  get layout() {
    return StatusWidget._layout;
  }

  async onCreate(state: GameState) {
    await super.onCreate();

    const l = this.layout;

    const bg = (this.content = new Graphics());

    const timer = await this.create(TimeWidget);
    this.attach(timer);

    const al = new Sprite(AssetDB.instance.getTexture("Al's_Recipe_Card"));
    this.attach(al);

    const shelfLayout = GuessRow._layout;
    const shelf = new Container();
    const answerWidgets = await Promise.all(
      state.visibleAnswer.map(async (val, potion_index, list) => {
        const widget = await this.create(
          PotionWidget,
          state.visibleAnswer,
          potion_index,
        );

        widget.x = get_distribution(
          list.length,
          potion_index,
          shelfLayout.width,
          shelfLayout.margin,
        );
        // widget.y = l.height;

        shelf.addChild(widget.content);

        return widget;
      }),
    );

    this.attach(shelf);

    autorun(() => {
      const visibleAnswer = state.visibleAnswer;

      for (let i = 0; i < answerWidgets.length; i++) {
        answerWidgets[i].setPotion(visibleAnswer[i]);
      }
    });

    autorun(() => {
      if (
        state.gameResult == GameResult.Won ||
        state.gameResult == GameResult.Lost
      ) {
        const finalcountdown = new Tween({}).to({}, 1000);

        const delays = answerWidgets.map((w, i) => {
          return new Tween({}).to({}, 500 * i).onComplete(() => {
            answerWidgets[i].setPotion(state.answer[i]);
          });
        });

        finalcountdown.chain(...delays).start();
      }
    });

    autorun(() => {
      bg.clear()
        .beginFill(Colors.Status)
        .drawRect(0, 0, l.width, l.height)
        .endFill();

      shelf.x = (l.width - shelfLayout.width) * 0.5;
      shelf.y = (l.height + shelf.height) * 0.5;

      // this.grid.x = (l.width - this.grid.width) * 0.5;
      // this.grid.y = (l.height - this.grid.height) * 0.5;

      timer.x = l.screenMargin;
      timer.y = l.height * 0.5;

      al.x = Math.floor(l.width - (al.width - l.shadowOffset) - l.screenMargin);
      al.y = Math.floor(shelf.y - (al.height - l.shadowOffset));
    });
  }
}

class TimeWidget extends GameObject {
  async onCreate(state: GameState) {
    await super.onCreate();
    const textStyle: Partial<ITextStyle> = {
      fontFamily: "Press Start 2P",
      fontSize: 25,
      lineHeight: 25,
      fontWeight: "400",
      fill: 0xffffff,
      align: "left",
    };
    const text = new Text("Hello World", textStyle);
    this.attach(text);

    const timer = new TimeTracker();

    timer.start();

    autorun(() => {
      text.text = timer.text;
    });
  }
}

class TimeTracker {
  elapsedMS: number = 0;

  constructor() {
    makeAutoObservable(this, {
      onTick: action.bound,
    });
  }

  start() {
    this.elapsedMS = 0;
    Ticker.shared.add(this.onTick);
  }

  stop() {
    Ticker.shared.remove(this.onTick);
  }

  onTick(deltaTime: number) {
    this.elapsedMS += Ticker.shared.deltaMS;
  }

  get text(): string {
    const output = millisecondsToHHMMSS(this.elapsedMS);
    return `${output}`;
  }
}

// https://stackoverflow.com/a/6313008
function millisecondsToHHMMSS(ms: number) {
  var sec_num = Math.floor(ms / 1000);
  var hours: any = Math.floor(sec_num / 3600);
  var minutes: any = Math.floor((sec_num - hours * 3600) / 60);
  var seconds: any = sec_num - hours * 3600 - minutes * 60;

  return hours
    ? String(hours).padStart(2, "0") + ":"
    : "" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}
