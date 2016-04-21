// A basic platformer game

"use strict";

var LOG_FPS = false;

// change in position per frame
var POSITION_CHANGE = 5;
var WALK_SPEED = 0.4;
var RUN_SPEED = WALK_SPEED * 2.0;
var JUMP_SPEED = 0.25;
var FALL_SPEED = JUMP_SPEED;
var ROTATION_CHANGE = 0.05;
var SCALE_CHANGE = 0.1;
var ALPHA_CHANGE = 0.01;
var GAME_WIDTH = 1000;
var GAME_HEIGHT = 600

var SHOW_HITBOXES = true;

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

/**
 */
class PlatformGame extends Game {
    
    constructor(canvas) {

        super("PlatformGame", GAME_WIDTH, GAME_HEIGHT, canvas);


        // Player sprite
        this.player = new PlayerSprite("Player", "PlayerAnimations.png");

        // attach and display player's hitbox
        var playerHitboxWidth = 56;
        var playerHitboxHeight = 108;
        var playerHitboxTopLeft = {'x': -playerHitboxWidth/2.0, 'y': -playerHitboxHeight/2.0};
        this.player.hitbox = new Rectangle(playerHitboxTopLeft, playerHitboxWidth, playerHitboxHeight);
        this.player.showHitbox = SHOW_HITBOXES;
        this.player.setPosition({x: 250.0, y: 480.282});
        this.player.setPivotPoint({x:64, y:56}); // center
        this.player.setScale({x:1.5, y:1.5});

        // this.player.setRotation(0.1 * Math.PI);

        // this.player.hitboxPolygon = this.player.hitbox.toPolygon();

        this.player.setAlpha(1.0);
        var playerAlphaTween = new Tween(this.player);
        playerAlphaTween.animate(TweenableParam.ALPHA, 0.0, 1.0, 1000);
        this.tweenJuggler.add(playerAlphaTween);

        // for player's hitbox to light up red on collision
        this.player.hitbox.color = "black";

        var playerMass = 50;
        this.player.physics = new Physics(playerMass);


        var ground = new Sprite("Ground", "Platform.png");
        ground.setPosition({x: GAME_WIDTH/2, y: GAME_HEIGHT-20});
        ground.setPivotPoint({x: 168, y: 24});
        ground.setScaleX(3);
        ground.showHitbox = SHOW_HITBOXES;
        ground.hitbox = new Rectangle({x:-170, y:-24}, 400, 48);

        this.platforms = [ground];

        var leftWall = new Sprite("LeftWall", "Brickwall.jpg");
        leftWall.hitbox = new Rectangle({x:-476.5, y:-300}, 953, 600);
        leftWall.setRotation(-1 * Math.PI / 2.0);
        // leftWall.setRotation(-.5 * Math.PI / 2.0);
        leftWall.setPosition({x: -250, y: 300});
        leftWall.setPivotPoint({x: 476.5, y: 300});
        // leftWall.setScale({x:2, y:1});
        this.platforms.push(leftWall);
        leftWall.showHitbox = SHOW_HITBOXES;

        var rightWall = new Sprite("RightWall", "Brickwall.jpg");
        rightWall.hitbox = new Rectangle({x:-476.5, y:-300}, 953, 600);
        rightWall.setRotation(1 * Math.PI / 2.0);
        // leftWall.setRotation(-.5 * Math.PI / 2.0);
        rightWall.setPosition({x: 1250, y: 300});
        rightWall.setPivotPoint({x: 476.5, y: 300});
        // leftWall.setScale({x:2, y:1});
        this.platforms.push(rightWall);
        rightWall.showHitbox = SHOW_HITBOXES;

        var ceiling = new Sprite("Ceiling", "Brickwall.jpg");
        ceiling.hitbox =  new Rectangle({x:-476.5, y:-300}, 953, 600);
        ceiling.setRotation(Math.PI);
        // leftWall.setRotation(-.5 * Math.PI / 2.0);
        ceiling.setPosition({x: 500, y: -250});
        ceiling.setPivotPoint({x: 476.5, y: 300});
        // leftWall.setScale({x:2, y:1});
        this.platforms.push(ceiling);
        ceiling.showHitbox = SHOW_HITBOXES;



        this.root.addChild(leftWall);
        this.root.addChild(rightWall);
        this.root.addChild(ceiling);
        this.root.addChild(ground);

        this.root.addChild(this.player);


    }

    update(pressedKeys, dt){

        if (LOG_FPS) {
            var fps = 1000.0/dt;
            console.log("FPS: " + fps);
        }

        this.tweenJuggler.update();
        super.update(pressedKeys, dt);
        
        var newPosition = this.player.getPosition();
        var oldPosition = {x:newPosition.x, y:newPosition.y};
        var newVelocity = this.player.physics.velocity;
        // var oldVelocity = {x:newVelocity.x, y:newVelocity.y};
        // var ballNewPosition = this.ball.getPosition();
        // var ballOldPosition = {x:ballNewPosition.x, y:ballNewPosition.y};
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
                if (pressedKeys.contains(KEY_Y)) {
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
                if (pressedKeys.contains(KEY_Y)) {
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

            // If not moving left or right, stop animation (animations are running or walking)
            if (!(
                pressedKeys.contains(KEY_D) 
                || pressedKeys.contains(KEY_A)
                || pressedKeys.contains(KEY_J)
                )) {
                if (!this.player.stopped) this.player.stopAnimation();
            }

            // Rotate
            if (pressedKeys.contains(KEY_R)) {
                newRotation += ROTATION_CHANGE;
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
        }

        this.player.hitbox.color = "black";
        this.root.update(dt);


        this.player.onGround = false;

        for (var i = 0; i < this.platforms.length; i++) {

            if (this.player.detectAndResolveCollisionWith(this.platforms[i])) {

                this.player.hitbox.color = "red";

                this.player.bounceOffOf(this.platforms[i], 0);
                if (this.platforms[i].id == "Ground") {
                    this.player.onGround = true;
                }
            }

        }  
        if (this.player.onGround) this.player.physics.velocity = {x:0, y:0};

    }

    draw(g) {
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
    var game = new PlatformGame(drawingCanvas);
    game.start();
}