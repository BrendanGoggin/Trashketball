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

        this.volume = 75;

        this.loadMenu();
        this.loadMenuSounds();

    }


    /**
     * Loads menu
     */
    loadMenu() {
        this.menu = Menu.makeMenuLayer();
        this.root.addChild(this.menu);

        this.paused = false;
        this.pausePressed = false;

        // make the pause screen
        this.pauseLayer = makePauseLayer();

        this.player = false;
        this.balls = [];
        this.trash = false;
        this.walls = [];

        this.levels = [LevelOne, LevelOne, LevelOne, LevelOne, LevelOne];

        // this.enterPressed = false;
    }


    /**
     * Loads menu sounds
     */
    loadMenuSounds() {
        // sounds
        this.sounds = [];

        for (var i = 0; i < this.menu.sounds.length; i++) {
            this.sounds.push(this.menu.sounds[i]);
        }

        this.setVolume(this.volume);
    }


    /**
     * Loads sounds for gameplay
     */
    loadLevelSounds() {
        // sounds
        this.sounds = [];
        // this.song = new Audio();
        // this.song.src = 'resources/sounds/ChibiNinja.mp3';
        // this.song.loop = true;
        // this.song.volume = this.volume;
        // this.song.play();
        // this.sounds.push(this.song);

        for (var i = 0; i < this.player.sounds.length; i++) {
            this.sounds.push(this.player.sounds[i]);
        }

        this.setVolume(this.volume);
    }


    update(pressedKeys, dt) {

        // if menu says load new level, call level load() method
        if (this.menu) {
            if (this.menu.loadNewLevel != -1) {
                this.root.removeChild(this.menu);
                this.levels[this.menu.loadNewLevel].load(this);
                this.loadLevelSounds();
                this.menu = false;
            }
            this.root.updateChildren(pressedKeys, dt);
            return;
        }

        // handle pause key
        else if (pressedKeys.contains(PAUSE_KEY)) {
            if (!this.pausePressed) {
                this.paused = !this.paused;
                if (this.paused) this.pause();
                else this.unpause();
            }
            this.pausePressed = true;
        }
        else {
            this.pausePressed = false;
        }


        // if paused
        if (this.paused) {
            this.pauseLayer.update(pressedKeys, dt);
            if (this.pauseLayer.resumeGame) {
                this.unpause();
                return;
            }
            if (this.pauseLayer.backToMainMenu) {
                this.unpause();
                this.loadMenu();
                this.loadMenuSounds();
                this.menu.enterPressed = true;
                return;
            }
            return;
        }

        // if not paused
        else {

            if (dt > 100) dt = 100;

            this.root.updateChildren(pressedKeys, dt);


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
            return;
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


    /**
     * Handles pauses
     */
    pause() {
        this.paused = true;
        this.pauseLayer = PauseMenu.makePauseMenuLayer();
        this.sounds = [];
        for (var i = 0; i < this.pauseLayer.sounds; i++) {
            this.pauseLayer.sounds[i].volume = this.volume/100.0;
            this.sounds.push(this.pauseLayer.sounds[i]);
        }
        this.pauseLayer.pauseSound.play();
        this.root.addChild(this.pauseLayer);
    }
    unpause() {
        this.paused = false;
        this.root.removeChild(this.pauseLayer);
        this.pauseLayer.pauseSound.play();
        this.pauseLayer = false;
        this.sounds = this.loadLevelSounds();
    }


    /**
     * Called by the volume slider on the webpage
     */
    setVolume(value) {
        this.volume = value;
        if (this.sounds) {
            for (var i = 0; i < this.sounds.length; i++) {
                this.sounds[i].volume = (value/100.0);
            }
        }
        var volumeRangeElement = document.getElementById("volume-range");
        if (volumeRangeElement) volumeRangeElement.value = value;
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
