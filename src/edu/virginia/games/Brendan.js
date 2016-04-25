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
        this.kicker.showHitbox = SHOW_HITBOXES;
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
        this.header.showHitbox = SHOW_HITBOXES;
        this.header.normal = {x: 0.70711, y: 0.70711};
        this.player.addChild(this.header);

        this.player.setAlpha(1.0);
        var playerAlphaTween = new Tween(this.player);
        playerAlphaTween.animate(TweenableParam.ALPHA, 0.0, 1.0, 1000);
        this.tweenJuggler.add(playerAlphaTween);

        // for player's hitbox to light up red on collision
        this.player.hitbox.color = "black";

        // var playerMass = 50;
        this.player.physics = new Physics(this.player);


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

        // this.trashcan = new Sprite("Trashcan", "Trashcan.png");
        // this.trashcan.setPosition({x: 500, y: 450});
        // this.trashcan.setPivotPoint({x:49.5, y: 48});
        // this.trashcan.setScale({x: 1.4, y: 1.75});

        // ball for player to get (208x278 sprite)
        this.ball = new Sprite("Ball", "Ball.png");
        // this.root.addChild(this.ball);
        // this.root.addChild(this.trash);

        // var hitboxWidth = this.ball.displayImage.width;
        // var hitboxHeight = this.ball.displayImage.height;
        // var hitboxTopLeft = {x: -95, y: -135};
        // var hitboxWidth = 140;
        // var hitboxHeight = 140;
        // this.ball.hitbox = new Rectangle(hitboxTopLeft, hitboxWidth, hitboxHeight);
        this.ball.showHitbox = SHOW_HITBOXES;
        this.ball.setPosition({x:700,y:180});
        this.ball.setPivotPoint({x:75,y:70});
        this.ball.setScale({x:.5, y:.5});
        this.ball.hitbox = new Circle({x:0, y:0}, 73);

        
        // trash can
        this.trash = new Sprite("Trash", "Trash.png");
        this.trash.setPosition({x:790,y:493});
        this.trash.setScale({x:4,y:3});
        var trashWidth  = 32;
        var trashHeight = 52;
        this.trash.setPivotPoint({x: trashWidth/2.0, y: trashHeight/2.0});
        this.trash.hitbox = new Rectangle({x: -0.5*trashWidth/2.0, y: 0}, 0.5*trashWidth, trashHeight/3);
        this.trash.showHitbox = SHOW_HITBOXES;

        // dimensions of walls of trash can
        var trashWallWidth = 4;
        var trashWallHeight = trashHeight;
        var trashWallTopLeft = {x: -trashWallWidth / 2.0, y: -trashWallHeight / 2.0};


        // left wall of trash can
        this.trashLeftWall = new DisplayObjectNode("trashLeftWall", "");
        this.trashLeftWall.setPosition({x: -.95*trashWidth / 2.0, y: .05*trashHeight});
        this.trashLeftWall.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
        this.trashLeftWall.hitbox = new Rectangle(trashWallTopLeft, trashWallWidth, .9*trashWallHeight);
        this.trashLeftWall.showHitbox = SHOW_HITBOXES;
        this.trash.addChild(this.trashLeftWall);

        // right wall of trash can
        this.trashRightWall = new DisplayObjectNode("trashRightWall", "");
        this.trashRightWall.setPosition({x: .95*trashWidth / 2.0, y: .05*trashHeight});
        this.trashRightWall.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
        this.trashRightWall.hitbox = new Rectangle(trashWallTopLeft, trashWallWidth, .9*trashWallHeight);
        this.trashRightWall.showHitbox = SHOW_HITBOXES;
        this.trash.addChild(this.trashRightWall);

        // the two walls in an array
        this.trashWalls = [this.trashLeftWall, this.trashRightWall];

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

        // var ballMass = 50;
        this.ball.physics = new Physics(this.ball);
        this.ball.physics.angularVelocity = .001;
        //this.ball.physics.velocity = {x:.5, y:.3};

        this.root.addChild(leftWall);
        this.root.addChild(rightWall);
        this.root.addChild(ceiling);
        this.root.addChild(ground);
        this.root.addChild(this.player);
        this.root.addChild(this.ball);
        this.root.addChild(this.trash);


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



        // Kicking
        this.kicking = false;
        if (this.kicker.hitbox) {
            if (this.ball.detectAndResolveCollisionWith(this.kicker) && !this.kicking && !this.heading) {
                this.ball.bounceOffOf(this.kicker);
                this.kicking = true;
            }
        }


        // Heading
        this.heading = false;
        if (this.header.hitbox) {
            if (this.ball.detectAndResolveCollisionWith(this.header) && !this.heading && !this.kicking) {
                this.ball.bounceOffOf(this.header);
                this.heading = true;
            }
        }

        for (var i = 0; i < this.trashWalls.length; i++) {
            if (this.ball.detectAndResolveCollisionWith(this.trashWalls[i])) {
                this.ball.bounceOffOf(this.trashWalls[i], 0.5);
                this.ball.hitbox.color = "red";
                this.trashWalls[i].hitbox.color = "red";
            }
            else {
                this.trashWalls[i].hitbox.color = "black";
            }
        }

        this.ball.hitbox.color = "black";
        for (var i = 0; i < this.platforms.length; i++) {

            // player-wall collision handling
            if (this.player.detectAndResolveCollisionWith(this.platforms[i])) {
                this.player.bounceOffOf(this.platforms[i], 0);
                this.player.hitbox.color = "red";
                this.platforms[i].hitbox.color = "red";


                if (this.platforms[i].id == "Ground") {
                    this.player.physics.velocity = {x:0, y:0};
                }

            }
            else {
                this.platforms[i].hitbox.color = "black";
            }


            // ball-wall collision handling
            if (this.ball.detectAndResolveCollisionWith(this.platforms[i])) {
                this.ball.bounceOffOf(this.platforms[i], C_REST_WALL);
            }
        }  

        if (this.ball.detectCollisionWith(this.trash)) {
            this.trash.hitbox.color = "green";
        } 
        else {
            this.trash.hitbox.color = "black";
        }

        // this.ballFadeOut() is the tween to remove the ball
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