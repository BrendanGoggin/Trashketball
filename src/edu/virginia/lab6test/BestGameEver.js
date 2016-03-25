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

/**
 * Main class. Instantiate or extend Game to create a new game of your own
 */
class BestGameEver extends Game {
    
    constructor(canvas){
        super("Best Game Ever", 1000, 600, canvas);

        // mario sprite
        this.mario = new AnimatedSprite("Mario", "Mario.png");

        // diamond sword in hand
        this.sword = new Sprite("Sword", "Sword.png");
        this.mario.addChild(this.sword);

        // orient them
        this.mario.setPosition({x: 50.0, y: 50.0});
        this.mario.setPivotPoint({x:32, y:44});
        this.mario.getChildAtIndex(0).setPosition({x:-27,y:15});
        this.mario.getChildAtIndex(0).setPivotPoint({x:75,y:75});
        this.sword.setScale({x:0.35, y:.35});
        this.sword.setRotation(Math.PI/2.0);
        this.sword.setAlpha(.5);

    }

    update(pressedKeys){
        super.update(pressedKeys);
        this.mario.update(pressedKeys);
        var newPosition = this.mario.getPosition();
        var newRotation = this.mario.getRotation();
        var newScale = this.mario.getScale();
        var newAlpha = this.mario.getAlpha();

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

        if (pressedKeys.contains(KEY_SPACE)) {
            newRotation += ROTATION_CHANGE;
        }

        if (pressedKeys.contains(KEY_ONE)) {
            newScale.x += SCALE_CHANGE;
        }

        if (pressedKeys.contains(KEY_TWO)) {
            newScale.x -= SCALE_CHANGE;
        }

        if (pressedKeys.contains(KEY_THREE)) {
            newScale.y += SCALE_CHANGE;
        }

        if (pressedKeys.contains(KEY_FOUR)) {
            newScale.y -= SCALE_CHANGE;
        }

        if (pressedKeys.contains(KEY_FIVE)) {
            newScale.x += SCALE_CHANGE;
            newScale.y += SCALE_CHANGE;
        }

        if (pressedKeys.contains(KEY_SIX)) {
            newScale.x -= SCALE_CHANGE;
            newScale.y -= SCALE_CHANGE;
        }

        if (pressedKeys.contains(KEY_Z)) {
            newAlpha += ALPHA_CHANGE;
            if (newAlpha > 1.0) {
                newAlpha = 1.0;
            }
        }

        if (pressedKeys.contains(KEY_X)) {
            newAlpha -= ALPHA_CHANGE;
            if (newAlpha < 0.0) {
                newAlpha = 0.0;
            }
        }

        if (pressedKeys.contains(KEY_SHIFT)) {
            this.mario.setVisible(false);
        } else {
            this.mario.setVisible(true);
        }

        // if (pressedKeys.contains(KEY_P)) {
        //     if (this.mario.paused) {
        //         this.mario.unPause();
        //     }
        //     else {
        //         this.mario.pause();
        //     }
        // }

        if (pressedKeys.size() != 0) {
            this.mario.setPosition(newPosition);
            this.mario.setRotation(newRotation);
            this.mario.setScale(newScale);
            this.mario.setAlpha(newAlpha);
            console.log("Position: " + JSON.stringify(this.mario.getPosition()));
            console.log("Rotation: " + this.mario.getRotation());
            console.log("Scale: " + JSON.stringify(this.mario.getScale()));
            console.log("Alpha: " + this.mario.getAlpha());
            console.log("Visible: " + this.mario.getVisible());
        }
    }

    draw(g){
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.mario.draw(g);
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
    var game = new BestGameEver(drawingCanvas);
    game.start();
}