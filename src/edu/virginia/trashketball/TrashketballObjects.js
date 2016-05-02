/**
 * TrashketballObject.js
 * Contains functions for creating the objects in the Trashketball Game
 * Objects include Player, Ball, Trashcan, etc.
 */

var GAME_WIDTH = 1000;
var GAME_HEIGHT = 600;
var SHOW_HITBOXES = true;


/**
 * Create and return the player object.
 */
function makePlayer() {

    // Player sprite
    var player = new PlayerSprite("Player", "KidAnimations2.png");

    // attach and display player's hitbox
    var playerHitboxWidth = 200;
    var playerHitboxHeight = 350;
    var playerHitboxTopLeft = {'x': -playerHitboxWidth/2.0, 'y': -playerHitboxHeight/2.0 -3};
    player.hitbox = new Rectangle(playerHitboxTopLeft, playerHitboxWidth, playerHitboxHeight);
    player.showHitbox = SHOW_HITBOXES;
    player.setPosition({x: 250.0, y: 350.0});
    player.setPivotPoint({x:200, y:175}); // center
    player.setScale({x:0.5, y:0.5});

    // player's kicking foot node
    var kicker = new DisplayObjectNode("Kicker", "");
    kicker.setPosition({x:50, y: 120});
    var kickerWidth = 130;
    var kickerHeight = 50;
    kicker.setPivotPoint({x: kickerWidth / 2.0, y: kickerHeight / 2.0});
    kicker.hitbox = false;
    kickbox = new Rectangle({x: -kickerWidth / 2.0, y: -kickerHeight / 2.0}, kickerWidth, kickerHeight);
    // kickbox = new Circle({x: 0, y: 0}, kickerWidth / 2.0);
    kicker.showHitbox = SHOW_HITBOXES;
    player.addChild(kicker);
    player.kicker = kicker;
    player.kickbox = kickbox;

    // player's heading foot node
    var header = new DisplayObjectNode("Header", "");
    header.setPosition({x:0, y:-100});
    var headerWidth = 150;
    var headerHeight = 100;
    header.setPivotPoint({x: -headerWidth / 2.0, y: -headerHeight / 2.0});
    header.hitbox = false;
    headbox = new Rectangle({x: -headerWidth/2.0, y: -headerHeight/2.0}, headerWidth, headerHeight);
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
 * Create and return the ball
 */
function makeBall() {
    var ball = new Sprite("Ball", "Ball.png");
    ball.showHitbox = SHOW_HITBOXES;
    ball.setPosition({x:300,y:180});
    ball.setPivotPoint({x:75,y:70});
    ball.setScale({x:.45, y:.45});
    ball.hitbox = new Circle({x:0, y:0}, 72);
    ball.physics = new Physics(ball);
    ball.physics.makeAngularProportionalToTranslational();
    ball.physics.limitMaxSpeed(1.5);
    ball.physics.limitMaxAngularSpeed();
    return ball;
}

/**
 * Create and return the trash can
 */
function makeTrash() {

    // trash can
    var trash = new Sprite("Trash", "wood.png");
    var trashWidth  = 100;
    var trashHeight = 175;

    trash.setPosition({x:700,y:480});
    //trash.setScale({x:3.5,y:3.5});
    trash.setPivotPoint({x: trashWidth/2.0, y: trashHeight/2.0});
    
    trash.hitbox = new Rectangle({x: -0.5*trashWidth/2.0, y: 0}, 0.5*trashWidth, trashHeight/3);
    trash.showHitbox = SHOW_HITBOXES;


    // dimensions of walls of trash can
    var trashWallWidth = 15;
    var trashWallHeight = trashHeight;
    var trashWallTopLeft = {x: -trashWallWidth / 2.0, y: -trashWallHeight / 2.0};

    // left wall of trash can
    var trashLeftWall = new DisplayObjectNode("trashLeftWall", "");
    trashLeftWall.setPosition({x: -.9*trashWidth / 2.0, y: .1*trashHeight});
    trashLeftWall.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
    trashLeftWall.hitbox = new Rectangle(trashWallTopLeft, trashWallWidth, .9*trashWallHeight);
    trashLeftWall.showHitbox = SHOW_HITBOXES;
    trash.addChild(trashLeftWall);

    // circular hitbox on top of left wall
    var trashLeftTop = new DisplayObjectNode("trashLeftTop", "");
    trashLeftTop.setPosition({x: -.9*trashWidth / 2.0, y: -0.85 * trashHeight / 2.0});
    trashLeftTop.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
    trashLeftTop.hitbox = new Circle({x:0, y:0}, 1.1*trashWallWidth/2.0);
    trashLeftTop.showHitbox = SHOW_HITBOXES;
    trash.addChild(trashLeftTop);

    // right wall of trash can
    var trashRightWall = new DisplayObjectNode("trashRightWall", "");
    trashRightWall.setPosition({x: .9*trashWidth / 2.0, y: .1*trashHeight});
    trashRightWall.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
    trashRightWall.hitbox = new Rectangle(trashWallTopLeft, trashWallWidth, .9*trashWallHeight);
    trashRightWall.showHitbox = SHOW_HITBOXES;
    trash.addChild(trashRightWall);

    // circular hitbox on top of right wall
    var trashRightTop = new DisplayObjectNode("trashRightTop", "");
    trashRightTop.setPosition({x: .9*trashWidth / 2.0, y: -0.85 * trashHeight / 2.0});
    trashRightTop.setPivotPoint({x: trashWallWidth/2.0, y: trashWallHeight/2.0});
    trashRightTop.hitbox = new Circle({x:0, y:0}, 1.1*trashWallWidth/2.0);
    trashRightTop.showHitbox = SHOW_HITBOXES;
    trash.addChild(trashRightTop);

    return trash;
}

/**
 * Returns a DisplayObjectNode which shows all pause screen stuff
 */
function makePauseLayer() {
    var pauseNode = new DisplayObjectNode("PauseNode", "BlackRectangle.jpg");
    pauseNode.position = {x:0, y:0};
    pauseNode.scale = {x:1, y:1.5};
    pauseNode.alpha = 0.5;
    return pauseNode;
}





