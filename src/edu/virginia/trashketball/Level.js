/**
 * This class serves as an interface that each level must implement.
 */

"use strict";

class Level {


    /** 
     * Loads this level into a game
     */
    static load(gameInstance) {}


    /**
     * Returns the parent node of the level's walls
     */
     static makeWallLayer() {}

}