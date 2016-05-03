"use strict";

var JUMP_SPEED = 0.4;
var WALK_SPEED = 0.4;
var RUN_SPEED = WALK_SPEED * 1.5;

// pressing down increases downward acceleration in the air
var FALL_ACCELERATION; // = 1 * (new Physics().gravity.y);

// how hard he kicks and heads the ball
var KICK_SPEED = 1;
var HEAD_SPEED = .5 * KICK_SPEED;

// key codes
var KEY_SPACE = 32;
var KEY_SHIFT = 16;
var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var KEY_J = 74;
var KEY_K = 75;

// key binding
var SPRINT_KEY = KEY_SHIFT;
var JUMP_KEY  = KEY_SPACE;
var UP_KEY    = KEY_W;
var LEFT_KEY  = KEY_A;
var DOWN_KEY  = KEY_S;
var RIGHT_KEY = KEY_D;
var KICK_KEY  = KEY_J;
var HEADER_KEY  = KEY_K;



/**
 * A very basic Sprite. For now, does not do anything.
 * 
 * */
class PlayerSprite extends Sprite {
    
    constructor(id, filename){
        super(id, filename);
        this.speed = 15; // how many frames the whole animation should take at 60fps
        this.currentFrame = 0;
        this.startIndex = 0; // start animation here (inclusive)
        this.currentIndex = this.startIndex;
        this.endIndex = 5; // end animation here (exclusive)
        this.paused = false;
        this.images = [];
        this.imagesLoaded = 0;
        this.stopped = true;
        this.animationName = "";
        this.frameWidth = 400;
        this.frameHeight = 400;

        this.physics = new Physics(this);

        // set the FALL_ACCELERATION based on gravity
        this.defaultGravity = this.physics.gravity;
        FALL_ACCELERATION = 1 * this.defaultGravity.y;
        this.downPressedGravity = {x: this.defaultGravity.x, y: this.defaultGravity.y + FALL_ACCELERATION};

        this.kicker = false;
        this.kickbox = false;
        this.header = false;
        this.headbox = false;

        // sounds
        this.kickSound = new Audio();
        this.kickSound.src = 'resources/sounds/ball_kick.wav';
        this.sounds = [this.kickSound];
        this.headSound = new Audio();
        this.headSound.src = 'resources/sounds/ball_head.wav';
        this.sounds.push(this.headSound);

        // which frames in the spritesheet each action uses
        this.walkFrames = [5, 4];
        this.kickFrames = [0];
        this.jumpFrames = [1];
        this.runFrames = [2,3];
        this.restFrames = [4];
        this.frameList = this.restFrames;

        // is the player on the ground
        this.onGround = false;

        // which buttons are currently pressed
        this.sprintPressed = false;
        this.jumpPressed = false;
        this.upPressed = false;
        this.rightPressed = false;
        this.leftPressed = false;
        this.downPressed = false;
        this.kickPressed = false;
        this.headerPressed = false;

        // how many jumps player can do, how many remaining
        this.jumpsTotal = 2;
        this.jumpsRemaining = 1;

    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     * dt: time since last call (ms)
     */
    update(pressedKeys, dt) {

        // poll for and handle key presses
        this.pollPressedKeys(pressedKeys);

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

        super.update(pressedKeys, dt);
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
        g.drawImage(this.displayImage, 
            this.frameWidth * this.frameList[this.currentIndex], // sx
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
            this.frameList = this.walkFrames;
        } 
        else if (animation == "run") {
            this.frameList = this.runFrames;
        } 
        else if (animation == "kick") {
            this.frameList = this.kickFrames;
        }
        else if (animation == "jump") {
            this.frameList = this.jumpFrames;
        }
        else {
            this.frameList = this.restFrames;
        }

        this.startIndex = 0
        this.endIndex = this.frameList.length;
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
            this.frameList = this.restFrames;
            this.startIndex = 0;
            this.endIndex = this.frameList.length;
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

    /**
     * Returns the direction in which to kick/head the ball, based on which keys are pressed down
     */
    getKickDirection() {
        var x = 0;
        var y = 0;
        var neutral = true;
        if (this.upPressed) {
            y -= 1;
            neutral = false;
        }
        if (this.downPressed) {
            y += 1;
            neutral = false;
        }
        if (this.rightPressed) {
            x += 1;
            neutral = false;
        }
        if (this.leftPressed) {
            x -= 1;
            neutral = false;
        }

        var direction; 
        if (!neutral) {
            direction = normalize({x:x, y:y});
        }
        else {
            x = (this.scale.x > 0) ? 1 : -1;
            direction = normalize({x:x, y:-3});
        }
        return direction;
    }

    /**
     * Kicks the ball in the given direction (direction is unit vector)
     */
    kickBall(ball, speed) {
        if (!speed && speed !== 0) {
            speed = 1;
        }
        speed *= KICK_SPEED;
        var direction = this.getKickDirection();
        this.exertImpulseOnBall(ball, direction, speed);
        this.kickSound.play();
        return;
    }

    /**
     * Heads the ball in the given direction (direction is a unit vector)
     */
    headBall(ball, speed) {
        if (!speed) {
            speed = 1;
        }
        speed *= HEAD_SPEED;
        var direction = this.getKickDirection();
        this.exertImpulseOnBall(ball, direction, speed);
        this.headSound.play();
        return;
    }

    /**
     * puts an impulse onto the ball
     * to be called by kickBall() and headBall()
     */
    exertImpulseOnBall(ball, direction, speed) {
        var deltaVel = multiplyVectorByScalar(direction, speed);
        // var ballOldVel = {x: ball.physics.velocity.x, y: ball.physics.velocity.y};
        // ball.physics.velocity = vectorAdd(ballOldVel, deltaVel);
        ball.physics.velocity = deltaVel;
        ball.position = vectorAdd(ball.position, direction);
        return;
    }

    /**
     * executes a jump
     */
    jump() {
        this.physics.velocity.y = -JUMP_SPEED;
        this.onGround = false;
    }

    /**
     * Alert this object that it is on the ground
     */
    hitGround() {
        if (!this.onGround) {
            this.onGround = true;
            this.jumpsRemaining = this.jumpsTotal;
        }
    }

    /**
     * Alert this object that jump has been pressed
     */
    pressJump() {
        if (this.jumpsRemaining > 0 && !this.jumpPressed) {
            this.jumpsRemaining -= 1;
            this.jumpPressed = true;
            this.jump();
        }
        else {
            this.jumpPressed = true;
        }
    }

    /**
     * Poll for and handle key presses
     */
    pollPressedKeys(pressedKeys) {
        this.pressedKeys = pressedKeys;
        this.pollSprint();
        this.pollDown();
        this.pollJump();
        this.pollLeft();
        this.pollRight();
        this.pollUp();
        this.pollKick();
        this.pollHeader();
        
        // stop animation if no relevant keys pressed
        if (!(this.leftPressed || this.rightPressed || this.kickPressed || this.headerPressed)) {
            this.stopAnimation();
        }

    }

    /**
     * Polls for and handles sprint
     */
    pollSprint() {
        this.sprintPressed = this.pressedKeys.contains(SPRINT_KEY);
    }

    /**
     * Polls for and handles jump
     */
    pollJump() {
        if (this.pressedKeys.contains(JUMP_KEY)) {
            if (this.jumpsRemaining > 0 && !this.jumpPressed) {
                this.jumpsRemaining -= 1;
                this.jump();
            }
            this.jumpPressed = true;
        }
        else {
            this.jumpPressed = false;
        }
    }

    /**
     * Polls for and handles Left
     */
    pollLeft() {
        // Walk left
        if (this.pressedKeys.contains(LEFT_KEY)) {
            this.leftPressed = true;
            if (this.scale.x >= 0)  {
                this.scale.x *= -1.0;
                this.position.x += 25;
            }
            if (this.sprintPressed) {
                this.animate("run");
                this.setSpeed(15); // animation speed

                if (this.onGround) {
                    this.physics.velocity.x = -RUN_SPEED;
                    this.physics.acceleration.x = 0;
                } else {
                    this.physics.acceleration.x = -RUN_SPEED / 1000.0;
                }
            }
            else {
                this.animate("walk");
                this.setSpeed(20); // animation speed
                if (this.onGround) {
                    this.physics.velocity.x = -WALK_SPEED;
                    this.physics.acceleration.x = 0;
                } 
                else {
                    this.physics.acceleration.x = -WALK_SPEED / 1000.0;
                }
            };
        } 
        else {
            this.leftPressed = false;
            if (this.physics.acceleration.x < 0) this.physics.acceleration.x = 0;
        }
    }

    /**
     * Polls for and handles Right
     */
    pollRight() {
        // Walk right
        if (this.pressedKeys.contains(RIGHT_KEY)) {
            this.rightPressed = true;
            if (this.scale.x < 0) {
                this.scale.x *= -1.0;
                this.position.x -= 25;
            }
            if (this.sprintPressed) {
                this.animate("run");
                this.setSpeed(15); // animation speed

                if (this.onGround) {
                    this.physics.velocity.x = RUN_SPEED;
                    this.physics.acceleration.x = 0;
                } else {
                    this.physics.acceleration.x = RUN_SPEED / 1000;
                }
            }
            else {
                this.animate("walk");
                this.setSpeed(20); // animation speed
                if(this.onGround) {
                    this.physics.velocity.x = WALK_SPEED;
                    this.physics.acceleration.x = 0;
                }
                else {
                    this.physics.acceleration.x = WALK_SPEED / 1000;
                }
            };
        }
        else {
            this.rightPressed = false;
            if (this.physics.acceleration.x > 0) this.physics.acceleration.x = 0;
        }
    }

    /**
     * Polls for and handles Down
     */
    pollDown() {
        // Down
        if (this.pressedKeys.contains(DOWN_KEY)) {
            this.downPressed = true;
        }
        else {
            this.physics.acceleration.y = 0;
            this.downPressed = false;
        }
        if (!this.onGround) {
            if (this.downPressed) {
                this.physics.acceleration.y = this.downPressedGravity.y;
            }
        }
    }

    /**
     * Polls for and handles Up
     */
    pollUp() {
        // Up
        if (this.pressedKeys.contains(UP_KEY)) {
            this.upPressed = true;
        }
        else {
            this.upPressed = false;
        }
    }

    /**
     * Polls for and handles Kick
     */
    pollKick() {
        // Kick
        if (this.pressedKeys.contains(KICK_KEY)) {
            this.kickPressed = true;
            this.kicker.hitbox = this.kickbox;
            this.animate("kick");
            this.setSpeed(15);
        }
        else {
            this.kicker.hitbox = false;
            this.kickPressed = false;
        }
    }

    /**
     * Polls for and handles Header
     */
    pollHeader() {
        // Header
        if (this.pressedKeys.contains(HEADER_KEY)) {
            this.headerPressed = true;
            this.header.hitbox = this.headbox;
            this.animate("jump");
            this.setSpeed(15);
        }
        else {
            this.headerPressed = false;
            this.header.hitbox = false;
        }
    }
}


