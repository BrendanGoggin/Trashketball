

"use strict";

/**
 * Makes a new moon rock and adds it to the game when the timer says to do so
 * 
 */
class MoonRockMaker extends DisplayObjectNode {
    
    constructor(id, filename){
        super(id, filename);
        this.timer = false;
        this.gameRoot = false;
        this.gameRocks = false;
        this.gameTrash = false;

        this.timeUntilNextRock = false;
    }

    /**
     * Invoked every frame
     */
    update(pressedKeys, dt) {
        if (this.timer && this.gameRoot && this.gameTrash && this.gameRocks !== false && this.timeUntilNextRock !== false) {
            this.timeUntilNextRock -= dt;
            if (this.timeUntilNextRock <= 0) {
                this.timeUntilNextRock = this.timer.timeStep;
                var rock = MoonRockMaker.makeRock();
                this.gameRoot.addChild(rock);
                this.gameRocks.push(rock);
                this.gameRoot.removeChild(this.gameTrash);
                this.gameRoot.addChild(this.gameTrash);
            }
        }
        if (this.timer) this.lastTime = this.timer.timeLeft;
        super.update(pressedKeys, dt);
    }


    /**
     * Creates and returns a new rock
     */
    static makeRock() {
        var ball = new MoonRockSprite("Ball", "Rock.png");
        ball.showHitbox = SHOW_HITBOXES;
        ball.setPosition({x:300,y:180});
        ball.setPivotPoint({x:75,y:70});
        ball.setScale({x:.45, y:.45});
        ball.hitbox = new Circle({x:0, y:0}, 68);
        ball.physics = new Physics(ball);
        ball.physics.gravity = MOON_GRAVITY;
        ball.physics.makeAngularProportionalToTranslational();
        ball.physics.limitMaxSpeed(1.5);
        ball.physics.limitMaxAngularSpeed();
        return ball;
    }
}

