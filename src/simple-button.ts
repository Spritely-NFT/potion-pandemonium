import { GameObject } from "./game-engine";
import { Colors } from "./palette";
import {
  Bounds,
  Container,
  filters,
  Graphics,
  ITextStyle,
  Rectangle,
  Sprite,
  Text,
} from "pixi.js";
import { AssetDB } from "./asset-db";
import { PotionWidget } from "./screens/potion-widget";
import { Tween } from "@tweenjs/tween.js";

export class SimpleButton extends GameObject {
  static _layout = {
    ...PotionWidget._layout,
  };

  get layout() {
    return SimpleButton._layout;
  }

  async onCreate(textureName: string) {
    await super.onCreate();

    this.content = new Sprite(AssetDB.instance.getTexture(textureName));
    this.content.pivot.set(0, this.height * 0.5);
    this.content.interactive = true;
  }
}

const TWEEN_DURATION_MS = 15;

export interface IButtonStyle {
  foregroundColor: number;
  shadowColor: number;
  shadowOpacity: number;
  shadowOffset: number;
}

const _defaultStyle: Partial<IButtonStyle> = {
  foregroundColor: Colors.YellowShapes,
  shadowColor: Colors.Shadow,
  shadowOpacity: 1,
  shadowOffset: 12,
};

const _defaultLabelStyle: Partial<ITextStyle> = {
  fontFamily: "VT323",
  fontSize: 36,
  lineHeight: 22,
  fontWeight: "400",
  fill: Colors.Shadow,
  align: "center",
};

abstract class BaseButton extends GameObject {
  private _enabled = true;

  _bind() {
    super._bind();
    this._pointerDown = this._pointerDown.bind(this);
    this._pointerUp = this._pointerUp.bind(this);
  }

  async onCreate() {
    await super.onCreate();

    this.content.on("pointerdown", this._pointerDown);
    this.content.on("pointerup", this._pointerUp);
    this.content.on("pointerout", this._pointerUp);
  }

  private _over = false;
  private _pointerDown() {
    if (!this._over) {
      this._over = true;
      this.onButtonDown();
    }
  }
  abstract onButtonDown();

  private _pointerUp() {
    if (this._over) {
      this._over = false;
      this.onButtonUp();
    }
  }
  abstract onButtonUp();

  enable() {
    if (!this._enabled) {
      this._enabled = true;
      this.content.interactive = true;
      this.onEnable();
    }
  }

  abstract onEnable();

  disable() {
    if (this._enabled) {
      this._enabled = false;
      this.content.interactive = false;
      this.onDisable();
    }
  }
  abstract onDisable();
}

export class RectangleButton extends BaseButton {
  static _layout = {};
  private _text: Text;
  private _rect: Rectangle;
  private _foreground: Container;
  private _bg: Graphics;
  private _buttonStyle: Partial<IButtonStyle>;

  get layout() {
    return RectangleButton._layout;
  }

  get rect(): Rectangle {
    return this._rect;
  }

  async setup(
    label: string,
    rect: Rectangle,
    style: Partial<IButtonStyle> = {},
    labelStyle: Partial<ITextStyle> = {},
  ) {
    style = style || {};
    labelStyle = labelStyle || {};

    this.content.hitArea = rect;

    const buttonStyle: Partial<IButtonStyle> = {
      ..._defaultStyle,
      ...style,
    };
    this._buttonStyle = buttonStyle;
    const textStyle: Partial<ITextStyle> = {
      ..._defaultLabelStyle,
      ...labelStyle,
    };

    this._rect = rect;
    this.content._bounds = new Bounds();

    this._foreground = new Container();

    this._bg = new Graphics();
    this._bg
      .beginFill(buttonStyle.foregroundColor)
      .drawRect(rect.x, rect.y, rect.width, rect.height)
      .endFill();
    this._foreground.addChild(this._bg);

    const shadow = new Graphics();
    shadow
      .beginFill(buttonStyle.shadowColor, buttonStyle.shadowOpacity)
      .drawRect(rect.x, rect.y, rect.width, rect.height)
      .endFill();
    shadow.position.set(buttonStyle.shadowOffset, buttonStyle.shadowOffset);

    this._text = new Text("Hello World", textStyle);
    this._foreground.addChild(this._text);

    this.attach(shadow);
    this.attach(this._foreground);

    this.setLabel(label);

    this.enable();
  }

  setLabel(label: string) {
    if (this._text) {
      this._text.text = label;
      this._repositionText();
    }
  }

  private _repositionText() {
    if (this._text) {
      this._text.x = Math.floor((this._rect.width - this._text.width) * 0.5);
      this._text.y = Math.floor((this._rect.height - this._text.height) * 0.5);
    }
  }

  onEnable() {
    this._bg.filters = [];
  }

  onDisable() {
    const foo = new filters.ColorMatrixFilter();
    foo.brightness(0.61, true);
    this._bg.filters = [foo];
  }
  onButtonDown() {
    new Tween(this._foreground)
      .to(
        {
          x: this._buttonStyle.shadowOffset,
          y: this._buttonStyle.shadowOffset,
        },
        TWEEN_DURATION_MS,
      )
      .start();
  }
  onButtonUp() {
    new Tween(this._foreground).to({ x: 0, y: 0 }, TWEEN_DURATION_MS).start();
  }
}

export interface ISpriteButtonStyle {
  fgSprite: string;
  bgSprite: string;
  bgOffsetX: number;
  bgOffsetY: number;
  iconSprite: string;
  iconOffsetX: number;
  iconOffsetY: number;
}

const _defaultSpriteStyle: Partial<ISpriteButtonStyle> = {
  bgOffsetX: 12,
  bgOffsetY: 12,
  iconOffsetX: 0,
  iconOffsetY: 0,
};

export class SpriteButton extends BaseButton {
  private _foreground: Container;
  private _style: Partial<ISpriteButtonStyle>;

  get style() {
    return { ...this._style };
  }

  async setup(spriteStyle: Partial<ISpriteButtonStyle>) {
    this.content.interactive = true;

    this._style = {
      ..._defaultSpriteStyle,
      ...spriteStyle,
    };
    this._foreground = new Container();

    // FIXME: hit area

    const bg = new Sprite(AssetDB.instance.getTexture(this._style.bgSprite));
    bg.position.set(this._style.bgOffsetX, this._style.bgOffsetY);

    const fg = new Sprite(AssetDB.instance.getTexture(this._style.fgSprite));

    this.content.hitArea = new Rectangle(0, 0, fg.width, fg.height);

    this._foreground.addChild(fg);

    if (this._style.iconSprite) {
      const icon = new Sprite(
        AssetDB.instance.getTexture(this._style.iconSprite),
      );
      icon.position.set(this._style.iconOffsetX, this._style.iconOffsetY);
      this._foreground.addChild(icon);
    }

    this.attach(bg);
    this.attach(this._foreground);

    this.enable();
  }

  onEnable() {
    this._foreground.filters = [];
  }

  onDisable() {
    const foo = new filters.ColorMatrixFilter();
    foo.brightness(0.61, true);
    this._foreground.filters = [foo];
  }
  onButtonDown() {
    new Tween(this._foreground)
      .to(
        { x: this._style.bgOffsetX, y: this._style.bgOffsetY },
        TWEEN_DURATION_MS,
      )
      .start();
  }
  onButtonUp() {
    new Tween(this._foreground).to({ x: 0, y: 0 }, TWEEN_DURATION_MS).start();
  }
}

// DownStateShifter (hitbox, target, x, y)
// DisabledGreyer (hitbox, target, color, alpha)
