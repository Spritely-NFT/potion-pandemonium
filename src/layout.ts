import { observable } from "mobx";

export const BaseLayout = {
    gap: 16,
    screenWidth: 1080,
    screenHeight: 1920,
    screenMargin: 64,
    shadowOffset: 10,
};

export const GameLayout = {
    ...BaseLayout,
    pad: 8,
    targetWidth: BaseLayout.screenWidth, // iphone 12 pro
    targetHeight: BaseLayout.screenHeight,
};
