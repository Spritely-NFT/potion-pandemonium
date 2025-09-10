import { GameObject, KeyDownHandler } from "../game-engine";
import { Container, Rectangle, Sprite } from "pixi.js";
import { GameState, PotionType } from "../state";
import { action, autorun, observable, runInAction } from "mobx";
import { BaseLayout } from "../layout";
import { AssetDB } from "../asset-db";
import { RectangleButton, SpriteButton } from "../simple-button";
import { Colors } from "../palette";

export class InputWidget extends GameObject {
  layout = observable({
    ...BaseLayout,
    width: 1080,
    height: 248,
    gap: 32,
  });

  async onCreate(state: GameState) {
    super.onCreate();

    const layer = new Container();
    this.attach(layer);

    const potionAction = action((p: PotionType) => {
      const currentGuess = state.currentGuess;
      if (!currentGuess) {
        return;
      }
      const firstEmpty = currentGuess.ingredients.indexOf(PotionType.Empty);
      if (firstEmpty > -1) {
        state.currentGuess.ingredients[firstEmpty] = p;
      }
    });
    // input buttons
    const widgets: (SpriteButton | RectangleButton)[] = await Promise.all(
      (Object.values(PotionType) as PotionType[])
        .filter(
          (p) =>
            p != PotionType.Empty &&
            p != PotionType.Answer &&
            !isNaN(Number(p)),
        )
        .map(async (p, i) => {
          const potKey = await this.create(SpriteButton);
          const sprite = AssetDB.instance.getPotionTextureName(p);
          potKey.setup({
            fgSprite: sprite,
            bgSprite: sprite + "_Shadow",
          });

          layer.addChild(potKey.content);

          potKey.content.on("pointerdown", () => potionAction(p));
          await this.create(KeyDownHandler, `${i + 1}`, () => potionAction(p));

          return potKey;
        }),
    );

    // delete action
    const deleteAction = action(() => {
      let lastTaken = -1;
      const currentGuess = state.currentGuess;
      if (!currentGuess) {
        return;
      }
      for (let i = currentGuess.ingredients.length - 1; i >= 0; i--) {
        if (currentGuess.ingredients[i] != PotionType.Empty) {
          lastTaken = i;
          break;
        }
      }
      if (lastTaken > -1) {
        currentGuess.ingredients[lastTaken] = PotionType.Empty;
      }
    });
    await this.create(KeyDownHandler, "Backspace", deleteAction);
    await this.create(KeyDownHandler, "Delete", deleteAction);

    // delete button
    const delBtn = await this.create(SpriteButton);
    delBtn.setup({
      fgSprite: "Delete_Button_Foreground",
      bgSprite: "Delete_Button_Background",
      bgOffsetX: this.layout.shadowOffset,
      bgOffsetY: this.layout.shadowOffset,
      iconSprite: "Delete_Button_Arrow",
      iconOffsetX: 47,
      iconOffsetY: 14,
    });
    delBtn.content.on("pointertap", deleteAction);
    layer.addChild(delBtn.content);
    widgets.push(delBtn);

    // submit action and button
    const submitAction = action(() => {
      const currentGuess = state.currentGuess;
      if (!currentGuess) {
        return;
      }
      const firstEmpty = currentGuess.ingredients.indexOf(PotionType.Empty);
      if (firstEmpty != -1) {
        return;
      }
      state.submitCurrentGuess();
    });
    await this.create(KeyDownHandler, "Enter", submitAction);

    // submit answer button
    const submitBtn = await this.create(RectangleButton);
    submitBtn.setup(
      "enter",
      new Rectangle(0, 0, 120, 92),
      {
        foregroundColor: Colors.Tan,
        shadowColor: Colors.ShadowTwo,
        shadowOpacity: 0.6,
        shadowOffset: this.layout.shadowOffset,
      },
      {
        fill: Colors.BrownText,
        fontSize: 48,
      },
    );
    submitBtn.y = -Math.floor(submitBtn.height * 0.5);
    submitBtn.content.on("pointertap", submitAction);
    layer.addChild(submitBtn.content);
    widgets.push(submitBtn);

    // updating the delete/submit button availability
    autorun(() => {
      const currentGuess = state.currentGuess;
      if (!currentGuess) {
        delBtn.disable();
        submitBtn.disable();
        return;
      }

      const firstEmpty = currentGuess.ingredients.indexOf(PotionType.Empty);
      if (firstEmpty > 0 || firstEmpty == -1) {
        delBtn.enable();
      } else {
        delBtn.disable();
      }

      if (firstEmpty == -1) {
        submitBtn.enable();
      } else {
        submitBtn.disable();
      }
    });

    // position all elements
    let x = 0;
    widgets.forEach((widget) => {
      widget.position.x = x;
      widget.position.y = -Math.floor(
        (widget.height - this.layout.shadowOffset) * 0.5,
      );
      x += widget.width - this.layout.shadowOffset + this.layout.gap;
    });

    layer.x = Math.floor((this.layout.width - layer.width) * 0.5);
    layer.y = 120;
  }
}
