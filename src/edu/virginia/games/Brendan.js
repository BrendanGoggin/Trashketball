// A basic platformer game

"use strict";

// change in position per frame
var POSITION_CHANGE = 5;
var WALK_SPEED = 0.25;
var RUN_SPEED = WALK_SPEED * 2.0;
var JUMP_SPEED = 0.25;
var FALL_SPEED = JUMP_SPEED;
var ROTATION_CHANGE = 0.05;
var SCALE_CHANGE = 0.1;
var ALPHA_CHANGE = 0.01;
var GAME_WIDTH = 1000;
var GAME_HEIGHT = 600

var SHOW_HITBOXES = true;

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
        this.player.setPosition({x: 250.0, y: 350.0});
        this.player.setPivotPoint({x:64, y:56}); // center
        this.player.setScale({x:1.5, y:1.5});

        // player's kicking foot node
        this.kicker = new DisplayObjectNode("Kicker", "");
        this.kicker.setPosition({x:0, y: 32});
        var kickerWidth = 60;
        var kickerHeight = 30;
        this.kicker.setPivotPoint({x: kickerWidth / 2.0, y: kickerHeight / 2.0});
        this.kicker.hitbox = false;
        this.kickbox = new Rectangle({x: -kickerWidth / 2.0, y: -kickerHeight / 2.0}, kickerWidth, kickerHeight);
        // this.kicker.hitbox = this.kickbox;
        this.kicker.showHitbox = true;
        this.kicker.normal = {x: 0.70711, y: 0.70711};
        this.player.addChild(this.kicker);

        // player's heading foot node
        this.header = new DisplayObjectNode("Header", "");
        this.header.setPosition({x:0, y: -32});
        var headerWidth = 60;
        var headerHeight = 30;
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

        // coin for player to get (208x278 sprite)
        this.coin = new Sprite("Coin", "Ball.png");
        this.trash = new Sprite("Trash", "Trash.png");
        this.trash.setScale({x:2,y:2});
        // this.root.addChild(this.coin);
        // this.root.addChild(this.trash);
        // var hitboxTopLeft = {x: -104, y: -139};
        var hitboxWidth = this.coin.displayImage.width;
        var hitboxHeight = this.coin.displayImage.height;
        // this.coin = new Sprite("Coin", "Coin.png");
        var hitboxTopLeft = {x: -95, y: -135};
        var hitboxWidth = 140;
        var hitboxHeight = 140;
        this.coin.hitbox = new Rectangle(hitboxTopLeft, hitboxWidth, hitboxHeight);
//  HEAD
        this.coin.showHitbox = SHOW_HITBOXES;
// ===
        this.trash.hitbox = new Rectangle({x: 0, y: 0},this.trash.displayImage.width,this.trash.displayImage.height/3);
        this.trash.showHitbox = SHOW_HITBOXES;
        this.coin.setPosition({x:700,y:180});
        this.trash.setPosition({x:800,y:460});
// === master
        this.coin.setPivotPoint({x:104,y:139});
        this.coin.setScale({x:0.4, y:0.4});


        // this.coin.showHitbox = true;
        // this.trash.showHitbox = true;
        // this.player.showHitbox = true;
        // this.coin.setScale({x:0.4, y:0.26});

        // the event dispatcher that will throw events for coiny things
        this.coin.eventDispatcher = new EventDispatcher();

        // Quest Love's manager listens for events and outputs moral support
        this.questLoveManager = new QuestManager(this);

        // the event to throw when the sword is picked up
        this.coinPickUpEvent = new Event("coinPickUp", this.coin.eventDispatcher);

        // add the event listener to the dispatcher
        this.coin.eventDispatcher.addEventListener(
            this.questLoveManager, 
            this.coinPickUpEvent.eventType
        );

        var coinMass = 50;
        this.coin.physics = new Physics(coinMass);
        this.coin.physics.velocity = {x:.5, y:.3};

        this.root.addChild(leftWall);
        this.root.addChild(rightWall);
        this.root.addChild(ceiling);
        this.root.addChild(ground);
        this.root.addChild(this.coin);
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
        var coinNewPosition = this.coin.getPosition();
        var coinOldPosition = {x:coinNewPosition.x, y:coinNewPosition.y};
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


        for (var i = 0; i < this.platforms.length; i++) {

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
            if (this.coin.collidesWith(this.platforms[i]) != -1 || this.platforms[i].collidesWith(this.coin) != -1) {
                var xDiff = coinOldPosition.x - coinNewPosition.x;
                var yDiff = coinOldPosition.y - coinNewPosition.y;
                var direction = -1;
                if (yDiff > 0) {
                    direction = 1;
                }

                this.coin.bounceOffOf(this.platforms[i]);
                this.coin.position = coinOldPosition;
            }
        }  

        if (this.kicker.hitbox) {
            if ((this.kicker.collidesWith(this.coin) != -1 
                || this.coin.collidesWith(this.kicker) != -1)) {
                if (!this.kicking && !this.heading) {
                    this.coin.bounceOffOf(this.kicker);
                    this.coin.position = coinOldPosition;
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
            if ((this.header.collidesWith(this.coin) != -1 
                || this.coin.collidesWith(this.header) != -1)) {
                if (!this.heading && !this.kicking) {
                    this.coin.bounceOffOf(this.header);
                    this.coin.position = coinOldPosition;
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
        // if(this.coin.collidesWith(this.trash)!=-1 || this.trash.collidesWith(this.coin)!=-1){
        //     this.root.removeChild(this.coin);
        //     // this.coin.showHitbox=false;
        //     console.log("Score!");
        //     this.coinFadeOut();
            
        // }

        // this.root.update(dt); // update children
    }

    draw(g){
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);
    }

    /**
     * Makes the coin fade out using a tween.
     * Called by this.questManager
     */
    // coinFadeOut() {
    //     var easeInOutTransition = new EaseInOutTransition();
    //     var coinAlphaTween = new Tween(this.coin, easeInOutTransition);
    //     coinAlphaTween.animate(TweenableParam.ALPHA, 1.0, 0.0, 500);
    //     this.tweenJuggler.add(coinAlphaTween);
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