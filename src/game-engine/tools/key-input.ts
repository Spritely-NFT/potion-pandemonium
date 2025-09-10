import { SimpleObject } from "../simple-object";


export class KeyDownHandler extends SimpleObject {
    showAnswer: boolean = false;
    private _event?: string;
    private _key?: string;
    private _callback?: EventListener;

    onCreate(key: string, callback: EventListener) {
        super.onCreate();
        this._event = 'keydown';
        this._key = key;
        this._callback = callback;
        document.addEventListener(
            this._event,
            this,
        );
    }

    _bind() {this.handleEvent = this.handleEvent.bind(this);}

    onDestroy() {
        super.onDestroy();
        if(this._event) {
            document.removeEventListener(this._event, this);
        }
    }

    handleEvent(ev: KeyboardEvent) {
        if(ev.key == this._key) {
            if (this._callback) {
                this._callback(new KeyboardEvent(ev.type, ev));
            }
        }
    }
}

