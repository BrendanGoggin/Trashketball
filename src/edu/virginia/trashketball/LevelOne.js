/**
 * BasicLevelObjects.js
 * Contains methods for creating the walls of the basic level
 */

"use strict";

class LevelOne extends Level {

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

        var ground = new Sprite("Ground", "ground.png");

        ground.setPosition({x: 0, y: 550});
        //ground.setPivotPoint({x: 168, y: 24});
        //ground.setScaleX(3);

        ground.showHitbox = SHOW_HITBOXES;
        ground.hitbox = new Rectangle({x: 0, y: 10}, 1000, 50);

        return ground;
    }

    /**
     * Creates and returns the left wall
     */
    static makeLeftWall() {

        var leftWall = new Sprite("LeftWall", "woodwallleftb.jpg");

        //leftWall.setRotation(-1 * Math.PI / 2.0);
        leftWall.setPosition({x: 0, y: 50});
        //leftWall.setPivotPoint({x: 25, y: 300});

        leftWall.hitbox = new Rectangle({x:0, y:0}, 50, 600);
        leftWall.showHitbox = SHOW_HITBOXES;

        return leftWall;
    }



    /**
     * Creates and returns the right wall
     */
    static makeRightWall() {

        var rightWall = new Sprite("RightWall", "woodwallrightb.jpg");

        //rightWall.setRotation(1 * Math.PI / 2.0);
        rightWall.setPosition({x: 950, y: 50});
        //rightWall.setPivotPoint({x: 476.5, y: 300});

        rightWall.hitbox = new Rectangle({x:0, y:0}, 50, 600);
        rightWall.showHitbox = SHOW_HITBOXES;

        return rightWall;
    }

    /**
     * Creates and returns the ceiling
     */
    static makeCeiling() {

        var ceiling = new Sprite("Ceiling", "woodceiling2.jpg");

        //ceiling.setRotation(Math.PI);
        ceiling.setPosition({x: 0, y: 0});
        //ceiling.setPivotPoint({x: 476.5, y: 300});

        ceiling.hitbox =  new Rectangle({x:0, y:0}, 1000, 50);
        ceiling.showHitbox = SHOW_HITBOXES;

        return ceiling;
    }

}

