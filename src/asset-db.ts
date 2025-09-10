import { SimpleObject } from "./game-engine";
import {
  BaseImageResource,
  BaseTexture,
  Loader,
  LoaderResource,
  Renderer,
  Resource,
  Spritesheet,
  SVGResource,
  Texture,
} from "pixi.js";
import { Dict } from "@pixi/utils";

// import SpriteSheetBaseImage from "../assets/processed/sheet.png";
// import SpriteSheetData from "../assets/processed/sheet.json";
import sprite_98_url from "../assets/raw/Wizard_Sprite.svg";
import { PotionType } from "./state";

export class AssetDB extends SimpleObject {
  static instance: AssetDB;
  loader: Loader;

  constructor() {
    super();
    AssetDB.instance = this;

    this.loader = new Loader();
  }

  async load(callback: Function) {
    const resp = await fetch(sprite_98_url);
    const svgXML = await resp.text();

    const container = document.createElement("div");
    container.innerHTML = svgXML;
    const svg = container.firstElementChild as SVGElement;

    function removeBackground(svg: SVGElement) {
      const bgSelector = ".Body__cls-1";
      const bg = svg.querySelector(bgSelector);
      if (bg) {
        bg.remove();
      }
    }
    removeBackground(svg);

    const modifiedXML = new XMLSerializer().serializeToString(svg);

    const svgBase64 = "data:image/svg+xml;base64," + btoa(modifiedXML);
    const svgResource = new SVGResource(svgBase64);

    const baseTexture = new BaseTexture(svgResource);

    const texture = new Texture(baseTexture);
    Texture.addToCache(texture, "mushroom109");
    console.log("loaded?", { texture });

    // const [a, b] = [SpriteSheetData, SpriteSheetBaseImage];

    // this.loader.add('mainsheet', SpriteSheetBaseImage.replace(".png", ".json"));

    this.loader.add("sheet", "static/sheet.json");

    // this.app.this.loader.add("sheet.png", SpriteSheetBaseImage, (resource: LoaderResource) => {
    //     this.spritesheet = new Spritesheet(resource.texture, SpriteSheetData);
    //     this.spritesheet.parse(()=>{});
    // });
    // const texture = await Texture.from(svg);
    this.loader.load(
      async (loader: Loader, resources: Dict<LoaderResource>) => {
        callback(loader, resources);
      },
    );
  }

  get mainSheet(): Spritesheet {
    return this.asset("sheet").spritesheet;
  }

  asset(name: string): LoaderResource {
    return this.loader.resources[name];
  }

  getTexture(name: string): Texture<Resource> {
    if (!name) {
      return null;
    }
    if (!name.endsWith(".png")) {
      name = name + ".png";
    }
    const tx = this.mainSheet.textures[name];
    if (!tx) {
      console.warn(`Unable to find texture ${name}`);
    }
    return tx;
  }

  getPotionTextureName(potion: PotionType): string {
    switch (potion) {
      case PotionType.Empty:
        return "Empty_Bottle";

      case PotionType.Answer:
        return "Als_Bottle";

      case PotionType.Aquatica:
        return "Aquatica_Potion";

      case PotionType.Doomsdom:
        return "Doomsdom_Potion";

      case PotionType.Mushtopia:
        return "Mushtopia_Potion";

      case PotionType.Mysterium:
        return "Mysterium_Potion";

      case PotionType.OuterLimit:
        return "Outer_Limit_Potion";

      case PotionType.Void:
        return "Void_Potion";

      default:
        return "Empty_Bottle";
    }
  }

  getPotionTexture(potion: PotionType): Texture<Resource> {
    return this.getTexture(this.getPotionTextureName(potion));
  }

  getPotionShadowTexture(potion: PotionType): Texture<Resource> {
    return this.getTexture(this.getPotionTextureName(potion) + "_Shadow");
  }

  hasShadow(potion: PotionType): boolean {
    if (potion === PotionType.Answer || potion === PotionType.Empty) {
      return false;
    }
    return true;
  }
}
