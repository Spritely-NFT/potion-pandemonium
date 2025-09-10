import { SimpleObject } from "./simple-object";

export class Delay extends SimpleObject {

    timeoutHandle: any = -1;

    onCreate(callback: Function, seconds: number) {
        super.onCreate();
        this.timeoutHandle = setTimeout(() => {
            callback()
        }, seconds * 1000);
    }

    onRelease() {
        clearTimeout(this.timeoutHandle);
    }
}