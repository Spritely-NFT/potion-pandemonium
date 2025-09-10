import { Application, settings, SCALE_MODES } from 'pixi.js';
import { SimpleObject } from './simple-object';

export class BaseGame extends SimpleObject {
    app: Application;

    constructor(mount = '#root') {
        super();

        settings.RESOLUTION = window.devicePixelRatio;
        settings.SCALE_MODE = SCALE_MODES.NEAREST;

        const options: any = {
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            autoDensity: true,
        };

        var view = document.querySelector(`${mount} canvas`);
        if (view) {
            options.view = view;
        }

        this.app = new Application(options);
    }

    async onCreate() {
        await super.onCreate();

        // this.app.renderer.view.style.width = "100%";
        // this.app.renderer.view.style.height = "100%";
        // this.app.renderer.view.style.position = 'absolute';
        this.app.ticker.add(this.onTick);

        this.attach();
    }

    _bind() {
        super._bind();
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onTick = this.onTick.bind(this);
    }

    get stage() {
        return this.app.stage;
    }

    get width() {
        return this.app.renderer.width;
    }

    get height() {
        return this.app.renderer.height;
    }

    attach() {
        window.addEventListener('resize', this.onWindowResize);
        this.onWindowResize();
    }

    detach() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onTick(delta: number) {}

    onWindowResize() {
        settings.RESOLUTION = window.devicePixelRatio;

        // this.app.renderer.view.style.width = "100%";
        // this.app.renderer.view.style.height = "100%";
        // this.app.renderer.resolution = Math.floor(window.devicePixelRatio);

        const parent:HTMLElement = this.app.renderer.view.parentNode as HTMLElement;
        if (parent) {
            this.app.renderer.resize(parent.offsetWidth, parent.offsetHeight);
        }
        // this.app.stage.scale.set(window.devicePixelRatio, window.devicePixelRatio);

        this.log('game.onResize', {
            resolution: this.app.renderer.resolution,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            stagewidth: this.app.stage.width,
            stageheight: this.app.stage.height,
            rendererWidth: this.app.renderer.width,
            rendererHeight: this.app.renderer.height,
            clientWidth: this.app.renderer.view.clientWidth,
            clientHeight: this.app.renderer.view.clientHeight,
            offsetWidth: this.app.renderer.view.offsetWidth,
            offsetHeight: this.app.renderer.view.offsetHeight,
            devicePixelRatio: window.devicePixelRatio,
        });

        this.dispatchEvent(new Event('resize'));
    }
}
