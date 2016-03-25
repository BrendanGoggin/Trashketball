/**
 * This file contains subclasses of TweenTransition.
 * Each subclass implements a different transition function.
 * Just call applyTransition() to apply the function.
 * Add new classes for more transition options.
 */

"use strict";

/**
 * Ease into and out of transition, max speed in middle of transition.
 */
class EaseInOutTransition extends TweenTransition {
    constructor() {
        super();
    }

    applyTransition(percentDone) {
        if (percentDone < 0.3) {
            var result = 20 * percentDone * percentDone / 9;
            return result;
        } else if (percentDone < .7) {
            var result = 3 * percentDone / 2;
            result -= .25;
            return result;
        } else {
            var result = 20 / 9 * (percentDone - 1) * (percentDone - 1);
            result = 1 - result;
            return result;
        }
    }
}

/**
 * Overshoots the target value and "bounces" back to it, similar to a damped shock-absorber.
 */
class ShockAbsorbTransition extends TweenTransition {
    constructor() {
        super();
    }

    applyTransition(percentDone) {
        var result = Math.sin(percentDone * Math.PI * 0.75) / Math.sin(Math.PI * 0.75);
        return result;
    }
}