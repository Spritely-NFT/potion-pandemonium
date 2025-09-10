import { GameObject } from "../game-engine";
import { Sprite } from "pixi.js";
import { AssetDB } from "../asset-db";
import { BaseLayout } from "../layout";

export class FooterBackgroundWidget extends GameObject {
  static _layout = {
    ...BaseLayout,
  };

  get layout() {
    return FooterBackgroundWidget._layout;
  }

  async onCreate() {
    this.content = new Sprite(AssetDB.instance.getTexture("Wood_Panel_Tall"));
  }
}
