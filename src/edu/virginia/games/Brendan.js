// Nanzhu's WIP


"use strict";

// change in position per frame
var POSITION_CHANGE = 5;
var WALK_SPEED = 0.4;
var RUN_SPEED = WALK_SPEED * 2.0;
var JUMP_SPEED = 0.25;
var FALL_SPEED = JUMP_SPEED;
var ROTATION_CHANGE = 0.05;
var SCALE_CHANGE = 0.1;
var ALPHA_CHANGE = 0.01;


// coefficient of restitution for ball-wall bounces. 0 = no bounce, 1 = completely elastic, >1 = gains speed
var C_REST_WALL = .8;

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
var KEY_J = 74;
var KEY_K = 75;
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
var score = 0;
var multiplier = 1;

/**
 */
class Trashketball extends Game {
    
    constructor(canvas) {

        super("Trashketball", GAME_WIDTH, GAME_HEIGHT, canvas);

        this.song = new Audio();
        this.song.src = 'resources/sounds/ChibiNinja.mp3';
        this.song.loop = true;
        this.song.play();

        this.score = 0;
        var attempts = 3;

        // make the player
        this.player = makePlayer();

        // make the ball
        this.ball = makeBall();

        // trash can
        this.trash = makeTrash();
        
        // the trashcan walls in an array
        this.trashWalls = this.trash.children;

        // make the walls of the level
        var wallLayer = makeWallLayer();
        this.walls = wallLayer.children;

        this.root.addChild(wallLayer);
        this.root.addChild(this.player);
        this.root.addChild(this.ball);
        this.root.addChild(this.trash);

    }

    update(pressedKeys, dt){
        if (dt > 100) dt = 100;
        this.tweenJuggler.update();
        super.update(pressedKeys, dt);
        
        var newPosition = this.player.getPosition();
        var oldPosition = {x:newPosition.x, y:newPosition.y};
        var newVelocity = this.player.physics.velocity;
        // var oldVelocity = {x:newVelocity.x, y:newVelocity.y};
        var ballNewPosition = this.ball.getPosition();
        var ballOldPosition = {x:ballNewPosition.x, y:ballNewPosition.y};
        var newScale = this.player.getScale();
        var newRotation = this.player.getRotation();

        // use key codes to update position coordinates
        if (pressedKeys.size() != 0) {

            // Jump
            if (pressedKeys.contains(KEY_SPACE)) {
                newVelocity.y = -JUMP_SPEED;
            }

            // Walk left
            if (pressedKeys.contains(KEY_A)) {
                newVelocity.x = -WALK_SPEED;
                if (newScale.x >= 0) newScale.x *= -1.0;
                if (pressedKeys.contains(KEY_SHIFT)) {
                    this.player.animate("run");
                    this.player.setSpeed(15);
                    newVelocity.x = -RUN_SPEED;
                }
                else {
                    this.player.animate("walk");
                    this.player.setSpeed(20);
                };
            }

            // Walk right
            if (pressedKeys.contains(KEY_D)) {
                newVelocity.x = WALK_SPEED;
                if (newScale.x < 0) newScale.x *= -1.0;
                if (pressedKeys.contains(KEY_SHIFT)) {
                    this.player.animate("run");
                    this.player.setSpeed(15);
                    newVelocity.x = RUN_SPEED;
                }
                else {
                    this.player.animate("walk");
                    this.player.setSpeed(20);
                };
                
            }

            // Down
            if (pressedKeys.contains(KEY_S)) {
                newVelocity.y = FALL_SPEED;
            }

            // Kick
            if (pressedKeys.contains(KEY_J)) {
                this.player.kicker.hitbox = this.player.kickbox;
                // this.player.kicker.hitbox.showHitbox = SHOW_HITBOXES;
                this.player.animate("kick");
                this.player.setSpeed(15);
                // console.log("kick");
            }
            else {
                this.player.kicker.hitbox = false;
            }

            // Header
            if (pressedKeys.contains(KEY_K)) {
                this.player.header.hitbox = this.player.headbox;
            }
            else {
                this.player.header.hitbox = false;
            }

            // If not moving left or right, stop animation (animations are running or walking)
            if (!(
                pressedKeys.contains(KEY_D) 
                || pressedKeys.contains(KEY_A)
                || pressedKeys.contains(KEY_J)
                )) {
                if (!this.player.stopped) this.player.stopAnimation();
            }

            // update player's info
            this.player.setPosition(newPosition);
            this.player.physics.velocity = newVelocity;
            this.player.setScale(newScale);
            this.player.setRotation(newRotation);
        }

        // No buttons pressed
        else {
            if (!this.player.stopped) this.player.stopAnimation();
            this.player.kicker.hitbox = false;
            this.player.header.hitbox = false;
        }

        this.player.hitbox.color = "black";
        this.root.update(dt);



        // Kicking
        if (this.player.kicker.hitbox) {
            if (this.ball.detectCollisionWith(this.player.kicker) && !this.kicking && !this.heading) {
                // this.ball.bounceOffOf(this.player.kicker);
                if (!this.kicking) {
                    var direction = normalize({x: 1, y: -2});
                    var directionFlip = (this.player.scale.x > 0) ? 1 : -1;
                    // var speed = 1;
                    direction.x *= directionFlip;
                    this.kicking = true;
                    this.player.kickBall(this.ball, direction);
                }
            }
            // else {
            //     this.kicking = false;
            // }
        }
        else {
            this.kicking = false;
        }


        // Heading
        if (this.player.header.hitbox) {
            if (this.ball.detectCollisionWith(this.player.header) && !this.heading) {
                var direction = normalize({x: 1, y: -3});
                var directionFlip = (this.player.scale.x > 0) ? 1 : -1;
                // var speed = .5;
                direction.x *= directionFlip;
                this.player.headBall(this.ball, direction);
                this.heading = true;
            }
        }
        else {
            this.heading = false;
        }



        for (var i = 0; i < this.trashWalls.length; i++) {
            // debugger;
            var ballTrashWallResolution = this.ball.detectAndResolveCollisionWith(this.trashWalls[i]);
            if (ballTrashWallResolution) {
                this.ball.bounceOffOf(this.trashWalls[i], 0.5, ballTrashWallResolution);
                this.ball.hitbox.color = "red";
                this.trashWalls[i].hitbox.color = "red";
            }
            else {
                this.trashWalls[i].hitbox.color = "black";
            }
        }

        this.ball.hitbox.color = "black";
        for (var i = 0; i < this.walls.length; i++) {

            // player-wall collision handling
            if (this.player.detectAndResolveCollisionWith(this.walls[i])) {
                this.player.bounceOffOf(this.walls[i], 0);
                this.player.hitbox.color = "red";
                this.walls[i].hitbox.color = "red";


                if (this.walls[i].id == "Ground") {
                    this.player.physics.velocity = {x:0, y:0};
                }

            }
            else {
                this.walls[i].hitbox.color = "black";
            }


            // ball-wall collision handling
            var ballPlatformResolution = this.ball.detectAndResolveCollisionWith(this.walls[i]);
            if (ballPlatformResolution) {
                this.ball.bounceOffOf(this.walls[i], C_REST_WALL, ballPlatformResolution);
            }
        }  

        if (this.ball.detectCollisionWith(this.trash)) {
            this.trash.hitbox.color = "green";
        } 
        else {
            this.trash.hitbox.color = "black";
        }

    }

    draw(g){
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);

        var ctx = this.canvas.getContext("2d");
        ctx.font = "36px Georgia";
        ctx.fillText("Score: "+this.score, 750, 100);
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
    var game = new Trashketball(drawingCanvas);
    game.start();
}