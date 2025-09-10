import { GameObject } from "../game-engine";
import { action, autorun, observable } from "mobx";
import { Graphics } from "pixi.js";
import { Colors } from "../palette";
import { PotionGame } from "../potion-game";
import { GameState } from "../state";
import { BaseLayout } from "../layout";
import { SimpleButton } from "../simple-button";

export class HeaderWidget extends GameObject {
  // 152px / 2340px screen height = 0.06495726496
  // 0.06495726496 * (390 x 844) = 54.8239316262 (aka 54)
  static _layout = observable({
    ...BaseLayout,
    gap: 46,
    width: BaseLayout.screenWidth,
    height: 144,
  });
  get layout() {
    return HeaderWidget._layout;
  }

  async onCreate(state: GameState) {
    await super.onCreate();

    const l = this.layout;

    const bg = (this.content = new Graphics());

    const helpBtn = await this.create(SimpleButton, "How_to_Play_Icon");
    helpBtn.content.on(
      "pointerdown",
      action(() => {}),
    );
    this.attach(helpBtn);

    const settingsBtn = await this.create(SimpleButton, "Settings_Icon");
    settingsBtn.content.on(
      "pointerdown",
      action(() => {}),
    );
    this.attach(settingsBtn);

    autorun(() => {
      bg.clear()
        .beginFill(Colors.Header)
        .drawRect(0, 0, l.width, l.height)
        .endFill();

      settingsBtn.x = l.width - settingsBtn.width - l.screenMargin;
      settingsBtn.y = l.height * 0.5;

      helpBtn.x =
        l.width - settingsBtn.width - helpBtn.width - l.screenMargin - l.gap;
      helpBtn.y = l.height * 0.5;
    });
  }
}
