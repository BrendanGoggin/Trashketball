"use strict";

var C_REST_WALL = .4;

/**
 * A very basic Sprite. For now, does not do anything.
 * 
 * */
class BallSprite extends Sprite {
    
    constructor(id, filename){
        super(id, filename);
    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     * dt: time since last call (ms)
     */
    // update(pressedKeys, dt){
        
    // }

    /**
     * Draws this image to the screen
     */
    draw(g){
        super.draw(g);
    }


    /**
     * Detect and handle collisions with the wall
     * Takes in a wall object and an object of the current game
     * when calling from a game, call using "this" keyword as gameInstance
     */
    handleCollisionWithWall(wall, gameInstance) {
        var ballPlatformResolution = this.detectAndResolveCollisionWith(wall);
        if (ballPlatformResolution) {
            var cFriction = 0.008;
            this.bounceOffOf(wall, ballPlatformResolution, C_REST_WALL, cFriction);
        }
    }


    /**
     * Detect and handle collisions with trash can
     * gameInstance is the game object which calls this method
     */
    handleCollisionWithTrash(trash, gameInstance) {

        this.hitbox.color = "black";
        // handle collisions with the walls of the trash can
        for (var i = 0; i < trash.trashWalls.length; i++) {
            var ballTrashWallResolution = this.detectAndResolveCollisionWith(trash.trashWalls[i]);
            if (ballTrashWallResolution) {

                var bounce = true;

                // if ball hits top side of can side-wall, ignore the bounce because there are
                // circles on top of the side-walls for it to hit
                if (trash.trashWalls[i].hitbox.shape == "Rectangle") {
                    var resCopy = copyPoints([ballTrashWallResolution])[0];
                    resCopy = normalize(resCopy);
                    trash.trashWalls[i].parent.rotateToLocal(resCopy);
                    if (Math.abs(resCopy.x) < 0.01 && Math.abs(resCopy.y - 1) < 0.01) {
                        bounce = false;
                        this.position = vectorAdd(this.position, ballTrashWallResolution);
                    }
                }

                if (bounce) {
                    var cRest = 0.5;
                    var cFriction = 0;
                    this.bounceOffOf(trash.trashWalls[i], ballTrashWallResolution, cRest, cFriction);
                    this.hitbox.color = "red";
                    trash.trashWalls[i].hitbox.color = "red";
                }
            }
            else {
                trash.trashWalls[i].hitbox.color = "black";
            }
        }


        // handle colliding with the 'success' area of the trash can
        if (this.detectCollisionWith(trash)) {
            trash.hitbox.color = "green";
        }
        else {
            trash.hitbox.color = "black";
        }
    }
}

