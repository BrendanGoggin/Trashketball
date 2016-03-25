"use strict";

/**
 * Manages the Tweens for a game
 */
class TweenJuggler {
    

    /**
     * Constructor
     * Takes in object to tween and (optionally) the transition function to use
     */
    constructor() {
        this.tweenList = []; // tweens to update
    }
    

    /**
     * Updates the Tweens in tweenList
     */
    update() {
        for (var i = 0; i < this.tweenList.length; i++) {
            if (this.tweenList[i].update() == -1) {
                this.tweenList.splice(i, 1);
                i--;
            }
        }
    }


    /**
     * Adds the specified tween object to the juggler's list
     */
    add(tween) {
        this.tweenList.push(tween);
    }

}