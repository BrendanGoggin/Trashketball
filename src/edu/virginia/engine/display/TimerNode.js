"use strict";

// var DEFAULT_FONT = "36px Comic Sans MS";
// var FONT_COLOR = "black";
// var FONT_COLOR_SELECTED = "#b9d5b7";
// var FONT_COLOR_DISABLED = "#555555";

/**
 * A node which draws text instead of an image
 * 
 * */
class TimerNode extends TextNode {
    
    constructor(id, text){
        super(id, text);

        this.startTime = false; // milliseconds to start
        this.timeLeft = false; // milliseconds left
        this.timeStep = false; // milliseconds in each step
        // this.lastTimeStepHit = false;
    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     * dt: time since last call (ms)
     */
    update(pressedKeys, dt) {
        this.timeLeft -= dt;
        if (this.timeLeft < 0) this.timeLeft = 0;
        this.text = this.convertTimeToText();
        this.updateChildren(pressedKeys, dt);
    }


    /**
     * Sets the timer's params as specified
     */
    setToStart(startTime, timeStep) {
        this.startTime = startTime;
        this.timeLeft = startTime;
        this.timeStep = timeStep;
        // this.lastTimeStepHit = this.startTime;
    }



    /**
     * Converts the time to readable text
     */
    convertTimeToText() {
        return "Time Remaining: " + parseFloat(this.timeLeft/1000).toFixed(1);
    }

}