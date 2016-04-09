"use strict";

/**
 * A very basic Sprite. For now, does not do anything.
 * 
 * */
class PlayerSprite extends Sprite {
    
    constructor(id, filename){
        super(id, filename);
        this.speed = 15; // how many frames the whole animation should take at 60fps
        this.currentFrame = 0;
        this.startIndex = 4; // start animation here (inclusive)
        this.currentIndex = this.startIndex;
        this.endIndex = 5; // end animation here (exclusive)
        this.paused = false;
        this.images = [];
        this.imagesLoaded = 0;
        this.stopped = true;
        this.animationName = "";
        this.frameWidth = 128;
        this.frameHeight = 128;

        // which frames in the spritesheet each action uses
        this.walkFrames = [4,5];
        this.kickFrames = [0,1];
        this.runFrames = [2,3];
        this.restFrame = [4];
    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     * dt: time since last call (ms)
     */
    update(dt) {
        if (!this.stopped && !this.paused) { // && this.imagesLoaded == (this.endIndex - this.startIndex)) {
            this.currentFrame++;
            var framesPerImage = Math.floor(this.speed / (this.endIndex - this.startIndex));
            if (this.currentFrame >= framesPerImage) {
                this.currentFrame = 0;
                this.currentIndex++;
                if (this.currentIndex == this.endIndex) this.currentIndex = this.startIndex;
                // this.currentIndex = this.currentIndex % (this.endIndex - this.startIndex);
            }
        }
        super.update(dt);
    }

    /**
     * Draws this image to the screen and applies transformations
     */
    draw(g) {
        if(this.visible){
            this.applyTransformations(g);
            if(this.displayImage && this.loaded) {
                this.drawSelfImage(g);
            }
            if (this.showHitbox) this.drawHitbox(g);
            this.children.forEach(function(child) {
                child.draw(g);
            });
            this.reverseTransformations(g);
        }
    }

    /**
     *  Draws just this obj's image to the screen,
     *  Doesn't apply transformations or anything else.
     *  Is called in the draw(g) method.
     */
     drawSelfImage(g) {
        debugger;
        g.drawImage(this.displayImage, 
            this.frameWidth * this.currentIndex, // sx
            0, //sy
            this.frameWidth, //sw
            this.frameHeight, //sh
            -this.pivotPoint.x, //dx
            -this.pivotPoint.y, //dy
            this.frameWidth, //dw
            this.frameHeight); //dh
     }

    /**
    * Begins the animation
    */
    animate(animation) {
        if (this.animationName === animation) return;
        this.animationName = animation;

        this.currentFrame = 0;

        if (animation == "walk") {
            this.startIndex = this.walkFrames[0];
            this.endIndex = this.walkFrames[this.walkFrames.length-1]+1;
        } 
        else if (animation == "run") {
            this.startIndex = this.runFrames[0];
            this.endIndex = this.runFrames[this.runFrames.length-1]+1;
        } 
        else if (animation == "kick") {
            this.startIndex = this.kickFrames[0];
            this.endIndex = this.kickFrames[this.kickFrames.length-1]+1;
        }

        this.currentIndex = this.startIndex;

        this.paused = false;
        this.stopped = false;
    }

    /**
    * Stops the animation on its default image
    */
    stopAnimation() {
        if (!this.stopped) {
            // this.loadImage(this.filename);
            this.startIndex = this.restFrame[0];
            this.endIndex = this.restFrame[0];
            this.currentIndex = this.startIndex;
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

