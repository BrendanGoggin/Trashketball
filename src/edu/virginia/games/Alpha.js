// A basic platformer game

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
class PlatformGame extends Game {
    
    constructor(canvas) {
        super("PlatformGame", 1000, 600, canvas);


        // mario sprite
        this.mario = new AnimatedSprite("Mario", "Mario.png");
        this.root.addChild(this.mario);

        // attach and display mario's hitbox
        var marioHitboxTopLeft = {'x': -30, 'y': -35};
        var marioHitboxWidth = 55;
        var marioHitboxHeight = 80;
        this.mario.hitbox = new Rectangle(marioHitboxTopLeft, marioHitboxWidth, marioHitboxHeight);
        // this.mario.showHitbox = true;
        this.mario.setPosition({x: 50.0, y: 50.0});
        this.mario.setPivotPoint({x:32, y:44}); // center

        this.mario.setAlpha(1.0);
        var marioAlphaTween = new Tween(this.mario);
        marioAlphaTween.animate(TweenableParam.ALPHA, 0.0, 1.0, 1000);
        this.tweenJuggler.add(marioAlphaTween);



        var marioMass = 50;
        this.mario.physics = new Physics(marioMass);


        var ground = new Sprite("Ground", "Platform.png");
        ground.setPosition({x: 500, y: 480});
        ground.setPivotPoint({x: 168, y: 24});
        ground.setScaleX(3);
        // ground.showHitbox = true;
        ground.hitbox = new Rectangle({x:-170, y:-24}, 400, 48);

        this.root.addChild(ground);
        this.platforms = [ground];

        var platformOne = new Sprite("PlatformOne", "Platform.png");
        platformOne.setPosition({x: 450, y: 325});
        platformOne.setPivotPoint({x: 168, y: 24});
        this.root.addChild(platformOne);
        this.platforms.push(platformOne);
        // platformOne.showHitbox = true;
        platformOne.hitbox = new Rectangle({x:-170, y:-24}, 336, 48);

        var platformTwo = new Sprite("PlatformTwo", "Platform.png");
        platformTwo.setPosition({x:750, y:150});
        platformTwo.setPivotPoint({x:168, y: 24});
        platformTwo.hitbox = new Rectangle({x:-170, y:-24}, 336, 48);
        this.root.addChild(platformTwo);
        this.platforms.push(platformTwo);

        // coin for mario to get (208x278 sprite)
        this.coin = new Sprite("Coin", "Coin.png");
        this.root.addChild(this.coin);
        var hitboxTopLeft = {x: -104, y: -139};
        var hitboxWidth = 208;
        var hitboxHeight = 278;
        this.coin.hitbox = new Rectangle(hitboxTopLeft, hitboxWidth, hitboxHeight);
        // this.coin.showHitbox = true;
        this.coin.setPosition({x:900,y:80});
        this.coin.setPivotPoint({x:104,y:139});
        this.coin.setScale({x:0.15, y:0.15});

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


    }

    update(pressedKeys, dt){
        this.tweenJuggler.update();
        super.update(pressedKeys, dt);
        this.root.update(dt);
        var newPosition = this.mario.getPosition();
        var oldPosition = {x:newPosition.x, y:newPosition.y};
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

        if (pressedKeys.size() != 0) {
            this.mario.setPosition(newPosition);
            this.mario.setScale(newScale);
            this.mario.setRotation(newRotation);
        }

        for (var i = 0; i < this.platforms.length; i++) {
            if (this.mario.collidesWith(this.platforms[i]) || this.platforms[i].collidesWith(this.mario)) {
                var xDiff = oldPosition.x - newPosition.x;
                var yDiff = oldPosition.y - newPosition.y;
                var direction = -1;
                if (yDiff > 0) {
                    direction = 1;
                }
                this.mario.setPosition(oldPosition)
                // this.mario.setPosition({x:newPosition.x + 10*xDiff, y:newPosition.y + 10*yDiff});
                // this.mario.setPosition({x:oldPosition.x + 10*xDiff, y:oldPosition.y +10*yDiff});
                // this.mario.setPosition({x:oldPosition.x + 5*xDiff, y:oldPosition.y + 5000*yDiff});
                // this.mario.setPosition({x: oldPosition.x, y: oldPosition.y - yDiff/2});
                // this.mario.physics.velocity = {x:this.mario.physics.velocity.x, y:this.mario.physics.velocity.y * -1};
                // this.mario.physics.velocity = {x:this.mario.physics.velocity.x, y: 0};
                this.mario.physics.velocity = {x:0, y:direction*.01};
                // this.mario.physics.gravity = {x:0, y:0};
                // console.log('here');
                //this.mario.physics.velocity = {x:0, y:0};
            }
        }  

        // mario collides with coin: cha-ching sound, tween coin away
        if (this.mario.collidesWith(this.coin) || this.coin.collidesWith(this.mario)) {
            console.log("Cha-ching!");
            // this.coin.visible = false;
            this.coin.hitbox = false;
            debugger;
            // dispatch the event
            this.coin.eventDispatcher.dispatchEvent(this.coinPickUpEvent);

            // tween the coin away
            var easeInOutTransition = new EaseInOutTransition();
            var shockAbsorbTransition = new ShockAbsorbTransition();
            // var coinAlphaTween = new Tween(this.coin, easeInOutTransition);
            // coinAlphaTween.animate(TweenableParam.ALPHA, 1.0, 0.0, 500);
            // this.tweenJuggler.add(coinAlphaTween);

            var coinTweenTime = 1000; // time for scale and position tweens
            var coinTweenEventDispatcher = new EventDispatcher();
            var coinTweenEndEvent = new Event("coinTweenDone", coinTweenEventDispatcher);
            coinTweenEventDispatcher.addEventListener(
                this.questLoveManager,
                coinTweenEndEvent.eventType
            );
            
            var coinScaleXTween = new Tween(this.coin, shockAbsorbTransition);
            coinScaleXTween.eventDispatcher = coinTweenEventDispatcher;
            coinScaleXTween.event = coinTweenEndEvent;
            coinScaleXTween.animate(
                TweenableParam.SCALE_X, 
                this.coin.scale.x, 
                this.coin.scale.x * 4.0, 
                coinTweenTime
            );
            this.tweenJuggler.add(coinScaleXTween);

            var coinScaleYTween = new Tween(this.coin, shockAbsorbTransition);
            coinScaleYTween.eventDispatcher = coinTweenEventDispatcher;
            coinScaleYTween.event = coinTweenEndEvent;
            coinScaleYTween.animate(
                TweenableParam.SCALE_Y,
                this.coin.scale.y,
                this.coin.scale.y * 4.0,
                coinTweenTime
            );
            this.tweenJuggler.add(coinScaleYTween);

            var coinXTween = new Tween(this.coin, shockAbsorbTransition);
            coinXTween.eventDispatcher = coinTweenEventDispatcher;
            coinXTween.event = coinTweenEndEvent;
            coinXTween.animate(
                TweenableParam.POSITION_X,
                this.coin.position.x,
                500,
                coinTweenTime
            );
            this.tweenJuggler.add(coinXTween);

            var coinYTween = new Tween(this.coin, easeInOutTransition);
            coinYTween.eventDispatcher = coinTweenEventDispatcher;
            coinYTween.event = coinTweenEndEvent;
            coinYTween.animate(
                TweenableParam.POSITION_Y,
                this.coin.position.y,
                300,
                coinTweenTime
            );
            this.tweenJuggler.add(coinYTween);


        }


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
    coinFadeOut() {
        var easeInOutTransition = new EaseInOutTransition();
        var coinAlphaTween = new Tween(this.coin, easeInOutTransition);
        coinAlphaTween.animate(TweenableParam.ALPHA, 1.0, 0.0, 500);
        this.tweenJuggler.add(coinAlphaTween);
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