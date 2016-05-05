/**
 * BasicLevelObjects.js
 * Contains methods for creating the walls of the basic level
 */

"use strict";

class FreePlayLevel extends LevelOne {

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

        gameInstance.currentLevel = FreePlayLevel;

        gameInstance.background = background;
        gameInstance.walls  = wallNode.children;
        gameInstance.trash  = trash;
        gameInstance.balls  = [ball];
        gameInstance.player = player;

        gameInstance.root.addChild(background);
        gameInstance.root.addChild(wallNode);
        gameInstance.root.addChild(player);
        gameInstance.root.addChild(ball);
        gameInstance.root.addChild(trash);

        gameInstance.score = 0;
        gameInstance.timer = false;
        gameInstance.timeLeft = false;
    }
}