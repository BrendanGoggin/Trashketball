"use strict";


/** 
 * TweenableParam: enum-like object, containing the different tweenable Display Object params
 */
var TweenableParam = {
    POSITION_X: 0,
    POSITION_Y: 1,
    SCALE_X: 2,
    SCALE_Y: 3,
    ROTATION: 4,
    ALPHA: 5
};

/* freeze the object so its values are constant */
Object.freeze(TweenableParam); 



/**
 * Tween class for implementing Flash-style tweens (fade-ins, fade-outs, etc.)
 *
 */
class Tween {
    
    /**
     * Constructor
     * takes in object to tween and (optionally) the transition function to use
     */
    constructor(target, transition) {
        this.target = target;
        if (transition) this.transition = transition;
        else this.transition = new TweenTransition();
        // this.totalTime = false;
        this.startTime = false;
        this.endTime = false;
        this.startVal = false;
        this.endVal = false;
        // this.lastVal = false;
        this.fieldToAnimate = false;
        this.eventDispatcher = false; // dispatch "isComplete()" events
        this.event = false; // "isComplete" events
    }


    /**
     * Animate method begins the animation
     * fieldToAnimate: TweenableParam string to tween
     * startVal, endVal: the desired start/end value of the field to animate
     * time: how long the animation should take (ms)
     */
    animate(fieldToAnimate, startVal, endVal, time) {
        if (this.startTime || this.startVal || this.endVal 
            || this.fieldToAnimate || this.endTime) return false;
        this.fieldToAnimate = fieldToAnimate;
        this.startVal = startVal;
        this.endVal = endVal;
        // this.totalTime = time;
        this.startTime = this.now();
        this.endTime = this.startTime + time;
        return true;
    }

    /**
     * Updates the fieldToAnimate for the next frame.
     * called by TweenJuggler
     */
    update() {
        if (this.isComplete()) {
            if (this.eventDispatcher && this.event) {
                this.eventDispatcher.dispatchEvent(this.event);
            }
            return -1;
        }
        // this.startTime = this.now();
        // this.endTime = this.startTime + this.totalTime;
        if (!this.endTime) return 0;
        var currentTime = this.now();
        var percentDone = (currentTime - this.startTime) / (this.endTime - this.startTime);
        if (percentDone < 0) percentDone = 0;
        else if (percentDone > 1) percentDone = 1;
        // var newVal = this.startVal + (this.endVal - this.startVal) * this.transition.applyTransition(percentDone);
        var trans = this.transition.applyTransition(percentDone);
        var newVal = this.startVal + (this.endVal - this.startVal) * trans;
        this.setValue(newVal);
        return 1;
    }

    /**
     * Returns true if the tween animation is finished.
     */
    isComplete() {
        if (!this.endTime) return false;
        if (this.now() > this.endTime) {
            return true;
        }
        else {
            return false;
        }
        
    }

    /**
     * Returns the current time in ms.
     */
    now() {
        return window.performance.now();
    }

    /**
     * Sets the tweenTarget's value based on fieldToAnimate
     */
    setValue(value) {
        switch (this.fieldToAnimate) {
            case TweenableParam.POSITION_X:
                this.target.setPositionX(value);
                break;
            case TweenableParam.POSITION_Y:
                this.target.setPositionY(value);
                break;
            case TweenableParam.SCALE_X:
                this.target.setScaleX(value);
                break;
            case TweenableParam.SCALE_Y:
                this.target.setScaleY(value);
                break;
            case TweenableParam.ROTATION:
                this.target.setRotation(value);
                break;
            case TweenableParam.ALPHA:
                this.target.setAlpha(value);
                break;
            default:
                return false;
        }
        return true;
    }

}