/**
 * BasicLevelObjects.js
 * Contains methods for creating the walls of the basic level
 */

"use strict";

class LevelOne extends Level {

    /**
     * Loads this level onto the gameInstance
     * gameInstance is the object calling this method
     */
    static load(gameInstance) {
        var wallNode = this.makeWallLayer();
        var ball = makeBall();
        var trash = makeTrash();
        var player = makePlayer();
        var background = this.makeBackground();

        gameInstance.background = background;
        gameInstance.walls  = wallNode.children;
        gameInstance.trash  = trash;
        gameInstance.balls  = [ball];
        gameInstance.player = player;

        gameInstance.root.addChild(background);
        gameInstance.root.addChild(player);
        gameInstance.root.addChild(ball);
        gameInstance.root.addChild(wallNode);
        gameInstance.root.addChild(trash);
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

        var ground = new Sprite("Ground", "Platform.png");

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

        var leftWall = new Sprite("LeftWall", "Brickwall.jpg");

        leftWall.setRotation(-1 * Math.PI / 2.0);
        leftWall.setPosition({x: -250, y: 300});
        leftWall.setPivotPoint({x: 476.5, y: 300});

        leftWall.hitbox = new Rectangle({x:-476.5, y:-300}, 953, 600);
        leftWall.showHitbox = SHOW_HITBOXES;

        return leftWall;
    }



    /**
     * Creates and returns the right wall
     */
    static makeRightWall() {

        var rightWall = new Sprite("RightWall", "Brickwall.jpg");

        rightWall.setRotation(1 * Math.PI / 2.0);
        rightWall.setPosition({x: 1250, y: 300});
        rightWall.setPivotPoint({x: 476.5, y: 300});

        rightWall.hitbox = new Rectangle({x:-476.5, y:-300}, 953, 600);
        rightWall.showHitbox = SHOW_HITBOXES;

        return rightWall;
    }

    /**
     * Creates and returns the ceiling
     */
    static makeCeiling() {

        var ceiling = new Sprite("Ceiling", "Brickwall.jpg");

        ceiling.setRotation(Math.PI);
        ceiling.setPosition({x: 500, y: -250});
        ceiling.setPivotPoint({x: 476.5, y: 300});

        ceiling.hitbox =  new Rectangle({x:-476.5, y:-300}, 953, 600);
        ceiling.showHitbox = SHOW_HITBOXES;

        return ceiling;
    }


    /**
     * Creates and returns the background
     */
    static makeBackground() {

        var background = new DisplayObjectNode("Background", "EmptyBleachers.png");

        background.setPosition({x: 0, y: 0});
        background.setPivotPoint({x: 0, y: 0});

        return background;
    }

}

