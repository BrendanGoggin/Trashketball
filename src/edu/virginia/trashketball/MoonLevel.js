/**
 * MoonLevel.js
 * Contains methods for creating the walls of the moon level
 */

"use strict";

var MOON_GRAVITY = {x: 0, y: 0.0002};

class MoonLevel extends Level {

    /**
     * Loads this level onto the gameInstance
     * gameInstance is the object calling this method
     */
    static load(gameInstance) {

        var wallNode = this.makeWallLayer();
        var ball = this.makeBall();
        var trash = this.makeTrash();
        var player = this.makePlayer();
        var background = this.makeBackground();

        gameInstance.background = background;
        gameInstance.walls  = wallNode.children;
        gameInstance.trash  = trash;
        gameInstance.balls  = [ball];
        gameInstance.player = player;

        gameInstance.score = 0;
        gameInstance.timeLeft = 60000;
        gameInstance.addRock = 10000;
        gameInstance.timer = this.makeTimer();
        gameInstance.scoreNode = this.makeScoreNode();
        gameInstance.moonRockMaker = this.makeMoonRockMaker(gameInstance);

        gameInstance.currentLevel = 2;


        gameInstance.root.addChild(background);
        gameInstance.root.addChild(wallNode);
        gameInstance.root.addChild(player);
        gameInstance.root.addChild(ball);
        gameInstance.root.addChild(trash);
        gameInstance.root.addChild(gameInstance.moonRockMaker);


        var life = new Sprite("RockCount", "Rock.png");
        life.setScale({x:0.3, y:0.3});
        life.setPosition({x: 50, y: 60});
        gameInstance.root.addChild(life);
        gameInstance.root.addChild(gameInstance.timer);
        gameInstance.root.addChild(gameInstance.scoreNode);
    }


    /**
     * Create and return the timer
     */
    static makeTimer() {
        var timer = new TimerNode("Timer", "");
        var startTime = 60 * 1000;
        var timeStep = 10 * 1000;
        timer.setToStart(startTime, timeStep);
        timer.position = {x:50, y:50};
        timer.fontColor = "white";
        return timer;
    }


    /**
     * Create and return the score node
     */
    static makeScoreNode() {
        var score = new TextNode("Score", "x 0");
        score.position = {x:100, y:95};
        score.fontColor = "white";
        return score;
    }



    /**
     * Creates and returns the object used to make new moon rocks every 10 seconds
     */
    static makeMoonRockMaker(gameInstance) {
        var moonRockMaker = new MoonRockMaker("MoonRockMaker", "");
        moonRockMaker.timer = gameInstance.timer;
        moonRockMaker.timeUntilNextRock = gameInstance.timer.timeStep;
        moonRockMaker.gameRoot = gameInstance.root;
        moonRockMaker.gameRocks = gameInstance.balls;
        moonRockMaker.gameTrash = gameInstance.trash;
        return moonRockMaker;
    }

    /**
     * Create and return the ball
     */
    static makeBall() {
        var ball = new MoonRockSprite("Ball", "Rock.png");
        ball.showHitbox = SHOW_HITBOXES;
        ball.setPosition({x:300,y:180});
        ball.setPivotPoint({x:75,y:70});
        ball.setScale({x:.45, y:.45});
        ball.hitbox = new Circle({x:0, y:0}, 68);
        ball.physics = new Physics(ball);
        ball.physics.gravity = MOON_GRAVITY;
        ball.physics.makeAngularProportionalToTranslational();
        ball.physics.limitMaxSpeed(1.5);
        ball.physics.limitMaxAngularSpeed();
        return ball;
    }


    /**
     * Create and return the trash can
     */
    static makeTrash() {
        // trash can
        var trash = new Sprite("Trash", "rocket.png");
        var trashWidth  = 150;
        var trashHeight = 175;

        trash.setPosition({x:600,y:480});
        //trash.setScale({x:3.5,y:3.5});
        trash.setPivotPoint({x: trashWidth/2.0, y: trashHeight/2.0});
        
        trash.hitbox = new Rectangle({x: -0.5*trashWidth/2.0, y: 0}, 0.5*trashWidth, trashHeight/3);
        trash.showHitbox = SHOW_HITBOXES;


        // dimensions of walls of trash can
        var trashWallWidth = 15;
        var trashWallHeight = trashHeight;
        var trashWallTopLeft = {x: -trashWallWidth / 2.0, y: -trashWallHeight / 2.0};

        // array of the walls of the trash can
        trash.trashWalls = [];

        // left wall of trash can
        var trashLeftWall = new DisplayObjectNode("trashLeftWall", "");
        trashLeftWall.setPosition({x: -.6*trashWidth / 2.0, y: .1*trashHeight});
        trashLeftWall.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
        trashLeftWall.hitbox = new Rectangle(trashWallTopLeft, trashWallWidth, .9*trashWallHeight);
        trashLeftWall.showHitbox = SHOW_HITBOXES;
        trash.trashWalls.push(trashLeftWall);
        trash.addChild(trashLeftWall);

        // circular hitbox on top of left wall
        var trashLeftTop = new DisplayObjectNode("trashLeftTop", "");
        trashLeftTop.setPosition({x: -.6*trashWidth / 2.0, y: -0.85 * trashHeight / 2.0});
        trashLeftTop.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
        trashLeftTop.hitbox = new Circle({x:0, y:0}, 1.1*trashWallWidth/2.0);
        trashLeftTop.showHitbox = SHOW_HITBOXES;
        trash.trashWalls.push(trashLeftTop);
        trash.addChild(trashLeftTop);

        // right wall of trash can
        var trashRightWall = new DisplayObjectNode("trashRightWall", "");
        trashRightWall.setPosition({x: .6*trashWidth / 2.0, y: .1*trashHeight});
        trashRightWall.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
        trashRightWall.hitbox = new Rectangle(trashWallTopLeft, trashWallWidth, .9*trashWallHeight);
        trashRightWall.showHitbox = SHOW_HITBOXES;
        trash.trashWalls.push(trashRightWall);
        trash.addChild(trashRightWall);

        // circular hitbox on top of right wall
        var trashRightTop = new DisplayObjectNode("trashRightTop", "");
        trashRightTop.setPosition({x: .6*trashWidth / 2.0, y: -0.85 * trashHeight / 2.0});
        trashRightTop.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
        trashRightTop.hitbox = new Circle({x:0, y:0}, 1.1*trashWallWidth/2.0);
        trashRightTop.showHitbox = SHOW_HITBOXES;
        trash.trashWalls.push(trashRightTop);
        trash.addChild(trashRightTop);

        return trash;
    }


    /**
     * Create and return the player object.
     */
    static makePlayer() {

        // Player sprite
        var player = new PlayerSprite("Player", "KidAnimationsSpaceBoosters.png");

        // attach and display player's hitbox
        var playerHitboxWidth = 200;
        var playerHitboxHeight = 350;
        var playerHitboxTopLeft = {'x': -playerHitboxWidth/2.0, 'y': -playerHitboxHeight/2.0 -3};
        player.hitbox = new Rectangle(playerHitboxTopLeft, playerHitboxWidth, playerHitboxHeight);
        player.showHitbox = SHOW_HITBOXES;
        player.setPosition({x: 250.0, y: 350.0});
        player.setPivotPoint({x:200, y:175}); // center
        player.setScale({x:0.5, y:0.5});

        player.physics.gravity = MOON_GRAVITY;
        player.defaultGravity = MOON_GRAVITY;
        player.downPressedGravity.y = 2*MOON_GRAVITY.y;
        player.walkSpeed /= 1.5;
        player.runSpeed  /= 1.5;
        player.jumpSpeed /= 1.5;
        player.kickSpeed /= 2;
        player.headSpeed /= 2;

        // player's kicking foot node
        var kicker = new DisplayObjectNode("Kicker", "");
        kicker.setPosition({x:50, y: 120});
        var kickerWidth = 130;
        var kickerHeight = 50;
        kicker.setPivotPoint({x: kickerWidth / 2.0, y: kickerHeight / 2.0});
        kicker.hitbox = false;
        var kickbox = new Rectangle({x: -kickerWidth / 2.0, y: -kickerHeight / 2.0}, kickerWidth, kickerHeight);
        // kickbox = new Circle({x: 0, y: 0}, kickerWidth / 2.0);
        kicker.showHitbox = SHOW_HITBOXES;
        player.addChild(kicker);
        player.kicker = kicker;
        player.kickbox = kickbox;

        // player's heading foot node
        var header = new DisplayObjectNode("Header", "");
        header.setPosition({x:20, y:-100});
        var headerWidth = 120;
        var headerHeight = 60;
        header.setPivotPoint({x: -headerWidth / 2.0, y: -headerHeight / 2.0});
        header.hitbox = false;
        var headbox = new Rectangle({x: -headerWidth/2.0, y: -headerHeight/2.0}, headerWidth, headerHeight);
        header.showHitbox = SHOW_HITBOXES;
        header.normal = {x: 0.70711, y: 0.70711};
        player.addChild(header);
        player.header = header;
        player.headbox = headbox;

        // player.setAlpha(1.0);
        // var playerAlphaTween = new Tween(player);
        // playerAlphaTween.animate(TweenableParam.ALPHA, 0.0, 1.0, 1000);
        // tweenJuggler.add(playerAlphaTween);

        // for player's hitbox to light up red on collision
        player.hitbox.color = "black";

        return player;
    }

    /**
     * Creates and returns parent node of all walls
     * wallLayer is just an empty parent node, with walls as its children
     */
    static makeWallLayer() {
        var wallLayer = new DisplayObjectNode("WallLayer", "");
        var walls = this.makeWalls();

        for (var i = walls.length - 1; i >= 0; i--) {
            wallLayer.addChild(walls[i]);
        }

        return wallLayer;
    }


    /**
     * Creates and returns array of all walls of the level
     */
    static makeWalls() {

        var ground    = this.makeGround();
        var leftWall  = this.makeLeftWall();
        var rightWall = this.makeRightWall();
        var ceiling = this.makeCeiling();

        var walls = [ground, leftWall, rightWall, ceiling];
        return walls;
    }


    /**
     * Creates and returns the ground
     */
    static makeGround() {

        var ground = new Sprite("Ground", "Moon.png");

        ground.setPosition({x: GAME_WIDTH/2, y: GAME_HEIGHT-20});
        ground.setPivotPoint({x: 168, y: 24});
        ground.setScaleX(3);

        ground.showHitbox = SHOW_HITBOXES;
        ground.hitbox = new Rectangle({x:-170, y:-24}, 400, 48);

        return ground;
    }


    /**
     * Creates and returns the left wall
     */
    static makeLeftWall() {

        var leftWall = new Sprite("LeftWall", "");

        leftWall.setRotation(-1 * Math.PI / 2.0);
        leftWall.setPosition({x: -300, y: 300});
        leftWall.setPivotPoint({x: 476.5, y: 300});

        leftWall.hitbox = new Rectangle({x:-476.5, y:-300}, 953, 600);
        leftWall.showHitbox = SHOW_HITBOXES;

        return leftWall;
    }



    /**
     * Creates and returns the right wall
     */
    static makeRightWall() {

        var rightWall = new Sprite("RightWall", "");

        rightWall.setRotation(1 * Math.PI / 2.0);
        rightWall.setPosition({x: 1300, y: 300});
        rightWall.setPivotPoint({x: 476.5, y: 300});

        rightWall.hitbox = new Rectangle({x:-476.5, y:-300}, 953, 600);
        rightWall.showHitbox = SHOW_HITBOXES;

        return rightWall;
    }

    /**
     * Creates and returns the ceiling
     */
    static makeCeiling() {

        var ceiling = new Sprite("Ceiling", "");

        ceiling.setRotation(Math.PI);
        ceiling.setPosition({x: 450, y: -300});
        ceiling.setPivotPoint({x: 476.5, y: 300});

        ceiling.hitbox =  new Rectangle({x:-600, y:-300}, 1200, 600);
        ceiling.showHitbox = SHOW_HITBOXES;

        return ceiling;
    }


    /**
     * Creates and returns the background
     */
    static makeBackground() {

        var background = new DisplayObjectNode("Background", "Space.png");

        background.setPosition({x: 0, y: 0});
        background.setPivotPoint({x: 0, y: 0});

        return background;
    }

}

