// A basic platformer game

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
var score = 0;
var multiplier = 1;

/**
 */
class PlatformGame extends Game {

    constructor(canvas) {

        super("PlatformGame", GAME_WIDTH, GAME_HEIGHT, canvas);

        this.score = 0;
        var attempts = 3;

        // Player sprite
        this.player = new PlayerSprite("Player", "KidAnimations.png");

        // attach and display player's hitbox
        var playerHitboxWidth = 200;
        var playerHitboxHeight = 350;
        var playerHitboxTopLeft = {'x': -playerHitboxWidth/2.0, 'y': -playerHitboxHeight/2.0};
        this.player.hitbox = new Rectangle(playerHitboxTopLeft, playerHitboxWidth, playerHitboxHeight);
        this.player.showHitbox = SHOW_HITBOXES;
        this.player.setPosition({x: 250.0, y: 350.0});
        this.player.setPivotPoint({x:200, y:175}); // center
        this.player.setScale({x:0.5, y:0.5});

        // player's kicking foot node
        this.kicker = new DisplayObjectNode("Kicker", "");
        this.kicker.setPosition({x:12, y: 120});
        var kickerWidth = 200;
        var kickerHeight = 100;
        this.kicker.setPivotPoint({x: kickerWidth / 2.0, y: kickerHeight / 2.0});
        this.kicker.hitbox = false;
        this.kickbox = new Rectangle({x: -kickerWidth / 2.0, y: -kickerHeight / 2.0}, kickerWidth, kickerHeight);
        // this.kicker.hitbox = this.kickbox;
        this.kicker.showHitbox = true;
        //this.kicker.normal = {x: 0.70711, y: 0.70711};
        this.player.addChild(this.kicker);

        // player's heading foot node
        this.header = new DisplayObjectNode("Header", "");
        this.header.setPosition({x:0, y:-100});
        var headerWidth = 200;
        var headerHeight = 100;
        this.header.setPivotPoint({x: -headerWidth / 2.0, y: -headerHeight / 2.0});
        this.header.hitbox = false;
        this.headbox = new Rectangle({x: -headerWidth/2.0, y: -headerHeight/2.0}, headerWidth, headerHeight);
        this.header.showHitbox = true;
        this.header.normal = {x: 0.70711, y: 0.70711};
        this.player.addChild(this.header);

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

        var life = new Sprite("Life0", "Ball.png");
        life.setScale({x:0.2, y:0.2});
        life.setPosition({x: 60, y: 60});
        this.attempt_sprites = [life];
        this.root.addChild(life);
        var xstart = 100;
        for(var num = 1; num < attempts; num+=1){
            var extra_life = new Sprite("Life"+num, "Ball.png");
            extra_life.setScale({x:0.2, y:0.2});
            extra_life.setPosition({x: xstart, y: 60});
            this.attempt_sprites.push(extra_life);
            xstart+=40;
            this.root.addChild(extra_life);
        }


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

        // this.trashcan = new Sprite("Trashcan", "Trashcan.png");
        // this.trashcan.setPosition({x: 500, y: 450});
        // this.trashcan.setPivotPoint({x:49.5, y: 48});
        // this.trashcan.setScale({x: 1.4, y: 1.75});

        // ball for player to get (208x278 sprite)
        this.ball = new Sprite("Ball", "Ball.png");
        this.trash = new Sprite("Trash", "Trash.png");
        this.trash.setScale({x:2,y:2});
        // this.root.addChild(this.ball);
        // this.root.addChild(this.trash);
        // var hitboxTopLeft = {x: -104, y: -139};
        var hitboxWidth = this.ball.displayImage.width;
        var hitboxHeight = this.ball.displayImage.height;
        var hitboxTopLeft = {x: -95, y: -135};
        var hitboxWidth = 140;
        var hitboxHeight = 140;
        this.ball.hitbox = new Rectangle(hitboxTopLeft, hitboxWidth, hitboxHeight);
//  HEAD
        this.ball.showHitbox = SHOW_HITBOXES;
// ===
        this.trash.hitbox = new Rectangle({x: 0, y: 0},this.trash.displayImage.width,this.trash.displayImage.height/3);
        this.trash.showHitbox = SHOW_HITBOXES;
        this.ball.setPosition({x:700,y:180});
        this.trash.setPosition({x:800,y:460});
// === master
        this.ball.setPivotPoint({x:104,y:139});
        this.ball.setScale({x:0.4, y:0.4});


        // this.ball.showHitbox = true;
        // this.trash.showHitbox = true;
        // this.player.showHitbox = true;
        // this.ball.setScale({x:0.4, y:0.26});

        // the event dispatcher that will throw events for bally things
        this.ball.eventDispatcher = new EventDispatcher();

        // Quest Love's manager listens for events and outputs moral support
        this.questLoveManager = new QuestManager(this);

        // the event to throw when the sword is picked up
        this.ballPickUpEvent = new Event("ballPickUp", this.ball.eventDispatcher);

        // add the event listener to the dispatcher
        this.ball.eventDispatcher.addEventListener(
            this.questLoveManager,
            this.ballPickUpEvent.eventType
        );

        var ballMass = 50;
        this.ball.physics = new Physics(ballMass);
        this.ball.physics.velocity = {x:.001, y:.001};

        this.root.addChild(leftWall);
        this.root.addChild(rightWall);
        this.root.addChild(ceiling);
        this.root.addChild(ground);
        this.root.addChild(this.ball);
        this.root.addChild(this.trash);
        this.root.addChild(this.player);


    }

    update(pressedKeys, dt){
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
        //this.score+=multiplier;
        this.ball.setRotation(this.ball.rotation+=0.01)
        if(this.ball.rotation>=2*Math.PI) this.ball.rotation = -2*Math.PI;


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

            // Kick
            if (pressedKeys.contains(KEY_J)) {
                // debugger;
                this.kicker.hitbox = this.kickbox;
                // this.kicker.hitbox.showHitbox = SHOW_HITBOXES;
                this.player.animate("kick");
                this.player.setSpeed(15);
                // console.log("kick");
            }
            else {
                this.kicker.hitbox = false;
            }

            // Header
            if (pressedKeys.contains(KEY_K)) {
                this.header.hitbox = this.headbox;
            }
            else {
                this.header.hitbox = false;
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
            this.kicker.hitbox = false;
            this.header.hitbox = false;
        }

        this.player.hitbox.color = "black";
        this.root.update(dt);


        for (var i = 0; i < this.platforms.length; i++) {

            this.ball.hitbox.color = "black";
            this.platforms[i].hitbox.color = "black";

            if(this.ball.collidesWith(this.platforms[i])!=-1 || this.platforms[i].collidesWith(this.ball)!=-1){
                if(this.platforms[i].id=="Ground")
                {
                    multiplier = 1;
                    this.ball.hitbox.color = "green";
                    this.platforms[i].hitbox.color = "green";
                    //this.ball.setPosition({x:700,y:180});  <--------------- UNCOMMENT THIS
                    if(this.attempt_sprites.length!=0) {
                        //debugger
                        this.root.removeChild(this.attempt_sprites.pop().visible=false);
                        //this.ball.physics = new Physics(ballMass);
                       // this.ball.physics.velocity = {x:.001, y:.001}; <--------------- UNCOMMENT THIS 
                        //is this the best way to handle this
                    }

                    //PAUSE or END GAME IF NO LIVES LEFT
                }
                else{
                    this.score+=(5*multiplier);
                    multiplier+=1;
                }
            }


            if (this.player.collidesWith(this.platforms[i]) != -1 || this.platforms[i].collidesWith(this.player) != -1) {

                var xDiff = oldPosition.x - newPosition.x;
                var yDiff = oldPosition.y - newPosition.y;
                var direction = -1;
                if (yDiff > 0) {
                    direction = 1;
                }

                this.player.setPosition(oldPosition);
                this.player.bounceOffOf(this.platforms[i], .1);
                // this.player.physics.velocity.y = .1;

                // if (!this.player.onGround) {
                //     this.player.onGround = true;
                //     this.player.setPosition(oldPosition);
                //     this.player.physics.gravity.y = 0;
                //     this.player.physics.velocity.y = 0;
                // }

                // else {
                //     // if player is already on the ground...
                // }
                //var platformNormal = {x: this.platforms[i].normal.x, y: this.platforms[i].normal.y}
                //this.platforms[i].rotateToGlobal(platformNormal);
                //this.player.physics.velocity = {x:.02 * -platformNormal.x, y:.02*platformNormal.y};

                this.player.hitbox.color = "red";
                this.platforms[i].hitbox.color = "red";

            }
            else {
                this.platforms[i].hitbox.color = "black";
            }
            if (this.ball.collidesWith(this.platforms[i]) != -1 || this.platforms[i].collidesWith(this.ball) != -1) {
                var xDiff = ballOldPosition.x - ballNewPosition.x;
                var yDiff = ballOldPosition.y - ballNewPosition.y;
                var direction = -1;
                if (yDiff > 0) {
                    direction = 1;
                }

                this.ball.bounceOffOf(this.platforms[i], C_REST_WALL);
                this.ball.position = ballOldPosition;
            }

        }
        
        if (this.kicker.hitbox) {
            if ((this.kicker.collidesWith(this.ball) != -1
                || this.ball.collidesWith(this.kicker) != -1)) {
                if (!this.kicking && !this.heading) {
                    this.ball.bounceOffOf(this.kicker);
                    this.ball.position = ballOldPosition;
                    this.kicking = true;
                }
            }
            else {
                this.kicking = false;
            }
        }
        else {
            this.kicking = false;
        }

        if (this.header.hitbox) {
            if ((this.header.collidesWith(this.ball) != -1
                || this.ball.collidesWith(this.header) != -1)) {
                if (!this.heading && !this.kicking) {
                    this.ball.bounceOffOf(this.header);
                    this.ball.position = ballOldPosition;
                    this.heading = true;
                }
            }
            else {
                this.heading = false;
            }
        }
        else {
            this.heading = false;
        }

        // this.root.update(dt); // update children
        // if(this.ball.collidesWith(this.trash)!=-1 || this.trash.collidesWith(this.ball)!=-1){
        //     this.root.removeChild(this.ball);
        //     // this.ball.showHitbox=false;
        //     console.log("Score!");
        //     this.ballFadeOut();

        // }

        // this.root.update(dt); // update children
    }

    draw(g){
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);

        var ctx = this.canvas.getContext("2d");
        ctx.font = "36px Georgia";
        ctx.fillText("Score: "+this.score, 750, 100);
    }

    /**
     * Makes the ball fade out using a tween.
     * Called by this.questManager
     */
    // ballFadeOut() {
    //     var easeInOutTransition = new EaseInOutTransition();
    //     var ballAlphaTween = new Tween(this.ball, easeInOutTransition);
    //     ballAlphaTween.animate(TweenableParam.ALPHA, 1.0, 0.0, 500);
    //     this.tweenJuggler.add(ballAlphaTween);
    // }
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