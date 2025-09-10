import { Ticker } from "pixi.js";
import { EventDispatcher } from "./core/EventDispatcher";

export class Factory {
  public static async create<T>(t: new () => T, ...args: any[]) {
    const o = new t();

    if (o instanceof SimpleObject) {
      await o.onCreate(...args);
    }

    return o;
  }
}

export class SimpleObject extends EventDispatcher {
  constructor() {
    super();
    this._bind();
  }

  _bind() {}

  public static async create<T>(...args: any[]) {
    return await Factory.create(this, ...args);
  }

  async create<T>(t: new () => T, ...args: any[]) {
    const o = await Factory.create<T>(t, ...args);
    return o;
  }

  onCreate(...args: any[]) {}

  onDestroy() {
    this.tick = false;
  }

  get ticker(): Ticker {
    return Ticker.shared;
  }

  _tick_enabled = false;
  set tick(val) {
    if (this._tick_enabled != val) {
      if (val) {
        this.ticker.add(this.onTick);
      } else {
        this.ticker.remove(this.onTick);
      }
    }
    this._tick_enabled = val;
  }

  get tick() {
    return this._tick_enabled;
  }

  onTick(delta: number) {}

  static _logger: Logger;
  getLogger(): Promise<Logger> {
    if (!SimpleObject._logger) {
      return (Logger.create() as Promise<Logger>).then((logger) => {
        SimpleObject._logger = logger as Logger;
        // logger.show();
        return logger;
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(SimpleObject._logger);
      });
    }
  }

  log(...args: any[]) {
    this.getLogger().then((logger) => logger.log(...args));
  }
}

export class Logger extends SimpleObject {
  container: HTMLDivElement;

  constructor() {
    super();
    this.container = document.createElement("div");
  }

  onCreate() {
    super.onCreate();

    const logstyle = document.createElement("style");
    logstyle.innerText = `
        .log-container {
            position: absolute;
            top: 0;
            pointer-events: none;
            z-index: 9999;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.25);
        }
        .log-line {
            overflow-wrap: break-word;
        }
        `;
    this.container.classList.add("log-container");
    document.body.appendChild(logstyle);
    document.body.appendChild(this.container);

    this.hide();
  }

  log(...args: any[]) {
    const elem: HTMLDivElement = document.createElement("div");
    elem.classList.add("log-line");
    elem.innerText = args.map((v) => JSON.stringify(v)).join(", ");
    this.container.appendChild(elem);
    console.log.apply(null, args);
  }

  show() {
    this.container.style.display = "block";
  }

  hide() {
    this.container.style.display = "none";
  }
}
