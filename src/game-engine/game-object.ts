import { Delay } from "./delay";
import { Container, ObservablePoint } from "pixi.js";
import { SimpleObject } from "./simple-object";

export class GameObject extends SimpleObject {
    content: Container = new Container();

    get position(): ObservablePoint {
        return this.content.position;
    }

    get x() { return this.content.x; }
    set x(value: number) { this.content.x = value; }
    
    get y() { return this.content.y; }
    set y(value: number) { this.content.y = value; }

    get width() { return this.content.width; }
    get height() { return this.content.height; }

    async onCreate(...args: any[]) {
        await super.onCreate();
    }

    attach(child: GameObject | Container) {
        let cc: Container;
        if (child instanceof GameObject) {
            cc = child.content;
        } else {
            cc = child;
        }
        this.content.addChild(cc);
    }

    detach(child: GameObject | Container) {
        let cc: Container;
        if (child instanceof GameObject) {
            cc = child.content;
        } else {
            cc = child;
        }
        this.content.removeChild(cc);
    }

    show() {
        this.content.renderable = true;
    }
    
    hide() {
        this.content.renderable = false;
    }

    delay(callback: (...args: any[]) => any, seconds: number) {
        return this.create(Delay, callback, seconds);
    }

    center() {
        this.content.pivot.set(
            Math.floor(this.width * 0.5),
            Math.floor(this.height * 0.5),
        )
    }
}