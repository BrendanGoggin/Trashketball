"use strict";

/**
 * Basic EventListener. Outputs "Quest Complete" when quest is completed.
 * 
 */
class QuestManager extends EventListener {

    /**
     * takes in the game for which it is managing events
     */
    constructor(game) {
        super();
        this.successSound = new Audio();
        this.successSound.src = 'resources/cha-ching.mp3';
        this.completeCoinTweenCount = 0;
        this.game = game;
    }

    /**
     * This method handles events.
     * event must have event.eventType property to be handled
     */
    notify(event) {
        if (event.eventType == "swordPickUp" || event.eventType == "coinPickUp") {
            document.getElementById('quest-console').innerHTML = 'Quest Complete.';
            console.log("Quest Complete.");
            this.successSound.play();
        }

        if (event.eventType == "coinTweenDone") {
            this.completeCoinTweenCount++;
            if (this.completeCoinTweenCount == 4) {
                this.game.coinFadeOut();
            }
        }
    }


}

