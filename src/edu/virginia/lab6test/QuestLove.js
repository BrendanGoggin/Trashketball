"use strict";

// change in position per frame
var POSITION_CHANGE = 5;
var ROTATION_CHANGE = 0.05;
var SCALE_CHANGE = 0.1;
var ALPHA_CHANGE = 0.01;

// common key codes
var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var KEY_UP = 38;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_SPACE = 32;
// var KEY_P = 80;
// var KEY_PLUS = 187;
// var KEY_MINUS = 189; 
var KEY_ONE = 49;
var KEY_TWO = 50;
var KEY_THREE = 51;
var KEY_FOUR = 52;
var KEY_FIVE = 53;
var KEY_SIX = 54;
var KEY_Z = 90;
var KEY_X = 88;
var KEY_Y = 89;
var KEY_SHIFT = 16;
var KEY_R = 82;

/**
 * Quest Love
 * Objective: pick up the diamond sword
 * You are Mario
 */
class QuestLove extends Game {
    
    constructor(canvas) {
        super("Quest Love", 1000, 600, canvas);

        this.root = new DisplayObjectNode("Root");

        // mario sprite
        this.mario = new AnimatedSprite("Mario", "Mario.png");
        this.root.addChild(this.mario);

        // attach and display mario's hitbox
        var marioHitboxTopLeft = {'x': -30, 'y': -35};
        var marioHitboxWidth = 55;
        var marioHitboxHeight = 80;
        this.mario.hitbox = new Rectangle(marioHitboxTopLeft, marioHitboxWidth, marioHitboxHeight);
        this.mario.showHitbox = true;

        // diamond sword in mid stage
        this.sword = new Sprite("Sword", "Sword.png");
        this.root.addChild(this.sword);

        // attach and display sword's hitbox
        var hitboxTopLeft = {'x': -80, 'y': -80};
        var hitboxWidth = 180;
        var hitboxHeight = 180;
        this.sword.hitbox = new Rectangle(hitboxTopLeft, hitboxWidth, hitboxHeight);
        this.sword.showHitbox = true;

        // the event dispatcher that will throw events for swordy things
        this.sword.eventDispatcher = new EventDispatcher();

        // Quest Love's manager listens for events and outputs moral support
        this.questLoveManager = new QuestManager();

        // the event to throw when the sword is picked up
        this.swordPickUpEvent = new Event("swordPickUp", this.sword.eventDispatcher);

        // add the event listener to the dispatcher
        this.sword.eventDispatcher.addEventListener(
            this.questLoveManager, 
            this.swordPickUpEvent.eventType
        );



        // orient them
        this.mario.setPosition({x: 50.0, y: 50.0});
        this.mario.setPivotPoint({x:32, y:44}); // center
        this.sword.setPosition({x:500,y:300});
        this.sword.setPivotPoint({x:75,y:75}); // center
        this.sword.setScale({x:0.35, y:.35});
        // this.sword.setRotation(Math.PI/2.0);
        // this.sword.setAlpha(.5);

    }

    update(pressedKeys){
        super.update(pressedKeys);
        this.mario.update(pressedKeys);
        var newPosition = this.mario.getPosition();
        var newScale = this.mario.getScale();
        var newRotation = this.mario.getRotation();

        // use key codes to update position coordinates
        if (pressedKeys.contains(KEY_W) || pressedKeys.contains(KEY_UP)) {
            newPosition.y -= POSITION_CHANGE;
        }

        if (pressedKeys.contains(KEY_A) || pressedKeys.contains(KEY_LEFT)) {
            newPosition.x -= POSITION_CHANGE;
            if (newScale.x >= 0) newScale.x *= -1.0;
            if (pressedKeys.contains(KEY_Y)) {
                this.mario.animate("run");
                this.mario.setSpeed(15);
                newPosition.x -= POSITION_CHANGE;
            }
            else {
                this.mario.animate("walk");
                this.mario.setSpeed(20);
            };
        }

        if (pressedKeys.contains(KEY_D) || pressedKeys.contains(KEY_RIGHT)) {
            newPosition.x += POSITION_CHANGE;
            if (newScale.x < 0) newScale.x *= -1.0;
            if (pressedKeys.contains(KEY_Y)) {
                this.mario.animate("run");
                this.mario.setSpeed(15);
                newPosition.x += POSITION_CHANGE;
            }
            else {
                this.mario.animate("walk");
                this.mario.setSpeed(20);
            };
            
        }

        if (!(pressedKeys.contains(KEY_D) || pressedKeys.contains(KEY_RIGHT) 
            || pressedKeys.contains(KEY_A) || pressedKeys.contains(KEY_LEFT))) {
            if (!this.mario.stopped) this.mario.stopAnimation();
        }

        if (pressedKeys.contains(KEY_S) || pressedKeys.contains(KEY_DOWN)) {
            newPosition.y += POSITION_CHANGE;
        }

        if (pressedKeys.contains(KEY_R)) {
            newRotation += ROTATION_CHANGE;
        }

        if (pressedKeys.size() != 0) {
            this.mario.setPosition(newPosition);
            this.mario.setScale(newScale);
            this.mario.setRotation(newRotation);
            // console.log("Position: " + JSON.stringify(this.mario.getPosition()));
            // console.log("Scale: " + JSON.stringify(this.mario.getScale()));
            // console.log("Sword Position: " + JSON.stringify(this.sword.getPosition()));
            // console.log("x distance: " + Math.abs(this.mario.getPosition().x - this.sword.getPosition().x));
            // console.log("y distance: " + Math.abs(this.mario.getPosition().y - this.sword.getPosition().y));
        }

        // check for intersection with sword
        // not the most efficient, but it works for now.
        if (this.mario.collidesWith(this.sword) || this.sword.collidesWith(this.mario)) {
            // intersection occurred. make sword invisible, throw event
            this.sword.visibile = false;
            this.sword.setAlpha(0.0);
            this.sword.eventDispatcher.dispatchEvent(this.swordPickUpEvent);

            console.log("Intersection!");

            // this.sword.hitbox = undefined;
        }


    }

    draw(g){
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);
    }
}


/**
 * THIS IS THE BEGINNING OF THE PROGRAM
 * YOU NEED TO COPY THIS VERBATIM ANYTIME YOU CREATE A GAME
 */
function tick(){
    game.nextFrame();
}

/* Get the drawing canvas off of the document */
var drawingCanvas = document.getElementById('game');
if(drawingCanvas.getContext) {
    var game = new QuestLove(drawingCanvas);
    game.start();
}