import { GameObject } from "../game-engine";
import { autorun } from "mobx";
import { Sprite } from "pixi.js";
import { PotionIngredients, PotionType } from "../state";
import { AssetDB } from "../asset-db";
import { BaseLayout } from "../layout";
import { Easing, Tween } from "@tweenjs/tween.js";

export class PotionWidget extends GameObject {
  static _layout = {
    ...BaseLayout,
  };
  private _sprite: Sprite;
  private _shadow: Sprite;

  get layout() {
    return PotionWidget._layout;
  }

  async onCreate(ingredients?: PotionIngredients, potion_index?: number) {
    super.onCreate();

    this._shadow = new Sprite();
    this.attach(this._shadow);

    this._shadow.position.set(
      this.layout.shadowOffset,
      this.layout.shadowOffset,
    );

    this._sprite = new Sprite();
    this.attach(this._sprite);

    if (ingredients) {
      autorun(() => {
        this.setPotion(ingredients[potion_index]);
      });
    }
  }

  setPotion(potion: PotionType) {
    const spriteTx = AssetDB.instance.getPotionTexture(potion);
    if (this._sprite.texture == spriteTx) {
      return;
    }
    this._sprite.texture = spriteTx;

    const shadowTx = AssetDB.instance.getPotionShadowTexture(potion);
    if (shadowTx) {
      this._shadow.texture = shadowTx;
    } else {
      this._shadow.texture = null;
    }
    this._shadow.renderable = !!shadowTx;

    this.content.pivot.set(
      Math.floor(spriteTx.width * 0.5),
      Math.floor(spriteTx.height),
    );

    if (potion != PotionType.Answer && potion != PotionType.Empty) {
      new Tween(this.content.scale)
        .to(
          {
            x: 1.25,
            y: 1.25,
          },
          150,
        )
        .easing(Easing.Circular.Out)
        .repeat(1)
        .yoyo(true)
        .start();
    }
  }
}
