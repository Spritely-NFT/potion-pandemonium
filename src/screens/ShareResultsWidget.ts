import { GameObject } from "../game-engine";
import { Graphics, ITextStyle, Rectangle, Sprite, Text } from "pixi.js";
import { autorun } from "mobx";
import { GameState } from "../state";
import { AssetDB } from "../asset-db";
import { GameLayout } from "../layout";
import { Colors } from "../palette";
import { RectangleButton } from "../simple-button";

export class ShareResultsWidget extends GameObject {
  async onCreate(state: GameState) {
    await super.onCreate();

    const potion = new Sprite(AssetDB.instance.getTexture("Potion_Medly"));
    this.attach(potion);

    const frame = new Graphics();
    frame
      .lineStyle({
        width: 4,
        color: Colors.YellowShapes,
      })
      .moveTo(270, 0)
      .lineTo(0, 0)
      .lineTo(0, 364)
      .lineTo(890, 364)
      .lineTo(890, 0)
      .lineTo(890 - 270, 0);
    this.attach(frame);
    frame.y = potion.height * 0.5;

    const textStyle: Partial<ITextStyle> = {
      fontFamily: "VT323",
      fontSize: 46,
      lineHeight: 22,
      fontWeight: "400",
      fill: Colors.YellowText,
      align: "left",
    };

    const text = new Text("don't be shy. share that score.", textStyle);
    this.attach(text);
    text.y = frame.y + 92;

    const shareBtn = await this.create(RectangleButton);
    shareBtn.setup("share", new Rectangle(0, 0, 600, 130), null, {
      fontSize: 86,
      letterSpacing: 10,
    });
    this.attach(shareBtn);
    shareBtn.y = frame.y + 162;

    const gl = GameLayout;
    autorun(() => {
      potion.x = (gl.targetWidth - potion.width) * 0.5;
      frame.x = (gl.targetWidth - frame.width) * 0.5;
      text.x = (gl.targetWidth - text.width) * 0.5;
      shareBtn.x = (gl.targetWidth - shareBtn.rect.width) * 0.5;
    });
  }
}
