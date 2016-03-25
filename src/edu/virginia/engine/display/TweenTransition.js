"use strict";

/**
 * Contains the transition function for tweens
 * Subclass this class for more custom transitions
 */
class TweenTransition {

    constructor() {
        /* default constructor */
    }

    /**
     * Default linear transition function
     * takes in the percentage of the timespan that has elapsed as a double (50% = 0.50)
     * returns the percentage between start and end value that the value should be
     */
    applyTransition(percentDone) {
        return percentDone;
    }

}