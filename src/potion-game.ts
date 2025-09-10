import { BaseGame, Delay } from "./game-engine";
import { Loader, LoaderResource } from "pixi.js";
import { Dict } from "@pixi/utils";

import { PotionScreen } from "./screens/potion-screen";
import { update as TWEEN_update } from "@tweenjs/tween.js";
import { AssetDB } from "./asset-db";

// if (!new class { x }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly for mobx');

export class PotionGame extends BaseGame {
  assetDb: AssetDB;
  currentScreen: PotionScreen;

  constructor() {
    super();
    this.create(
      Delay,
      async () => {
        this.assetDb = await this.create(AssetDB);
        this.assetDb.load(this.onLoad);
      },
      0.1,
    );
  }

  async onCreate() {
    await super.onCreate();

    // const l = this.layout;
    // const bg = new Graphics();
    // bg.beginFill(0xff0000)
    //     .drawRect(0, 0, 80, 80)
    //     .endFill()
    //     .beginFill(0x0ff000)
    //     .drawRect(l.pad, l.pad, l.targetWidth - (l.pad * 2), l.targetHeight - (l.pad * 2))
    //     .endFill()
    // this.app.stage.addChild(bg);

    this.addEventListener("resize", this.onResize);
  }

  _bind() {
    super._bind();
    this.onTick = this.onTick.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  onResize(e) {
    // this.app.renderer.resize(
    //     this.layout.targetWidth,
    //     this.layout.targetHeight,
    // );
    // this.app.renderer.resize(
    //     this.app.renderer.view.parentNode.clientWidth,
    //     this.app.renderer.view.parentNode.clientHeight
    // );

    if (this.currentScreen) {
      this.currentScreen.dispatchEvent(new Event("resize"));
    }
  }

  onTick(delta: number) {
    super.onTick(delta);
    TWEEN_update(this.app.ticker.lastTime);
  }

  onLoad(loader: Loader, resources: Dict<LoaderResource>) {
    this.create(PotionScreen, this.app).then((gameScreen) => {
      this.showScreen(gameScreen);
    });
  }

  showScreen(screen: PotionScreen) {
    this.app.stage.addChild(screen.content);

    this.currentScreen = screen;
  }
}
