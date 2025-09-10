import { GameObject, KeyDownHandler } from "../game-engine";
import { GuessesWidget } from "./guesses-widget";
import { createGameState, GameResult } from "../state";
import { InputWidget } from "./input-widget";
import { action, autorun, runInAction } from "mobx";
import { StatusWidget } from "./status-widget";
import { HeaderWidget } from "./header-widget";
import { GameLayout } from "../layout";
import { Application, Graphics } from "pixi.js";
import { Colors } from "../palette";
import { ResultPotionWidget } from "./ResultPotionWidget";
import { ShareResultsWidget } from "./ShareResultsWidget";
import { FooterBackgroundWidget } from "./FooterBackgroundWidget";
import { ConnectWalletWidget } from "./ConnectWalletWidget";
import { Tween, Easing } from "@tweenjs/tween.js";

export class PotionScreen extends GameObject {
  app: Application;

  async onCreate(app: Application) {
    this.app = app;
    await super.onCreate();

    const state = createGameState();

    const gl = GameLayout;

    const header = await this.create(HeaderWidget, state);
    const background = await this.create(Graphics);
    const blackbar_bottom = await this.create(Graphics);
    const status = await this.create(StatusWidget, state);
    const guesses = await this.create(GuessesWidget, state);
    const footer = await this.create(FooterBackgroundWidget);
    const connect_wallet = await this.create(ConnectWalletWidget);
    const input = await this.create(InputWidget, state);

    const resultPotion = await this.create(ResultPotionWidget);
    const share = await this.create(ShareResultsWidget);
    // input.connectWallet();
    // const share = await this.create(WalletWidget);

    runInAction(() => {
      guesses.layout.height =
        gl.targetHeight -
        (input.layout.height + header.layout.height + status.layout.height);
    });

    autorun(() => {
      background
        .clear()
        .beginFill(Colors.Background)
        .drawRect(0, 0, gl.targetWidth, gl.targetHeight)
        .endFill();
      blackbar_bottom
        .clear()
        .beginFill(Colors.ClearDraw)
        .drawRect(0, 0, gl.targetWidth, gl.targetHeight)
        .endFill();

      status.y = header.layout.height;
      guesses.y = status.y + status.layout.height;
      input.y = gl.targetHeight - input.layout.height;

      resultPotion.y = 320;
      share.y = 884;

      connect_wallet.y = 1384;

      blackbar_bottom.y = gl.targetHeight;
    });

    autorun(() => {
      if (state.gameResult == GameResult.Won) {
        console.log("WINNER WINNER CHICKEN DINNER");
      } else if (state.gameResult == GameResult.Lost) {
        new Tween({})
          .to({}, 5000)
          .onComplete(() => {
            beginGameEndReaction();
          })
          .start();
      } else {
        resultPotion.hide();
        share.hide();
        connect_wallet.hide();

        footer.y = input.y;
      }
    });

    this.attach(background);
    this.attach(footer);
    this.attach(guesses);
    this.attach(resultPotion);
    this.attach(connect_wallet);
    this.attach(share);
    this.attach(input);
    this.attach(status);
    this.attach(header);
    this.attach(blackbar_bottom);

    this.addEventListener("resize", this.onResize);
    this.onResize();

    KeyDownHandler.create(
      "l",
      action(() => {
        console.log("keydown bby");
      }),
    );

    function beginGameEndReaction() {
      resultPotion.x = gl.targetWidth * 0.5;
      new Tween(resultPotion)
        .to(
          {
            x: 0,
          },
          500,
        )
        .easing(Easing.Back.Out)
        .start();
      resultPotion.show();

      share.x = -gl.targetWidth * 0.5;
      new Tween(share)
        .to(
          {
            x: 0,
          },
          500,
        )
        .easing(Easing.Back.Out)
        .start();
      share.show();

      connect_wallet.y = 1384 + gl.targetHeight * 0.25;
      new Tween(connect_wallet)
        .to(
          {
            y: 1384,
          },
          500,
        )
        .easing(Easing.Quartic.Out)
        .start();
      connect_wallet.show();

      // footer.y = connect_wallet.y;
      new Tween(footer)
        .to(
          {
            y: 1384,
          },
          500,
        )
        .easing(Easing.Quartic.Out)
        .start();

      input.hide();
      guesses.hide();
      status.hide();
    }
  }

  beginGameEndReaction() {
    throw new Error("Method not implemented.");
  }

  _bind() {
    this.onTick = this.onTick.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  onTick(delta: number) {
    super.onTick(delta);
  }

  onResize() {
    console.log("onresize");

    const gl = GameLayout;

    const w = this.app.renderer.width / this.app.renderer.resolution;
    const h = this.app.renderer.height / this.app.renderer.resolution;

    const scale = Math.min(w / gl.targetWidth, h / gl.targetHeight);

    console.log(scale);
    this.content.scale.set(scale, scale);

    this.content.x = Math.floor((w - this.content.width) * 0.5);
  }
}
