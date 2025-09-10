import { GameObject } from "../game-engine";
import { Graphics, ITextStyle, Rectangle, Sprite, Text } from "pixi.js";
import { autorun } from "mobx";
import { GameState } from "../state";
import { AssetDB } from "../asset-db";
import { GameLayout } from "../layout";
import { Colors } from "../palette";
import { RectangleButton } from "../simple-button";

export class ConnectWalletWidget extends GameObject {
  async onCreate(state: GameState) {
    await super.onCreate();

    const textStyle: Partial<ITextStyle> = {
      fontFamily: "VT323",
      fontSize: 46,
      lineHeight: 20,
      fontWeight: "400",
      fill: Colors.YellowText,
      align: "left",
    };

    const text = new Text(
      "connect wallet to view your potion ingredients",
      textStyle,
    );
    this.attach(text);
    text.y = 162 + 12;

    const connectBtn = await this.create(RectangleButton);
    connectBtn.setup("connect", new Rectangle(0, 0, 440, 96), null, {
      fontSize: 56,
      letterSpacing: 5,
    } as any);
    this.attach(connectBtn);
    connectBtn.y = text.y + 93;

    const gl = GameLayout;
    autorun(() => {
      text.x = Math.floor((gl.targetWidth - text.width) * 0.5);
      connectBtn.x = Math.floor((gl.targetWidth - connectBtn.rect.width) * 0.5);
    });
  }
}
