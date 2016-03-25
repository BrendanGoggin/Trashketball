"use strict";

/**
 * A very basic Sprite. For now, does not do anything.
 * 
 * */
class AnimatedSprite extends Sprite {
    
    constructor(id, filename){
        super(id, filename);
        this.speed = 15; // how many frames the whole animation should take at 60fps
        this.currentFrame = 0;
        this.startIndex = 0; // start animation here (inclusive)
        this.endIndex = 2; // end animation here (exclusive)
        this.paused = false;
        this.images = [];
        this.imagesLoaded = 0;
        this.stopped = true;
        this.animationName = "";
    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     * dt: time since last call (ms)
     */
    update(dt) {
        if (!this.stopped && !this.paused && this.imagesLoaded == (this.endIndex - this.startIndex)) {
            this.currentFrame++;
            var framesPerImage = Math.floor(this.speed / (this.endIndex - this.startIndex));
            if (this.currentFrame >= framesPerImage) {
                this.currentFrame = 0;
                this.currentIndex++;
                this.currentIndex = this.currentIndex % (this.endIndex - this.startIndex);
                this.displayImage = this.images[this.currentIndex];
            }
        }
        super.update(dt);
    }

    /**
     * Draws this image to the screen
     */
    draw(g){
        super.draw(g);
    }

    /**
    * Begins the animation
    */
    animate(animation) {
        if (this.animationName === animation) return;
        this.animationName = animation;
        this.imagesLoaded = 0;
        this.images = [];
        this.currentFrame = 0;
        this.currentIndex = this.startIndex;
        for (var i = this.startIndex; i < this.endIndex; i++) {
            this.images[i] = new Image();
            var t = this;
            this.images[i].onload = function() {
                t.imagesLoaded++;
            }
            var fileSplitByDots = this.filename.split(".");
            var extension = fileSplitByDots[fileSplitByDots.length-1];
            var fileWithoutExtension = this.filename.substring(0, this.filename.length - extension.length - 1);
            this.images[i].src = "resources/" + fileWithoutExtension + "_" + animation + "_" + i + "." + extension;
        }
        this.paused = false;
        this.stopped = false;
    }

    /**
    * Stops the animation on its default image
    */
    stopAnimation() {
        if (!this.stopped) {
            this.loadImage(this.filename);
            this.stopped = true;
            this.animationName = "";
        }
    }

    /**
    * Pauses the animation on its current frame
    */
    pause() {
        this.paused = true;
    }

    /**
    * unpauses the animation
    */
    unPause() {
        this.paused = false;
    }

    /**
    * toggles pause status
    */
    togglePause() {
        this.paused = !this.paused;
    }

    /**
    *  Sets the animation speed in frames per loop
    */
    setSpeed(speed) {
        this.speed = speed;
    }
}

