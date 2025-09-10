import { PotionGuessResult, PotionType } from "./state";

// https://coolors.co/c9e4ca-87bba2-55828b-3b6064-364958
export const Palette = [
    0x364958,
    0x3b6064,
    0x55828B,
    0x87BBA2,
    0xC9E4CA,
];

export const Colors = {
    Header: 0xFFFFFF,
    Status: 0x231F20,
    Background: 0x586649,
    ClearDraw: 0x000000,
    YellowText: 0xEFFC44,
    YellowShapes: 0xF5F886,
    Shadow: 0x454029,
    Tan: 0xD6D1AE,
    ShadowTwo: 0x382714,
    BrownText: 0x1E1409,
};

export function getPotionColor(potion: PotionType): number {
    switch (potion) {
        case PotionType.Empty:
            return 0x555555;
        case PotionType.Aquatica:
            return 0xff0000;
        case PotionType.Doomsdom:
            return 0x00ff00;
        case PotionType.Mushtopia:
            return 0x0000ff;
        case PotionType.Mysterium:
            return 0xffa500;
        case PotionType.OuterLimit:
            return 0x800080;
        case PotionType.Void:
            return 0xffff00;
        default:
            return 0xff00ff
    }
}

export function getResultColor(potion: PotionGuessResult): number {
    switch (potion) {
        case PotionGuessResult.Unknown:
            return 0xffffff;
        case PotionGuessResult.Miss:
            return 0x555555;
        case PotionGuessResult.Near:
            return 0xffff00;
        case PotionGuessResult.Correct:
            return 0x00ff00;
        default:
            return 0xff00ff
    }
}

export function getResultSprite(potion: PotionGuessResult): string {
    switch (potion) {
        case PotionGuessResult.Near:
            return "Guess_Result_Near";
        case PotionGuessResult.Correct:
            return "Guess_Result_Correct";
        case PotionGuessResult.Miss:
            return "Guess_Result_Miss"
        case PotionGuessResult.Unknown:
        default:
            return null
    }
}