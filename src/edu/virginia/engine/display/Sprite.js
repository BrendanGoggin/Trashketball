"use strict";

/**
 * A very basic Sprite. For now, does not do anything.
 * 
 * */
class Sprite extends DisplayObjectNode {
	
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

	// returns the center coordinates of the image
	// getCenter() {
	// 	console.log(this.loaded);
	// 	console.log({x : this.displayImage.width/2.0, y: this.displayImage.height/2.0});
	// 	return {x : this.displayImage.width/2.0, y: this.displayImage.height/2.0};
	// }
}

