import { GameObject } from "../game-engine";
import { ITextStyle, Sprite, Text } from "pixi.js";
import { autorun } from "mobx";
import { GameState } from "../state";
import { AssetDB } from "../asset-db";
import { GameLayout } from "../layout";
import { Colors } from "../palette";

export class ResultPotionWidget extends GameObject {
  async onCreate(state: GameState) {
    await super.onCreate();

    const potion = new Sprite(AssetDB.instance.getTexture("Bummer_Potion"));
    this.attach(potion);

    const bummer = new Sprite(AssetDB.instance.getTexture("Bummer_Text"));
    this.attach(bummer);
    bummer.y = 124; // 302 - 178

    const textStyle: Partial<ITextStyle> = {
      fontFamily: "VT323",
      fontSize: 46,
      lineHeight: 22,
      fontWeight: "400",
      fill: Colors.YellowText,
      align: "left",
    };

    const text = new Text("you brewed a disastrous batch.", textStyle);
    this.attach(text);
    text.y = bummer.y + bummer.height + 16;

    const gl = GameLayout;
    autorun(() => {
      potion.x = (gl.targetWidth - potion.width) * 0.5;
      bummer.x = (gl.targetWidth - bummer.width) * 0.5;
      text.x = (gl.targetWidth - text.width) * 0.5;
    });
  }
}
