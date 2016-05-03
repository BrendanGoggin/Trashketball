"use strict";

// coefficient of restitution for ball-wall bounces. 0 = no bounce, 1 = completely elastic, >1 = gains speed
var C_REST_WALL = .4;

var score = 0;
var multiplier = 1;

var KEY_ESC = 27;
var PAUSE_KEY = KEY_ESC;

var GAME_WIDTH = 1000;
var GAME_HEIGHT = 600;

/**
 * A game to test the menu functionality
 */
class MenuGame extends Game {
    
    constructor(canvas) {

        super("Trashketball", GAME_WIDTH, GAME_HEIGHT, canvas);

        this.menu = Menu.makeMenuLayer();
        this.root.addChild(this.menu);

        this.player = false;
        this.balls = [];
        this.trash = false;
        this.walls = [];

        this.levels = [LevelOne];


    }

    update(pressedKeys, dt) {
        this.root.updateChildren(pressedKeys, dt);

        // if menu says load new level, call level load() method
        if (this.menu) {
            if (this.menu.loadNewLevel != -1) {
                this.levels[this.menu.loadNewLevel].load(this);
                this.menu = false;
            }
        }

        // detect and handle all ball collisions
        for (var i = 0; i < this.balls.length; i++) {

            // ball-player collisions (kicking, heading)
            if (this.player) {
                this.player.handleCollisionWithBall(this.balls[i], this);
            }

            // ball-trash collisions (including trash walls)
            if (this.trash) {
                this.balls[i].handleCollisionWithTrash(this.trash, this);
            }

            // ball-wall collisions
            for (var j = 0; j < this.walls.length; j++) {
                this.balls[i].handleCollisionWithWall(this.walls[j], this);
            }
        }

        // detect and handle player-wall collisions
        if (this.player) {
            for (var i = 0; i < this.walls.length; i++) {
                this.player.handleCollisionWithWall(this.walls[i], this);
            }
        }

    }

    draw(g){
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);

        // var ctx = this.canvas.getContext("2d");
        // ctx.font = "36px Georgia";
        // ctx.fillText("Score: "+this.score, 750, 100);
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
    var game = new MenuGame(drawingCanvas);
    game.start();
}
