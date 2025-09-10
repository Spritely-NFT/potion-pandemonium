import { SimpleObject } from "./game-engine";
import { ZZFX, zzfx } from "zzfx";

const clips = {
  test: [
    ,
    ,
    500,
    0.16,
    0.04,
    0,
    ,
    0.24,
    -5.1,
    ,
    ,
    0.14,
    ,
    ,
    ,
    ,
    ,
    ,
    0.14,
    0.04,
  ], // Random 20
};

export class SFX extends SimpleObject {
  static playOneShot(clipName: string) {
    const clip = clips[clipName];
    if (!clip) {
      console.warn(`Unable to find sound: ${clipName}`);
    }

    // zzfx(...clip);
    console.log(`Would be playing: ${clipName}`);
  }
}

// zzfx(...[,,500,.16,.04,0,,.24,-5.1,,,.14,,,,,,,.14,.04]); // Random 20
