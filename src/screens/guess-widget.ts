import { GameObject } from "../game-engine";
import { Sprite } from "pixi.js";
import { getResultSprite } from "../palette";
import { PotionGuess, PotionGuessResult } from "../state";
import { autorun } from "mobx";
import { AssetDB } from "../asset-db";
import { Easing, Tween } from "@tweenjs/tween.js";
import { SFX } from "../sfx";

export class GuessWidget extends GameObject {
  static _layout = {
    width: 24,
    height: 24,
  };

  get layout() {
    return GuessWidget._layout;
  }

  async onCreate(guess: PotionGuess, result_index: number) {
    super.onCreate();

    const sprite = new Sprite();
    sprite.position.x = sprite.pivot.x = Math.floor(this.layout.width * 0.5);
    this.attach(sprite);

    autorun(() => {
      let txName = getResultSprite(PotionGuessResult.Unknown);
      if (guess.isSubmitted) {
        txName = getResultSprite(guess.result[result_index]);
      }

      const tx = AssetDB.instance.getTexture(txName);

      if (sprite.texture != tx) {
        sprite.texture = tx;

        sprite.scale.y = 0.01;
        new Tween(sprite.scale)
          .to(
            {
              y: 1,
            },
            250,
          )
          .onStart(() => {
            if (guess.result[result_index] == PotionGuessResult.Miss) {
              SFX.playOneShot("test");
            }
          })
          .easing(Easing.Bounce.Out)
          .delay(result_index * 75)
          .start();
      }
    });
  }
}
